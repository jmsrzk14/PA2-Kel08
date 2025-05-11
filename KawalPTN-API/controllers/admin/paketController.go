package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreatePacket(ctx *fiber.Ctx) error {
	fmt.Println("Received request:", ctx.FormValue("name"), ctx.FormValue("total"), ctx.FormValue("active"), ctx.FormValue("price"))
	name := ctx.FormValue("name")
	if name == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "name is required",
		})
	}

	total := ctx.FormValue("total")
	totalInt, err := strconv.Atoi(total)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "total must be a valid integer",
		})
	}

	active := ctx.FormValue("active")
	activeInt, err := strconv.Atoi(active)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "active is required",
		})
	}

	price := ctx.FormValue("price")
	priceInt, err := strconv.Atoi(price)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "price is required",
		})
	}

	pu := ctx.FormValue("pu")
	puInt, err := strconv.Atoi(pu)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "pu is required",
		})
	}

	ppu := ctx.FormValue("ppu")
	ppuInt, err := strconv.Atoi(ppu)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "ppu is required",
		})
	}

	pbm := ctx.FormValue("pbm")
	pbmInt, err := strconv.Atoi(pbm)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "pbm is required",
		})
	}

	pk := ctx.FormValue("pk")
	pkInt, err := strconv.Atoi(pk)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "pk is required",
		})
	}

	lbi := ctx.FormValue("lbi")
	lbiInt, err := strconv.Atoi(lbi)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "lbi is required",
		})
	}

	lbe := ctx.FormValue("lbe")
	lbeInt, err := strconv.Atoi(lbe)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "lbe is required",
		})
	}

	pm := ctx.FormValue("pm")
	pmInt, err := strconv.Atoi(pm)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "pm is required",
		})
	}

	packet := models.T_Paket{
		Nama_Paket: name,
		Total:      totalInt,
		Active:     activeInt,
		Price:      priceInt,
		Pu:         puInt,
		Ppu:        ppuInt,
		Pbm:        pbmInt,
		Pk:         pkInt,
		Lbi:        lbiInt,
		Lbe:        lbeInt,
		Pm:         pmInt,
	}

	fmt.Println("Saving to DB:", packet)

	database.DB.Create(&packet)

	return ctx.JSON(packet)
}

func IndexPacket(ctx *fiber.Ctx) error {
	var packet []models.T_Paket

	database.DB.Find(&packet)

	if len(packet) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Packet not found",
		})
	}

	return ctx.JSON(packet)
}

func ShowPacket(ctx *fiber.Ctx) error {
	PacketIDStr := ctx.Params("id")

	packetID, err := strconv.Atoi(PacketIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid packet ID",
		})
	}

	var packet models.T_Paket

	database.DB.Where("id = ?", packetID).First(&packet)

	if packetID != int(packet.ID) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Packet not found",
		})
	}

	return ctx.JSON(packet)
}

func UpdatePacket(ctx *fiber.Ctx) error {
	packetIDStr := ctx.Params("id")

	packetID, err := strconv.Atoi(packetIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid packet ID",
		})
	}

	var packet models.T_Paket

	database.DB.Where("id = ?", packetID).First(&packet)

	if packetID != int(packet.ID) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	}

	name := ctx.FormValue("name")
	if name == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "name is required",
		})
	}

	total := ctx.FormValue("total")
	totalInt, err := strconv.Atoi(total)
	if total == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "total is required",
		})
	}

	active := ctx.FormValue("active")
	activeInt, err := strconv.Atoi(active)
	if active == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "active is required",
		})
	}

	price := ctx.FormValue("price")
	priceInt, err := strconv.Atoi(price)
	if price == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "price is required",
		})
	}

	result := database.DB.Model(&packet).Updates(models.T_Paket{
		Nama_Paket: name,
		Total:      totalInt,
		Active:     activeInt,
		Price:      priceInt,
	})
	if result.Error != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error Updating",
			"error":   result.Error.Error(),
		})
	}

	return ctx.JSON(packet)

}

func DeletePacket(ctx *fiber.Ctx) error {
	packetIDStr := ctx.Params("id")

	packetID, err := strconv.Atoi(packetIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid product ID",
		})
	}

	var product models.T_Paket

	database.DB.Where("id = ?", packetID).First(&product)

	if packetID != int(product.ID) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Product not found",
		})
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to Delete Table",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Product deleted successfully",
	})
}
