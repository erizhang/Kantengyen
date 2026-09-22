import assert from "node:assert/strict";
import test from "node:test";
import { PATTERNS, createGrid, population, step } from "./life.js";

function stamp(grid, cols, cells, ox = 0, oy = 0) {
  for (const [x, y] of cells) grid[(y + oy) * cols + (x + ox)] = 1;
}

function aliveCells(grid, cols) {
  const cells = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) cells.push([i % cols, (i / cols) | 0]);
  }
  return cells;
}

function run(grid, cols, rows, generations, wrap = false) {
  let current = grid;
  let next = createGrid(cols, rows);
  for (let i = 0; i < generations; i++) {
    step(current, next, cols, rows, wrap);
    const swap = current;
    current = next;
    next = swap;
  }
  return current;
}

function snapshot(grid, cols) {
  return aliveCells(grid, cols).map(([x, y]) => [x, y]);
}

test("a block stays still", () => {
  const cols = 6;
  const rows = 6;
  const grid = createGrid(cols, rows);
  stamp(grid, cols, PATTERNS.find((p) => p.id === "block").cells, 2, 2);
  const next = run(grid, cols, rows, 1);
  assert.deepEqual(aliveCells(next, cols), [
    [2, 2], [3, 2],
    [2, 3], [3, 3],
  ]);
});

test("a blinker oscillates", () => {
  const cols = 5;
  const rows = 5;
  const grid = createGrid(cols, rows);
  stamp(grid, cols, PATTERNS.find((p) => p.id === "blinker").cells, 1, 1);
  const next = run(grid, cols, rows, 1);
  assert.deepEqual(aliveCells(next, cols), [
    [2, 1],
    [2, 2],
    [2, 3],
  ]);
  const back = run(next, cols, rows, 1);
  assert.deepEqual(aliveCells(back, cols), aliveCells(grid, cols));
});

test("a glider translates after four generations", () => {
  const cols = 10;
  const rows = 10;
  const grid = createGrid(cols, rows);
  stamp(grid, cols, PATTERNS.find((p) => p.id === "glider").cells, 1, 1);
  const start = snapshot(grid, cols);
  const next = run(grid, cols, rows, 4);
  assert.deepEqual(
    aliveCells(next, cols),
    start.map(([x, y]) => [x + 1, y + 1]),
  );
});

test("a pulsar returns after three generations", () => {
  const pattern = PATTERNS.find((p) => p.id === "pulsar");
  const cols = 17;
  const rows = 17;
  const grid = createGrid(cols, rows);
  stamp(grid, cols, pattern.cells, 1, 1);
  const start = snapshot(grid, cols);
  assert.equal(start.length, 48);
  const mid = run(Uint8Array.from(grid), cols, rows, 1);
  assert.notDeepEqual(aliveCells(mid, cols), start);
  const back = run(Uint8Array.from(grid), cols, rows, 3);
  assert.deepEqual(aliveCells(back, cols), start);
});

test("neighbors wrap around the edges", () => {
  const cols = 5;
  const rows = 3;
  const grid = createGrid(cols, rows);
  grid[1 * cols + (cols - 1)] = 1;
  grid[1 * cols + 0] = 1;
  grid[1 * cols + 1] = 1;
  const next = run(grid, cols, rows, 1, true);
  assert.deepEqual(aliveCells(next, cols), [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
});
