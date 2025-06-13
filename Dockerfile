# ---- 빌드 스테이지 (Builder Stage) ----
# Node.js 22.16.0-alpine3.21 버전을 빌드 환경으로 사용합니다. Alpine 이미지는 경량화되어 있습니다.
# 'AS builder'는 이 스테이지에 'builder'라는 이름을 부여하여 이후 스테이지에서 참조할 수 있도록 합니다.
FROM node:22.16.0-alpine3.21 AS builder

# 작업 디렉토리를 '/app'으로 설정합니다.
# 이후 모든 RUN, CMD, COPY, ADD 명령어는 이 디렉토리를 기준으로 실행됩니다.
WORKDIR /app

# NODE_ENV 환경 변수를 'production'으로 설정합니다.
# 이는 많은 빌드 도구와 라이브러리가 프로덕션 최적화를 수행하도록 합니다.
ENV NODE_ENV=production

# 의존성 관련 파일들을 먼저 복사하여 Docker 레이어 캐싱을 활용합니다.
COPY package.json pnpm-lock.yaml ./

# 의존성을 설치합니다.
# devDependencies를 포함하여 모든 의존성을 설치하기 위해 NODE_ENV를 일시적으로 development로 설정합니다.
# 프로덕션 빌드 시 devDependencies가 필요 없다면 이 부분을 조정할 수 있습니다.
# pnpm은 기본적으로 devDependencies를 설치하지 않으므로, 빌드에 필요하다면 --prod 플래그 없이 실행합니다.
RUN pnpm install --frozen-lockfile

# 애플리케이션 빌드에 필요한 소스 코드 및 설정 파일만 복사합니다.
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tsconfig.json ./
# 프로젝트에 필요한 다른 루트 파일이나 디렉토리가 있다면 여기에 추가합니다.

# 애플리케이션 프로덕션 빌드를 실행합니다.
RUN pnpm build

# ---- 실행 스테이지 (Runner Stage) ----
# Nginx 1.28.0-alpine3.21 버전을 실행 환경으로 사용합니다.
# Alpine 이미지는 경량화되어 최종 이미지 크기를 줄이는 데 도움이 됩니다.
FROM nginx:1.28.0-alpine3.21

# 중요: 아래 COPY되는 nginx.conf 파일은 Nginx가 8080 포트(또는 다른 비특권 포트)에서
# 수신 대기하도록 수정되어야 합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지('builder')에서 생성된 정적 빌드 결과물(Vite의 경우 기본적으로 'dist' 폴더)을
# Nginx 웹 서버의 기본 HTML 제공 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 8080번 포트를 사용하도록 Docker에 알립니다.
# Traefik은 이 포트를 자동으로 감지하거나 docker-compose.yml에서 명시적으로 지정할 수 있습니다.
EXPOSE 8080

# Nginx 실행에 필요한 디렉토리 생성 및 권한 설정
# Nginx가 임시 파일 및 PID 파일을 저장할 디렉토리에 대한 쓰기 권한을 nginx 사용자에게 부여합니다.
RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx && \
  chown -R nginx:nginx /var/cache/nginx /var/run/nginx && \
  chmod -R 700 /var/cache/nginx && \
  # Nginx PID 파일 경로에 대한 쓰기 권한을 nginx 사용자에게 부여합니다.
  # 기본 nginx.conf에서 pid /var/run/nginx.pid; 로 설정되어 있을 경우 필요합니다.
  # Alpine Nginx 이미지의 기본 설정에서는 /run/nginx.pid 를 사용하며, /run 디렉토리는 일반적으로 적절한 권한을 가집니다.
  # 만약 사용자 정의 nginx.conf에서 다른 pid 경로를 사용한다면 해당 경로에 대한 권한 설정이 필요할 수 있습니다.
  # 다음 줄은 /var/run/nginx.pid 에 대한 소유권을 명시적으로 설정합니다.
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

# Nginx 프로세스를 nginx 사용자로 실행하여 보안을 강화합니다.
USER nginx

# 컨테이너가 시작될 때 Nginx를 foreground 모드로 실행합니다.
# '-g "daemon off;"' 옵션은 Nginx가 백그라운드 데몬으로 실행되지 않도록 하여
# Docker 컨테이너가 Nginx 프로세스 종료 시 함께 종료되도록 합니다. 이는 Docker 컨테이너 관리의 표준 방식입니다.
CMD ["nginx", "-g", "daemon off;"]
