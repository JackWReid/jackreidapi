package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Book struct {
	Title       string `json:"title"`
	Author      string `json:"author"`
	Image       string `json:"image"`
	DateUpdated string `json:"date_updated"`
}

func BookQueryBuilder(queryType string) (query string) {
	return fmt.Sprintf(
		`SELECT title, author, image, date_updated
		 FROM books
		 WHERE status = '%s'
		 ORDER BY date_updated DESC`, queryType)
}

func GetReadingHandler(w http.ResponseWriter, r *http.Request) {
	query := BookQueryBuilder("reading")
	rows, err := db.Query(query)
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
}

func GetReadHandler(w http.ResponseWriter, r *http.Request) {
	query := BookQueryBuilder("read")
	rows, err := db.Query(query)
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
}

func GetToReadHandler(w http.ResponseWriter, r *http.Request) {
	query := BookQueryBuilder("toread")
	rows, err := db.Query(query)
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
}
