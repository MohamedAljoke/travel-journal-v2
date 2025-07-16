# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Building and Testing
- **Build all projects**: `pnpm run build` or `npx nx run-many -t build`
- **Run tests**: `npx nx run-many -t test`
- **Type check**: `npx nx run-many -t typecheck`

### Individual Project Commands
- **Backend API**: `npx nx build @travel-journal-v2/lambda_rest_api`
- **Gallery App**: `npx nx build @travel-journal-v2/gallery-app`
- **Landing Page**: `npx nx build @travel-journal-v2/landing-page`
- **Go Image Processor**: `npx nx build image-metadata`

### Testing Individual Projects
- **Backend API tests**: `npx nx test @travel-journal-v2/lambda_rest_api`
- **Frontend tests**: `npx nx test @travel-journal-v2/gallery-app`

### Deployment
- **Deploy to dev**: `npm run deploy:dev`
- **Deploy to staging**: `npm run deploy:stg`
- **Deploy to production**: `npm run deploy:prod`

## Architecture Overview

This is a serverless travel journal application built with AWS services and NX monorepo architecture:

### Key Components
- **Frontend**: Two React applications (landing page and gallery app) built with Vite and Tailwind CSS
- **Backend**: Node.js Lambda REST API with JWT authentication via AWS Cognito
- **Image Processing**: Golang Lambda function for metadata extraction
- **Database**: DynamoDB for storing image metadata and user data
- **Storage**: S3 with pre-signed URLs for large file uploads (bypassing API Gateway 10MB limit)
- **Infrastructure**: Serverless Framework v4 with compose functionality

### Directory Structure
```
applications/
├── backend/
│   ├── lambda_rest_api/          # Node.js REST API
│   └── image_metadata_processor/ # Go image processor
├── frontend/
│   ├── gallery-app/              # Main React app
│   └── landing-page/             # Marketing site
serverless_infra/                 # AWS infrastructure definitions
└── scripts/                      # Deployment scripts
```

### Authentication Flow
- Uses AWS Cognito User Pool for authentication
- JWT tokens are validated via Lambda authorizer
- All API routes are protected except public endpoints

### Image Upload Process
1. Client requests pre-signed URL from `/get-upload-url`
2. Direct upload to S3 using pre-signed URL
3. S3 event triggers Go Lambda for metadata extraction
4. Metadata stored in DynamoDB
5. Failed operations sent to SQS dead letter queue

## Development Notes

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js 18, TypeScript, AWS SDK v3
- **Processing**: Go 1.x
- **Testing**: Jest with Node.js and JSDOM environments
- **Build Tool**: NX monorepo with esbuild
- **Package Manager**: pnpm

### Important Patterns
- All Lambda functions use custom handlers extending base functionality
- Error handling follows domain-driven design with custom error classes
- Zod is used for API request validation
- Pino logger is configured for structured logging
- Sentry integration for error monitoring

### Protocol Buffers
- Uses protobuf for type definitions in `src/shared/types/proto-types/`
- Build with `cd applications/backend/lambda_rest_api && npm run build:proto`

### Database Models
- User images: `src/application/models/users_images.models.ts`
- Users: `src/application/models/users.models.ts`

### No Linting Setup
This project has no ESLint or Prettier configuration. Type checking via TypeScript is the primary code quality tool.

### Environment Configuration
- Uses environment-specific serverless stages (dev, stg, prod)
- AWS credentials must be configured for deployment
- DynamoDB tables and S3 buckets are stage-specific

### Testing Strategy
- Unit tests for controllers and use cases
- Integration tests for database connections
- Mock AWS services in tests using `jest-mock-extended`