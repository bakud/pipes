package main

import (
    "log"
    "net/http"
)

func main() {
    fs := http.FileServer(http.Dir("htdocs"))
    http.Handle("/", fs)
    log.Println("Listening...")
    http.ListenAndServe(":80", nil)
}
