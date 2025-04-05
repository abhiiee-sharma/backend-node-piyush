// 


const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const log = `${Date.now()} New request rec\n`
    fs.appendFile("log.txt", log , () => {
        res.end("Hello from localhost server")
    })  
})

server.listen(8000, () => {
    console.log("Server started");
    
})
