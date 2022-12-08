package main

import (
	"log"
	"os"
	"take-notes/models"
	"take-notes/storage"

	"github.com/joho/godotenv"
)

func main() {

	// declare variable to hold error
	var err error
	// declare variable to hold database connection
	var db *storage.DB

	// Load .env file
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Create a new connection to the database
	config := storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   os.Getenv("DB_NAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}

	// Connect to the database
	db, err = storage.NewConnection(config)
	if err != nil {
		log.Fatal("Error connecting to database")
	}

	err = models.MigrateNotes(db)

	if err != nil {
		log.Fatal("Error migrating database")
	}

}
