package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Berita struct {
	Id        uint      `json:"id"`
	Judul     string    `json:"judul" gorm:"not null"`
	Deskripsi string    `json:"deskripsi" gorm:"not null"`
	Foto      *string   `json:"foto" gorm:"type:varchar(255);default:null"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (berita *Berita) ValidateBerita() error {
	validate := validator.New()
	return validate.Struct(berita)
}
