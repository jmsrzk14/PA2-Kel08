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

func CreateNews(ctx *fiber.Ctx) error {
	judul := ctx.FormValue("judul")
	if judul == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "judul is required",
		})
	}

	deskripsi := ctx.FormValue("deskripsi")
	if deskripsi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deskripsi is required",
		})
	}

	var news models.Berita
	news.Judul = judul
	news.Deskripsi = deskripsi

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

			fileName := fmt.Sprintf("%d_%s.jpg", time.Now().Unix(), strings.ReplaceAll(judul, " ", "_"))
			fullPath := filepath.Join(saveDir, fileName)
			err = os.WriteFile(fullPath, decodedImage, 0644)
			if err != nil {
				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"message": "Failed to save image file",
				})
			}

			imagePath := filepath.ToSlash(filepath.Join("berita", fileName)) // "berita/nama_file.jpg"
			news.Foto = &imagePath
		}
	}

	if err := database.DB.Create(&news).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to save news to database",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(news)
}

func IndexNews(ctx *fiber.Ctx) error {
	var news []models.Berita

	database.DB.Find(&news)

	if len(news) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "news not found",
		})
	}

	return ctx.JSON(news)
}

func ShowNews(ctx *fiber.Ctx) error {
	NewsIDStr := ctx.Params("id")

	var news models.Berita

	err := database.DB.Model(&news).
		Select("judul, deskripsi, foto").
		Where("id = ?", NewsIDStr).
		First(&news).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "News not found",
		})
	}

	response := fiber.Map{
		"judul":     news.Judul,
		"deskripsi": news.Deskripsi,
		"foto":      news.Foto,
	}

	return ctx.JSON(response)
}

func UpdateNews(ctx *fiber.Ctx) error {
	NewsIDStr := ctx.Params("id")

	var news models.Berita

	result := database.DB.Where("id = ?", NewsIDStr).First(&news)
	if result.RowsAffected == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "News not found",
		})
	}

	judul := ctx.FormValue("judul")
	if judul == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "judul is required",
		})
	}

	deskripsi := ctx.FormValue("deskripsi")
	if deskripsi == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deskripsi is required",
		})
	}

	updateData := map[string]interface{}{
		"judul":     judul,
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

			fileName := fmt.Sprintf("%d_%s.jpg", time.Now().Unix(), strings.ReplaceAll(judul, " ", "_"))
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

	updateResult := database.DB.Model(&models.Berita{}).Where("id = ?", NewsIDStr).Updates(updateData)
	if updateResult.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   updateResult.Error.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "News updated successfully",
		"news":    news,
	})

}

func DeleteNews(ctx *fiber.Ctx) error {
	newsIDStr := ctx.Params("id")

	newsID, err := strconv.Atoi(newsIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid news ID",
		})
	}

	var news models.Berita

	database.DB.Where("id = ?", newsID).First(&news)

	if newsID != int(news.Id) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	}

	if err := database.DB.Delete(&news).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}
