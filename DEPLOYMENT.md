# 🚀 Droni React 배포 가이드

이 문서는 droni-react 애플리케이션의 프로덕션 배포 가이드입니다.

## 📋 사전 요구사항

- Docker 및 Docker Compose 설치
- `traefik_network` 네트워크 설정
- 충분한 디스크 공간 (최소 2GB 권장)
- GitHub Container Registry 접근 권한

## 🔧 배포 스크립트 기능

### 주요 기능

- ✅ **자동 백업 및 롤백**: 배포 전 자동 백업 생성 및 롤백 지원
- ✅ **Health Check**: 배포 후 애플리케이션 상태 자동 확인
- ✅ **로깅**: 상세한 배포 로그 및 오류 추적
- ✅ **환경별 배포**: production/staging 환경 지원
- ✅ **Zero-downtime**: 그레이스풀 셧다운 및 헬스체크 기반 배포
- ✅ **보안 강화**: 권한 제한 및 보안 검증
- ✅ **리소스 정리**: 자동 이미지/로그 정리

## 📖 사용법

### 기본 배포

```bash
# 프로덕션 환경에 배포
./deploy.sh production

# 스테이징 환경에 배포
./deploy.sh staging
```

### 고급 옵션

```bash
# 특정 태그로 배포
./deploy.sh production --tag v1.2.3

# 백업 없이 강제 배포
./deploy.sh production --no-backup --force

# 롤백 실행
./deploy.sh production --rollback

# 도움말 보기
./deploy.sh --help
```

### 빠른 롤백

```bash
# 간단한 롤백 인터페이스
./rollback.sh
```

## 📁 디렉토리 구조

배포 스크립트는 다음 디렉토리를 생성하고 관리합니다:

```
droni-react/
├── deploy.sh              # 메인 배포 스크립트
├── rollback.sh            # 롤백 유틸리티
├── .env.deploy            # 환경 설정
├── logs/                  # 배포 로그
│   └── deploy-YYYYMMDD-HHMMSS.log
├── backups/               # 백업 파일
│   ├── backup-YYYYMMDD-HHMMSS-*
│   └── latest-backup.txt
└── docker-compose.yml     # Docker 설정
```

## 🔍 모니터링 및 로그

### 로그 확인

```bash
# 최근 배포 로그 확인
tail -f logs/deploy-*.log

# 애플리케이션 로그 확인
docker compose logs -f frontend

# 컨테이너 상태 확인
docker compose ps
```

### Health Check

- **URL**: `http://localhost:18080/droni/health`
- **간격**: 30초
- **타임아웃**: 10초
- **재시도**: 3회

## 🔄 백업 및 롤백

### 백업 정책

- 배포 시 자동 백업 생성
- 최근 5개 백업 유지
- 백업 정보: 컨테이너 상태, 이미지 정보, 설정

### 롤백 절차

1. `./rollback.sh` 실행 또는 `./deploy.sh production --rollback`
2. 이전 이미지로 자동 복원
3. Health Check 수행
4. 롤백 완료 확인

## ⚠️ 트러블슈팅

### 일반적인 문제

#### 1. Health Check 실패

```bash
# 컨테이너 로그 확인
docker compose logs frontend

# 직접 Health Check URL 테스트
curl -f http://localhost:18080/droni/health
```

#### 2. 이미지 Pull 실패

```bash
# Registry 로그인 확인
docker login ghcr.io

# 수동으로 이미지 Pull 테스트
docker pull ghcr.io/dronicaplatformservice/droni-react:latest
```

#### 3. 네트워크 문제

```bash
# traefik 네트워크 확인
docker network ls | grep traefik

# 네트워크 재생성
docker network create traefik_network
```

#### 4. 디스크 공간 부족

```bash
# Docker 정리
docker system prune -f

# 사용하지 않는 이미지 정리
docker image prune -a -f
```

### 응급 복구 절차

#### 서비스 완전 중단 시

```bash
# 1. 모든 컨테이너 중지
docker compose down

# 2. 최신 이미지 다시 Pull
docker compose pull

# 3. 서비스 재시작
docker compose up -d

# 4. 로그 확인
docker compose logs -f
```

#### 설정 파일 복구

```bash
# Docker Compose 설정 검증
docker compose config

# 백업에서 설정 복원
cp backups/backup-YYYYMMDD-HHMMSS-compose.yml docker-compose.yml
```

## 🔒 보안 고려사항

- 컨테이너는 read-only 파일시스템으로 실행
- 불필요한 권한 제거 (cap_drop: ALL)
- 새로운 권한 획득 방지 (no-new-privileges)
- tmpfs를 통한 임시 파일 격리
- 정기적인 보안 업데이트 적용

## 📞 지원

배포 관련 문제 발생 시:

1. 로그 파일 확인 (`logs/deploy-*.log`)
2. 컨테이너 로그 확인 (`docker compose logs`)
3. Health Check URL 직접 테스트
4. 필요시 롤백 수행

## 📚 추가 리소스

- [Docker Compose 문서](https://docs.docker.com/compose/)
- [Traefik 설정 가이드](https://doc.traefik.io/traefik/)
- [프로젝트 메인 README](./README.md)
