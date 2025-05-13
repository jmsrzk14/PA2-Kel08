package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateCapacity(ctx *fiber.Ctx) error {
	prodi_id := ctx.FormValue("prodi_id")
	if prodi_id == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "prodi_id must be a valid integer",
		})
	}

	tahun := ctx.FormValue("tahun")
	tahunInt, err := strconv.Atoi(tahun)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "tahun is required",
		})
	}

	daya_tampung := ctx.FormValue("daya_tampung")
	daya_tampungInt, err := strconv.Atoi(daya_tampung)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "daya_tampung is required",
		})
	}

	peminat := ctx.FormValue("peminat")
	peminatInt, err := strconv.Atoi(peminat)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "peminat is required",
		})
	}

	capacity := models.T_Daya_Tampung_Prodi{
		ProdiID:      prodi_id,
		Tahun:        tahunInt,
		Daya_tampung: daya_tampungInt,
		Peminat:      peminatInt,
	}

	fmt.Println("Saving to DB:", capacity)

	database.DB.Create(&capacity)

	return ctx.JSON(capacity)
}

func IndexCapacity(ctx *fiber.Ctx) error {
	ProdiID := ctx.Params("id_prodi")

	var capacities []models.T_Daya_Tampung_Prodi

	result := database.DB.Where("prodi_id = ?", ProdiID).Find(&capacities)

	if result.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Gagal mengambil data kapasitas",
		})
	}

	if len(capacities) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Tidak ada kapasitas ditemukan untuk prodi ini",
		})
	}

	return ctx.JSON(capacities)
}

func ShowCapacityByYear(ctx *fiber.Ctx) error {
	ProdiID := ctx.Params("id_prodi")
	Year := time.Now().Year()

	var capacities []models.T_Daya_Tampung_Prodi

	result := database.DB.Where("prodi_id = ? AND tahun = ?", ProdiID, Year).Find(&capacities)

	if result.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Gagal mengambil data kapasitas",
		})
	}

	if len(capacities) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Tidak ada kapasitas ditemukan untuk prodi ini",
		})
	}

	return ctx.JSON(capacities)
}

func DeleteCapacity(ctx *fiber.Ctx) error {
	capacityIDStr := ctx.Params("id")

	capacityID, err := strconv.Atoi(capacityIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid capacity ID",
		})
	}

	var capacity models.T_Daya_Tampung_Prodi

	database.DB.Where("id = ?", capacityID).First(&capacity)

	if capacityID != int(capacity.Id) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "capacity not found",
		})
	}

	if err := database.DB.Delete(&capacity).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "capacity deleted successfully",
	})
}
