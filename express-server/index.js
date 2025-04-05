const express = require('express');
// const http = require('http');
const app = express(); 

app.get("/", (req,res) => {
    return res.send(`Welcome to Homepage pf this server`);
})

app.get("/about", (req,res) => {
    return res.send(`Welcome to about us  page this server`);
})


// const myserver = http.createServer(app);
// myserver.listen(8000, () => {
//     console.log(`Server started at port 8000`);
    
// })

app.listen(8000, () => {
    console.log("Server started at port 8000");
    
})