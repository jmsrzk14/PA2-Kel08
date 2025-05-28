package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type T_Ptn struct {
	Id_ptn       uint       `json:"id_ptn" gorm:"primaryKey;autoIncrement"`
	Nama_ptn     string     `json:"nama_ptn" gorm:"not null"`
	Nama_singkat string     `json:"nama_singkat" gorm:"not null"`
	Active       *int       `json:"active" gorm:"default: null"`
	Alamat_web   string     `json:"alamat_web" gorm:"not null"`
	CreatedAt    *time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    *time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (t_ptn *T_Ptn) ValidateTPtn() error {
	validate := validator.New()
	return validate.Struct(t_ptn)
}
