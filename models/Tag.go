package models

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name  string
	Notes []Note `gorm:"many2many:note_tags;"` // This is the foreign key
}
