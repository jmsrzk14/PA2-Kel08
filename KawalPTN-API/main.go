package main

import (
	"KawalPTN-API/database"
	"KawalPTN-API/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Content-Type, Authorization, X-Requested-With",
		AllowCredentials: true,
	}))

	app.Static("/", "./public")

	routes.Setup(app)

	err := app.Listen("localhost:8000")
	if err != nil {
		log.Fatal(err)
	}
}
