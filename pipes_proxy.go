package main

import (
    "log"
    "net/http"
    "fmt"
    "regexp"
    "io/ioutil"
)

var re = regexp.MustCompile(`^http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?`)

func main() {
    http.HandleFunc("/", handler)
    log.Println("Listening...")
    http.ListenAndServe(":4000", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
    v := r.URL.Query()
    if v == nil {
        return
    }
    for key, vs := range v {
        if key == "u" && re.MatchString(vs[0]) == true {
          resp, _ := http.Get(vs[0])
          defer resp.Body.Close()
          byteArray, _ := ioutil.ReadAll(resp.Body)
          fmt.Fprintf(w, "%s", string(byteArray)) // htmlをstringで取得
        }
    }
}
