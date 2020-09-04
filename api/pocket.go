// const query = `
//   SELECT title, link, content, word_count, date_updated FROM pocket
//   WHERE status = 0
//   ORDER BY date_updated ${sort}
//   LIMIT ${limit} OFFSET ${offset};
// `;

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type PocketArticle struct {
	Title       string `json:"name"`
	Link        string `json:"link"`
	WordCount   string `json:"word_count"`
	DateUpdated string `json:"date_updated"`
}

func GetPocketHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT title, link, word_count, date_updated FROM pocket
		WHERE status = 0
		ORDER BY date_updated DESC
	`)
	articles := []PocketArticle{}
	defer rows.Close()
	for rows.Next() {
		article := PocketArticle{}
		err = rows.Scan(&article.Title, &article.Link, &article.WordCount, &article.DateUpdated)
		if err != nil {
			panic(err)
		}
		articles = append(articles, article)
	}
	b, _ := json.Marshal(articles)
	s := string(b)
	fmt.Fprintf(w, s)
}
