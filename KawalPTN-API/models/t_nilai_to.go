package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type T_Nilai struct {
	ID        uint      `json:"id"`
	Id_Siswa  uint      `json:"id_siswa" gorm:"not null"`
	T_Siswa   T_Siswa   `gorm:"foreignKey:Id_Siswa;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"t_siswa"`
	Id_Paket  uint      `json:"id_paket" gorm:"not null"`
	T_Paket   T_Paket   `gorm:"foreignKey:Id_Paket;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"t_paket"`
	Total     int       `json:"total" gorm:"not null"`
	Year      int       `json:"year" gorm:"not null"`
	Pu        int       `json:"pu" gorm:"not null"`
	Ppu       int       `json:"ppu" gorm:"not null"`
	Pbm       int       `json:"pbm" gorm:"not null"`
	Pk        int       `json:"pk" gorm:"not null"`
	Lbi       int       `json:"lbi" gorm:"not null"`
	Lbe       int       `json:"lbe" gorm:"not null"`
	Pm        int       `json:"pm" gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (t_nilai *T_Nilai) ValidateTNilai() error {
	validate := validator.New()
	return validate.Struct(t_nilai)
}
