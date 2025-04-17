package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/sign_and_send", SignAndSend)

	r.Run(":8080")
}

func SignAndSend(c *gin.Context) {
	// TODO: verify WebAuthn assertion
	// TODO: verify eBPF signature
	c.JSON(http.StatusOK, gin.H{"status": "submitted"})
}
