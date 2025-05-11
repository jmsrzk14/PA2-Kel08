package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateSekolah(ctx *fiber.Ctx) error {
	npsn := ctx.FormValue("npsn")
	npsnInt, err := strconv.Atoi(npsn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "npsn is required",
		})
	}

	propinsi := ctx.FormValue("propinsi")
	propinsiInt, err := strconv.Atoi(propinsi)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "propinsi is required",
		})
	}

	kabupaten := ctx.FormValue("kabupaten")
	kabupatenInt, err := strconv.Atoi(kabupaten)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "kabupaten is required",
		})
	}

	kecamatan := ctx.FormValue("kecamatan")
	kecamatanInt, err := strconv.Atoi(kecamatan)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "kecamatan is required",
		})
	}

	bentuk := ctx.FormValue("bentuk")
	if bentuk == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bentuk is required",
		})
	}

	sekolah := ctx.FormValue("sekolahs")
	if sekolah == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "sekolah is required",
		})
	}

	status := ctx.FormValue("status")
	if status == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "status is required",
		})
	}

	school := models.Sekolah_Sma{
		Npsn:        npsnInt,
		ProvinsiID:  uint(propinsiInt),
		KabupatenID: uint(kabupatenInt),
		KecamatanID: uint(kecamatanInt),
		Bentuk:      bentuk,
		Sekolah:     sekolah,
		Status:      status,
	}

	fmt.Println("Saving to DB:", school)

	database.DB.Create(&school)

	return ctx.JSON(school)
}

func IndexSekolah(ctx *fiber.Ctx) error {
	var school []models.Sekolah_Sma

	database.DB.Find(&school)

	if len(school) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "school not found",
		})
	}

	return ctx.JSON(school)
}

func ShowSekolah(ctx *fiber.Ctx) error {
	SekolahIDStr := ctx.Params("id")

	var sekolah models.Sekolah_Sma

	err := database.DB.Model(&sekolah).
		Select("npsn, provinsi_id, kabupaten_id, kecamatan_id, bentuk, sekolah, status").
		Where("id = ?", SekolahIDStr).
		First(&sekolah).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Sekolah not found",
		})
	}

	var province struct {
		Provinsi string `json:"nama_provinsi"`
	}

	err = database.DB.Table("provinsis").
		Select("provinsi").
		Where("id = ?", sekolah.ProvinsiID).
		First(&province).Error

	if err != nil {
		province.Provinsi = "-"
	}

	var regency struct {
		Kabupaten string `json:"nama_kabupaten"`
	}

	err = database.DB.Table("kabupatens").
		Select("kabupaten").
		Where("id = ?", sekolah.KabupatenID).
		First(&regency).Error

	if err != nil {
		regency.Kabupaten = "-"
	}

	var subdistric struct {
		Kecamatan string `json:"nama_kecamatan"`
	}

	err = database.DB.Table("kecamatans").
		Select("kecamatan").
		Where("id = ?", sekolah.KecamatanID).
		First(&subdistric).Error

	if err != nil {
		subdistric.Kecamatan = "-"
	}

	response := fiber.Map{
		"npsn":           sekolah.Npsn,
		"nama_provinsi":  province.Provinsi,
		"nama_kabupaten": regency.Kabupaten,
		"nama_kecamatan": subdistric.Kecamatan,
		"bentuk":         sekolah.Bentuk,
		"sekolah":        sekolah.Sekolah,
		"status":         sekolah.Status,
	}

	return ctx.JSON(response)
}

func UpdateSekolah(ctx *fiber.Ctx) error {
	SekolahIDStr := ctx.Params("id")

	var sekolah models.Sekolah_Sma

	result := database.DB.Where("id = ?", SekolahIDStr).First(&sekolah)
	if result.RowsAffected == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Sekolah not found",
		})
	}

	npsn := ctx.FormValue("npsn")
	npsnInt, err := strconv.Atoi(npsn)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "npsn is required",
		})
	}

	bentuk := ctx.FormValue("bentuk")
	if bentuk == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "bentuk is required",
		})
	}

	sekolahs := ctx.FormValue("sekolahs")
	if sekolahs == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "sekolahs is required",
		})
	}

	status := ctx.FormValue("status")
	if status == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "status is required",
		})
	}

	updateResult := database.DB.Model(&models.Sekolah_Sma{}).Where("id = ?", SekolahIDStr).Updates(models.Sekolah_Sma{
		Npsn:    npsnInt,
		Bentuk:  bentuk,
		Sekolah: sekolahs,
		Status:  status,
	})

	if updateResult.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   updateResult.Error.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Sekolah updated successfully",
		"sekolah": sekolah,
	})

}

func DeleteSekolah(ctx *fiber.Ctx) error {
	SekolahStr := ctx.Params("id")

	var sekolah models.Sekolah_Sma

	database.DB.Where("id = ?", SekolahStr).First(&sekolah)

	if err := database.DB.Where("id = ?", SekolahStr).Delete(&models.Sekolah_Sma{}).Error; err != nil {
		fmt.Println("Delete Error:", err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Sekolahs deleted successfully",
	})
}

func GetSekolahByRegion(ctx *fiber.Ctx) error {
    provinsiID := ctx.Params("provinsi_id")
    kabupatenID := ctx.Params("kabupaten_id")
    kecamatanID := ctx.Params("kecamatan_id")

    if provinsiID == "" && kabupatenID == "" && kecamatanID == "" {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Minimal salah satu parameter wilayah harus disertakan",
        })
    }

    var sekolahList []models.Sekolah_Sma

	err := database.DB.Where("provinsi_id = ? AND kabupaten_id = ? AND kecamatan_id = ?", provinsiID, kabupatenID, kecamatanID).
		Find(&sekolahList).Error

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Gagal mengambil data sekolah",
		})
	}

	return ctx.JSON(fiber.Map{
		"data": sekolahList,
	})
}
