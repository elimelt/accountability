import { useState, useEffect } from 'react'

const defaultHtml = `<!DOCTYPE html>
<div class="container">
  <h1>This is a template</h1>
  <p className="description">
    I know this is cool, but you need to replace this component eventually.
  </p>
  <p>Edit the HTML, CSS, and JavaScript files to see your changes live!</p>

  <div class="counter-container">
    <button id="decrementBtn">-</button>
    <span id="counter">0</span>
    <button id="incrementBtn">+</button>
  </div>

  <div class="color-container">
    <input type="color" id="colorPicker" value="#64ffda">
    <p>Pick a color to change the heading!</p>
  </div>
</div>`

const defaultCss = `/* Container styles */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  text-align: center;
}

.description {
  color: #666;
  font-size: 4%;
  margin-bottom: 2rem;
}

h1 {
  color: #64ffda;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

p {
  color: #666;
  line-height: 1.6;
}

.counter-container {
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

#counter {
  font-size: 1.5rem;
  min-width: 3rem;
}

button {
  background: #64ffda;
  border: none;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: opacity 0.2s ease;
}

button:hover {
  opacity: 0.8;
}

.color-container {
  margin-top: 2rem;
}

#colorPicker {
  margin-bottom: 1rem;
  cursor: pointer;
}`

const defaultJs = `
const counter = document.getElementById('counter');
const decrementBtn = document.getElementById('decrementBtn');
const incrementBtn = document.getElementById('incrementBtn');
const colorPicker = document.getElementById('colorPicker');
const heading = document.querySelector('h1');

let count = 0;

decrementBtn.addEventListener('click', () => {
  count--;
  counter.textContent = count;
});

incrementBtn.addEventListener('click', () => {
  count++;
  counter.textContent = count;
});

colorPicker.addEventListener('input', (e) => {
  heading.style.color = e.target.value;
});`

export default function useAppState() {
  const [inMemoryState, setInMemoryState] = useState({
    html: defaultHtml,
    css: defaultCss,
    js: defaultJs,
  })

  const handlePersistState = () => {
    localStorage.setItem('appState', JSON.stringify(inMemoryState))
  }

  const handleHtmlChange = (e) => {
    setInMemoryState((prevState) => ({
      ...prevState,
      html: e.target.value,
    }))
  }

  const handleCssChange = (e) => {
    setInMemoryState((prevState) => ({
      ...prevState,
      css: e.target.value,
    }))
  }

  const handleJsChange = (e) => {
    setInMemoryState((prevState) => ({
      ...prevState,
      js: e.target.value,
    }))
  }

  useEffect(() => {
    const appState = localStorage.getItem('appState')

    if (appState) {
      setInMemoryState(JSON.parse(appState))
    }
  }, [])

  return {
    inMemoryState,
    _setInMemoryState: setInMemoryState,
    handleHtmlChange,
    handleCssChange,
    handleJsChange,
    handlePersistState,
  }
}