package main

import (
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

func main() {
	InitDB()

	http.HandleFunc("/books/reading", GetReadingHandler)
	http.HandleFunc("/books/read", GetReadHandler)
	http.HandleFunc("/books/toread", GetToReadHandler)

	http.HandleFunc("/films/watched", GetWatchedHandler)
	http.HandleFunc("/films/towatch", GetToWatchHandler)

	http.HandleFunc("/pocket", GetPocketHandler)
	http.HandleFunc("/articles", GetFeedbinHandler)

	log.Print("api.jackreid.xyz listening on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
