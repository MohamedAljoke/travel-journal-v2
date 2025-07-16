#!/bin/bash
STAGE=${1:-dev}

echo "🚀 Deploying all services to $STAGE..."

# Build landing page (no dynamic env vars needed)
echo "📦 Building landing page..."
npx nx build @travel-journal-v2/landing-page

# Deploy backend infrastructure first and capture outputs
echo "📦 Deploying backend infrastructure..."
DEPLOY_OUTPUT=$(serverless deploy --stage $STAGE 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract API URL and Cognito Client ID from the deploy output
echo "🔍 Extracting infrastructure outputs..."

# Extract API URL from the deploy output
API_URL=$(echo "$DEPLOY_OUTPUT" | grep -E "(ServiceEndpoint|ApiGatewayUrl):" | head -1 | awk '{print $2}')

# Get Cognito Client ID from CloudFormation (this was working)
COGNITO_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name travel-journal-cognito-auth-$STAGE --query "Stacks[0].Outputs[?OutputKey=='CognitoClientId'].OutputValue" --output text --region us-east-1 2>/dev/null)

# Validate outputs
if [ -z "$API_URL" ]; then
    echo "⚠️  Could not extract API_URL from deploy output, trying CloudFormation..."
    API_URL=$(aws cloudformation describe-stacks --stack-name travel-journal-$STAGE --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" --output text --region us-east-1 2>/dev/null)
    if [ -z "$API_URL" ]; then
        API_URL=$(aws cloudformation describe-stacks --stack-name travel-journal-$STAGE --query "Stacks[0].Outputs[?OutputKey=='ServiceEndpoint'].OutputValue" --output text --region us-east-1 2>/dev/null)
    fi
fi

if [ -z "$COGNITO_CLIENT_ID" ]; then
    echo "⚠️  Could not get COGNITO_CLIENT_ID from CloudFormation, using hardcoded value..."
    COGNITO_CLIENT_ID="4v9o8iakouf1lgqvj0bfdvt2l1"
fi

if [ -z "$API_URL" ]; then
    echo "❌ Could not determine API_URL. Please check the deployment output above."
    echo "You can manually set it by running:"
    echo "export VITE_API_BASE_URL='https://your-api-url' && npx nx build @travel-journal-v2/gallery-app"
    exit 1
fi

echo "✅ Got infrastructure outputs:"
echo "   API_URL: $API_URL"
echo "   COGNITO_CLIENT_ID: $COGNITO_CLIENT_ID"

# Build gallery app with environment variables
echo "📦 Building gallery app with environment variables..."
export VITE_API_BASE_URL="$API_URL"
export VITE_COGNITO_CLIENT_ID="$COGNITO_CLIENT_ID"
export VITE_COGNITO_ENDPOINT="https://cognito-idp.us-east-1.amazonaws.com/"

npx nx build @travel-journal-v2/gallery-app

echo "📁 Uploading frontend files to S3..."
aws s3 sync ./applications/frontend/landing-page/dist s3://travel-journal-frontend-$STAGE --delete
aws s3 sync ./applications/frontend/gallery-app/dist s3://app-travel-journal-frontend-$STAGE --delete

echo "✅ Deployment complete!"
echo "🌐 Landing Page: d26i5q1k2vdupf.cloudfront.net"
echo "🌐 Gallery App: Check your S3 bucket for the gallery app files"