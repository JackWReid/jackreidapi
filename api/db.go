package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB() {
	var err error
	password := os.Getenv("PG_PASS")
	connStr := fmt.Sprintf("user=jack dbname=personal host=jackreid.xyz password=%s sslmode=require", password)
	db, err = sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal("Failed to configure database connection")
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database")
		log.Panic(err)
	}
}
