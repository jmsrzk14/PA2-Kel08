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
		AllowOrigins:     "http://localhost:5173,https://your-app-name.herokuapp.com",
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Content-Type, Authorization, X-Requested-With",
		AllowCredentials: true,
	}))

	app.Static("/", "./public")

	routes.Setup(app)

	// Gunakan port dari variabel lingkungan PORT atau default ke 8000
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	err := app.Listen(":" + port)
	if err != nil {
		log.Fatal(err)
	}
}