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

# 중요: 아래 COPY되는 nginx.conf 파일은 Nginx가 8080 포트(또는 다른 비특권 포트)에서
# 수신 대기하도록 수정되어야 합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# /run/nginx 디렉토리 생성 (PID 파일 및 기타 런타임 파일용)
# 이 작업은 root 권한으로 수행되어야 합니다.
RUN mkdir -p /run/nginx && \
  chown nginx:nginx /run/nginx && \
  chmod 700 /run/nginx

# Nginx 주 설정 파일에서 PID 경로를 /run/nginx/nginx.pid 로 설정합니다.
# 기존 pid 지시어가 있으면 수정하고, 없으면 추가합니다.
# 또한, user 지시어가 nginx로 설정되어 있는지 확인합니다.
RUN if grep -q "^pid " /etc/nginx/nginx.conf; then \
  sed -i 's#^pid .*;#pid /run/nginx/nginx.pid;#' /etc/nginx/nginx.conf; \
  else \
  # pid 지시어가 없으면 파일의 첫 번째 user 지시어 바로 뒤에 추가
  sed -i '/^user .*;/a pid /run/nginx/nginx.pid;' /etc/nginx/nginx.conf; \
  fi && \
  # user 지시어가 nginx로 되어있는지 확인 또는 설정
  if ! grep -q "^user nginx;" /etc/nginx/nginx.conf && grep -q "^user " /etc/nginx/nginx.conf; then \
  sed -i 's/^user .*;/user nginx;/' /etc/nginx/nginx.conf; \
  elif ! grep -q "^user " /etc/nginx/nginx.conf; then \
  # user 지시어가 아예 없으면 파일 최상단에 추가 (일반적으로 존재함)
  echo "user nginx;" | cat - /etc/nginx/nginx.conf > temp && mv temp /etc/nginx/nginx.conf; \
  fi

# 빌드 스테이지('builder')에서 생성된 정적 빌드 결과물(Vite의 경우 기본적으로 'dist' 폴더)을
# Nginx 웹 서버의 기본 HTML 제공 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 8080번 포트를 사용하도록 Docker에 알립니다.
# Traefik은 이 포트를 자동으로 감지하거나 docker-compose.yml에서 명시적으로 지정할 수 있습니다.
EXPOSE 8080

# Nginx 실행에 필요한 디렉토리 생성 및 권한 설정 (이미 /run/nginx는 위에서 처리)
RUN mkdir -p /var/cache/nginx/client_temp \
  /var/cache/nginx/proxy_temp \
  /var/cache/nginx/fastcgi_temp \
  /var/cache/nginx/uwsgi_temp \
  /var/cache/nginx/scgi_temp && \
  chown -R nginx:nginx /var/cache/nginx && \
  chmod -R 700 /var/cache/nginx && \
  # nginx.conf 파일 권한 설정 (nginx 사용자가 읽을 수 있도록)
  chmod 644 /etc/nginx/conf.d/default.conf && \
  chmod 644 /etc/nginx/nginx.conf


# Nginx 프로세스를 nginx 사용자로 실행하여 보안을 강화합니다.
USER nginx

# 컨테이너가 시작될 때 Nginx를 foreground 모드로 실행합니다.
# '-g "daemon off;"' 옵션은 Nginx가 백그라운드 데몬으로 실행되지 않도록 하여
# Docker 컨테이너가 Nginx 프로세스 종료 시 함께 종료되도록 합니다. 이는 Docker 컨테이너 관리의 표준 방식입니다.
CMD ["nginx", "-g", "daemon off;"]
