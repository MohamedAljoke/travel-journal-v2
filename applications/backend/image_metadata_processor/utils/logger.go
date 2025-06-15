package utils

import "log"

// LogError logs errors to the standard output, adding extra context.
func LogError(message string, err error) {
	log.Printf("%s: %v", message, err)
}
