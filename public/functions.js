const url='http://localhost:3030/data'
//paint data on page
function paintData(data){
  const divFather=document.getElementById('compTask')
  let newChilds=data.map((element, index) => (
    `<div id="tasks" class="col-10 offset-1 d-flex justify-content-between">
        <div>
          <input type="checkbox" name="${element.id}" onclick="updateStatus(this)" ${element.status==1&&("checked")}/>
        </div>
          <p ${element.status==1&&("class='text-decoration-line-through'")}>${element.task}</p>
        <div>
          <button id="update" value="${index}" class="btn me-3" onclick="moveData(this)"
          ${element.status==1&&("disabled")}><i class="fa fa-pencil"></i></button>
          <button id="delete" value="${element.id}" class="btn" onclick="deleteData(this)"><i class="fa fa-trash"></i></button>
        </div>
    </div>`
  ));
  divFather.innerHTML=((String(newChilds)).replace(/(,)/gm,""))
}
//Mandar los nuevos datos
function sendData(data, metodo){
   console.log(JSON.stringify(data))
   console.log(metodo)
  const Http = new XMLHttpRequest();        
  Http.open(metodo, url);  
  Http.setRequestHeader("Accept", "application/json");
  Http.setRequestHeader('Content-Type','application/json');
  Http.send(JSON.stringify(data));
  Http.onreadystatechange = function(){
    if (this.readyState==4 && this.status==200) {
      console.log(Http.responseText)  
    }
  }
  paintData(data)
}

//Post data
function addTask(){ 
  const toDo=document.getElementById('toDo').value
  if (toDo==="") {
    alert("add text in the input")
  } else {    
    let localData=JSON.parse(window.localStorage.getItem("toDo"))
    let maxId=1
    localData!==null&&(maxId=((localData[localData.length-1].id)+1))        
    var tasks=[{
      id:maxId,
      task:toDo,
      status:0
    }]
    maxId===1?(localData=tasks):(localData.push(... tasks))    
    window.localStorage.setItem("toDo",JSON.stringify(localData))  
    document.getElementById('toDo').value=""
    sendData(localData, "POST")
  }   
}

//Get data
function getfirst(){
  document.getElementById("btnupdate").style.display = 'none';
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  if (localData===null) { 
    let cdata=[]
    const Http = new XMLHttpRequest();        
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200) {
        cdata=JSON.parse(Http.responseText)
        paintData(cdata)               
      }                
    }
  }
  console.log(localData)
  paintData(localData)
}

//Delete data
function deleteData(e){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  localData.map(element=>(parseInt(element.id)!==parseInt(e.value))&&(tempData.push(element)))
  localData=tempData
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  sendData(localData, "DELETE")
}


//update Status
function updateStatus(e){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  localData.map(element=>(parseInt(element.id)===parseInt(e.name))?
    (e.checked===true?(tempData.push({id:element.id, task:element.task, status:1}))
    :(tempData.push({id:element.id, task:element.task, status:0})))
  :(tempData.push(element)))
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  localData=tempData
  sendData(localData, "PUT")
}

//Move data to update them
function moveData(e){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  document.getElementById('toDo').value=localData[e.value].task
  document.getElementById("btnupdate").style.display = 'block';
  document.getElementById("btnupdate").value = localData[e.value].id;
  document.getElementById("btnadd").style.display = 'none';
}
function updateTask(e){
  document.getElementById("btnupdate").style.display = 'none';
  document.getElementById("btnadd").style.display = 'block';
  const toDo=document.getElementById('toDo').value
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  console.log(e.value)
  localData.map(element=>(parseInt(element.id)===parseInt(e.value))?
    (tempData.push({id:element.id, task:toDo, status:element.status}))
    :(tempData.push(element)))
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  localData=tempData
  document.getElementById('toDo').value=""
  sendData(localData, "PUT")
}
getfirst()








/* function getfirst(mycalback1){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  if (localData===null) { 
    const Http = new XMLHttpRequest();        
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200) {
        localData=JSON.parse(Http.responseText)    
        console.log('from api')                
      }                
    }
  }
  mycalback1(localData, paintData)
}
function getTasks(data,mycallback2){     
    mycallback2(data)      
} */
