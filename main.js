var today = new Date();

var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);

var dateString = year + '-' + month + '-' + day;

// const yyyymmdd = `${year}-${month}-${day}`;

document.getElementById("getToday").innerHTML = `${year}.${month}.${day}`;

let addButton = document.getElementById("add-button");
let taskInput = document.getElementById("task-input");

const todolist = localStorage.getItem('taskList');
let taskList = [];
let filterList = [];

if (todolist) {
  taskList = JSON.parse(localStorage.getItem('taskList'));
}

let tabs = document.querySelectorAll(".task-tabs div");
let mode = "all";
let underLine = document.getElementById("under-line");



addButton.addEventListener("click", function(e) {
  if (taskInput.value === "") {
    e.preventDefault();
  } else {
    addTask();
  }
});

taskInput.addEventListener("keydown", function(e) {
  const keyCode = e.keyCode;

  if(keyCode == 13) {
    addTask();
  }
})


for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}




function addTask() {

  let task = {
    id: randomIDGenerator(),
    taskContent: taskInput.value,
    isComplete: false,
  };

  taskInput.value = "";
  taskList.push(task);

  saveToDos();

  render();
}



function render() {
  let resultHTML = "";
  // 1. 내가 선택한 탭에 따라서
  let list = [];
  if (mode === "all") {
    // all taskList
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    // ongoing, done  filterList
    list = filterList;
  }
  // 2. 리스트를 달리 보여준다.

  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task">
      <div class= "task-done">${list[i].taskContent}</div>
      <div>
        <button onClick = "toggleComplete('${list[i].id}')">Check</button>
        <button onClick = "deleteTask('${list[i].id}')">Delete</button>
      </div>
   </div>`;
    } else {
      resultHTML += `<div class="task">
    <div>${list[i].taskContent}</div>
    <div>
      <button onClick = "toggleComplete('${list[i].id}')">Check</button>
      <button onClick = "deleteTask('${list[i].id}')">Delete</button>
    </div>
 </div>`;
    }
  }

  taskInput.focus();

  document.getElementById("task-board").innerHTML = resultHTML;
}



function toggleComplete(id) {
  console.log("id:", id);
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  filter();
  saveToDos();

  console.log(taskList);
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
    }
  }
  filter();
  saveToDos()
}

function filter(event) {
  if (event) {
    mode = event.target.id;
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
  }

  filterList = [];

  if (mode === "all") {
    // 전체 리스트틀 보여준다
    render();
  } else if (mode === "ongoing") {
    // 진행중인 아이템을 보여준다
    // task.isComplete = false
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
    render();
  } else if (mode === "done") {
    // 끝나는 케이스
    // task.isComplete = true
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }
  }
  render();
  
}

function randomIDGenerator() {
  return "_" + Math.random().toString(36).substr(2, 9);
}


// 로컬 스토리지
function saveToDos() {
  localStorage.setItem("taskList", JSON.stringify(taskList))
}

render();

