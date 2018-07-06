const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8888;
const users = [
  {id: 1, username: "admin", password: "admin"},
  {id: 2, username: "guest", password: "guest"},
]

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  // const user = req.body.username;
  // res
  //   .status(200)
  //   .send(`You logged in with ${user}.`);
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(404)
      .send("You need a username and password");
      return;
  }
  // search for user in database
  const user = users.find(user => {
    return user.username === username && user.password === password;
  });
  // if no user, return 401 (unauthorized)
  if (!user) {
    res
      .status(401)
      .send("User not found");
      return;
  }

  const token = jwt.sign({
    sub: user.id,
    username: user.username
  }, "mysupersecretkey", { expiresIn: "3 hours" });

  res
    .status(200)
    .send({access_token: token});

})

app.get("/status", (req, res) => {
  const localTime = (new Date()).toLocaleTimeString();

  res
    .status(200)
    .send(`Server time is ${localTime}.`);
})

app.get("*", (req, res) => {
  res
    .sendStatus(404);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
