package main

import (
	"fmt"

	"github.com/MohamedAljoke/image_metadata_processor/s3eventhandler"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	fmt.Println("Lambda is starting...")
	lambda.Start(s3eventhandler.HandleRequest)
}
