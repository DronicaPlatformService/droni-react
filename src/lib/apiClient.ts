import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { authStore, logout, reissueToken } from '../stores/authStore';

/**
 * API 에러 응답 객체의 표준 타입입니다.
 * 백엔드에서 발생한 에러 정보를 클라이언트에 전달할 때 사용합니다.
 *
 * - `message`: 에러 메시지 (필수)
 * - `status`: HTTP 상태 코드 (필수)
 * - `code`: 비즈니스 에러 코드 (예: 'USER_NOT_FOUND')
 * - `details`: 추가 설명 또는 상세 원인
 * - `errors`: 필드별 에러 정보 (예: { email: "Invalid email" })
 * - `type`: RFC 7807 표준 type URI
 * - `instance`: RFC 7807 표준 instance URI
 * - 기타 백엔드에서 제공하는 추가 에러 정보를 확장하여 포함할 수 있습니다.
 */
interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
  details?: string;
  errors?: Record<string, string>;
  type?: string;
  instance?: string;
}

/**
 * API 요청 중 발생한 에러를 표준화하여 처리하는 커스텀 에러 클래스입니다.
 *
 * - 백엔드에서 반환한 에러 응답(`ApiErrorResponse`)을 포함합니다.
 * - HTTP 상태 코드, 비즈니스 에러 코드, 상세 설명, 필드별 에러 등 다양한 정보를 제공합니다.
 * - TanStack Query, 글로벌 에러 핸들러 등에서 일관된 에러 처리에 사용합니다.
 *
 * @example
 * try {
 *   await apiClient('/user/profile');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     // error.status, error.code, error.details, error.fieldErrors 등 활용 가능
 *   }
 * }
 *
 * @property {ApiErrorResponse} errorResponse - 백엔드에서 반환한 에러 응답 객체
 * @property {number} status - HTTP 상태 코드 (기본값: 500)
 * @property {string | undefined} code - 비즈니스 에러 코드
 * @property {string | undefined} details - 상세 설명
 * @property {Record<string, string> | undefined} fieldErrors - 필드별 에러 정보
 * @method toJSON - 에러 객체를 직렬화하여 반환
 */
export class ApiError extends Error {
  errorResponse?: ApiErrorResponse;

  constructor(message: string, status: number, errorResponse?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.errorResponse = errorResponse ?? { message, status };
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get status(): number {
    return this.errorResponse?.status ?? 500;
  }

  get code(): string | undefined {
    return this.errorResponse?.code;
  }

  get details(): string | undefined {
    return this.errorResponse?.details;
  }

  get fieldErrors(): Record<string, string> | undefined {
    return this.errorResponse?.errors;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      ...this.errorResponse,
    };
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

/**
 * 토큰 재발급 중 대기 중인 요청 큐를 처리합니다.
 *
 * - 토큰 재발급이 성공하면 큐에 쌓인 모든 요청의 `resolve`를 호출하여 새 토큰을 전달합니다.
 * - 재발급이 실패하거나 에러가 발생하면 모든 요청의 `reject`를 호출하여 에러를 전달합니다.
 * - 처리 후 큐를 초기화합니다.
 *
 * @param error 토큰 재발급 실패 시 전달할 에러 객체 (성공 시 null)
 * @param token 새로 발급된 액세스 토큰 (실패 시 null)
 */
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

/**
 * 표준화된 API 요청 함수입니다.
 *
 * - 백엔드 엔드포인트에 HTTP 요청을 보내고, 응답 데이터를 반환합니다.
 * - 인증이 필요한 요청은 자동으로 액세스 토큰을 헤더에 포함합니다.
 * - 401(Unauthorized) 발생 시 자동으로 토큰 재발급 및 재시도를 처리합니다.
 * - 모든 에러는 {@link ApiError}로 래핑되어 throw됩니다.
 * - TanStack Query, SSR/CSR, 일반 fetch 등 다양한 상황에서 사용할 수 있습니다.
 *
 * @template T 응답 데이터의 타입
 * @param endpoint 요청할 API 경로 (예: '/user/profile')
 * @param options 요청 옵션 객체
 * @param options.method HTTP 메서드 (GET, POST 등, 기본값: data가 있으면 POST, 없으면 GET)
 * @param options.data 요청 본문 데이터 (POST, PUT, PATCH 등에서 사용)
 * @param options.isPublic 인증이 필요 없는 공개 API 여부 (기본값: false)
 * @param options.headers 추가 요청 헤더
 * @param options.params 쿼리 파라미터 등 기타 axios 옵션
 * @returns 응답 데이터 (T)
 * @throws {ApiError} 요청 실패 시 표준화된 에러 객체
 *
 * @example
 * // GET 요청
 * const user = await apiClient<UserProfile>('/user/profile');
 *
 * // POST 요청
 * await apiClient('/address', { method: 'POST', data: { ... } });
 *
 * // 인증이 필요 없는 공개 API
 * await apiClient('/public/info', { isPublic: true });
 */
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
