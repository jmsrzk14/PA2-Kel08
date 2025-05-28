package database

import (
	"KawalPTN-API/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "apiuser:passwordku123@tcp(127.0.0.1:3306)/pa02kel08?charset=utf8mb4&parseTime=True&loc=Local"
	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("could not connect to database")
	}

	DB = conn

	conn.AutoMigrate(
		&models.T_Ptn{}, &models.T_Paket{}, &models.T_Prodi{}, &models.T_Daya_Tampung_Prodi{}, &models.Pengumuman{}, &models.Provinsi{}, &models.Kabupaten{}, &models.Kecamatan{}, &models.Sekolah_Sma{}, &models.T_Siswa{}, &models.T_Nilai{}, &models.Payment{})

}
