# ---- 빌드 스테이지 (Builder Stage) ----
# Node.js 22.16.0-alpine3.21 버전을 빌드 환경으로 사용합니다.
# 'AS builder'는 이 스테이지에 'builder'라는 이름을 부여하여 이후 스테이지에서 참조할 수 있도록 합니다.
FROM node:22.16.0-alpine3.21 AS builder

# 작업 디렉토리를 '/app'으로 설정합니다.
# 이후 모든 RUN, CMD, COPY, ADD 명령어는 이 디렉토리를 기준으로 실행됩니다.
WORKDIR /app

# NODE_ENV 환경 변수를 'production'으로 설정합니다.
# 이는 많은 빌드 도구와 라이브러리가 프로덕션 최적화를 수행하도록 합니다.
ENV NODE_ENV=production

# 의존성 관련 파일들을 먼저 복사합니다.
# Docker는 레이어 캐싱을 사용하므로, 이 파일들이 변경되지 않으면 'yarn install' 단계를 다시 실행하지 않아 빌드 시간을 단축할 수 있습니다.
COPY package.json yarn.lock ./

# Yarn PnP (Plug'n'Play)를 사용하는 경우 관련된 파일들을 복사합니다.
# 이 파일들은 Git에 커밋되어 있어야 하며, 'yarn install' 시 필요합니다.
COPY .pnp.cjs ./.pnp.cjs
COPY .pnp.loader.mjs ./.pnp.loader.mjs
COPY install-state.gz ./install-state.gz

# 의존성을 설치합니다.
# '--frozen-lockfile' 플래그는 'yarn.lock' 파일을 변경하지 않고 정확히 명시된 버전의 의존성만 설치하도록 강제합니다.
# 이는 CI/CD 환경에서 일관된 빌드를 보장하는 데 중요합니다.
RUN yarn install --frozen-lockfile

# 나머지 소스 코드를 작업 디렉토리로 복사합니다.
# '.dockerignore' 파일에 명시된 파일 및 폴더는 이 과정에서 제외됩니다.
# 빌드에 불필요한 파일(예: .git, node_modules 등)을 제외하여 빌드 컨텍스트 크기를 줄이고 보안을 강화합니다.
COPY . .

# 애플리케이션 프로덕션 빌드를 실행합니다.
# package.json 파일 내 "scripts"의 "build" 명령어를 사용합니다 (예: "vite build && tsc").
RUN yarn build

# ---- 실행 스테이지 (Runner Stage) ----
# Nginx 1.28.0-alpine3.21 버전을 실행 환경으로 사용합니다.
# Alpine 이미지는 경량화되어 최종 이미지 크기를 줄이는 데 도움이 됩니다.
FROM nginx:1.28.0-alpine3.21

# 사용자 정의 Nginx 설정 파일을 이미지 내의 Nginx 설정 디렉토리로 복사합니다.
# 이 설정 파일은 React Router와 같은 SPA(Single Page Application)의 라우팅을 올바르게 처리하도록
# 'try_files $uri $uri/ /index.html;' 지시어 등을 포함해야 합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지('builder')에서 생성된 정적 빌드 결과물(Vite의 경우 기본적으로 'dist' 폴더)을
# Nginx 웹 서버의 기본 HTML 제공 루트 디렉토리로 복사합니다.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 80번 포트를 사용하도록 Docker에 알립니다.
# 실제 포트 매핑은 'docker run -p' 또는 docker-compose.yml 파일에서 설정됩니다.
EXPOSE 80

# 컨테이너가 시작될 때 Nginx를 foreground 모드로 실행합니다.
# '-g "daemon off;"' 옵션은 Nginx가 백그라운드 데몬으로 실행되지 않도록 하여
# Docker 컨테이너가 Nginx 프로세스 종료 시 함께 종료되도록 합니다. 이는 Docker 컨테이너 관리의 표준 방식입니다.
CMD ["nginx", "-g", "daemon off;"]
