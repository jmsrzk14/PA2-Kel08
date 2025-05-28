package main

import (
	"KawalPTN-API/database"
	"KawalPTN-API/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "https://160.19.166.155:5173",
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Content-Type, Authorization, X-Requested-With",
		AllowCredentials: true,
	}))

	app.Static("/", "./public")

	routes.Setup(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	err := app.Listen(":" + port)
	if err != nil {
		log.Fatal(err)
	}
}
