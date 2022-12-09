package models

import "gorm.io/gorm"

type Note struct {
	ID   int    `json:"id" gorm:"autoIncrement"`
	Body string `json:"body"`
	Tag  []Tag  `gorm:"many2many:note_tags;" json:"tags"`
}

type Tag struct {
	ID   int    `json:"id" gorm:"autoIncrement"`
	Name string `json:"name"`
}

func MigrateNotes(db *gorm.DB) error {
	err := db.AutoMigrate(&Note{}, &Tag{})
	return err
}
