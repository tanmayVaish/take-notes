package routes

import (
	"fmt"

	"github.com/gofiber/fiber"
	"gorm.io/gorm"
)

// Within this, we will define all the route methods.
type Route struct {
	DB *gorm.DB
}

type Note struct {
	Body string `json:"body"`
	Tag  []Tag  `json:"tag"`
}

type Tag struct {
	Name string `json:"name"`
}

func (r *Route) SetupRoutes(app *fiber.App) {

	api := app.Group("/api")

	api.Get("/notes", r.getNotes)
	api.Get("/notes/:id", r.getNote)
	api.Post("/note", r.createNote)
	api.Put("/notes/:id", r.updateNote)
	api.Delete("/notes/:id", r.deleteNote)
}

func (r *Route) getNotes(c *fiber.Ctx) {
	// Get all the notes from the database
	var notes []Note
	err := r.DB.Find(&notes)
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}
	// Send the notes as a response
	c.JSON(notes)
}

func (r *Route) getNote(c *fiber.Ctx) {
	c.Send("get note")
}

func (r *Route) createNote(c *fiber.Ctx) {
	var note Note

	err := c.BodyParser(&note)
	if err != nil {
		c.Status(503).Send(err)
		fmt.Println("bodyparser", err)
		return
	}

	checkCreation := r.DB.Create(&note)

	// fmt.Println(checkCreation)

	if checkCreation.Error != nil {
		c.Status(503).Send(checkCreation.Error)
		fmt.Println("checkCreation", err)
		return
	}

	c.Status(201).JSON(&fiber.Map{
		"message": "Note created successfully",
	})

}

func (r *Route) updateNote(c *fiber.Ctx) {
	c.Send("update note")
}

func (r *Route) deleteNote(c *fiber.Ctx) {
	c.Send("delete note")
}
