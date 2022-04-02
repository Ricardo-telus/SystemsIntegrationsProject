const express = require("express");
const app = express();
const server = require("http").createServer(app);
let tasks= []
const content = require("./content/cards.json");

// Middlewares
app.use(express.static("public"));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
// Templating engine setup
app.set("view engine", "ejs");

// Enpoints
app.get("/", (req, res) => {
  res.render("index", { content });
});
app.get("/data", (req, res) => {  
  res.json((tasks))
});
app.post("/data", (req, res) => {  
  tasks=(req.body)
  res.json(tasks)  
  console.log(tasks)
  console.log("POST")  
});
app.put("/data", (req, res) => {  
  tasks=(req.body)
  res.json(tasks)  
  console.log(tasks)
  console.log("PUT")   
});
app.delete("/data", (req, res) => {  
  tasks=(req.body)
  res.json(tasks)    
  console.log(tasks)
  console.log("DELETE") 
});

// Starting server.
server.listen(3030, () => {
  console.log("Listening on port 3030...");
});
