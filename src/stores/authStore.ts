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
