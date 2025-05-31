package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateTesti(ctx *fiber.Ctx) error {
	nama := ctx.FormValue("nama")
	if nama == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nama is required",
		})
	}

	deskripsi := ctx.FormValue("deskripsi")
	if deskripsi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deskripsi is required",
		})
	}

	var testi models.Testimoni
	testi.Nama = nama
	testi.Deskripsi = deskripsi

	base64Image := ctx.FormValue("foto")
	if base64Image != "" && strings.HasPrefix(base64Image, "data:image") {
		parts := strings.SplitN(base64Image, ",", 2)
		if len(parts) == 2 {
			imageData := parts[1]

			decodedImage, err := base64.StdEncoding.DecodeString(imageData)
			if err != nil {
				return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"message": "Failed to decode base64 image",
				})
			}

			saveDir := "./public/testimoni"
			if _, err := os.Stat(saveDir); os.IsNotExist(err) {
				err = os.MkdirAll(saveDir, 0755)
				if err != nil {
					return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"message": "Failed to create upload directory",
					})
				}
			}

			fileName := fmt.Sprintf("%d_%s.jpg", time.Now().Unix(), strings.ReplaceAll(nama, " ", "_"))
			fullPath := filepath.Join(saveDir, fileName)
			err = os.WriteFile(fullPath, decodedImage, 0644)
			if err != nil {
				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"message": "Failed to save image file",
				})
			}

			imagePath := filepath.ToSlash(filepath.Join("testimoni", fileName)) 
			testi.Foto = &imagePath
		}
	}

	if err := database.DB.Create(&testi).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to save testi to database",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(testi)
}

func IndexTesti(ctx *fiber.Ctx) error {
	var testi []models.Testimoni

	database.DB.Find(&testi)

	if len(testi) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "testi not found",
		})
	}

	return ctx.JSON(testi)
}

func ShowTesti(ctx *fiber.Ctx) error {
	TestiIDStr := ctx.Params("id")

	var testi models.Testimoni

	err := database.DB.Model(&testi).
		Select("nama, deskripsi, foto").
		Where("id = ?", TestiIDStr).
		First(&testi).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Testi not found",
		})
	}

	response := fiber.Map{
		"nama":     testi.Nama,
		"deskripsi": testi.Deskripsi,
		"foto":      testi.Foto,
	}

	return ctx.JSON(response)
}

func UpdateTesti(ctx *fiber.Ctx) error {
	TestiIDStr := ctx.Params("id")

	var testi models.Testimoni

	result := database.DB.Where("id = ?", TestiIDStr).First(&testi)
	if result.RowsAffected == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Testi not found",
		})
	}

	nama := ctx.FormValue("nama")
	if nama == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nama is required",
		})
	}

	deskripsi := ctx.FormValue("deskripsi")
	if deskripsi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deskripsi is required",
		})
	}

	updateData := map[string]interface{}{
		"nama":     nama,
		"deskripsi": deskripsi,
	}

	base64Image := ctx.FormValue("foto")
	if base64Image != "" && strings.HasPrefix(base64Image, "data:image") {
		parts := strings.SplitN(base64Image, ",", 2)
		if len(parts) == 2 {
			imageData := parts[1]

			decodedImage, err := base64.StdEncoding.DecodeString(imageData)
			if err != nil {
				return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"message": "Failed to decode base64 image",
				})
			}

			saveDir := "./public/berita"
			if _, err := os.Stat(saveDir); os.IsNotExist(err) {
				err = os.MkdirAll(saveDir, 0755)
				if err != nil {
					return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"message": "Failed to create upload directory",
					})
				}
			}

			fileName := fmt.Sprintf("%d_%s.jpg", time.Now().Unix(), strings.ReplaceAll(nama, " ", "_"))
			fullPath := filepath.Join(saveDir, fileName)
			err = os.WriteFile(fullPath, decodedImage, 0644)
			if err != nil {
				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"message": "Failed to save image file",
				})
			}

			imagePath := filepath.ToSlash(filepath.Join("berita", fileName)) 
			updateData["foto"] = imagePath
		}
	}

	updateResult := database.DB.Model(&models.Testimoni{}).Where("id = ?", TestiIDStr).Updates(updateData)
	if updateResult.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   updateResult.Error.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Testi updated successfully",
		"testi":    testi,
	})

}

func DeleteTesti(ctx *fiber.Ctx) error {
	testiIDStr := ctx.Params("id")

	testiID, err := strconv.Atoi(testiIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid testi ID",
		})
	}

	var testi models.Testimoni

	database.DB.Where("id = ?", testiID).First(&testi)

	if testiID != int(testi.Id) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	}

	if err := database.DB.Delete(&testi).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}
