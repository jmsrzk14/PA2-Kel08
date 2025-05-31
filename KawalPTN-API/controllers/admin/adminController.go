package controllers

import (
	"KawalPTN-API/database"
	"KawalPTN-API/models"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const AdminSecretKey = "admin_secret"

func Register(ctx *fiber.Ctx) error {
	var data map[string]string
	fmt.Println("Signing key:", AdminSecretKey)
	if err := ctx.BodyParser(&data); err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), 10)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	admin := models.Users{
		Nama:     data["name"],
		Email:    data["email"],
		Password: string(hashedPassword),
	}

	if err := admin.ValidateUsers(); err != nil {
		if validateErr, ok := err.(validator.ValidationErrors); ok {
			var validationErrors []string
			for _, e := range validateErr {
				validationErrors = append(validationErrors, e.Error())
			}
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"errors": validationErrors,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	database.DB.Create(&admin)
	return ctx.JSON(admin)
}

func Login(ctx *fiber.Ctx) error {
	var data map[string]string

	if err := ctx.BodyParser(&data); err != nil {
		return err
	}

	var admin models.Users

	database.DB.Where("email = ?", data["email"]).First(&admin)

	if admin.Email != data["email"] {
		ctx.Status(fiber.StatusNotFound)
		return ctx.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	if err := admin.ValidateUsers(); err != nil {
		if validateErr, ok := err.(validator.ValidationErrors); ok {
			var validationErrors []string
			for _, e := range validateErr {
				validationErrors = append(validationErrors, e.Error())
			}
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"errors": validationErrors,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(data["password"])); err != nil {
		ctx.Status(fiber.StatusBadRequest)
		return ctx.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(admin.ID)),
		ExpiresAt: time.Now().Add(time.Minute * 120).Unix(),
		Subject:   "admin",
	})

	token, err := claims.SignedString([]byte(AdminSecretKey))

	if err != nil {
		ctx.Status(fiber.StatusInternalServerError)
		return ctx.JSON(fiber.Map{
			"message": "couldn't login",
		})
	}

	prefixedToken := "admin-" + token

	cookie := fiber.Cookie{
		Name:     "jwtAdmin",
		Value:    prefixedToken,
		Expires:  time.Now().Add(time.Minute * 30),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
	}

	ctx.Cookie(&cookie)

	if fiber.StatusOK == 200 {
		fmt.Println("Has been login")
	}

	return ctx.JSON(fiber.Map{
		"message": "login success",
		"token":   prefixedToken,
	})
}

func Profile(ctx *fiber.Ctx) error {
	cookie := ctx.Cookies("jwtAdmin")
	tokenString := strings.TrimPrefix(cookie, "admin-")

	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(AdminSecretKey), nil
	})

	if err != nil || !token.Valid {
		fmt.Println("JWT Parse Error:", err)
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated (invalid token)",
		})
	}

	claims, ok := token.Claims.(*jwt.StandardClaims)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "unauthenticated (invalid claims)",
		})
	}

	var admin models.Users
	fmt.Println("Issuer:", claims.Issuer)

	if err := database.DB.Raw("SELECT id, nama, no_handphone, email FROM users WHERE id = ?", claims.Issuer).Scan(&admin).Error; err != nil {
		fmt.Println("Database Error:", err)
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	return ctx.JSON(admin)
}

func Logout(c *fiber.Ctx) error {
	cookie := new(fiber.Cookie)
	cookie.Name = "jwtAdmin"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-time.Minute)
	cookie.HTTPOnly = true
	cookie.Secure = false

	c.Cookie(cookie)

	return c.JSON(fiber.Map{
		"message": "Successfully logged out",
	})
}

func IndexUsers(ctx *fiber.Ctx) error {
	UserIDStr := ctx.Params("id_users")

	userID, err := strconv.Atoi(UserIDStr)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid user ID",
		})
	}

	var user models.Users

	database.DB.Where("id = ?", userID).First(&user)

	if userID != int(user.ID) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Packet not found",
		})
	}

	return ctx.JSON(user)
}
