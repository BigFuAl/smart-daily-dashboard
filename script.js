/* global Chart */

// smart-daily-dashboard/script.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded. JS running.');

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
});
