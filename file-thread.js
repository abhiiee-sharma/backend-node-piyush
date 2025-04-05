const { error } = require("console");
const fs = require("fs");

console.log("1");

//Async - Non blocking code
fs.readFile("test.txt", "utf-8", (error , result) => {
    console.log(result);
})


// //Blocking code..
// const result = fs.readFileSync("test.txt", "utf-8")
// console.log(result);

console.log("2");


//output for blocking code -- sync operation takes the available thread for processing and leave it once they are done
// [Running] node "/home/abhi/Desktop/Winter Arc/node-piyush/file-thread.js"
// 1
// My name is Anthony Gonsalves
// 2

//Output of async code - non bloicking code 

// [Running] node "/home/abhi/Desktop/Winter Arc/node-piyush/file-thread.js"
// 1
// 2
// My name is Anthony Gonsalves

const os = require("os")
console.log("core : " , os.cpus().length);

