package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Kecamatan struct {
	ID          uint      `json:"id"`
	Kecamatan   string    `json:"kecamatan" gorm:"not null"`
	KabupatenID uint      `json:"kabupaten_id" gorm:"not null"`
	Kabupaten   Kabupaten `gorm:"foreignKey:KabupatenID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"kabupaten"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (kecamatan *Kecamatan) ValidateKecamatan() error {
	validate := validator.New()
	return validate.Struct(kecamatan)
}
