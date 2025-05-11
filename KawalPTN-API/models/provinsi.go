package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Provinsi struct {
	ID        uint      `json:"id"`
	Provinsi  string    `json:"provinsi" gorm:"not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP" json:"updated_at"`
}

func (provinsi *Provinsi) ValidateProvinsi() error {
	validate := validator.New()
	return validate.Struct(provinsi)
}
