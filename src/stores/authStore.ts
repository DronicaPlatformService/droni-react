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
  // This re-applies the initial state logic.
  // Since the store is already initialized with getInitialState(),
  // this might be redundant unless specific re-initialization logic is needed.
  // Or, it can be used to trigger effects like fetching user profiles if tokens exist.
  const reloadedState = getInitialState();
  authStore.setState(reloadedState);
  // Example: if (reloadedState.accessToken) { /* fetch user profile and call setUser */ }
};

// Expose actions through the store's state or a separate actions object if preferred.
// For direct use, ensure they are exported or attached to the store if that pattern is desired.
// TanStack Store doesn't enforce a specific way to organize actions like Redux toolkits.
// We can make them available on the store instance for convenience, though this is not standard.
// A more common pattern is to export actions separately or use them within hooks/components directly.

// To make actions callable like authStore.login(...), you would typically extend the Store class
// or manage actions separately. For this iteration, we will export them and they can be imported and used.

export { loadInitialState, login, logout, setLoading, setTokens, setUser };
export type { AuthActions, AuthState }; // Exporting types for use elsewhere

// App initialization note:
// The store is initialized with data from localStorage when authStore is created.
// `loadInitialState()` can be called explicitly if, for example, you need to re-verify tokens
// or fetch user data after initial load.
// e.g., in main.tsx: authStore.getState().loadInitialState(); (if actions were part of state)
// or simply: loadInitialState(); (if actions are separate like here)
