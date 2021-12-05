/*
    Day 5 of Advent of Code 2021
    Done with TS on Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

type Line = number[][];
type Grid = string[][];

function readFileToArray(filename: string): Line[] {
  const lines = Deno.readTextFileSync(filename).split("\n");
  const a = lines.map((line) => {
    const b: number[][] = [];
    line.split(" -> ").forEach((item) => {
      const temp = item.split(",").map((item) => parseInt(item));
      b.push(temp);
    });
    return b;
  });
  return a;
}

function horizontalVerticalLinesOnly(lines: Line[]): Line[] {
  return lines.filter((line) =>
    line[0][0] === line[1][0] || line[0][1] === line[1][1]
  );
}

function pureDiagonalLinesAlso(lines: Line[]): Line[] {
  return lines.filter((line) =>
    line[0][0] === line[1][0] || line[0][1] === line[1][1] || pureDiagonal(line)
  );
}

function pureDiagonal(line: Line): boolean {
  return Math.abs(line[0][0] - line[1][0]) ===
    Math.abs(line[0][1] - line[1][1]);
}

function getGridSize(lines: Line[]): [number, number] {
  let [maxX, maxY] = [0, 0];
  lines.forEach((line) => {
    if (line[1][0] > maxX) maxX = line[1][0];
    if (line[0][0] > maxX) maxX = line[0][0];
    if (line[1][1] > maxY) maxY = line[1][1];
    if (line[0][1] > maxY) maxY = line[0][1];
  });
  return [maxX, maxY];
}

function createGrid(size: [number, number], relevantLines: Line[]) {
  // Assuming square grid
  const gridSize = size[0] > size[1] ? size[0] + 1 : size[1] + 1;
  const grid = Array.from(Array(gridSize).keys()).map((_i) =>
    initializeGrid(gridSize)
  );
  let pointsGone = [] as Line;
  relevantLines.forEach((line) =>
    pointsGone = [...pointsGone, ...getPointsGone(line)]
  );
  updateGrid(grid, pointsGone);
}

function updateGrid(grid: Grid, pointsGone: number[][]) {
  //   console.log(grid);
  for (const point of pointsGone) {
    // console.log(`x is ${point[0]} and y is ${point[1]}`);
    // console.log(grid[point[0]]);
    if (grid[point[0]][point[1]] === ".") {
      grid[point[0]][point[1]] = "1";
    } else {
      const num = parseInt(grid[point[0]][point[1]]);
      grid[point[0]][point[1]] = String(num + 1);
    }
  }
  reportOnGridStatus(grid);
}

function reportOnGridStatus(grid: Grid) {
  let count = 0;
  for (const line of grid) {
    for (const item of line) {
      if (parseInt(item) >= 2) {
        count += 1;
      }
    }
  }
  console.log(`2 or more counts is ${count}`);
}

function initializeGrid(size: number): string[] {
  return Array.from(Array(size).keys()).map((_i) => ".");
}

function getPointsGone(line: Line): Line {
  const points = [];
  let [maxX, minX, maxY, minY] = [0, 0, 0, 0];
  if (line[0][0] > line[1][0]) {
    maxX = line[0][0];
    minX = line[1][0];
  } else {
    maxX = line[1][0];
    minX = line[0][0];
  }
  if (line[0][1] > line[1][1]) {
    maxY = line[0][1];
    minY = line[1][1];
  } else {
    maxY = line[1][1];
    minY = line[0][1];
  }
  if (pureDiagonal(line)) {
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (Math.abs(i - line[0][0]) === Math.abs(j - line[0][1])) {
          points.push([i, j]);
        }
      }
    }
  } else {
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        points.push([i, j]);
      }
    }
  }
  return points;
}

console.log(
  createGrid(
    getGridSize(readFileToArray("./input-data")),
    // horizontalVerticalLinesOnly(readFileToArray("./input-data")),
    pureDiagonalLinesAlso(readFileToArray("./input-data")),
  ),
);

Deno.test("check setup", () => assertEquals(5, 5));
