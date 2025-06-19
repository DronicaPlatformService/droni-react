'use client';

import { useCallback, useEffect, useRef } from 'react';
import { calculateTokenCheckInterval, logTokenInfo, shouldRefreshToken } from '@/lib/jwtUtils';
import { authStore, reissueToken } from '@/stores/authStore';

/**
 * @description JWT 토큰의 만료를 감지하고 자동으로 갱신하는 커스텀 훅
 * 이 훅은 클라이언트 컴포넌트에서만 사용할 수 있습니다.
 */
export function useTokenExpirationMonitor() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMonitoringRef = useRef(false);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    isMonitoringRef.current = false;

    if (import.meta.env.DEV) {
      console.log('[TokenMonitor] Monitoring stopped');
    }
  }, []);

  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return; // 이미 모니터링 중
    }

    const checkToken = async () => {
      const { accessToken } = authStore.state;

      if (!accessToken) {
        stopMonitoring();
        return;
      }

      // 개발 환경에서 토큰 정보 로깅
      if (import.meta.env.DEV) {
        logTokenInfo(accessToken, 'Token Monitor Check');
      }

      // 토큰이 곧 만료될 예정인지 확인 (기본: 10분 전)
      if (shouldRefreshToken(accessToken, 10)) {
        try {
          if (import.meta.env.DEV) {
            console.log('[TokenMonitor] Token will expire soon, attempting refresh...');
          }
          const currentPath = window.location.pathname + window.location.search;
          await reissueToken(currentPath);
          if (import.meta.env.DEV) {
            console.log('[TokenMonitor] Token refreshed successfully');
          }
        } catch (error) {
          console.error('[TokenMonitor] Failed to refresh token:', error);
          // 토큰 갱신 실패 시 모니터링 중지 (authStore에서 로그아웃 처리됨)
          stopMonitoring();
          return;
        }
      }

      // 다음 체크 주기 계산
      const { accessToken: newToken } = authStore.state;
      if (newToken) {
        const nextCheckInterval = calculateTokenCheckInterval(newToken, 30); // 최대 30분 주기

        if (nextCheckInterval) {
          intervalRef.current = setTimeout(checkToken, nextCheckInterval);

          if (import.meta.env.DEV) {
            const nextCheckMinutes = Math.round(nextCheckInterval / (1000 * 60));
            console.log(`[TokenMonitor] Next check scheduled in ${nextCheckMinutes} minutes`);
          }
        } else {
          console.warn('[TokenMonitor] Cannot calculate next check interval, stopping monitoring');
          stopMonitoring();
        }
      }
    };

    isMonitoringRef.current = true;

    // 첫 번째 체크를 즉시 실행
    checkToken();
  }, [stopMonitoring]);

  // 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      const { isAuthenticated, accessToken } = authStore.state;

      if (isAuthenticated && accessToken) {
        if (import.meta.env.DEV) {
          console.log('[TokenMonitor] User authenticated, starting token monitoring');
        }
        startMonitoring();
      } else {
        if (import.meta.env.DEV) {
          console.log('[TokenMonitor] User not authenticated, stopping token monitoring');
        }
        stopMonitoring();
      }
    });

    // 컴포넌트 마운트 시 현재 상태 확인
    const { isAuthenticated, accessToken } = authStore.state;
    if (isAuthenticated && accessToken) {
      startMonitoring();
    }

    // 클린업
    return () => {
      unsubscribe();
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  // 페이지 가시성 변화 감지 (브라우저 탭 활성화/비활성화)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const { isAuthenticated, accessToken } = authStore.state;

        if (isAuthenticated && accessToken) {
          // 페이지가 다시 활성화되면 즉시 토큰 상태 확인
          if (shouldRefreshToken(accessToken, 1)) {
            // 1분 버퍼로 더 민감하게 체크
            if (import.meta.env.DEV) {
              console.log('[TokenMonitor] Page became visible, checking token immediately');
            }

            const currentPath = window.location.pathname + window.location.search;
            reissueToken(currentPath).catch((error) => {
              console.error('[TokenMonitor] Failed to refresh token on page visibility:', error);
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    startMonitoring,
    stopMonitoring,
    isMonitoring: isMonitoringRef.current,
  };
}
