import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const todolist = new ToDoList();


// Launch app

document.addEventListener("readystatechange", (event) =>{
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    //Add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    });

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", (event) => {
        const list = todolist.getList();
        if (list.length) {
            const confirmed = confirm("Are you sure you want to confirm the entire list?");
            if (confirmed) {
                todolist.clearList();
                updatePersistentData(todolist.getList());
                refreshThePage();
            }
        }
    })
    //Procedural
    loadListObject();
    //refresh page
    refreshThePage();
}


const loadListObject = () => {
    const storedList = localStorage.getItem("myToDolist");
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        todolist.addItemToList(newToDoItem);
    });
};

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    SetFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child)
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = todolist.getList()
    list.forEach((element) => {
        buildListItem(element);
    });
};

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        todolist.removeItemFromList(checkbox.id);
        updatePersistentData(todolist.getList());
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    });
};

const updatePersistentData = (listArray) => {
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
};

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
};

const SetFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
};


const processSubmission = () => {
    const newEntryText = getNewEntry();
    if(!newEntryText.length) return;
    const nextItemId = calcNextItemId();   
    const toDoItem = createNewItem(nextItemId, newEntryText); 
    todolist.addItemToList(toDoItem);
    updatePersistentData(todolist.getList());
    refreshThePage();
};

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = todolist.getList();
    if (list.length > 0){
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
};


const createNewItem = (itemId, itemText) => {
    let toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
};
