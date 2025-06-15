package s3eventhandler

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var db *dynamodb.DynamoDB
var tableName string

func init() {
	// Initialize a new session using default AWS config (region, creds, etc.)
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
	}))
	db = dynamodb.New(sess)
	tableName = os.Getenv("DYNAMODB_TABLE")
}

func writeFileToDynamoDB(userId, imageId, fileUrl, uploadedAt string) error {
	// Prepare DynamoDB PutItem request
	input := &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item: map[string]*dynamodb.AttributeValue{
			"PK":        {S: aws.String(userId)},
			"SK":        {S: aws.String("FILE#" + imageId)},
			"imageId":   {S: aws.String(imageId)},
			"imageUrl":  {S: aws.String(fileUrl)},
			"uploadedAt": {S: aws.String(uploadedAt)},
		},
	}

	// Execute the PutItem request
	_, err := db.PutItem(input)
	return err
}
