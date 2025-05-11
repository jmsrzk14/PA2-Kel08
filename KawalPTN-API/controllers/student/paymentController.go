package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func SendPayment(ctx *fiber.Ctx) error {
	order_id := ctx.FormValue("order_id")
	if order_id == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "order_id is required",
		})
	}

	id_paket := ctx.FormValue("id_paket")
	id_paketInt, err := strconv.Atoi(id_paket)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "id_paket is required",
		})
	}

	amount := ctx.FormValue("amount")
	amountInt, err := strconv.Atoi(amount)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "amount is required",
		})
	}

	id_users := ctx.FormValue("id_users")
	id_usersInt, err := strconv.Atoi(id_users)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "id_users is required",
		})
	}

	payment := models.Payment{
		Id:      order_id,
		IdPaket: uint(id_paketInt),
		Harga:   amountInt,
		IdSiswa: uint(id_usersInt),
	}

	fmt.Println("Saving to DB:", payment)

	database.DB.Create(&payment)

	return ctx.JSON(payment)
}

func IndexPayment(ctx *fiber.Ctx) error {
	var payment []models.Payment

	database.DB.Find(&payment)

	if len(payment) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "payment not found",
		})
	}

	return ctx.JSON(payment)
}

func ShowPayment(ctx *fiber.Ctx) error {
	PaymentIDStr := ctx.Params("id")

	var payment models.Payment

	err := database.DB.Model(&payment).
		Select("id, id_siswa, id_paket, harga, created_at").
		Where("id = ?", PaymentIDStr).
		First(&payment).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Announcement not found",
		})
	}

	var student struct {
		First_Name string `json:"nama_siswa"`
	}

	err = database.DB.Table("t_siswas").
		Select("first_name").
		Where("id = ?", payment.IdSiswa).
		First(&student).Error

	if err != nil {
		student.First_Name = "-"
	}

	var packet struct {
		NamaPaket string `json:"nama_paket"`
	}

	err = database.DB.Table("t_pakets").
		Select("nama_paket").
		Where("id = ?", payment.IdPaket).
		First(&packet).Error

	if err != nil {
		packet.NamaPaket = "-"
	}

	response := fiber.Map{
		"id":         payment.Id,
		"nama":       student.First_Name,
		"id_paket":   packet.NamaPaket,
		"harga":      payment.Harga,
		"created_at": payment.CreatedAt,
	}

	return ctx.JSON(response)
}

func ShowPaymentCourses(ctx *fiber.Ctx) error {
	PaymentIDStr := ctx.Params("id")

	var payment models.Payment

	err := database.DB.Model(&payment).
		Select("id, id_siswa, id_paket, harga, created_at").
		Where("id = ?", PaymentIDStr).
		First(&payment).Error

	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Announcement not found",
		})
	}

	var student struct {
		First_Name string `json:"nama_siswa"`
	}

	err = database.DB.Table("t_siswas").
		Select("first_name").
		Where("id = ?", payment.IdSiswa).
		First(&student).Error

	if err != nil {
		student.First_Name = "-"
	}


	response := fiber.Map{
		"id":         payment.Id,
		"nama":       student.First_Name,
		"id_paket":   payment.IdPaket,
		"harga":      payment.Harga,
		"created_at": payment.CreatedAt,
	}

	return ctx.JSON(response)
}
