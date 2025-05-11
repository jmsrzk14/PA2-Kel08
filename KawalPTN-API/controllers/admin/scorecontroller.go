package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateScore(ctx *fiber.Ctx) error {
	id_siswa := ctx.FormValue("id_siswa")
	id_siswaInt, err := strconv.Atoi(id_siswa)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "id_siswa is required",
		})
	}

	id_courses := ctx.FormValue("id_courses")
	id_coursesInt, err := strconv.Atoi(id_courses)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "id_courses must be a valid integer",
		})
	}

	year := ctx.FormValue("year")
	yearInt, err := strconv.Atoi(year)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "year is required",
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

	total := float64(puInt+ppuInt+pbmInt+pkInt+lbiInt+lbeInt+pmInt) / 7.0

	Score := models.T_Nilai{
		Id_Siswa: uint(id_siswaInt),
		Id_Paket: uint(id_coursesInt),
		Year:     yearInt,
		Pu:       puInt,
		Ppu:      ppuInt,
		Pbm:      pbmInt,
		Pk:       pkInt,
		Lbi:      lbiInt,
		Lbe:      lbeInt,
		Pm:       pmInt,
		Total:    int(total),
	}

	fmt.Println("Saving to DB:", Score)

	database.DB.Create(&Score)

	return ctx.JSON(Score)
}

func ShowScore(ctx *fiber.Ctx) error {
	idSiswa := ctx.Params("id_siswa")

	var scores []models.T_Nilai

	err := database.DB.
		Select("id_siswa, id_paket, year, total, pu, ppu, pbm, pk, lbi, lbe, pm").
		Where("id_siswa = ?", idSiswa).
		Find(&scores).Error

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Gagal mengambil data nilai",
		})
	}

	if len(scores) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Tidak ada nilai ditemukan untuk siswa ini",
		})
	}

	groupedByYear := make(map[string]map[string]fiber.Map)

	for _, score := range scores {
		yearStr := strconv.Itoa(score.Year)
		idPaketStr := strconv.Itoa(int(score.Id_Paket))

		if _, exists := groupedByYear[yearStr]; !exists {
			groupedByYear[yearStr] = make(map[string]fiber.Map)
		}

		groupedByYear[yearStr][idPaketStr] = fiber.Map{
			"pu":    score.Pu,
			"ppu":   score.Ppu,
			"pbm":   score.Pbm,
			"pk":    score.Pk,
			"lbi":   score.Lbi,
			"lbe":   score.Lbe,
			"pm":    score.Pm,
			"total": score.Total,
		}
	}

	return ctx.JSON(groupedByYear)
}

func ShowScorePacket(ctx *fiber.Ctx) error {
	idSiswa := ctx.Params("id_siswa")

	var scores []models.T_Nilai

	err := database.DB.
		Select("id_siswa, id_paket, year, total, pu, ppu, pbm, pk, lbi, lbe, pm").
		Where("id_siswa = ?", idSiswa).
		Find(&scores).Error

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Gagal mengambil data nilai",
		})
	}

	if len(scores) == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Tidak ada nilai ditemukan untuk siswa ini",
		})
	}

	groupedByYear := make(map[string]map[string]fiber.Map)

	for _, score := range scores {
		yearStr := strconv.Itoa(score.Year)

		var packet struct {
			NamaPaket string `json:"nama_paket"`
		}
	
		err = database.DB.Table("t_pakets").
			Select("nama_paket").
			Where("id = ?", score.Id_Paket).
			First(&packet).Error
	
		if err != nil {
			packet.NamaPaket = "-"
		}

		if _, exists := groupedByYear[yearStr]; !exists {
			groupedByYear[yearStr] = make(map[string]fiber.Map)
		}

		groupedByYear[yearStr][packet.NamaPaket] = fiber.Map{
			"pu":    score.Pu,
			"ppu":   score.Ppu,
			"pbm":   score.Pbm,
			"pk":    score.Pk,
			"lbi":   score.Lbi,
			"lbe":   score.Lbe,
			"pm":    score.Pm,
			"total": score.Total,
		}
	}

	return ctx.JSON(groupedByYear)
}

func GetScoreByTahunUserPaket(ctx *fiber.Ctx) error {
    tahun := ctx.Params("tahun")
    idUsers := ctx.Params("id_users")
    idPaket := ctx.Params("id_paket")

    var score[] models.T_Nilai
	fmt.Println(tahun, idUsers, idPaket)
    result := database.DB.Where("year = ? AND id_siswa = ? AND id_paket = ?", tahun, idUsers, idPaket).First(&score)

    if result.Error != nil {
        return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Data tidak ditemukan untuk kombinasi tahun, user, dan paket tersebut",
        })
    }

    return ctx.JSON(score)
}