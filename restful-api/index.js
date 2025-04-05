const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

//Middleware to handle the form data to test the post reques to server
app.use(express.urlencoded({ extended: false }));

//Custom middleware (req , res , next)

app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  //return res.end(Hey) it will will not invoke middleware 2 and the user funciton will not work
  next();
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2");
  next();
});

//Middleware to maintain a log file for the http methods and time
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()} : ${req.method} @ ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

///Routes

// use /api in front of routes if it returns JSON and normal routes for html renders
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

// Adding new user to our users file

app.post("/api/users", (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.email
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).send({ Status: "Success", id: users.length });
  });
});

// GET /api/user/1 this shoyld display data of the specific user
// GET /api/user/1

// :id -- this represtns dyanamic routing

// app.get("/api/users/:id", (req,res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// });

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find(user => user.id === id);

//     if (!user) {
//         return res.status(404).json({ error: "User not found" });
//     }
//     return res.json(user);
// });

// app.patch("/api/users/:id", (req, res) => {
//     // To do edit user data
//     return res.json({status : "Pending"})
// });

// app.delete("/api/users/:id", (req, res) => {
//     // To delete user data
//     return res.json({status : "Pending"})
// });

//Instead of mentioning different http methods on a single route you can group all them in a single block of code for refernce

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    // First get the id from the server
    const id = Number(req.params.id);
    // get the exisiting user
    const userIndex = users.findIndex((user) => user.id === id);
    //... spread operator first take the exisring data and match it with new incoming data if it founds something different then it changes that particular field only and and do not override the whole user data just the mentin change
    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({
        status: "User updated Succesfully",
        userIndex: updatedUser,
      });
    });
  })
  .delete((req, res) => {
    // First get the id from the server
    const id = Number(req.params.id);
    // get the exisiting user
    const userIndex = users.findIndex((user) => user.id === id);

    const deletedUser = users.splice(userIndex, 1)[0]; //[0] to store the deleted user for later logging

    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(users, null, 2),
      (err, data) => {
        return res.json({
          Status: "User deleted Successfully",
          user: deletedUser,
        });
      }
    );
  });

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
