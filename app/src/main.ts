const inputBox = document.querySelector<HTMLInputElement>("#input-box")
const listContainer = document.querySelector<HTMLUListElement>("#list-container")
const form = document.querySelector<HTMLFormElement>("#form")
const date = document.querySelector<HTMLInputElement>("#date-selector")
const dropdown = document.querySelector<HTMLSelectElement>("#sort")
let ToDoArray: ToDo[] = JSON.parse(localStorage.getItem('todos') || '[]');

interface ToDo {
  readonly id: number;
  title: string;
  isCompleted: boolean;
  dueDate: Date,
  stringDueDate: string;
  isExpired: boolean;
}

const createNewTodo = (inputTitle: string, InputDate: string): ToDo => {
  const newTodo: ToDo = {
    id: Date.now(),
    title: inputTitle.trim(),
    isCompleted: false,
    dueDate: new Date(InputDate),
    stringDueDate: InputDate,
    isExpired: false,
  }
  return newTodo
}

const checkboxComponent = ({ id, isCompleted }: ToDo): HTMLInputElement => {
  const checkbox = document.createElement("input")
  checkbox.setAttribute("type", "checkbox")
  checkbox.checked = isCompleted
  
  checkbox.onchange = () => {
    handleToggle(id, checkbox)
  }
  return checkbox
}

const textComponent = (todo: ToDo): HTMLDivElement => {
  const textContainer = document.createElement("div")
  const text = document.createElement("p");
  text.innerText = todo.title;

  const dueText = document.createElement("p")
  dueText.innerText = todo.stringDueDate;
  dueText.className = "due-date"

  const checkbox = checkboxComponent(todo)

  textContainer.onclick = () => {
    checkbox.checked = !todo.isCompleted
    handleToggle(todo.id, checkbox)
  }

  if (todo.isCompleted) {
    text.style.textDecoration = "line-through"
    text.style.color = "#9a9a9a"
  }
  if (todo.isExpired && !todo.isCompleted) {
    dueText.style.color = "#f43939"
    dueText.style.fontWeight = "700"
  }
  textContainer.append(text, dueText)
  return textContainer
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
  const checkbox = checkboxComponent(toDo)
  const deleteBtn = deleteBtnComponent(toDo)

  toDoItem.append(checkbox, text, deleteBtn)
  listContainer?.appendChild<HTMLLIElement>(toDoItem)
}

const deleteToDo = (id: number): void => {
  ToDoArray = ToDoArray.filter(item => item.id !== id);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));
  renderToDo(ToDoArray);
}

const renderToDo = (array: ToDo[]): void => {
  listContainer!.innerHTML = array.length ? "" :  "<img class='done' src='../done.png' alt='done'><p class='no-task'>Well Done!</p><p class='sub-no-task'>Your to-do list is empty. Time to recharge.</p>"
  array.forEach(toDo => {
    toDo.isExpired = isTaskExpired(toDo);
    createToDoItem(toDo);
  })
}

const handleToggle = (id:number, checkbox: HTMLInputElement): void => {
  const item = ToDoArray.find(item => item.id === id);
  const filteredTodo = filterTodos(ToDoArray, dropdown!.value)
    if (item) {
      item.isCompleted = checkbox.checked;
      localStorage.setItem('todos', JSON.stringify(ToDoArray));
    }
    renderToDo(filteredTodo)
}

const isTaskExpired = (toDo: ToDo): boolean => {
  const currentDate = new Date()
  const dueDate = new Date(toDo.dueDate)

  if (currentDate.toISOString().split('T')[0] == toDo.stringDueDate) return false
  return currentDate > dueDate
}

const sortToDo = (array: ToDo[], type: "asc" | "desc"): void => {
  array.sort((a, b): number => {
    if (type === "asc") {
      return a.dueDate > b.dueDate ? 1 : -1
    }
    if (type === "desc") {
      return a.dueDate > b.dueDate ? -1 : 1
    }
    return 0
  })
}

const filterTodos = (array: ToDo[], filter: string): ToDo[] => {
  switch (filter) {
  case 'pending':
      return array.filter(toDo => !toDo.isCompleted);
  case 'completed':
      return array.filter(toDo => toDo.isCompleted);
  case 'expired':
      return array.filter(toDo => toDo.isExpired && !toDo.isCompleted);
  case 'all':
  default:
      return array;
  }
}

const resetInputs = (): void => {
  inputBox!.value = ""
  date!.value = ""
  dropdown!.value = "all"
}

const handleSubmit = (event: Event): void => {
  event.preventDefault()
  const task = inputBox!.value.trim()
  const dueDate = date!.value
  const newTodo = createNewTodo(task, dueDate)

  if (task === "" || dueDate === "") {
    alert("Invalid Input")
    return 
  }

  ToDoArray.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(ToDoArray));
  sortToDo(ToDoArray, "asc")
  renderToDo(ToDoArray)
  resetInputs()
}

const eventListeners = (): void => {
  form?.addEventListener("submit", (event) => handleSubmit(event))

  dropdown!.onchange = () => {
    const filteredToDos = filterTodos(ToDoArray, dropdown!.value)
    sortToDo(filteredToDos, "asc")
    renderToDo(filteredToDos)
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        renderToDo(filterTodos(ToDoArray, dropdown!.value))
    }
  });
  renderToDo(ToDoArray)
}

eventListeners()
