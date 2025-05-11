package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"

	"github.com/gofiber/fiber/v2"
)

func IndexProvince(ctx *fiber.Ctx) error {
	var province []models.Provinsi

	database.DB.Find(&province)

	if len(province) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Province not found",
		})
	}

	return ctx.JSON(province)
}

func IndexRegency(ctx *fiber.Ctx) error {
	id := ctx.Params("id_province")

	var regency []models.Kabupaten
	if err := database.DB.Find(&regency, "provinsi_id = ?", id).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Regency not found",
		})
	}

	return ctx.JSON(regency)
}

func IndexSubdistrict(ctx *fiber.Ctx) error {
	id := ctx.Params("id_regency")

	var subdistrict []models.Kecamatan
	if err := database.DB.Find(&subdistrict, "kabupaten_id = ?", id).Error; err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Subdistrict not found",
		})
	}

	return ctx.JSON(subdistrict)
}