const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
// const users = require('./MOCK_DATA.json')
const app = express();
const PORT = 8000

//Mongoose connection
mongoose
    .connect("mongodb://127.0.0.1:27017/node-piyush")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB Error", err));
 
//Schema
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender : {
        type: String,
    }
}, {timestamps: true,} );

//Creating model from the schema
const user = mongoose.model("userDatabase", userSchema);

//Middleware to handle the form data to test the post reques to server
app.use(express.urlencoded({extended: false}));


//Middleware to maintain a log file for the http methods and time
app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${Date.now()} : ${req.method} @ ${req.path}`, (err , data) => {
        next();
    })
})

///Routes

// use /api in front of routes if it returns JSON and normal routes for html renders
app.get("/api/users", async (req,res) => {
    const allDatabaseUser = await user.find({});
    return res.json(allDatabaseUser);
});

app.get("/users", async (req, res) => {
    const allDatabaseUser = await user.find({});
    const html = `
    <ul>
    ${allDatabaseUser.map(user => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `; 
    res.send(html);
});

// Adding new user to our users file

app.post("/api/users", async (req, res) => {

    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.email){
        return res.status(400).json({msg : "All fields are required"})
    }
    const result = await user.create({
        firstName: body.first_name,
        lastName : body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
    })

    return res.status(201).json({msg : "Success"});
});

app
    .route("/api/users/:id")
    .get(async (req, res) => {
        const userFound = await user.findById(req.params.id)
        if (!userFound) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(userFound);
    })
    .patch((req,res) => {
        // First get the id from the server
        const id = Number(req.params.id);
        // get the exisiting user
        const userIndex = users.findIndex(user => user.id === id);
        //... spread operator first take the exisring data and match it with new incoming data if it founds something different then it changes that particular field only and and do not override the whole user data just the mentin change
        const updatedUser = {...users[userIndex], ...req.body};
        users[userIndex] = updatedUser;

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err , data) => {
            return res.json({status: "User updated Succesfully" ,userIndex: updatedUser})
        })
    })
    .delete((req,res) => {
        // First get the id from the server
        const id = Number(req.params.id);
        // get the exisiting user
        const userIndex = users.findIndex(user => user.id === id);

        const deletedUser = users.splice(userIndex, 1)[0]; //[0] to store the deleted user for later logging
        
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err, data) => {
            return res.json({Status: "User deleted Successfully", user: deletedUser});
        })
        
    })












app.listen(PORT , () => {
    console.log(`Server started at port ${PORT}`); 
})