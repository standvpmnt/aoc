// deno-lint-ignore-file
/*
    Day 15 of Advent of Code 2021
    Attempted in TS with Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

import dijkstra from "https://deno.land/x/dijkstra/mod.ts";

main("./input-data");

type Grid = number[][];
type Index = [number, number];

function main(filename: string) {
  const startTime = Date.now();
  let grid = readFileToArray(filename);
  //   TODO expandedGrid is returning wrong answer for input but correct for test;
  grid = [...expandedGrid(grid)];
  const [rowCount, colCount] = sizeOfGrid(grid);
  const gridIndices = [] as Index[];
  const paths = {} as { [key: string]: number };
  for (let i = rowCount - 1; i >= 0; i--) {
    for (let j = colCount - 1; j >= 0; j--) {
      gridIndices.push([i, j]);
      paths[String([i, j])] = Infinity;
    }
  }
  //   paths["0,0"] = grid[0][0];
  // As per rule starting position is never entered so its risk is not counted
  paths["0,0"] = 0;

  const graph = {} as { [key: string]: { [key: string]: number } };

  for (const index of gridIndices) {
    console.log(`onIndex ${index}`);
    const options = nextPositionsFromLocation(index, [rowCount, colCount]);
    const pathsAvailable = {} as { [key: string]: number };
    for (const option of options) {
      pathsAvailable[String(option)] = grid[option[0]][option[1]];
    }
    if (Object.keys(graph).includes(String(index))) {
      const existinData = { ...graph[String(index)] };
      graph[String(index)] = { ...existinData, ...pathsAvailable };
    } else {
      graph[String(index)] = pathsAvailable;
    }
  }

  const creationTime = Date.now() - startTime;
  console.log(`Graph created in ${creationTime}`);
  const path = dijkstra.find_path(graph, "0,0", "499,499");
  console.log(`Algo ran in ${Date.now() - creationTime}`);
  const indices = path.map((strIndex) => strIndex.split(",").map(Number));
  const totalRisk = indices.map((index) => grid[index[0]][index[1]]);
  console.log(
    `Risk here is ${totalRisk.reduce((s, c) => s + c, 0) - grid[0][0]}`,
  );

  while (gridIndices.length > 0) {
    const currentIndex = gridIndices.pop();
    const currentRiskLevel = paths[String(currentIndex)];

    if (currentIndex) {
      const options = nextPositionsFromLocation(currentIndex, [
        rowCount,
        colCount,
      ]);
      for (const option of options) {
        // update the distances object with the adjacent indices
        //   replace the distance value if it is smaller, distance will be
        const positionsRiskLevel = grid[option[0]][option[1]];
        const riskToThisPoint = positionsRiskLevel + currentRiskLevel;
        if (riskToThisPoint < paths[String(option)]) {
          paths[String(option)] = riskToThisPoint;
        }
      }
    }
  }
  console.log(`Time taken: ${Date.now() - startTime}`);
  console.log(
    `The total risk level to [${rowCount - 1}, ${colCount - 1}] is ${
      paths[String([rowCount - 1, colCount - 1])]
    }`,
  );
}

function expandedGrid(grid: Grid, multiplier = 5): Grid {
  const oldColCount = grid[0].length;
  const oldRowCount = grid.length;
  const newColCount = oldColCount * multiplier;
  const newRowCount = oldRowCount * multiplier;

  const fullGrid = Array.from(
    { length: newRowCount },
    (_, y) =>
      Array.from({ length: newColCount }, (_, x) => {
        return (
          ((grid[y % oldRowCount][x % oldColCount] +
            Math.floor(y / oldRowCount) +
            Math.floor(x / oldColCount) -
            1) %
            9) +
          1
        );
      }),
  );
  return fullGrid;
}

function isWithinGrid(position: Index, [maxR, maxC]: Index): boolean {
  if (position[0] < 0 || position[1] < 0) return false;
  else if (position[0] >= maxR || position[1] >= maxC) return false;
  else return true;
}

function isOnDiagonal(position: Index, secondPosition: Index): boolean {
  return Math.abs(secondPosition[0] - position[0]) ===
    Math.abs(secondPosition[1] - position[1]);
}

function nextPositionsFromLocation(
  [r, c]: Index,
  [maxR, maxC]: Index,
): Index[] {
  const rowOptions = [r - 1, r, r + 1];
  const colOptions = [c - 1, c, c + 1];
  const options = [] as Index[];
  for (const ro of rowOptions) {
    for (const co of colOptions) {
      options.push([ro, co]);
    }
  }
  const allowedPositions = options.filter((position) =>
    isWithinGrid(position, [maxR, maxC]) && !isOnDiagonal(position, [r, c])
  );
  return allowedPositions;
}

function readFileToArray(filename: string): Grid {
  return Deno.readTextFileSync(filename).split("\n").map((item) =>
    item.split("").map((val) => parseInt(val))
  );
}

function sizeOfGrid(grid: Grid): [number, number] {
  const rowCount = grid.length;
  const colCount = grid[0].length;
  return [rowCount, colCount];
}

Deno.test("negative indexes should not be allowed", () => {
  assertEquals(isWithinGrid([-1, 0], [10, 10]), false);
  assertEquals(isWithinGrid([2, -1], [5, 4]), false);
  assertEquals(isWithinGrid([6, 4], [5, 5]), false);
  assertEquals(isWithinGrid([3, 6], [5, 5]), false);
  assertEquals(isOnDiagonal([1, 1], [5, 5]), true);
  assertEquals(isOnDiagonal([2, 4], [3, 5]), true);
});
