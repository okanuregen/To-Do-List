let allTasks = [];
let innerTasks = [];

let count = 1; //for identical collapse id
const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = addingForm.children[0];
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

eventListeners();
loadLS();
loadInnerTasks();

// all Listeners
function eventListeners() {
  //submit event
  mainForm.addEventListener("submit", addNewItem);

  //task stufs
  mainList.addEventListener("click", taskStufs);

  //delete all tasks
  delAll.addEventListener("click", deleteAll);
}

//to creat new task
function createNewTask(text, check) {
  //to clone upper visible li in html page
  const newLi = upperLi.cloneNode(true);
  //making visible the new li
  newLi.classList.remove("d-none");
  //removing id
  newLi.setAttribute("id", "");

  newLi.children[0].setAttribute("href", `#collapse${count}`); //identical colapseId

  newLi.children[0].classList.remove("line-throught");

  newLi.children[0].innerText = text;
  if (check === true) {
    newLi.children[0].classList.add("line-throught");
  } else {
    newLi.children[0].classList.remove("line-throught");
  }
  newLi.children[3].setAttribute("id", `collapse${count}`);

  mainList.children[0].appendChild(newLi);

  count++; //for different value of collapseId
  mainInput.value = "";
}

//add New Task
function addNewItem(e) {
  e.preventDefault();
  //entered text
  const taskText = mainInput.value;

  if (taskText != "") {
    allTasks = JSON.parse(localStorage.getItem("allTasks"));
    let c = false;
    allTasks.forEach(function (item) {
      if (item.text == taskText) {
        c = true;
        alert("Task Already Added");
      }
    });
    if (c == false) {
      createNewTask(taskText);
      saveLS(taskText, 1);
    }
  }
}

//to add Inner Tasks
function addInnerTask(upperText, mainText, check) {
  //to clone inner visible li from html page
  let tempLi = innerLi.cloneNode(true);
  tempLi.setAttribute("id", "");

  //making visible check and delete icons.
  tempLi.childNodes.forEach(function (item, index) {
    if (index == 3 || index == 5) {
      item.classList.remove("d-none");
    }
  });
  //to add the value to new li text
  tempLi.children[0].innerText = mainText;

  //check
  if (check == true) {
    tempLi.children[0].classList.add("line-throught");
  } else {
    tempLi.children[0].classList.remove("line-throught");
  }

  //adding new inner task to last of the list before form
  let tempList;
  for (let i = 1; i < mainList.children[0].children.length; i++) {
    if (upperText == mainList.children[0].children[i].children[0].innerText) {
      tempList = mainList.children[0].children[i];
      break;
    }
  }

  //adding inner to upper
  tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
    tempLi,
    tempList.lastElementChild.firstElementChild.firstElementChild
      .lastElementChild
  );
}

//delete and check a task - add new inner task
function taskStufs(e) {
  e.preventDefault();
  //delete item
  if (e.target.classList.contains("delete-item")) {
    //remove LS

    const text = e.target.parentElement.children[0].innerText;
    saveLS(text, 0);

    //remove inner tasks of it
    let tempInnerList = JSON.parse(localStorage.getItem("innerTasks"));

    tempInnerList.forEach(function (item) {
      if (text == item.upperTaskText) {
        saveInnerTasks(item.mainText, 0, text);
      }
    });

    //remove from page
    e.target.parentElement.remove();

    // to check an inner task
  } else if (e.target.classList.contains("delete-inner-item")) {
    const upperText =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.children[0].innerText;
    //removing LS
    saveInnerTasks(e.target.parentElement.children[0].innerText, 0, upperText);

    //Removing Page
    e.target.parentElement.remove();
  } else if (e.target.classList.contains("check")) {
    let tmpList = JSON.parse(localStorage.getItem("allTasks"));

    if (
      e.target.parentElement.children[0].classList.contains("line-throught")
    ) {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text == e.target.parentElement.children[0].innerText) {
          tmpList[i].check = false;
          localStorage.setItem("allTasks", JSON.stringify(tmpList));
          break;
        }
      }

      e.target.parentElement.children[0].classList.remove("line-throught");
    } else {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text == e.target.parentElement.children[0].innerText) {
          tmpList[i].check = true;
          localStorage.setItem("allTasks", JSON.stringify(tmpList));
          break;
        }
      }

      e.target.parentElement.children[0].classList.add("line-throught");
    }

    //adding inner task with button
  } else if (e.target.classList.contains("inner-check")) {
    let tmp = JSON.parse(localStorage.getItem("innerTasks"));

    const upperText =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.children[0].innerText;

    if (
      e.target.parentElement.children[0].classList.contains("line-throught")
    ) {
      tmp.forEach(function (item) {
        if (
          item.mainText == e.target.parentElement.children[0].innerText &&
          item.upperTaskText == upperText
        ) {
          item.check = false;
          localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
      });
      e.target.parentElement.children[0].classList.remove("line-throught");
    } else {
      tmp.forEach(function (item) {
        if (
          item.mainText == e.target.parentElement.children[0].innerText &&
          item.upperTaskText == upperText
        ) {
          item.check = true;
          localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
      });
      e.target.parentElement.children[0].classList.add("line-throught");
    }
  } else if (e.target.classList.contains("btn-add-inner-task")) {
    //getting value of input
    const text = e.target.parentElement.childNodes[1].value;

    if (text != "") {
      innerTasks = JSON.parse(localStorage.getItem("innerTasks"));

      //getting upper text
      const upperText =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement.children[0].innerText;

      let c = true;
      innerTasks.forEach(function (item) {
        if (item.mainText == text && item.upperTaskText == upperText) {
          c = false;
          alert("Task Already Added");
        }
      });
      if (c == true) {
        //adding innerTask List
        innerTasks.push({
          upperTaskText: upperText,
          mainText: text,
          check: false,
        });
        addInnerTask(upperText, text);
        saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
      }
    }
    //clear input
    e.target.parentElement.childNodes[1].value = "";

    //adding inner task with i tag that in the button
    //same things with adding with btn
  } else if (e.target.classList.contains("i-add-inner-task")) {
    let text = e.target.parentElement.parentElement.childNodes[1].value;

    if (text != "") {
      //getting upper text
      const upperText =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement.parentElement.children[0].innerText;

      //adding innerTask List
      innerTasks.push({ upperTaskText: upperText, mainText: text });

      addInnerTask(upperText, text);
      saveInnerTasks(innerTasks[innerTasks.length - 1], 1);

      //clear input
      e.target.parentElement.parentElement.childNodes[1].value = "";
    }
  }
}
//delete all
function deleteAll(e) {
  e.preventDefault();

  let list =
    e.target.parentElement.parentElement.children[1].children[0].childNodes[1]
      .children;

  while (list.length != 1) {
    //block the remove main invisible li in html
    list[list.length - 1].remove();
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

//loading Main Tasks
function loadLS() {
  if (localStorage.getItem("allTasks") === null) {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  } else {
    allTasks = JSON.parse(localStorage.getItem("allTasks"));

    allTasks.forEach(function (item) {
      if (item != "") {
        createNewTask(item.text, item.check);
      }
    });
  }
}

//loading Inner Tasks
function loadInnerTasks() {
  if (localStorage.getItem("innerTasks") === null) {
    localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
  } else {
    innerTasks = JSON.parse(localStorage.getItem("innerTasks"));

    innerTasks.forEach(function (item) {
      if (item.mainText != "") {
        addInnerTask(item.upperTaskText, item.mainText, item.check);
      }
    });
  }
}

//saving Main Tasks
function saveLS(text, index) {
  //if index = 1 add, = 0 remove, =-1 remove all
  if (index == -1) {
    localStorage.removeItem("allTasks");
    allTasks.length = 0;
    loadLS();
  } else if (index == 0) {
    const tmp = JSON.parse(localStorage.getItem("allTasks"));
    let c;
    tmp.forEach(function (item, ind) {
      if (item.text == text) c = ind;
    });
    tmp.splice(c, 1);
    localStorage.setItem("allTasks", JSON.stringify(tmp));

    //delete inner tasks whose upper text that
    const tmp2 = JSON.parse(localStorage.getItem("innerTasks"));

    for (let i = 0; i < tmp2.length; i++) {
      if (tmp2[i].upperTaskText == text) {
        saveInnerTasks(tmp[i], 0);
      }
    }
  } else if (index == 1) {
    const tmp = JSON.parse(localStorage.getItem("allTasks"));
    tmp.push({ text: text, check: false });
    localStorage.setItem("allTasks", JSON.stringify(tmp));
  }
}

//saving Inner Tasks
function saveInnerTasks(item, index, upperText = "") {
  //if index = 1 add, = 0 remove, =-1 remove all, 2 check, =3 removeCheck
  if (index == -1) {
    localStorage.removeItem("innerTasks");
    innerTasks.length = 0;
    loadInnerTasks();
  } else if (index == 0) {
    const tmp = JSON.parse(localStorage.getItem("innerTasks"));

    let cont = false;
    let c;
    tmp.forEach(function (e, ind) {
      if (e.mainText == item && e.upperTaskText == upperText) {
        c = ind;
        cont = true;
      }
    });
    if (cont) {
      tmp.splice(c, 1);
      localStorage.setItem("innerTasks", JSON.stringify(tmp));
    }
  } else if (index == 1) {
    const tmp = JSON.parse(localStorage.getItem("innerTasks"));
    tmp.push(item);
    localStorage.setItem("innerTasks", JSON.stringify(tmp));
  }
}
