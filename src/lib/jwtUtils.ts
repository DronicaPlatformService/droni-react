/**
 * @description JWT 토큰 처리를 위한 유틸리티 함수들
 */

interface JWTPayload {
  exp?: number; // 만료 시간 (Unix timestamp)
  iat?: number; // 발급 시간 (Unix timestamp)
  sub?: string; // 주체 (보통 사용자 ID)
  userId?: string; // 사용자 ID (커스텀 클레임)
  id?: string; // ID (커스텀 클레임)
  [key: string]: unknown; // 기타 커스텀 클레임들
}

/**
 * @description JWT 토큰에서 페이로드를 디코딩합니다.
 * @param token JWT 토큰 문자열
 * @returns 디코딩된 페이로드 객체 또는 null (디코딩 실패 시)
 */
export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    // JWT는 '.'으로 구분된 세 부분으로 구성됨
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('[JWT] Invalid JWT format: token should have 3 parts');
      return null;
    }

    const payloadBase64 = parts[1];
    if (!payloadBase64) {
      console.warn('[JWT] Payload part is missing');
      return null;
    }

    // Base64URL 디코딩을 위해 '-'를 '+', '_'를 '/'로 변경
    const correctedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

    // 패딩 추가 (Base64 문자열 길이는 4의 배수여야 함)
    const paddedBase64 = correctedBase64 + '==='.slice((correctedBase64.length + 3) % 4);

    // Base64 디코딩 후 JSON 파싱
    const decodedPayload = atob(paddedBase64);
    const payloadObject = JSON.parse(decodedPayload) as JWTPayload;

    return payloadObject;
  } catch (error) {
    console.error('[JWT] Error decoding JWT payload:', error);
    return null;
  }
}

/**
 * @description JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰 문자열
 * @param bufferSeconds 만료 전 버퍼 시간 (초) - 기본값: 60초
 * @returns true if expired or will expire within buffer time, false otherwise
 */
export function isTokenExpiredOrExpiring(token: string, bufferSeconds = 60): boolean {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    console.warn('[JWT] Token payload is invalid or missing expiration claim');
    return true; // 안전을 위해 만료된 것으로 간주
  }

  const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (Unix timestamp)
  const expirationTime = payload.exp;
  const timeUntilExpiration = expirationTime - currentTime;

  // 만료되었거나 버퍼 시간 내에 만료될 예정인지 확인
  return timeUntilExpiration <= bufferSeconds;
}

/**
 * @description JWT 토큰의 남은 유효 시간을 초 단위로 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 남은 시간(초) 또는 0 (만료되었거나 유효하지 않은 경우)
 */
export function getTokenRemainingTime(token: string): number {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = payload.exp - currentTime;

  return Math.max(0, remainingTime); // 음수가 되지 않도록 보정
}

/**
 * @description JWT 토큰의 만료 시간을 Date 객체로 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 만료 시간 Date 객체 또는 null
 */
export function getTokenExpirationDate(token: string): Date | null {
  const payload = decodeJWTPayload(token);

  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000); // Unix timestamp를 밀리초로 변환
}

/**
 * @description JWT 토큰에서 사용자 정보를 추출합니다.
 * @param token JWT 토큰 문자열
 * @returns 사용자 ID 또는 null
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWTPayload(token);

  if (!payload) {
    return null;
  }

  // 일반적으로 'sub' 클레임에 사용자 ID가 저장됨
  // 백엔드 구현에 따라 'userId', 'id' 등 다른 필드일 수 있음
  return payload.sub || payload.userId || payload.id || null;
}

/**
 * @description JWT 토큰이 곧 만료될 예정인지 확인합니다 (사전 갱신용).
 * @param token JWT 토큰 문자열
 * @param thresholdMinutes 임계값 (분 단위) - 기본값: 10분
 * @returns true if token should be refreshed, false otherwise
 */
export function shouldRefreshToken(token: string, thresholdMinutes = 10): boolean {
  const remainingTimeSeconds = getTokenRemainingTime(token);
  const thresholdSeconds = thresholdMinutes * 60;

  return remainingTimeSeconds <= thresholdSeconds;
}

/**
 * @description JWT 토큰 만료까지의 체크 주기를 계산합니다.
 * @param token JWT 토큰 문자열
 * @param maxIntervalMinutes 최대 체크 주기 (분 단위) - 기본값: 30분
 * @returns 체크 주기 (밀리초) 또는 null (토큰이 유효하지 않은 경우)
 */
export function calculateTokenCheckInterval(token: string, maxIntervalMinutes = 30): number | null {
  const remainingTimeSeconds = getTokenRemainingTime(token);

  if (remainingTimeSeconds <= 0) {
    return null; // 이미 만료된 토큰
  }

  // 남은 시간의 1/3 지점에서 체크하되, 최대 주기를 넘지 않음
  const intervalSeconds = Math.min(remainingTimeSeconds / 3, maxIntervalMinutes * 60);

  // 최소 1분은 보장
  const finalIntervalSeconds = Math.max(intervalSeconds, 60);

  return finalIntervalSeconds * 1000; // 초를 밀리초로 변환
}

/**
 * @description JWT 토큰의 완전한 정보를 반환합니다.
 * @param token JWT 토큰 문자열
 * @returns 토큰 정보 객체 또는 null
 */
export function getTokenInfo(token: string) {
  const payload = decodeJWTPayload(token);

  if (!payload) {
    return null;
  }

  const expirationDate = getTokenExpirationDate(token);
  const issuedDate = payload.iat ? new Date(payload.iat * 1000) : null;
  const remainingTimeSeconds = getTokenRemainingTime(token);
  const remainingTimeMinutes = Math.floor(remainingTimeSeconds / 60);
  const isExpired = isTokenExpiredOrExpiring(token, 0);
  const isExpiring = isTokenExpiredOrExpiring(token);
  const shouldRefresh = shouldRefreshToken(token);
  const userId = getUserIdFromToken(token);

  return {
    payload,
    userId,
    expirationDate,
    issuedDate,
    remainingTimeSeconds,
    remainingTimeMinutes,
    isExpired,
    isExpiring,
    shouldRefresh,
  };
}

/**
 * @description JWT 토큰의 상세 정보를 로깅합니다 (개발 환경에서만).
 * @param token JWT 토큰 문자열
 * @param label 로그 라벨
 */
export function logTokenInfo(token: string, label = 'JWT Token'): void {
  if (import.meta.env.PROD) {
    return; // 프로덕션에서는 로깅하지 않음
  }

  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo) {
    console.warn(`[${label}] Failed to decode token`);
    return;
  }

  console.group(`[${label}] Token Information`);
  console.info('User ID:', tokenInfo.userId);
  console.info('Issued Date:', tokenInfo.issuedDate?.toISOString());
  console.info('Expiration Date:', tokenInfo.expirationDate?.toISOString());
  console.info(
    'Remaining Time:',
    `${tokenInfo.remainingTimeMinutes}m ${tokenInfo.remainingTimeSeconds % 60}s`,
  );
  console.info('Is Expired:', tokenInfo.isExpired);
  console.info('Is Expiring (60s buffer):', tokenInfo.isExpiring);
  console.info('Should Refresh (10m threshold):', tokenInfo.shouldRefresh);
  console.info('Full Payload:', tokenInfo.payload);
  console.groupEnd();
}
