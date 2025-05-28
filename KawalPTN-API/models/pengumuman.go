package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Pengumuman struct {
	Id        uint      `json:"id"`
	Judul     string    `json:"judul" gorm:"not null"`
	Deskripsi string    `json:"deskripsi" gorm:"not null"`
	IdUsers   uint      `json:"id_users" gorm:"not null"`
	Users     Users     `json:"users" gorm:"foreignKey:IdUsers"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (pengumuman *Pengumuman) ValidatePengumuman() error {
	validate := validator.New()
	return validate.Struct(pengumuman)
}
