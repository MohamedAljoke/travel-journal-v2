package s3eventhandler

import (
	"context"
	"fmt"
	"strings"

	"github.com/MohamedAljoke/image_metadata_processor/utils"
	"github.com/aws/aws-lambda-go/events"
)

func HandleRequest(ctx context.Context, s3Event events.S3Event) error {
	var combinedError error

	for _, record := range s3Event.Records {
		s3Bucket := record.S3.Bucket.Name
		s3Key := record.S3.Object.Key
		fileURL := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", s3Bucket, s3Key)
		uploadedAt := record.EventTime.String()

		userId := extractUserIdFromS3Key(s3Key)

		if err := writeFileToDynamoDB(userId, s3Key, fileURL, uploadedAt); err != nil {
			utils.LogError(fmt.Sprintf("Failed to write to DynamoDB for S3 key %s", s3Key), err)
			combinedError = fmt.Errorf("processing failed for S3 key %s: %w", s3Key, err)
		}
	}

	if combinedError != nil {
		return combinedError
	}

	return nil
}

func extractUserIdFromS3Key(s3Key string) string {
	parts := strings.Split(s3Key, "/")
	if len(parts) > 0 {
		return parts[0] // userId is the first part of the key
	}
	return ""
}
