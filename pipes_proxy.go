package main

import (
    "log"
    "net/http"
    "regexp"
    "io/ioutil"
    "crypto/md5"
    "encoding/hex"
    "fmt"
    "os"
    "time"
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
          fmt.Println(vs[0])
          b := []byte(vs[0])
          md5 := md5.Sum(b)
          name := "tmp/" + hex.EncodeToString(md5[:])
          if(exists(name)){
            info, err := os.Stat(name)
            if err != nil {
                fmt.Println(err)
            }
            duration := time.Now().Unix() - info.ModTime().Unix()
            if (duration < 180){
                data, err := ioutil.ReadFile(name)
                if err != nil {
                    fmt.Println(err)
                    return
                }
                w.Header().Set("Access-Control-Allow-Origin", "http://pipes.ooo")
                w.Write(data)

                return
            } else {
                defer os.Remove(name)
            }
          }

          w.Header().Set("Access-Control-Allow-Origin", "http://pipes.ooo")
          resp, _ := http.Get(vs[0])
          defer resp.Body.Close()
          byteArray, _ := ioutil.ReadAll(resp.Body)
          err := ioutil.WriteFile(name, []byte(byteArray), 0664)
          if err != nil {
              fmt.Println(err)
          }
          w.Write(byteArray)
          return
        }
    }
}

func exists(name string) bool {
    _, err := os.Stat(name)
    return !os.IsNotExist(err)
}
