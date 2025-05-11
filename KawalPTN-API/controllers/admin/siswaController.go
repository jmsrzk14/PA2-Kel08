package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateStudent(ctx *fiber.Ctx) error {
	fmt.Println("Received request:", ctx.FormValue("name"), ctx.FormValue("total"), ctx.FormValue("active"), ctx.FormValue("price"))
	username := ctx.FormValue("username")
	if username == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "username is required",
		})
	}

	no_utbk := ctx.FormValue("no_utbk")
	no_utbkInt, err := strconv.Atoi(no_utbk)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no_utbk must be a valid integer",
		})
	}

	nisn := ctx.FormValue("nisn")
	nisnInt, err := strconv.Atoi(nisn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nisn is required",
		})
	}

	first_name := ctx.FormValue("first_name")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "first_name is required",
		})
	}

	student := models.T_Siswa{
		Username:   username,
		No_UTBK:    &no_utbkInt,
		NISN:       &nisnInt,
		First_Name: first_name,
	}

	fmt.Println("Saving to DB:", student)

	database.DB.Create(&student)

	return ctx.JSON(student)
}

func IndexStudent(ctx *fiber.Ctx) error {
	var student []models.T_Siswa

	database.DB.Find(&student)

	if len(student) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	return ctx.JSON(student)
}

func ShowStudent(ctx *fiber.Ctx) error {
	StudentIDStr := ctx.Params("username")

	var student models.T_Siswa

	err := database.DB.Model(&student).
		Select("id, username, nisn, first_name, grade, last_name, no_utbk, pilihan1_utbk, pilihan2_utbk, pilihan1_utbk_aktual, pilihan2_utbk_aktual, kelompok_ujian, asal_sekolah").
		Where("username = ?", StudentIDStr).
		First(&student).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": err,
		})
	}

	fmt.Printf("Data dari database: %+v\n", student)

	var school struct {
		Sekolah string `json:"nama_sekolah"`
	}

	err = database.DB.Table("sekolah_smas").
		Select("sekolah").
		Where("id = ?", student.Asal_Sekolah).
		First(&school).Error

	if err != nil {
		school.Sekolah = "-"
	}

	var prodi1 struct {
		Prodi1 string `json:"nama_prodi1" gorm:"column:nama_prodi_ptn"`
	}

	err = database.DB.Table("t_prodis").
		Select("nama_prodi_ptn").
		Where("id_prodi = ?", student.Pilihan1_UTBK).
		First(&prodi1).Error

	if err != nil {
		prodi1.Prodi1 = "-"
	}

	var prodi2 struct {
		Prodi2 string `json:"nama_prodi2" gorm:"column:nama_prodi_ptn"`
	}

	err = database.DB.Table("t_prodis").
		Select("nama_prodi_ptn").
		Where("id_prodi = ?", student.Pilihan2_UTBK).
		First(&prodi2).Error

	if err != nil {
		prodi2.Prodi2 = "-"
	}

	var prodi1_aktual struct {
		Prodi1_aktual string `json:"nama_prodi1_aktual" gorm:"column:nama_prodi_ptn"`
	}

	err = database.DB.Table("t_prodis").
		Select("nama_prodi_ptn").
		Where("id_prodi = ?", student.Pilihan1_UTBK_Aktual).
		First(&prodi1_aktual).Error

	if err != nil {
		prodi1_aktual.Prodi1_aktual = "-"
	}

	var prodi2_aktual struct {
		Prodi2_aktual string `json:"nama_prodi2_aktual" gorm:"column:nama_prodi_ptn"`
	}

	err = database.DB.Table("t_prodis").
		Select("nama_prodi_ptn").
		Where("id_prodi = ?", student.Pilihan2_UTBK_Aktual).
		First(&prodi2_aktual).Error

	if err != nil {
		prodi2_aktual.Prodi2_aktual = "-"
	}

	response := fiber.Map{
		"id":                 student.ID,
		"username":           student.Username,
		"first_name":         student.First_Name,
		"last_name":          student.Last_Name,
		"nisn":               student.NISN,
		"no_utbk":            student.No_UTBK,
		"grade":              student.Grade,
		"kelompok_ujian":     student.Kelompok_Ujian,
		"nama_prodi1":        prodi1.Prodi1,
		"nama_prodi2":        prodi2.Prodi2,
		"nama_prodi1_aktual": prodi1_aktual.Prodi1_aktual,
		"nama_prodi2_aktual": prodi2_aktual.Prodi2_aktual,
		"nama_sekolah":       school.Sekolah,
	}

	return ctx.JSON(response)
}

func UpdateStudent(ctx *fiber.Ctx) error {
	StudentIDStr := ctx.Params("username")

	var student models.T_Siswa

	result := database.DB.Where("username = ?", StudentIDStr).First(&student)
	if result.RowsAffected == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	first_name := ctx.FormValue("first_name")
	if first_name == "" && first_name != "null" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "first_name is required",
		})
	}

	no_utbk := ctx.FormValue("no_utbk")
	no_utbkInt, err := strconv.Atoi(no_utbk)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "no_utbk must be a number",
		})
	}

	nisn := ctx.FormValue("nisn")
	nisnInt, err := strconv.Atoi(nisn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nisn must be a number",
		})
	}

	grade := ctx.FormValue("grade")
	if grade == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "grade is required",
		})
	}

	updateResult := database.DB.Model(&models.T_Siswa{}).Where("username = ?", StudentIDStr).Updates(models.T_Siswa{
		First_Name: first_name,
		No_UTBK:    &no_utbkInt,
		NISN:       &nisnInt,
		Grade:      &grade,
	})

	if updateResult.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   updateResult.Error.Error(),
		})
	}

	database.DB.Where("username = ?", StudentIDStr).First(&student)
	return ctx.JSON(fiber.Map{
		"message": "Student updated successfully",
		"student": student,
	})
}

func DeleteStudent(ctx *fiber.Ctx) error {
	studentId := ctx.Params("id")

	var student models.T_Siswa

	database.DB.Where("id = ?", studentId).First(&student)

	if studentId != student.Username {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Student not found",
		})
	}

	if err := database.DB.Where("id = ?", studentId).Delete(&models.T_Siswa{}).Error; err != nil {
		fmt.Println("Delete Error:", err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Students deleted successfully",
	})
}
