package models

import (
	"time"
)

type T_Prodi struct {
	Id_prodi       string    `json:"id_prodi" gorm:"primaryKey;type:char(100)"`
	Nama_prodi     string    `json:"nama_prodi" gorm:"not null"`
	PTNID          uint      `json:"ptn_id" gorm:"not null"`
	T_Ptn          T_Ptn     `gorm:"foreignKey:PTNID;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;" json:"t_ptn"`
	Nama_prodi_ptn string    `json:"nama_prodi_ptn" gorm:"not null"`
	Jenis          string    `json:"jenis" gorm:"not null"`
	Active         int       `json:"active" gorm:"not null"`
	Jenjang        string    `json:"jenjang" gorm:"not null"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
