const display = document.getElementById('display');
const historyLine = document.getElementById('history');
let justCalculated = false;

function appendToDisplay(value) {
  // After a result, typing a number starts a new calculation,
  // while typing an operator continues from the result.
  if (justCalculated && /[0-9.(]/.test(value)) display.value = '';
  if (display.value === 'Error') display.value = '';
  justCalculated = false;
  display.value += value;
}

function clearDisplay() {
  display.value = '';
  historyLine.textContent = '';
  justCalculated = false;
}

function deleteChar() {
  if (display.value === 'Error') display.value = '';
  display.value = display.value.slice(0, -1);
}

function calculate() {
  const expression = display.value;
  if (!expression) return;
  try {
    const result = Calculator.evaluate(expression);
    historyLine.textContent = `${expression} =`;
    display.value = String(result);
  } catch (error) {
    historyLine.textContent = error.message;
    display.value = 'Error';
  }
  justCalculated = true;
}

document.querySelector('.buttons').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const { action, value } = button.dataset;
  if (action === 'clear') clearDisplay();
  else if (action === 'delete') deleteChar();
  else if (action === 'equals') calculate();
  else appendToDisplay(value);
});

// Keyboard support
document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/^[0-9.+\-/*%()]$/.test(key)) appendToDisplay(key === '*' ? 'x' : key);
  else if (key === 'Enter' || key === '=') { event.preventDefault(); calculate(); }
  else if (key === 'Backspace') deleteChar();
  else if (key === 'Escape') clearDisplay();
});
