import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authStore, logout, reissueToken } from '../stores/authStore';

// 기존 ApiErrorResponse 및 ApiError 클래스 정의는 그대로 유지합니다.
interface ApiErrorResponse {
  message: string;
  status: number;
  // 백엔드에서 추가적으로 제공하는 에러 정보가 있다면 여기에 추가
}

export class ApiError extends Error {
  status: number;
  errorResponse?: ApiErrorResponse;

  constructor(message: string, status: number, errorResponse?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorResponse = errorResponse;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// apiClient 함수에 전달될 옵션 인터페이스
export interface CustomApiClientOptions
  extends Omit<AxiosRequestConfig, 'url' | 'baseURL' | 'method'> {
  isPublic?: boolean; // 인증이 필요 없는 요청인지 여부
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
}

// Axios 인터셉터 내부에서 사용될 확장된 설정 타입
interface InternalApiClientAxiosConfig extends InternalAxiosRequestConfig {
  isPublic?: boolean;
  _retry?: boolean; // 재시도 여부를 추적하기 위한 플래그
}

// API 요청 시 사용될 확장된 설정 타입
interface ApiClientRequestConfig extends AxiosRequestConfig {
  isPublic?: boolean;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키 (Refresh Token) 전송을 위해 필요
});

let isRefreshing = false; // 현재 토큰 재발급 중인지 여부
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = []; // 토큰 재발급 중 실패한 요청들을 저장하는 큐

const processQueue = (error: Error | null, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  }
  failedQueue = [];
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config): InternalApiClientAxiosConfig | Promise<InternalApiClientAxiosConfig> => {
    const { accessToken } = authStore.state;
    const internalConfig = config as InternalApiClientAxiosConfig;

    if (!internalConfig.isPublic && accessToken) {
      internalConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return internalConfig;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalApiClientAxiosConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(
        new ApiError(
          error.message || 'Request configuration is missing.',
          error.response?.status || 500,
          error.response?.data,
        ),
      );
    }

    // 401 에러, 공개 API가 아니고, /reissue 엔드포인트가 아니며, 재시도된 요청이 아닐 경우
    if (
      error.response?.status === 401 &&
      !originalRequest.isPublic &&
      originalRequest.url &&
      !originalRequest.url.includes('/reissue') &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 이미 토큰 재발급 중이라면, 현재 요청을 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest as AxiosRequestConfig); // 새 토큰으로 재시도
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true; // 재시도 플래그 설정
      isRefreshing = true;

      try {
        const currentPath =
          typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
        await reissueToken(currentPath); // 토큰 재발급 시도

        const newAccessToken = authStore.state.accessToken;
        if (newAccessToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken); // 큐에 있던 요청들 처리
          return axiosInstance(originalRequest as AxiosRequestConfig); // 원래 요청 재시도
        }
        // 재발급 후 새 토큰이 없다면 (reissueToken 내부에서 로그아웃 처리됨)
        logout(); // 확실하게 로그아웃
        const sessionExpiredError = new ApiError(
          'Session expired after token refresh. Please log in again.',
          401,
        );
        processQueue(sessionExpiredError, null);
        if (typeof window !== 'undefined') window.location.href = '/login'; // 로그인 페이지로 리디렉션
        return Promise.reject(sessionExpiredError);
      } catch (reissueError) {
        logout(); // 토큰 재발급 과정에서 에러 발생 시 로그아웃
        const tokenReissueFailedError = new ApiError(
          reissueError instanceof Error ? reissueError.message : 'Failed to refresh token.',
          401, // 재발급 실패도 401로 처리하거나 적절한 상태 코드로 설정
          // error.response?.data // 원래 에러의 추가 정보
        );
        processQueue(tokenReissueFailedError, null);
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(tokenReissueFailedError);
      } finally {
        isRefreshing = false;
      }
    }

    // 그 외 모든 에러 (401이 아니거나, 재발급 로직 조건에 맞지 않는 경우)
    const errorMessage =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    const errorStatus = error.response?.status || 500;
    return Promise.reject(new ApiError(errorMessage, errorStatus, error.response?.data));
  },
);

const apiClient = async <T>(endpoint: string, options: CustomApiClientOptions = {}): Promise<T> => {
  const { isPublic = false, data, method: optionMethod, ...axiosSpecificOptions } = options;

  const config: ApiClientRequestConfig = {
    url: endpoint, // baseURL은 axiosInstance에 설정되어 있으므로 endpoint는 경로만 전달
    method: optionMethod || (data ? 'POST' : 'GET'), // HTTP 메서드 (기본값: GET, data 있으면 POST)
    data, // 요청 본문 (POST, PUT, PATCH 등)
    isPublic, // 사용자 정의 플래그
    ...axiosSpecificOptions, // headers, params 등 기타 Axios 설정
  };

  try {
    const response = await axiosInstance.request<T>(config);
    return response.data; // 실제 응답 데이터 반환
  } catch (error) {
    // 인터셉터에서 ApiError로 변환되었으므로 그대로 throw
    if (error instanceof ApiError) {
      throw error;
    }
    // 인터셉터를 통과하지 않은 예외적인 에러 처리 (드문 경우)
    const axiosError = error as AxiosError;
    throw new ApiError(
      axiosError.message || 'An unexpected error occurred in apiClient.',
      axiosError.response?.status || 500,
      axiosError.response?.data as ApiErrorResponse | undefined,
    );
  }
};

export default apiClient;
