let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


window.onload = function () {
  renderAllTasks();
};


function displayTask() {
  const taskInput = document.getElementById('task');
  const dateInput = document.getElementById('dueDate');

  const taskText = taskInput.value.trim();
  const dueDate = dateInput.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const categoryInput = document.getElementById('category');
  const category = categoryInput.value;

  const taskObj = {
  id: Date.now(),
  text: taskText,
  due: dueDate,
  completed: false,
  category: category
  };


  tasks.push(taskObj);
  saveTasks();
  renderTask(taskObj);

  taskInput.value = '';
  dateInput.value = '';
  document.getElementById('sortOption').value = 'default';

}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderAllTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task));
}

function renderTask(taskObj) {
  const taskList = document.getElementById('taskList');

  const taskItem = document.createElement('div');
  taskItem.className = 'taskItem';
  taskItem.setAttribute('data-id', taskObj.id);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObj.completed;
  checkbox.onclick = () => toggleComplete(taskObj.id);

  const taskContent = document.createElement('p');
  taskContent.textContent = `${taskObj.text} [${taskObj.category}] - Due: ${taskObj.due || 'No date'}`;
  taskContent.className = taskObj.completed ? 'completed' : '';
  taskContent.contentEditable = false;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'editBtn';
  editBtn.onclick = () => {
    taskContent.contentEditable = true;
    taskContent.focus();
    editBtn.textContent = 'Save';
    editBtn.onclick = () => {
      taskObj.text = taskContent.textContent.split(' - Due:')[0].trim();
      taskContent.contentEditable = false;
      editBtn.textContent = 'Edit';
      saveTasks();
      renderAllTasks();
    };
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'deleteBtn';
  deleteBtn.onclick = () => deleteTask(taskObj.id);

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskContent);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(deleteBtn);

  taskList.appendChild(taskItem);
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderAllTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderAllTasks();
}
document.getElementById('sortOption').addEventListener('change', function () {
  const value = this.value;
  let sortedTasks = [...tasks]; 
  if (value === 'dueDate') {
    sortedTasks.sort((a, b) => {
      if (!a.due) return 1; 
      if (!b.due) return -1;
      return new Date(a.due) - new Date(b.due);
    });
  } else if (value === 'completed') {
    sortedTasks.sort((a, b) => a.completed - b.completed); 
  }

  renderSortedTasks(sortedTasks);
});

function renderSortedTasks(sortedList) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  sortedList.forEach(task => renderTask(task));
}


function exportCSV() {
  let csv = 'Task,Due Date,Category,Completed\n';
  tasks.forEach(task => {
    csv += `"${task.text}","${task.due}","${task.category}",${task.completed}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'eazzy_tasks.csv';
  a.click();
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text('Eazzy Task List', 10, 10);

  let y = 20;
  tasks.forEach(task => {
    doc.text(`• ${task.text} [${task.category}] - Due: ${task.due || 'No date'} - Completed: ${task.completed ? 'Yes' : 'No'}`, 10, y);
    y += 10;
  });

  doc.save('eazzy_tasks.pdf');
}

