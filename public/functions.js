const url='http://localhost:3030/data'
//paint data on page
function paintData(data){
  const divFather=document.getElementById('compTask')
  let newChilds=""
  if (data.length!==0) {
    newChilds=data.map((element, index) => (
      `<div id="tasks" class="col-10 offset-1 d-flex justify-content-between">
          <div>
            <input type="checkbox" name="${element.id}" onclick="updateStatus(this)" ${element.status==true&&("checked")}/>
          </div>
            <p ${element.status==1&&("class='text-decoration-line-through'")}>${element.task}</p>
          <div>
            <button id="update" value="${index}" class="btn me-3" onclick="moveData(this)"
            ${element.status==1&&("disabled")}><i class="fa fa-pencil"></i></button>
            <button id="delete" value="${element.id}" class="btn" onclick="deleteData(this)"><i class="fa fa-trash"></i></button>
          </div>
      </div>`
    ));
    }else{
      newChilds=
        `<div id="tasks" class="col-10 offset-1 d-flex justify-content-between">
           <h5>add a task...</h5>
        </div>`
    }
    divFather.innerHTML=((String(newChilds)).replace(/(,)/gm,""))
}
//Mandar los nuevos datos
function sendData(data, metodo, allData){
/*    console.log(JSON.stringify(data))
   console.log(metodo) */
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
  paintData(allData)
}

//Post data
function addTask(){ 
  const toDo=document.getElementById('toDo').value
  if (toDo==="") {
    alert("add text in the input")
  } else {    
    let localData=JSON.parse(window.localStorage.getItem("toDo"))
    let maxId=1
    if ((localData!==null)&&(localData.length!==0)) {
      maxId=((localData[localData.length-1].id)+1)
    }       
    var tasks=[{
      id:maxId,
      task:toDo,
      status:false
    }]
    maxId===1?(localData=tasks):(localData.push(... tasks))    
    window.localStorage.setItem("toDo",JSON.stringify(localData))  
    document.getElementById('toDo').value=""
    sendData(tasks, "POST", localData)
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
        console.log(cdata)
        if (cdata.length===0) {
          console.log("no hay datos en la api")
        } else {
        paintData(cdata)  
        window.localStorage.setItem("toDo",JSON.stringify(cdata)) 
        }            
      }                
    }
  }else{
    paintData(localData)
  }
}

//Delete data
function deleteData(e){
  const delet={data:e.value}
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  localData.map(element=>(parseInt(element.id)!==parseInt(e.value))&&(tempData.push(element)))
  localData=tempData
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  sendData(delet, "DELETE",localData)
}

//update Status, checked
function updateStatus(e){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  let dataMod=[]
  localData.map(element=>(parseInt(element.id)===parseInt(e.name))?
  ((dataMod={id:element.id, task:element.task, status:e.checked},
     tempData.push({id:element.id, task:element.task, status:e.checked})))
  :(tempData.push(element)))
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  localData=tempData
  sendData(dataMod, "PUT",localData)
}

//Move data to update them
function moveData(e){
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  document.getElementById('toDo').value=localData[e.value].task
  document.getElementById("btnupdate").style.display = 'block';
  document.getElementById("btnupdate").value = localData[e.value].id;
  document.getElementById("btnadd").style.display = 'none';
}

//updating data, description
function updateTask(e){
  document.getElementById("btnupdate").style.display = 'none';
  document.getElementById("btnadd").style.display = 'block';
  const toDo=document.getElementById('toDo').value
  let localData=JSON.parse(window.localStorage.getItem("toDo"))
  let tempData=[]
  let dataMod=[]
  console.log(e.value)
  localData.map(element=>(parseInt(element.id)===parseInt(e.value))?
     ((dataMod={id:element.id, task:toDo, status:element.status}, 
      tempData.push({id:element.id, task:toDo, status:element.status})))
    :(tempData.push(element)))
  window.localStorage.setItem("toDo",JSON.stringify(tempData))
  localData=tempData
  document.getElementById('toDo').value=""
  sendData(dataMod, "PUT", localData)
}
getfirst()
