APP_VERSION ?= 0.9.0
IMAGE_NAME ?= magiceden-mint-nft

define docker_build
	@echo "Building $(1) image..."
	@docker build --target=$(1) --build-arg APP_VERSION=$(APP_VERSION) -t $(IMAGE_NAME):$(1) .
	@echo "Done building $(1) image."
endef

prod:
	$(call docker_build,production)

dev:
	$(call docker_build,development)

help:
	@echo "Makefile for building Docker images"
	@echo "Available commands:"
	@echo "  make prod - Build production image"
	@echo "  make dev - Build development image"