# ---- 빌드 스테이지 (Builder Stage) ----
# Alpine 이미지는 경량화되어 있습니다.
# 'AS builder'는 이 스테이지에 'builder'라는 이름을 부여하여 이후 스테이지에서 참조할 수 있도록 합니다.
FROM node:24.2.0-alpine3.21 AS builder

# 작업 디렉토리를 '/app'으로 설정합니다.
# 이후 모든 RUN, CMD, COPY, ADD 명령어는 이 디렉토리를 기준으로 실행됩니다.
WORKDIR /app

# NODE_ENV 환경 변수를 'production'으로 설정합니다.
# 이는 많은 빌드 도구와 라이브러리가 프로덕션 최적화를 수행하도록 합니다.
ENV NODE_ENV=production

ARG VITE_BACKEND_URL_ARG
ARG VITE_NAVER_CLIENT_ID_ARG
ARG VITE_NAVER_REDIRECT_URI_ARG

# pnpm을 전역으로 설치합니다.
RUN npm install -g pnpm

# 의존성 관련 파일들을 먼저 복사하여 Docker 레이어 캐싱을 활용합니다.
COPY package.json pnpm-lock.yaml ./

# 의존성을 설치합니다.
RUN env NODE_ENV=development pnpm install --frozen-lockfile

# 애플리케이션 빌드에 필요한 소스 코드 및 설정 파일만 복사합니다.
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tsconfig.json ./
# 확실하게 하기 위해, 파일이 없을 경우를 대비해 touch 명령으로 파일을 생성할 수 있습니다.
RUN touch .env.production

# .env.production 파일에 빌드 인자로 받은 민감 변수들 추가
RUN if [ -n "$VITE_BACKEND_URL_ARG" ]; then printf "VITE_BACKEND_URL=%s\n" "${VITE_BACKEND_URL_ARG}" >> .env.production; fi
RUN if [ -n "$VITE_NAVER_CLIENT_ID_ARG" ]; then printf "VITE_NAVER_CLIENT_ID=%s\n" "${VITE_NAVER_CLIENT_ID_ARG}" >> .env.production; fi
RUN if [ -n "$VITE_NAVER_REDIRECT_URI_ARG" ]; then printf "VITE_NAVER_REDIRECT_URI=%s\n" "${VITE_NAVER_REDIRECT_URI_ARG}" >> .env.production; fi


# 애플리케이션 프로덕션 빌드를 실행합니다.
RUN pnpm build

# ---- 실행 스테이지 (Runner Stage) ----
# Alpine 이미지는 경량화되어 최종 이미지 크기를 줄이는 데 도움이 됩니다.
FROM nginx:1.28.0-alpine3.21

# Nginx가 8080번 포트를 사용하도록 Docker에 알립니다.
# 실제 포트는 nginx.conf에서 listen 지시어로 설정됩니다.
EXPOSE 8080

# 사용자 정의 Nginx 설정을 복사합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지('builder')에서 생성된 정적 빌드 결과물을 Nginx 웹 서버의 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 워커 프로세스(nginx 사용자)가 정적 컨텐츠를 읽을 수 있도록
# /usr/share/nginx/html 디렉토리와 그 내용의 소유권 및 권한을 설정합니다.
# Nginx 마스터 프로세스는 root로 실행되지만, 워커 프로세스는 nginx 사용자로 실행되므로 이 설정은 여전히 중요합니다.
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
  find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# 컨테이너가 시작될 때 Nginx를 foreground 모드로 실행합니다.
# 기본 Nginx 이미지는 ENTRYPOINT를 통해 /docker-entrypoint.sh를 실행하며,
# 이 스크립트가 최종적으로 Nginx를 시작합니다.
CMD ["nginx", "-g", "daemon off;"]
