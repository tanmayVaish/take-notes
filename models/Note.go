package models

import "gorm.io/gorm"

type Note struct {
	gorm.Model
	Title string
	Body  string
	Tags  []Tag `gorm:"many2many:note_tags;"` // This is the foreign key
}
