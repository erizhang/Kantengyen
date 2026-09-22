// Conway's Game of Life. Pure grid logic, shared by the page and the tests.

export const PATTERNS = [
  {
    id: "gun",
    name: "滑翔机枪",
    anchor: "left",
    cells: [
      [24, 0],
      [22, 1], [24, 1],
      [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
      [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
      [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
      [10, 6], [16, 6], [24, 6],
      [11, 7], [15, 7],
      [12, 8], [13, 8],
    ],
  },
  {
    id: "glider",
    name: "滑翔机",
    cells: [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
  },
  {
    id: "lwss",
    name: "轻量飞船",
    cells: [
      [1, 0], [4, 0],
      [0, 1],
      [0, 2], [4, 2],
      [0, 3], [1, 3], [2, 3], [3, 3],
    ],
  },
  {
    id: "pulsar",
    name: "脉冲星",
    cells: [
      [4, 2], [5, 2], [6, 2], [10, 2], [11, 2], [12, 2],
      [2, 4], [7, 4], [9, 4], [14, 4],
      [2, 5], [7, 5], [9, 5], [14, 5],
      [2, 6], [7, 6], [9, 6], [14, 6],
      [4, 7], [5, 7], [6, 7], [10, 7], [11, 7], [12, 7],
      [4, 9], [5, 9], [6, 9], [10, 9], [11, 9], [12, 9],
      [2, 10], [7, 10], [9, 10], [14, 10],
      [2, 11], [7, 11], [9, 11], [14, 11],
      [2, 12], [7, 12], [9, 12], [14, 12],
      [4, 14], [5, 14], [6, 14], [10, 14], [11, 14], [12, 14],
    ],
  },
  {
    id: "toad",
    name: "蟾蜍",
    cells: [
      [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1],
    ],
  },
  {
    id: "blinker",
    name: "闪烁",
    cells: [
      [0, 1], [1, 1], [2, 1],
    ],
  },
  {
    id: "beacon",
    name: "信标",
    cells: [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
      [2, 2], [3, 2],
      [2, 3], [3, 3],
    ],
  },
  {
    id: "block",
    name: "方块",
    cells: [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ],
  },
];

export function createGrid(cols, rows) {
  return new Uint8Array(cols * rows);
}

// One generation. `src` is read, `dst` is replaced. Edges wrap when `wrap` is set.
export function step(src, dst, cols, rows, wrap) {
  const size = cols * rows;
  for (let i = 0; i < size; i++) {
    const x = i % cols;
    const y = (i / cols) | 0;
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;
        if (wrap) {
          if (nx < 0) nx += cols;
          else if (nx >= cols) nx -= cols;
          if (ny < 0) ny += rows;
          else if (ny >= rows) ny -= rows;
        } else if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) {
          continue;
        }
        count += src[ny * cols + nx];
      }
    }
    const alive = src[i];
    dst[i] = count === 3 || (alive && count === 2) ? 1 : 0;
  }
}

export function population(grid) {
  let count = 0;
  for (let i = 0; i < grid.length; i++) count += grid[i];
  return count;
}
