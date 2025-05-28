package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type T_Paket struct {
	ID         uint        `json:"id"`
	Nama_Paket string      `json:"nama_paket" gorm:"not null"`
	Total      int         `json:"total" gorm:"not null"`
	Active     int         `json:"active" gorm:"not null"`
	Price      int         `json:"price" gorm:"not null"`
	Pu         int         `json:"pu" gorm:"not null"`
	Ppu        int         `json:"ppu" gorm:"not null"`
	Pbm        int         `json:"pbm" gorm:"not null"`
	Pk         int         `json:"pk" gorm:"not null"`
	Lbi        int         `json:"lbi" gorm:"not null"`
	Lbe        int         `json:"lbe" gorm:"not null"`
	Pm         int         `json:"pm" gorm:"not null"`
	Deskripsi  string      `json:"deskripsi" gorm:"not null"`
	Subjects   string      `json:"subjects" gorm:"not null"`
	CreatedAt  **time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  **time.Time `gorm:"default:CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP" json:"updated_at"`
}

func (t_paket *T_Paket) ValidateTPaket() error {
	validate := validator.New()
	return validate.Struct(t_paket)
}
