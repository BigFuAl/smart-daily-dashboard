/* global Chart */

// smart-daily-dashboard/script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded. JS running.');

  // ─── Daily Quote API ───
const quoteArea = document.getElementById('quoteArea');

fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random')
  .then(res => res.json())
  .then(data => {
    if (data && data[0] && data[0].q && data[0].a) {
      quoteArea.innerText = `"${data[0].q}" — ${data[0].a}`;
    } else {
      quoteArea.innerText = 'Could not load quote today.';
    }
  })
  .catch(err => {
    console.error('❌ Failed to fetch quote:', err);
    quoteArea.innerText = 'Quote unavailable. Try again later.';
  });

  // ─── Dark-Mode Toggle Setup ───
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.innerText = next === 'dark' ? '☀️' : '🌙';
  });

  // ─── Greeting & Advice Logic ───
  const nameInput = document.getElementById('nameInput');
  const moodSelect = document.getElementById('moodSelect');
  const emotionSelect = document.getElementById('emotionSelect');
  const messageArea = document.getElementById('messageArea');
  const adviceArea = document.getElementById('adviceArea');
  const greeting = document.getElementById('greeting');
  const startBtn = document.getElementById('startBtn');
  const greetingTitle = document.querySelector('h1');

  // Time‐based greeting
  const nowH = new Date().getHours();
  greetingTitle.innerText =
    nowH < 12
      ? 'Good morning!'
      : nowH < 17
        ? 'Good afternoon!'
        : 'Good evening!';

  // Restore name
  const savedName = localStorage.getItem('username');
  if (savedName) {
    nameInput.value = savedName;
    greeting.innerText = `Welcome back, ${savedName}.`;
  }

  // Advice map
  const adviceMap = {
    anxious: 'Breathe in through nose for 4 seconds…',
    sad: 'It is okay to feel sadness…',
    angry: 'Remove yourself…: 5 things you see, 4 things you feel…',
    happy: 'This is awesome! Remember to write down this feeling…',
  };

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const mood = moodSelect.value;
    const emotion = emotionSelect.value;

    if (!name) return alert('Please enter your name.');

    localStorage.setItem('username', name);
    greeting.innerText = `Good day, ${name}!`;

    const moodMsgs = {
      happy: 'Keep shining — your vibe is contagious!',
      tired: 'Take a deep breath. You’ve got this.',
      focused: 'Laser focus — stay locked in.',
      meh: 'Even the meh days pass. Proud of you.',
    };
    messageArea.innerText = moodMsgs[mood] || 'Pick a mood first.';
    adviceArea.innerText = adviceMap[emotion] || '';
  });

  // ─── Chart.js + Dynamic Data Entry Setup ───

  // 1) Grab controls
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  console.log('🔍 taskInput=', taskInput, 'addTaskBtn=', addTaskBtn);

  // 2) Load or default data
  const savedData = JSON.parse(localStorage.getItem('chartData')) || [
    3, 2, 4, 5, 3, 1, 0,
  ];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // 3) Create the chart instance
  let productivityChart;
  const canvas = document.getElementById('productivityChart');
  if (canvas && window.Chart) {
    const ctx = canvas.getContext('2d');
    productivityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Tasks Completed',
            data: savedData,
            backgroundColor: 'rgba(197,160,222,0.6)',
            borderColor: 'rgba(197,160,222,1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  } else {
    console.error(
      '⚠️ Chart.js not loaded or <canvas id="productivityChart"> missing',
    );
  }

  // 4) Wire up new entries
  addTaskBtn.addEventListener('click', () => {
    console.log('✅ Add Data Point clicked, input value =', taskInput.value);
    if (!productivityChart) {
      console.error('⚠️ Cannot add data point: chart instance is missing');
      return;
    }

    const val = parseInt(taskInput.value, 10);
    if (isNaN(val) || val < 0) {
      return alert('Please enter a valid non-negative number');
    }

    savedData.push(val);
    if (savedData.length > 7) savedData.shift();

    productivityChart.data.datasets[0].data = savedData;
    productivityChart.update();

    localStorage.setItem('chartData', JSON.stringify(savedData));
    taskInput.value = '';
  });
  // ─── To-Do List Logic ───
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

// Load saved todos
const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
savedTodos.forEach(todo => renderTodo(todo));

// Add new todo
addTodoBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (!text) return alert('Please enter a task.');

  const newTodo = { text, completed: false };
  savedTodos.push(newTodo);
  localStorage.setItem('todos', JSON.stringify(savedTodos));
  renderTodo(newTodo);
  todoInput.value = '';
});

// Render a single todo item
function renderTodo(todo) {
  const li = document.createElement('li');
  if (todo.completed) li.classList.add('completed');

  const span = document.createElement('span');
  span.innerText = todo.text;
  span.style.cursor = 'pointer';
  span.addEventListener('click', () => {
    todo.completed = !todo.completed;
    li.classList.toggle('completed');
    localStorage.setItem('todos', JSON.stringify(savedTodos));
  });

  const delBtn = document.createElement('button');
  delBtn.innerText = '×';
  delBtn.className = 'todo-delete';
  delBtn.addEventListener('click', () => {
    const index = savedTodos.indexOf(todo);
    if (index !== -1) {
      savedTodos.splice(index, 1);
      localStorage.setItem('todos', JSON.stringify(savedTodos));
      li.remove();
    }
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  todoList.appendChild(li);
}
  
});
