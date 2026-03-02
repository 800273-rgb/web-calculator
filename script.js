const display = document.getElementById('display');
const history = document.getElementById('history');
let memory = 0;
let lastResult = 0;
let shouldResetDisplay = false;

// Check for theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// ============ CORE CALCULATOR FUNCTIONS ============

function appendNumber(num) {
    if (shouldResetDisplay) {
        display.value = num;
        shouldResetDisplay = false;
    } else {
        if (display.value === '0') {
            display.value = num;
        } else {
            display.value += num;
        }
    }
}

function appendOperator(op) {
    const value = display.value.trim();
    if (value === '' || value === '-') return;
    
    // Prevent multiple operators
    if (/[+\-*/]$/.test(value)) {
        display.value = value.slice(0, -1) + op;
    } else {
        display.value += op;
    }
    shouldResetDisplay = false;
}

function clearDisplay() {
    display.value = '0';
    shouldResetDisplay = false;
    history.textContent = '';
}

function clearEntry() {
    display.value = '0';
    shouldResetDisplay = false;
}

function deleteLast() {
    display.value = display.value.slice(0, -1) || '0';
}

function calculate() {
    try {
        if (display.value.trim() === '') return;
        
        const expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        const result = math.evaluate(expression);
        
        // Handle infinity and invalid results
        if (!isFinite(result)) {
            display.value = 'Cannot divide by 0';
            setTimeout(() => display.value = '0', 1500);
            return;
        }
        
        history.textContent = expression + ' =';
        lastResult = result;
        display.value = parseFloat(result.toFixed(10));
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        history.textContent = '';
        shouldResetDisplay = true;
    }
}

// ============ SCIENTIFIC FUNCTIONS ============

function calculateSquare() {
    try {
        const value = parseFloat(display.value);
        const result = value * value;
        history.textContent = `${value}²`;
        display.value = result;
        shouldResetDisplay = true;
    } catch {
        display.value = 'Error';
    }
}

function calculateSqrt() {
    try {
        const value = parseFloat(display.value);
        if (value < 0) {
            display.value = 'Error';
            return;
        }
        const result = Math.sqrt(value);
        history.textContent = `√${value}`;
        display.value = parseFloat(result.toFixed(10));
        shouldResetDisplay = true;
    } catch {
        display.value = 'Error';
    }
}

function calculateReciprocal() {
    try {
        const value = parseFloat(display.value);
        if (value === 0) {
            display.value = 'Cannot divide by 0';
            setTimeout(() => display.value = '0', 1500);
            return;
        }
        const result = 1 / value;
        history.textContent = `1/${value}`;
        display.value = parseFloat(result.toFixed(10));
        shouldResetDisplay = true;
    } catch {
        display.value = 'Error';
    }
}

function calculatePercent() {
    try {
        const value = parseFloat(display.value);
        const result = value / 100;
        display.value = result;
        shouldResetDisplay = false;
    } catch {
        display.value = 'Error';
    }
}

function toggleSign() {
    try {
        const value = parseFloat(display.value);
        display.value = value * -1;
        shouldResetDisplay = false;
    } catch {
        display.value = 'Error';
    }
}

// ============ MEMORY FUNCTIONS ============

function memoryStore() {
    try {
        memory = parseFloat(display.value);
        updateMemoryButtons();
    } catch {
        display.value = 'Error';
    }
}

function memoryAdd() {
    try {
        memory += parseFloat(display.value);
        updateMemoryButtons();
    } catch {
        display.value = 'Error';
    }
}

function memorySubtract() {
    try {
        memory -= parseFloat(display.value);
        updateMemoryButtons();
    } catch {
        display.value = 'Error';
    }
}

function memoryRecall() {
    display.value = memory;
    shouldResetDisplay = true;
    updateMemoryButtons();
}

function memoryClear() {
    memory = 0;
    updateMemoryButtons();
}

function updateMemoryButtons() {
    const memButtons = document.querySelectorAll('[data-action^="memory"]');
    const hasMem = memory !== 0;
    memButtons.forEach(btn => {
        if (btn.dataset.action === 'memory-clear' || btn.dataset.action === 'memory-recall') {
            btn.classList.toggle('disabled', !hasMem);
        }
    });
}

// ============ EVENT DELEGATION ============

document.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    // Number buttons
    if (button.dataset.number) {
        appendNumber(button.dataset.number);
        return;
    }

    // Operators
    if (button.dataset.operator) {
        appendOperator(button.dataset.operator);
        return;
    }

    // Actions
    const action = button.dataset.action;
    switch(action) {
        case 'calculate': calculate(); break;
        case 'clear': clearDisplay(); break;
        case 'clear-entry': clearEntry(); break;
        case 'backspace': deleteLast(); break;
        case 'square': calculateSquare(); break;
        case 'sqrt': calculateSqrt(); break;
        case 'reciprocal': calculateReciprocal(); break;
        case 'percent': calculatePercent(); break;
        case 'toggle-sign': toggleSign(); break;
        case 'memory-store': memoryStore(); break;
        case 'memory-add': memoryAdd(); break;
        case 'memory-subtract': memorySubtract(); break;
        case 'memory-recall': memoryRecall(); break;
        case 'memory-clear': memoryClear(); break;
    }
});

// ============ DARK MODE TOGGLE ============

const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ============ KEYBOARD SHORTCUTS ============

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+') appendOperator('+');
    if (e.key === '-') appendOperator('-');
    if (e.key === '*') appendOperator('*');
    if (e.key === '/') { e.preventDefault(); appendOperator('/'); }
    if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
    if (e.key === 'Backspace') { e.preventDefault(); deleteLast(); }
    if (e.key === 'Escape') clearDisplay();
});

// Initialize
updateMemoryButtons();