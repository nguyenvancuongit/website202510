# Docker Hub configuration - update these with your actual values
DOCKER_HUB_USERNAME ?= ezgdpk31999
IMAGE_TAG ?= latest

# Load environment variables from .env.prod if it exists
ifneq (,$(wildcard ./.env.prod))
    include .env.prod
    export
endif

# Service image names
BACKEND_IMAGE = $(DOCKER_HUB_USERNAME)/viansite-backend:$(IMAGE_TAG)
FRONTEND_IMAGE = $(DOCKER_HUB_USERNAME)/viansite-frontend:$(IMAGE_TAG)
LANDING_PAGE_IMAGE = $(DOCKER_HUB_USERNAME)/viansite-landing-page:$(IMAGE_TAG)

# Local development commands
build:
	docker-compose -f docker-compose.yml build

run:
	docker-compose up -d

down:
	docker-compose -f docker-compose.yml down

run-with-remove-orphans:
	docker-compose -f docker-compose.yml up -d --remove-orphans

stop:
	docker-compose stop

# Build for Linux platform (EC2 deployment)
build-linux:
	docker buildx build --platform linux/amd64 -t $(BACKEND_IMAGE) -f ./docker/Dockerfile.backend .
	docker buildx build --platform linux/amd64 -t $(FRONTEND_IMAGE) -f ./docker/Dockerfile.frontend \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) .
	docker buildx build --platform linux/amd64 -t $(LANDING_PAGE_IMAGE) -f ./docker/Dockerfile.landing-page \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) \
		--build-arg API_URL=$(NEXT_PUBLIC_API_URL) .

# Build and push to Docker Hub
build-and-push:
	docker buildx build --platform linux/amd64 -t $(BACKEND_IMAGE) -f ./docker/Dockerfile.backend . --push
	docker buildx build --platform linux/amd64 -t $(FRONTEND_IMAGE) -f ./docker/Dockerfile.frontend \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) . --push
	docker buildx build --platform linux/amd64 -t $(LANDING_PAGE_IMAGE) -f ./docker/Dockerfile.landing-page \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) \
		--build-arg NEXT_PUBLIC_SITE_URL=$(NEXT_PUBLIC_SITE_URL) \
		--build-arg API_URL=$(NEXT_PUBLIC_API_URL) . --push

# Login to Docker Hub
docker-login:
	docker login

# Push images to Docker Hub (after building locally)
push:
	docker push $(BACKEND_IMAGE)
	docker push $(FRONTEND_IMAGE)
	docker push $(LANDING_PAGE_IMAGE)

# Build individual services for Linux
build-backend-linux:
	docker buildx build --platform linux/amd64 -t $(BACKEND_IMAGE) -f ./docker/Dockerfile.backend .

build-frontend-linux:
	docker buildx build --platform linux/amd64 -t $(FRONTEND_IMAGE) -f ./docker/Dockerfile.frontend \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) .

build-landing-page-linux:
	docker buildx build --platform linux/amd64 -t $(LANDING_PAGE_IMAGE) -f ./docker/Dockerfile.landing-page \
		--build-arg NEXT_PUBLIC_API_URL=$(NEXT_PUBLIC_API_URL) \
		--build-arg NEXT_PUBLIC_SITE_URL=$(NEXT_PUBLIC_SITE_URL) \
		--build-arg API_URL=$(NEXT_PUBLIC_API_URL) .

# Push individual services
push-backend:
	docker push $(BACKEND_IMAGE)

push-frontend:
	docker push $(FRONTEND_IMAGE)

push-landing-page:
	docker push $(LANDING_PAGE_IMAGE)

# Remote host commands (original)
build-on-host:
	DOCKER_HOST=ssh://vian docker-compose -f docker-compose.yml build

run-on-host:
	DOCKER_HOST=ssh://vian docker-compose -f docker-compose.yml up -d --remove-orphans

down-on-host:
	DOCKER_HOST=ssh://vian docker-compose -f docker-compose.yml down

stop-on-host:
	DOCKER_HOST=ssh://vian docker-compose -f docker-compose.yml stop

