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

	// Get
	api.Get("/notes", r.getAllNotes)
	api.Get("/tags", r.getAllTags)
	api.Get("/note/:id", r.getNoteByID)

	// Post and Put
	api.Post("/note", r.createNote)
	api.Put("/note/:id", r.updateNote)

	// Delete
	api.Delete("/note/:id", r.deleteNote)
	api.Delete("/tag/:id", r.deleteTag)
}

func (r *Route) getAllNotes(c *fiber.Ctx) {
	// Get all the notes from the database
	var notes []models.Note
	err := r.DB.Preload("Tags").Find(&notes)
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}
	// Send the notes as a response
	c.JSON(notes)
}

func (r *Route) getAllTags(c *fiber.Ctx) {
	// Get all the tags from the database
	var tags []models.Tag
	err := r.DB.Find(&tags)
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}
	// Send the tags as a response
	c.JSON(tags)
}

func (r *Route) getNoteByID(c *fiber.Ctx) {
	// Get the note from the database
	var note models.Note
	err := r.DB.Preload("Tags").First(&note, c.Params("id"))
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}
	// Send the note as a response
	c.JSON(note)
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
	// Get the note from the database and update it
	var note models.Note
	err := r.DB.Preload("Tags").First(&note, c.Params("id"))
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}

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

	if input.Title != "" {
		note.Title = input.Title
	}
	if input.Body != "" {
		note.Body = input.Body
	}

	if err := r.DB.Save(&note).Error; err != nil {
		c.Status(503).Send(err)
		return
	}

	if len(input.Tags) == 0 {
		c.JSON(note)
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

func (r *Route) deleteNote(c *fiber.Ctx) {
	// delete the note from the database

	var note models.Note
	err := r.DB.Preload("Tags").First(&note, c.Params("id"))
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}

	if err := r.DB.Delete(&note).Error; err != nil {
		c.Status(503).Send(err)
		return
	}

	c.Send("Note deleted successfully")
}

func (r *Route) deleteTag(c *fiber.Ctx) {
	// delete the tag from the database

	var tag models.Tag
	err := r.DB.First(&tag, c.Params("id"))
	if err.Error != nil {
		c.Status(503).Send(err.Error)
		return
	}

	if err := r.DB.Delete(&tag).Error; err != nil {
		c.Status(503).Send(err)
		return
	}

	c.Send("Tag deleted successfully")
}
