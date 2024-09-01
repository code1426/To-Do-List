const inputBox = document.querySelector<HTMLInputElement>("#input-box")
const listContainer = document.querySelector<HTMLUListElement>("#list-container")
const form = document.querySelector<HTMLFormElement>(".form")
let ToDoArray: ToDo[] = JSON.parse(localStorage.getItem('todos') || '[]');

interface ToDo {
  readonly id: number;
  title: string;
  isCompleted: boolean;
}

const createToDoItem = (toDo: ToDo) => {
  const toDoItem = document.createElement("li")

  //checkbox
  const checkbox = document.createElement("input")
  checkbox.setAttribute("type", "checkbox")
  checkbox.checked = toDo.isCompleted
  checkbox.onchange = () => {
    const item = ToDoArray.find(item => item.id === toDo.id);
    if (item) {
      item.isCompleted = checkbox.checked;
      localStorage.setItem('todos', JSON.stringify(ToDoArray));
    }
    title.className = checkbox.checked ? "text-cut" : "";
  }

  //task title
  const title = document.createElement("p");
  title.className = toDo.isCompleted ? "text-cut" : "";
  title.innerHTML = `${toDo.title}`;
  
  //delete button
  const deleteBtn = document.createElement("span")
  deleteBtn.innerHTML = "\u00d7"
  deleteBtn.onclick = () => {
    deleteToDo(toDo.id)
  }

  //append elements
  toDoItem.append(checkbox, title, deleteBtn)
  listContainer?.appendChild(toDoItem) 
  inputBox!.value = ""
}


const deleteToDo = (id: number) => {
  ToDoArray = ToDoArray.filter(item => item.id !== id);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));
  renderToDo();
}


const renderToDo = () => {
  listContainer!.innerHTML = ToDoArray.length ? "" : "<p class='no-task'>No To Do Yet!</p>";
  ToDoArray.forEach(item => {
    createToDoItem(item);
  })
}


const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (inputBox?.value === "" || inputBox?.value === null) return

  const newTodo: ToDo = {
    id: Date.now(),
    title: inputBox!.value,
    isCompleted: false
  }

  ToDoArray.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));

  renderToDo()
}

form?.addEventListener("submit",(e) => handleSubmit(e))
renderToDo()
