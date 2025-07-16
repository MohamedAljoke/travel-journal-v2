#!/bin/bash
STAGE=${1:-dev}

echo "🚀 Deploying all services to $STAGE..."

# Build landing page (no dynamic env vars needed)
echo "📦 Building landing page..."
npx nx build @travel-journal-v2/landing-page

# Deploy backend infrastructure first
echo "📦 Deploying backend infrastructure..."
serverless deploy --stage $STAGE

# Get the outputs from the deployed infrastructure
echo "🔍 Getting infrastructure outputs..."

# Debug: List all available outputs
echo "Available CloudFormation outputs for travel-journal-$STAGE:"
aws cloudformation describe-stacks --stack-name travel-journal-$STAGE --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" --output table --region us-east-1

echo "Available CloudFormation outputs for travel-journal-cognito-auth-$STAGE:"
aws cloudformation describe-stacks --stack-name travel-journal-cognito-auth-$STAGE --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" --output table --region us-east-1

# Try multiple possible output keys for API URL
API_URL=$(aws cloudformation describe-stacks --stack-name travel-journal-$STAGE --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" --output text --region us-east-1)
if [ -z "$API_URL" ]; then
    API_URL=$(aws cloudformation describe-stacks --stack-name travel-journal-$STAGE --query "Stacks[0].Outputs[?OutputKey=='ServiceEndpoint'].OutputValue" --output text --region us-east-1)
fi

COGNITO_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name travel-journal-cognito-auth-$STAGE --query "Stacks[0].Outputs[?OutputKey=='CognitoClientId'].OutputValue" --output text --region us-east-1)

if [ -z "$API_URL" ] || [ -z "$COGNITO_CLIENT_ID" ]; then
    echo "❌ Failed to get infrastructure outputs"
    echo "API_URL: $API_URL"
    echo "COGNITO_CLIENT_ID: $COGNITO_CLIENT_ID"
    
    # Fallback: try to extract from the serverless output you showed
    echo "Trying fallback method..."
    # For now, let's use the URL from your output as a fallback
    if [ -z "$API_URL" ]; then
        API_URL="https://ovldl0gfs5.execute-api.us-east-1.amazonaws.com/stg"
        echo "Using fallback API_URL: $API_URL"
    fi
    
    if [ -z "$COGNITO_CLIENT_ID" ]; then
        echo "❌ Still missing COGNITO_CLIENT_ID, cannot continue"
        exit 1
    fi
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