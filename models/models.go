package models

import "gorm.io/gorm"

type Note struct {
	gorm.Model
	Body string
	Tags []Tag
}

type Tag struct {
	gorm.Model
	Name string
}

func MigrateNotes(db *gorm.DB) error {
	err := db.AutoMigrate(&Note{}, &Tag{})
	return err
}
