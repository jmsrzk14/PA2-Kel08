package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Users struct {
	ID           uint       `json:"id"`
	Nama         string     `json:"nama" gorm:"not null"`
	No_handphone int        `json:"total" gorm:"not null;default:0"`
	Email        string     `json:"email" gorm:"not null" validate:"required"`
	Password     string     `json:"password" gorm:"not null" validate:"required"`
	Role         int        `json:"role" gorm:"not null;default:0"`
	CreatedAt    *time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt    *time.Time `gorm:"default:CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP" json:"updated_at"`
}

func (users *Users) ValidateUsers() error {
	validate := validator.New()
	return validate.Struct(users)
}
