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
  try {
    addTask(req.body)
    res.json({response:"successfully add"})
    console.log("POST")
  } catch (error) {
    console.log(error)
    res.status(400);
    res.json({response:"something bad happen"})
  }  
});
app.put("/data", (req, res) => { 
  try {
    updateTask(req.body)
    res.json({response:"Updated successfully"})  
    console.log("PUT")
  } catch (error) {
    console.log(error)
    res.status(400);
    res.json({response:"something bad happen"})
  } 
});
app.delete("/data", (req, res) => {  
  try {
    deleteData(req.body.data)    
    console.log("DELETE")  
    res.json({response:"Deleted successfully"})    
  } catch (error) {
    console.log(error)
    res.status(400);
    res.json({response:"something bad happen"})  
  }
});
// Starting server.
server.listen(3030, () => {
  console.log("Listening on port 3030...");
});


//metodos....
function addTask(newData){ 
    tasks.push(... newData)
    console.log(tasks)
}

function deleteData(data){
  let tempData=[]
  tasks.map(element=>(parseInt(element.id)!==parseInt(data))&&(tempData.push(element)))
  tasks=tempData
  console.log(tasks)
}
function updateTask(data){
  let tempData=[]
  tasks.map(element=>(parseInt(element.id)===parseInt(data.id))?
    (tempData.push(data))
    :(tempData.push(element)))
  tasks=tempData
  console.log(tasks)
}
