package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Sekolah_Sma struct {
	ID          uint       `json:"id"`
	Npsn        int        `json:"npsn" gorm:"not null;default:0"`
	ProvinsiID  uint       `json:"provinsi_id" gorm:"not null"`
	Provinsi    Provinsi   `gorm:"foreignKey:ProvinsiID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"provinsi"`
	KabupatenID uint       `json:"kabupaten_id" gorm:"not null"`
	Kabupaten   Kabupaten  `gorm:"foreignKey:KabupatenID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"kabupaten"`
	KecamatanID uint       `json:"kecamatan_id" gorm:"not null"`
	Kecamatan   Kecamatan  `gorm:"foreignKey:KecamatanID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"kecamatan"`
	Bentuk      string     `json:"bentuk" gorm:"not null"`
	Sekolah     string     `json:"sekolah" gorm:"not null"`
	Status      string     `json:"status" gorm:"not null"`
	CreatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP" json:"updated_at"`
}

func (sekolah_sma *Sekolah_Sma) ValidateSekolahSma() error {
	validate := validator.New()
	return validate.Struct(sekolah_sma)
}
