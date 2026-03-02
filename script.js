const r = document.getElementById('res');
function calc(v) { r.value += v; }
function clr() { r.value = ''; }
function solve() { r.value = eval(r.value); }