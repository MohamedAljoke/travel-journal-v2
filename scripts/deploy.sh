#!/bin/bash
STAGE=${1:-dev}

pnpm run build

echo "🚀 Deploying all services to $STAGE..."
serverless deploy --stage $STAGE

echo "📁 Uploading frontend files..."
aws s3 sync ./applications/frontend/landing-page/dist s3://travel-journal-frontend-$STAGE --delete
aws s3 sync ./applications/frontend/gallery-app/dist s3://app-travel-journal-frontend-$STAGE --delete

echo "✅ Deployment complete!"