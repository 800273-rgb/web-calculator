const display = document.getElementById('display');

// Functionality
function append(value) { display.value += value; }
function clearDisplay() { display.value = ''; }
function deleteLast() { display.value = display.value.slice(0, -1); }

function calculate() {
    try {
        // Prevent empty or malicious evals
        if (display.value === "") return;
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
        setTimeout(clearDisplay, 1500);
    }
}

// DARK MODE TOGGLE
const themeBtn = document.getElementById('theme-toggle');
themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
};

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) append(e.key);
    if (e.key === '.') append('.');
    if (e.key === '+') append('+');
    if (e.key === '-') append('-');
    if (e.key === '*') append('*');
    if (e.key === '/') append('/');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
});