# Variables
NODE_AUTH_PATH = applications/backend/lambda_rest_api
IMAGE_METADATA_PROCESSOR_PATH = applications/backend/image_metadata_processor
PROTO_PATH = prototypes/schemas

# Build commands
.PHONY: build-image_metadata_processor build-node_auth build-proto build-all

build-image_metadata_processor:
	cd $(IMAGE_METADATA_PROCESSOR_PATH) && npm run build

build-node_auth:
	cd $(NODE_AUTH_PATH) && npm run build

build-proto:
	cd $(NODE_AUTH_PATH) && npm run build:proto

build-all: pnpm build


deploy-stg: build-all
	npx serverless deploy --stage stg
