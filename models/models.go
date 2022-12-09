package models

import "gorm.io/gorm"

type Note struct {
	ID   int    `json:"id"`
	body string `json:"body"`
	tag  string `json:"tag"`
}

type Tag struct {
	ID   int    `json:"id"`
	name string `json:"name"`
}

func MigrateNotes(db *gorm.DB) error {
	err := db.AutoMigrate(&Note{})
	return err
}
