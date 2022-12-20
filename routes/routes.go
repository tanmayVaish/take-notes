package routes

import (
	"take-notes/models"

	"github.com/gofiber/fiber"
	"gorm.io/gorm"
)

// Within this, we will define all the route methods.
type Route struct {
	DB *gorm.DB
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
	var notes []models.Note
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

	var input struct {
		Title string
		Body  string
		Tags  []struct {
			Name string
		}
	}

	if err := c.BodyParser(&input); err != nil {
		c.Status(503).Send(err)
		return
	}

	note := models.Note{
		Title: input.Title,
		Body:  input.Body,
	}

	if err := r.DB.Create(&note).Error; err != nil {
		c.Status(503).Send(err)
		return
	}

	var tags []models.Tag

	for _, tagName := range input.Tags {
		var tag models.Tag
		if err := r.DB.Where("name = ?", tagName.Name).FirstOrCreate(&tag, models.Tag{Name: tagName.Name}).Error; err != nil {
			c.Status(503).Send(err)
			return
		}
		tags = append(tags, tag)
	}

	if err := r.DB.Model(&note).Association("Tags").Replace(tags); err != nil {
		c.Status(503).Send(err)
		return
	}

	c.JSON(note)

}

func (r *Route) updateNote(c *fiber.Ctx) {
	c.Send("update note")
}

func (r *Route) deleteNote(c *fiber.Ctx) {
	c.Send("delete note")
}
