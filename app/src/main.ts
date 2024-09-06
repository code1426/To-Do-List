const inputBox = document.querySelector<HTMLInputElement>("#input-box")
const listContainer = document.querySelector<HTMLUListElement>("#list-container")
const form = document.querySelector<HTMLFormElement>(".form")
let ToDoArray: ToDo[] = JSON.parse(localStorage.getItem('todos') || '[]');

interface ToDo { 
  readonly id: number;
  title: string;
  isCompleted: boolean;
}

const checkboxComponent = ({ id, isCompleted }: ToDo, text: HTMLParagraphElement): HTMLInputElement => {
  const checkbox = document.createElement("input")
  checkbox.setAttribute("type", "checkbox")
  checkbox.checked = isCompleted
  
  checkbox.onchange = () => {
    const item = ToDoArray.find(item => item.id === id);
    if (item) {
      item.isCompleted = checkbox.checked;
      localStorage.setItem('todos', JSON.stringify(ToDoArray));
    }
    text.className = checkbox.checked ? "text-cut" : "";
  }
  return checkbox
}

const textComponent = ({ isCompleted, title }: ToDo): HTMLParagraphElement => {
  const text = document.createElement("p");
  text.className = isCompleted ? "text-cut" : "";
  text.innerHTML = `${title}`;
  return text
}

const deleteBtnComponent = ({ id }: ToDo): HTMLSpanElement => {
  const deleteBtn = document.createElement("span")
  deleteBtn.innerHTML = "\u00d7"
  deleteBtn.onclick = () => {
    deleteToDo(id)
  }
  return deleteBtn
}

const createToDoItem = (toDo: ToDo): void => {
  const toDoItem = document.createElement("li")
  const text = textComponent(toDo)
  const checkbox = checkboxComponent(toDo, text)
  const deleteBtn = deleteBtnComponent(toDo)

  toDoItem.append(checkbox, text, deleteBtn)
  listContainer?.appendChild<HTMLLIElement>(toDoItem) 
  inputBox!.value = ""
}

const deleteToDo = (id: number): void => {
  ToDoArray = ToDoArray.filter(item => item.id !== id);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));
  renderToDo();
}

const renderToDo = (): void => {
  listContainer!.innerHTML = ToDoArray.length ? "" : "<p class='no-task'>No To Do Yet!</p>";
  ToDoArray.forEach(toDo => {
    createToDoItem(toDo);
  })
}

const handleSubmit = (event: Event): void => {
  event.preventDefault()
  const task = inputBox?.value.trim()
  if (task === "" || task === null) return

  const newTodo: ToDo = {
    id: Date.now(),
    title: inputBox!.value.trim(),
    isCompleted: false
  }

  ToDoArray.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));
  renderToDo()
}

form?.addEventListener("submit", (e) => handleSubmit(e))
renderToDo()
