package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	IsProd          bool
	TrustedProxies  []string
	TrustedPlatform string
}

func LoadEnv() (*Config, error) {

	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			return nil, fmt.Errorf("Error loading .env file: %v", err)
		}
	}

	//
	var trustedProxies []string
	trustedProxiesEnv := os.Getenv("TRUSTED_PROXIES")
	if trustedProxiesEnv != "" {
		trustedProxies = strings.Split(trustedProxiesEnv, ",")
	} else {
		trustedProxies = append(trustedProxies, "127.0.0.1")
	}

	return &Config{
		IsProd:          os.Getenv("ENV") == "production",
		TrustedProxies:  trustedProxies,
		TrustedPlatform: os.Getenv("TRUSTED_PLATFORM"),
	}, nil
}

func getenvInt(key string, defaultValue int) int {
	value, ok := os.LookupEnv(key)
	if !ok || value == "" {
		return defaultValue
	}

	n, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}

	return n
}
func getenvString(key, defaultValue string) string {
	value, ok := os.LookupEnv(key)
	if !ok || value == "" {
		return defaultValue
	}

	return value
}
