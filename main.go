package main

import (
	"fmt"
	"log"
	"os"
	"take-notes/models"
	"take-notes/routes"
	"take-notes/storage"

	"github.com/gofiber/fiber"
	"github.com/joho/godotenv"
)

func main() {

	// declare variable to hold error
	var err error

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
	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("Error connecting to database")
	}

	// Migrate the database
	err = models.MigrateNotes(db)
	if err != nil {
		log.Fatal("Error migrating database")
	}
	fmt.Println("Migrated database")

	app := fiber.New()

	r := routes.Route{
		DB: db,
	}

	r.SetupRoutes(app)

	app.Listen(3000)
}
