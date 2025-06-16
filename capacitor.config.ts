import type { CapacitorConfig } from '@capacitor/cli';

const isDevelopment = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.example.droniapp',
  appName: 'DroniApp',
  webDir: 'dist', // 프로덕션 빌드 시 사용될 웹 에셋 디렉토리
  ...(isDevelopment && {
    server: {
      // Android 에뮬레이터/기기에서 호스트 PC의 Vite 개발 서버에 접근하기 위한 주소
      // Mac에서는 일반적으로 10.0.2.2가 호스트를 가리킵니다.
      // vite.config.js의 base 설정에 따라 경로를 포함해야 합니다.
      url: 'http://10.0.2.2:3000', // Vite 개발 서버 포트 및 base 경로
      cleartext: true, // HTTP 트래픽 허용 (개발 중에만 권장)
    },
  }),
  // iOS 개발 시 추가 설정 (필요한 경우)
  ...(isDevelopment && {
    ios: {
      contentInset: 'always', // iOS에서 라이브 리로드 시 화면 잘림 방지
    },
  }),
};

export default config;
