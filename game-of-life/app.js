import { PATTERNS, createGrid, population, step } from "./life.js";

const board = document.querySelector("#board");
const stage = document.querySelector(".stage");
const generationEl = document.querySelector("#generation");
const populationEl = document.querySelector("#population");
const runButton = document.querySelector("#run");
const stepButton = document.querySelector("#step");
const clearButton = document.querySelector("#clear");
const randomButton = document.querySelector("#random");
const speedInput = document.querySelector("#speed");
const speedValue = document.querySelector("#speed-value");
const densityInput = document.querySelector("#density");
const densityValue = document.querySelector("#density-value");
const patternSelect = document.querySelector("#pattern");
const sizeSelect = document.querySelector("#size");
const wrapInput = document.querySelector("#wrap");

const ctx = board.getContext("2d");
const colors = Array.from({ length: 17 }, (_, age) => {
  const t = age / 16;
  const r = Math.round(31 + (180 - 31) * t);
  const g = Math.round(106 + (72 - 106) * t);
  const b = Math.round(69 + (28 - 69) * t);
  return `rgb(${r} ${g} ${b})`;
});

const state = {
  cols: 100,
  rows: 64,
  grid: createGrid(100, 64),
  next: createGrid(100, 64),
  ages: new Uint8Array(100 * 64),
  generation: 0,
  alive: 0,
  running: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  wrap: true,
  speed: 12,
  density: 0.18,
  painting: null,
  wasRunning: false,
  hover: null,
  view: { originX: 0, originY: 0, cell: 8, dpr: 1 },
};

let raf = 0;
let lastTime = 0;
let accumulator = 0;

function allocate(cols, rows) {
  state.cols = cols;
  state.rows = rows;
  state.grid = createGrid(cols, rows);
  state.next = createGrid(cols, rows);
  state.ages = new Uint8Array(cols * rows);
  state.generation = 0;
  state.alive = 0;
  state.hover = null;
}

function syncStats() {
  generationEl.textContent = String(state.generation);
  populationEl.textContent = String(state.alive);
}

function recount() {
  state.alive = population(state.grid);
  syncStats();
}

function setRunning(running) {
  state.running = running;
  runButton.textContent = running ? "暂停" : "运行";
  runButton.setAttribute("aria-pressed", String(running));
  if (running) requestTick();
}

function advance() {
  step(state.grid, state.next, state.cols, state.rows, state.wrap);
  const { grid, next, ages } = state;
  for (let i = 0; i < grid.length; i++) {
    if (next[i]) ages[i] = grid[i] ? Math.min(ages[i] + 1, 16) : 1;
    else ages[i] = 0;
  }
  state.grid = next;
  state.next = grid;
  state.generation += 1;
  recount();
}

function clearBoard() {
  state.grid.fill(0);
  state.ages.fill(0);
  state.generation = 0;
  recount();
}

function patternById(id) {
  return PATTERNS.find((pattern) => pattern.id === id);
}

function placePattern(id) {
  const pattern = patternById(id);
  if (!pattern) return;
  clearBoard();
  const xs = pattern.cells.map(([x]) => x);
  const ys = pattern.cells.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs) + 1;
  const height = Math.max(...ys) - Math.min(...ys) + 1;
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const originX = pattern.anchor === "left"
    ? 2 - minX
    : Math.floor((state.cols - width) / 2) - minX;
  const originY = Math.floor((state.rows - height) / 2) - minY;
  for (const [x, y] of pattern.cells) {
    const cx = x + originX;
    const cy = y + originY;
    if (cx < 0 || cy < 0 || cx >= state.cols || cy >= state.rows) continue;
    const index = cy * state.cols + cx;
    state.grid[index] = 1;
    state.ages[index] = 1;
  }
  recount();
}

function randomize() {
  clearBoard();
  for (let i = 0; i < state.grid.length; i++) {
    if (Math.random() < state.density) {
      state.grid[i] = 1;
      state.ages[i] = 1;
    }
  }
  recount();
}

function paintCell(x, y, alive) {
  if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return;
  const index = y * state.cols + x;
  const value = alive ? 1 : 0;
  if (state.grid[index] === value) return;
  state.grid[index] = value;
  state.ages[index] = value;
}

function cellFromEvent(event) {
  const rect = board.getBoundingClientRect();
  const { originX, originY, cell, dpr } = state.view;
  const x = (event.clientX - rect.left) * dpr;
  const y = (event.clientY - rect.top) * dpr;
  return {
    x: Math.floor((x - originX) / cell),
    y: Math.floor((y - originY) / cell),
  };
}

function layout() {
  const rect = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (board.width !== width || board.height !== height) {
    board.width = width;
    board.height = height;
  }
  const cell = Math.max(1, Math.floor(Math.min(width / state.cols, height / state.rows)));
  state.view = {
    dpr,
    cell,
    originX: Math.floor((width - cell * state.cols) / 2),
    originY: Math.floor((height - cell * state.rows) / 2),
  };
}

function draw() {
  const { originX, originY, cell, dpr } = state.view;
  const width = cell * state.cols;
  const height = cell * state.rows;
  ctx.clearRect(0, 0, board.width, board.height);
  ctx.fillStyle = "#f4efe4";
  ctx.fillRect(originX, originY, width, height);

  const cssCell = cell / dpr;
  if (cssCell >= 7) {
    ctx.strokeStyle = "rgba(90, 70, 40, 0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= state.cols; x++) {
      const px = originX + x * cell + 0.5;
      ctx.moveTo(px, originY);
      ctx.lineTo(px, originY + height);
    }
    for (let y = 0; y <= state.rows; y++) {
      const py = originY + y * cell + 0.5;
      ctx.moveTo(originX, py);
      ctx.lineTo(originX + width, py);
    }
    ctx.stroke();
  }

  const pad = cssCell >= 8 ? Math.max(1, cell * 0.12) : 0;
  const { grid, ages, cols } = state;
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i]) continue;
    const x = i % cols;
    const y = (i / cols) | 0;
    ctx.fillStyle = colors[ages[i]] || colors[1];
    ctx.fillRect(
      originX + x * cell + pad,
      originY + y * cell + pad,
      cell - pad * 2,
      cell - pad * 2,
    );
  }

  if (state.hover) {
    const { x, y } = state.hover;
    if (x >= 0 && y >= 0 && x < state.cols && y < state.rows) {
      ctx.strokeStyle = "#1f6a45";
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeRect(originX + x * cell + 1, originY + y * cell + 1, cell - 2, cell - 2);
    }
  }
}

function requestTick() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick(time) {
  raf = 0;
  layout();
  if (state.running) {
    const delta = lastTime ? Math.min(100, time - lastTime) : 0;
    lastTime = time;
    accumulator += delta;
    const interval = 1000 / state.speed;
    let steps = 0;
    while (accumulator >= interval && steps < 6) {
      advance();
      accumulator -= interval;
      steps += 1;
    }
    if (accumulator > interval) accumulator = 0;
  } else {
    lastTime = time;
    accumulator = 0;
  }
  draw();
  if (state.running || state.painting !== null) requestTick();
}

function applySize() {
  const [cols, rows] = sizeSelect.value.split("x").map(Number);
  const patternId = patternSelect.value;
  allocate(cols, rows);
  if (patternId) placePattern(patternId);
  else recount();
  layout();
  draw();
  syncStats();
}

function fillPatterns() {
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "手绘";
  patternSelect.append(blank);
  for (const pattern of PATTERNS) {
    const option = document.createElement("option");
    option.value = pattern.id;
    option.textContent = pattern.name;
    patternSelect.append(option);
  }
  patternSelect.value = "gun";
}

runButton.addEventListener("click", () => setRunning(!state.running));

stepButton.addEventListener("click", () => {
  setRunning(false);
  advance();
  requestTick();
});

clearButton.addEventListener("click", () => {
  setRunning(false);
  patternSelect.value = "";
  clearBoard();
  requestTick();
});

randomButton.addEventListener("click", () => {
  patternSelect.value = "";
  randomize();
  requestTick();
});

speedInput.addEventListener("input", () => {
  state.speed = Number(speedInput.value);
  speedValue.textContent = speedInput.value;
});

densityInput.addEventListener("input", () => {
  state.density = Number(densityInput.value) / 100;
  densityValue.textContent = `${densityInput.value}%`;
});

patternSelect.addEventListener("change", () => {
  if (!patternSelect.value) return;
  placePattern(patternSelect.value);
  requestTick();
});

sizeSelect.addEventListener("change", applySize);

wrapInput.addEventListener("change", () => {
  state.wrap = wrapInput.checked;
});

board.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const cell = cellFromEvent(event);
  if (cell.x < 0 || cell.y < 0 || cell.x >= state.cols || cell.y >= state.rows) return;
  state.wasRunning = state.running;
  setRunning(false);
  state.painting = state.grid[cell.y * state.cols + cell.x] ? 0 : 1;
  patternSelect.value = "";
  paintCell(cell.x, cell.y, state.painting);
  recount();
  board.setPointerCapture(event.pointerId);
  requestTick();
});

board.addEventListener("pointermove", (event) => {
  const cell = cellFromEvent(event);
  state.hover = cell;
  if (state.painting !== null) {
    paintCell(cell.x, cell.y, state.painting);
    recount();
  }
  requestTick();
});

function endPaint() {
  if (state.painting === null) return;
  state.painting = null;
  recount();
  if (state.wasRunning) setRunning(true);
  requestTick();
}

board.addEventListener("pointerup", endPaint);
board.addEventListener("pointercancel", endPaint);
board.addEventListener("pointerleave", () => {
  state.hover = null;
  requestTick();
});

board.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("keydown", (event) => {
  if (event.target.closest("input, select, textarea")) return;
  if (event.code === "Space") {
    event.preventDefault();
    setRunning(!state.running);
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    setRunning(false);
    advance();
    requestTick();
  } else if (event.key === "c" || event.key === "C") {
    setRunning(false);
    patternSelect.value = "";
    clearBoard();
    requestTick();
  } else if (event.key === "r" || event.key === "R") {
    patternSelect.value = "";
    randomize();
    requestTick();
  }
});

window.addEventListener("resize", () => requestTick());
new ResizeObserver(() => requestTick()).observe(stage);

fillPatterns();
placePattern("gun");
setRunning(state.running);
syncStats();
requestTick();
