import { Store } from '@tanstack/store';

interface AuthState {
  accessToken: string | null;
  user: null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (tokens: { accessToken: string }) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string }) => void;
  setUser: (userProfile: null) => void;
  loadInitialState: () => void;
  setLoading: (loading: boolean) => void;
  reissueToken: (redirectionUrl: string) => Promise<void>;
}

/**
 * @description
 * 클라이언트의 인증 상태 초기값을 반환합니다.
 *
 * - 브라우저 환경에서 localStorage에 저장된 accessToken이 있으면 인증된 상태로 초기화합니다.
 * - accessToken이 없거나 localStorage 접근에 실패하면 인증되지 않은 상태로 초기화합니다.
 * - SSR 환경 등 window가 없는 경우에도 안전하게 동작합니다.
 *
 * @returns {AuthState} 인증 관련 초기 상태 객체
 */
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        return {
          accessToken,
          user: null,
          isAuthenticated: true,
          isLoading: false,
        };
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }
  return {
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };
};

// TanStack Store v0.7.1 uses new Store()
// The constructor expects the initial state, and actions can be defined on the store instance directly
// or by extending the store if more complex logic is needed within actions.
// For simplicity, we'll set the initial state and then define methods that call setState.

const initialState = getInitialState();

export const authStore = new Store<AuthState>(initialState);

// Actions - defined outside and call authStore.setState
// This approach is more aligned with how TanStack Store is typically used when actions are simple state updates.

/**
 * @description
 * 사용자가 로그인할 때 호출되는 액션입니다.
 *
 * - accessToken을 localStorage에 저장하고, 인증 상태를 true로 변경합니다.
 * - 사용자 정보(user)는 null로 초기화됩니다(추후 프로필 fetch 필요).
 * - isLoading은 false로 설정됩니다.
 *
 * @param tokens - 로그인 성공 시 받은 accessToken 객체
 * @example
 * login({ accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' });
 */
const login = (tokens: { accessToken: string }) => {
  try {
    localStorage.setItem('accessToken', tokens.accessToken);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
  authStore.setState((state) => ({
    ...state,
    accessToken: tokens.accessToken,
    user: null,
    isAuthenticated: true,
    isLoading: false,
  }));
};

const logout = () => {
  try {
    localStorage.removeItem('accessToken');
    // refreshToken 쿠키는 서버에서 만료시키거나 httpOnly이므로 클라이언트에서 직접 제어하지 않습니다.
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
  authStore.setState((state) => ({
    ...state,
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }));
};

const setTokens = (tokens: { accessToken: string }) => {
  try {
    localStorage.setItem('accessToken', tokens.accessToken);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
  authStore.setState((state) => ({
    ...state,
    accessToken: tokens.accessToken,
    isAuthenticated: !!tokens.accessToken,
  }));
};

const setUser = (userProfile: null) => {
  authStore.setState((state) => ({
    ...state,
    user: userProfile,
  }));
};

const setLoading = (loading: boolean) => {
  authStore.setState((state) => ({
    ...state,
    isLoading: loading,
  }));
};

const loadInitialState = () => {
  authStore.setState(getInitialState());
};

/**
 * @description
 * Refresh Token(서버 HttpOnly 쿠키)에 기반하여 새로운 Access Token을 발급받고 상태를 갱신합니다.
 *
 * - 현재 accessToken이 없으면 즉시 로그아웃 처리 후 종료합니다.
 * - 서버에 POST 요청을 보내 accessToken 재발급을 시도합니다.
 * - 성공 시 새 accessToken을 저장하고 인증 상태를 갱신합니다.
 * - 실패(401 등) 또는 네트워크 에러 발생 시 로그아웃 처리합니다.
 * - 항상 isLoading 상태를 적절히 관리합니다.
 *
 * @param redirectionUrl 재발급 후 리다이렉션에 사용할 현재 경로(쿼리 포함)
 * @returns Promise<void>
 */
const reissueToken = async (redirectionUrl: string) => {
  setLoading(true);
  try {
    // HttpOnly 쿠키에 있는 Refresh Token은 브라우저가 자동으로 전송합니다.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const currentAccessToken = authStore.state.accessToken;

    if (!currentAccessToken) {
      console.error('No access token available for reissue.');
      logout();
      setLoading(false);
      return;
    }

    const response = await fetch(
      `${backendUrl}/reissue?redirectionUrl=${encodeURIComponent(redirectionUrl)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: currentAccessToken }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        setTokens({ accessToken: data.accessToken });
      } else {
        // 응답에 accessToken이 없는 경우, API 명세 확인 필요
        console.error('Reissue token response does not contain accessToken:', data);
        logout(); // 또는 다른 에러 처리
      }
    } else {
      // 401 (Unauthorized) 또는 다른 에러 코드 처리
      // Refresh Token이 만료되었거나 유효하지 않은 경우
      console.error('Failed to reissue token:', response.status, await response.text());
      logout();
    }
  } catch (error) {
    console.error('Error during token reissue:', error);
    logout(); // 네트워크 에러 등 발생 시 로그아웃
  } finally {
    setLoading(false);
  }
};

export { loadInitialState, login, logout, reissueToken, setLoading, setTokens, setUser };
export type { AuthActions, AuthState };
