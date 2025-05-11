package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateMajor(ctx *fiber.Ctx) error {
	nama_prodi := ctx.FormValue("nama_prodi")
	if nama_prodi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nama_prodi is required",
		})
	}

	active := ctx.FormValue("active")
	activeInt, err := strconv.Atoi(active)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "active must be a valid integer",
		})
	}

	jenjang := ctx.FormValue("jenjang")
	if jenjang == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "jenjang is required",
		})
	}

	jenis := ctx.FormValue("jenis")
	if jenis == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "jenis is required",
		})
	}

	ptn_id := ctx.FormValue("ptn_id")
	ptn_idInt, err := strconv.Atoi(ptn_id)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "ptn_id is required",
		})
	}

	var ptn models.T_Ptn
	if err := database.DB.First(&ptn, ptn_idInt).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "PTN not found",
		})
	}

	namaProdiPTN := fmt.Sprintf("%s - %s", nama_prodi, ptn.Nama_singkat)

	var lastMajor models.T_Prodi
	database.DB.Order("id_prodi DESC").First(&lastMajor)

	startingID := 1110001
	if lastMajor.Id_prodi != "" {
		lastID, err := strconv.Atoi(lastMajor.Id_prodi)
		if err == nil {
			startingID = lastID + 1
		}
	}

	major := models.T_Prodi{
		Id_prodi:       fmt.Sprintf("%d", startingID),
		Nama_prodi:     nama_prodi,
		PTNID:          uint(ptn_idInt),
		Active:         activeInt,
		Jenjang:        jenjang,
		Jenis:          jenis,
		Nama_prodi_ptn: namaProdiPTN,
	}

	fmt.Println("Saving to DB:", major)

	database.DB.Create(&major)

	return ctx.JSON(major)
}

func IndexMajor(ctx *fiber.Ctx) error {
	var majors []models.T_Prodi

	result := database.DB.
		Select("id_prodi", "nama_prodi", "nama_prodi_ptn").
		Find(&majors)

	if result.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to fetch majors",
			"error":   result.Error.Error(),
		})
	}

	if len(majors) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "no majors found",
		})
	}

	return ctx.JSON(majors)
}

func ShowMajor(ctx *fiber.Ctx) error {
	MajorIDStr := ctx.Params("id_prodi")

	var major models.T_Prodi

	err := database.DB.Model(&major).
		Select("nama_prodi, nama_prodi_ptn, jenis, active, jenjang").
		Where("id_prodi = ?", MajorIDStr).
		First(&major).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Major not found",
		})
	}

	response := fiber.Map{
		"nama_prodi":     major.Nama_prodi,
		"nama_prodi_ptn": major.Nama_prodi_ptn,
		"jenis":          major.Jenis,
		"active":         major.Active,
		"jenjang":        major.Jenjang,
	}

	return ctx.JSON(response)
}

func UpdateMajor(ctx *fiber.Ctx) error {
	MajorIDStr := ctx.Params("id_prodi")

	var major models.T_Prodi

	result := database.DB.Where("id_prodi = ?", MajorIDStr).First(&major)
	if result.RowsAffected == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Major not found",
		})
	}

	nama_prodi := ctx.FormValue("nama_prodi")
	if nama_prodi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nama_prodi is required",
		})
	}

	jenjang := ctx.FormValue("jenjang")
	if jenjang == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "jenjang is required",
		})
	}

	jenis := ctx.FormValue("jenis")
	if jenis == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "jenis is required",
		})
	}

	active := ctx.FormValue("active")
    activeInt, err := strconv.Atoi(active)
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "active must be a number",
        })
    }

	updateResult := database.DB.Model(&models.T_Prodi{}).Where("id_prodi = ?", MajorIDStr).Updates(models.T_Prodi{
		Nama_prodi: nama_prodi,
		Active:     activeInt,
		Jenjang:    jenjang,
		Jenis:      jenis,
	})

	if updateResult.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   updateResult.Error.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Major updated successfully",
		"major":   major,
	})

}

func DeleteMajor(ctx *fiber.Ctx) error {
	majorUsernameStr := ctx.Params("id_prodi")

	var major models.T_Prodi

	database.DB.Where("id_prodi = ?", majorUsernameStr).First(&major)

	if majorUsernameStr != major.Id_prodi {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Major not found",
		})
	}

	if err := database.DB.Where("id_prodi = ?", majorUsernameStr).Delete(&models.T_Prodi{}).Error; err != nil {
		fmt.Println("Delete Error:", err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Majors deleted successfully",
	})
}

func GetMajorByUniversity(ctx *fiber.Ctx) error {
    universityID := ctx.Params("id_ptn")

    var majorList []models.T_Prodi

	err := database.DB.Where("ptn_id = ?", universityID).
		Find(&majorList).Error

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal mengambil data major",
		})
	}

	return ctx.JSON(fiber.Map{
		"data": majorList,
	})
}