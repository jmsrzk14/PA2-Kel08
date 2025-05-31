package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Testimoni struct {
	Id        uint      `json:"id"`
	Nama      string    `json:"nama" gorm:"not null"`
	Deskripsi string    `json:"deskripsi" gorm:"not null"`
	Foto      *string   `json:"foto" gorm:"type:varchar(255);default:null"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (testimoni *Testimoni) ValidateTestimoni() error {
	validate := validator.New()
	return validate.Struct(testimoni)
}
