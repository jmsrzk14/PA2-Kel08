package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Kabupaten struct {
	ID         uint       `json:"id"`
	Kabupaten  string     `json:"kabupaten" gorm:"not null"`
	ProvinsiID uint       `json:"provinsi_id" gorm:"not null"`
	Provinsi   Provinsi   `gorm:"foreignKey:ProvinsiID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"provinsi"`
	CreatedAt  *time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  *time.Time `gorm:"default:CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP" json:"updated_at"`
}

func (kabupaten *Kabupaten) ValidateKabupaten() error {
	validate := validator.New()
	return validate.Struct(kabupaten)
}
