npm install -g pnpm
npx create-nx-workspace@latest travel-journal-v2 --packageManager=pnpm
pnpm add -D @nx/react @nx/node @nx/js


# backend
pnpm add -w -D @types/aws-lambda @types/node aws-lambda typescript jest-mock-extended serverless serverless-offline 

## backend api
npx nx generate @nx/node:application lambda-authorizer --directory=applications/backend/lambda_rest_api
pnpm add -w  @sentry/aws-serverless @sentry/node @sentry/profiling-node sentry dotenv
pnpm add -w zod pino-pretty pino
pnpm add -w @aws-sdk/client-dynamodb  @aws-sdk/client-s3 @aws-sdk/lib-dynamodb @aws-sdk/s3-request-presigner
pnpm add -w -D @bufbuild/protobuf/codegenv1 @bufbuild/protobuf
## backend golang
cd applications/backend
mkdir image_metadata_processor
go mod init github.com/MohamedAljoke/image_metadata_processor
go mod tidy


# frontend
npx nx generate @nx/react:application landing-page --directory=applications/frontend/landing-page --routing=true --style=tailwind --bundler=vite

pnpm add -w lucide-react 

# backend lambdas authorizer
npx nx generate @nx/node:application lambda-authorizer --directory=applications/backend/lambda-authorizer
pnpm add -w jsonwebtoken jwks-rsa @sentry/aws-serverless @sentry/node @sentry/profiling-node sentry                  
