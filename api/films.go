package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Film struct {
	Name        string `json:"name"`
	Year        int    `json:"year"`
	Link        string `json:"link"`
	DateUpdated string `json:"date_updated"`
}

func FilmQueryBuilder(queryType string) (query string) {
	return fmt.Sprintf(
		`SELECT name, year, link, date_updated
		 FROM films
		 WHERE status = '%s'
		 ORDER BY date_updated DESC`, queryType)
}

func GetWatchedHandler(w http.ResponseWriter, r *http.Request) {
	query := FilmQueryBuilder("watched")
	rows, err := db.Query(query)
	films := []Film{}
	defer rows.Close()
	for rows.Next() {
		film := Film{}
		err = rows.Scan(&film.Name, &film.Year, &film.Link, &film.DateUpdated)
		if err != nil {
			panic(err)
		}
		films = append(films, film)
	}
	b, _ := json.Marshal(films)
	s := string(b)
	fmt.Fprintf(w, s)
}

func GetToWatchHandler(w http.ResponseWriter, r *http.Request) {
	query := FilmQueryBuilder("towatch")
	rows, err := db.Query(query)
	films := []Film{}
	defer rows.Close()
	for rows.Next() {
		film := Film{}
		err = rows.Scan(&film.Name, &film.Year, &film.Link, &film.DateUpdated)
		if err != nil {
			panic(err)
		}
		films = append(films, film)
	}
	b, _ := json.Marshal(films)
	s := string(b)
	fmt.Fprintf(w, s)
}
