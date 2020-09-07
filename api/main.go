package main

import (
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

func HeaderMiddleware(h http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL)
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		h.ServeHTTP(w, r)
	})
}

func main() {
	InitDB()

	http.HandleFunc("/books/reading", HeaderMiddleware(GetReadingHandler))
	http.HandleFunc("/books/read", HeaderMiddleware(GetReadHandler))
	http.HandleFunc("/books/toread", HeaderMiddleware(GetToReadHandler))

	http.HandleFunc("/films/watched", HeaderMiddleware(GetWatchedHandler))
	http.HandleFunc("/films/towatch", HeaderMiddleware(GetToWatchHandler))

	http.HandleFunc("/pocket", HeaderMiddleware(GetPocketHandler))
	http.HandleFunc("/articles", HeaderMiddleware(GetFeedbinHandler))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		fmt.Fprintf(w, "{ \"message\": \"ok\" }")
	})

	log.Print("api.jackreid.xyz listening on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
