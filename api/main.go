package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
)

type Book struct {
	Title       string `json:"title"`
	Author      string `json:"author"`
	Image       string `json:"image"`
	DateUpdated string `json:"date_updated"`
}

func main() {
	password := os.Getenv("PG_PASS")
	connStr := fmt.Sprintf("user=jack dbname=personal host=jackreid.xyz password=%s sslmode=require", password)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/books/reading", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT title, author, image, date_updated FROM books WHERE status = 'reading'")
		books := []Book{}
		defer rows.Close()
		for rows.Next() {
			book := Book{}
			err = rows.Scan(&book.Title, &book.Author, &book.Image, &book.DateUpdated)
			if err != nil {
				panic(err)
			}
			books = append(books, book)
		}
		b, _ := json.Marshal(books)
		s := string(b)
		fmt.Fprintf(w, s)
	})

	http.HandleFunc("/books/read", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT title, author, image, date_updated FROM books WHERE status = 'read'")
		books := []Book{}
		defer rows.Close()
		for rows.Next() {
			book := Book{}
			err = rows.Scan(&book.Title, &book.Author, &book.Image, &book.DateUpdated)
			if err != nil {
				panic(err)
			}
			books = append(books, book)
		}
		b, _ := json.Marshal(books)
		s := string(b)
		fmt.Fprintf(w, s)
	})

	log.Print("api.jackreid.xyz listening on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
