// SELECT title, description, link, author, date_updated FROM likes
// ORDER BY date_updated ${sort}
// LIMIT ${limit} OFFSET ${offset};

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type FeedbinArticle struct {
	Title       string `json:"name"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Author      string `json:"author"`
	DateUpdated string `json:"date_updated"`
}

func GetFeedbinHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT title, description, link, author, date_updated FROM likes
		ORDER BY date_updated DESC
	`)
	articles := []FeedbinArticle{}
	defer rows.Close()
	for rows.Next() {
		article := FeedbinArticle{}
		err = rows.Scan(&article.Title, &article.Description, &article.Link, &article.Author, &article.DateUpdated)
		if err != nil {
			panic(err)
		}
		articles = append(articles, article)
	}
	b, _ := json.Marshal(articles)
	s := string(b)
	fmt.Fprintf(w, s)
}
