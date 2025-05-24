# ---- 빌드 스테이지 ----
# Node.js 22-alpine을 빌드 환경으로 사용
FROM node:22.16.0-alpine3.21 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 환경 변수 설정 (빌드 최적화에 도움)
ENV NODE_ENV=production

# 의존성 설치 캐싱을 위해 package.json과 yarn.lock 먼저 복사
COPY package.json yarn.lock ./

# 의존성 설치 (프로덕션 의존성만 설치하려면 --production 플래그 고려)
# --frozen-lockfile은 yarn.lock을 기반으로 정확한 버전 설치 보장
RUN yarn install --frozen-lockfile

# 소스 코드 복사
# .dockerignore 파일을 사용하여 불필요한 파일/폴더 제외 권장
COPY . .

# 애플리케이션 프로덕션 빌드 실행
# package.json의 "build": "vite build" 스크립트 사용
RUN yarn build

# ---- 실행 스테이지 ----
# Nginx 최신 안정 alpine 버전을 실행 환경으로 사용
FROM nginx:1.28.0-alpine3.21

# Nginx 설정 파일 복사
# 이 설정 파일은 React Router와 같은 SPA 라우팅을 올바르게 처리하도록 구성되어야 합니다.
# 예: try_files $uri $uri/ /index.html;
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지에서 생성된 정적 파일들을 Nginx 웹 루트로 복사
# Vite의 기본 빌드 출력 폴더는 'dist' 입니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 80번 포트를 사용하도록 설정
EXPOSE 80

# 컨테이너 시작 시 Nginx를 foreground로 실행
# Nginx가 데몬으로 실행되지 않도록 하여 Docker 컨테이너가 계속 실행되도록 함
CMD ["nginx", "-g", "daemon off;"]
