/*
  Day 4 of Advent of Code 2021
  Exercise attempted in Deno-TS
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

type RowCount = `row-${number}`;
type ColumnCount = `column-${number}`;

interface Board {
  [key: RowCount | ColumnCount]: number[];
}

// row and columns of board are 0 indexed
function initializeBoard(gridSize: number): Board {
  const board = {} as Board;
  for (let i = 0; i < gridSize; i++) {
    board[`row-${i}`] = [];
    board[`column-${i}`] = [];
  }
  return board;
}

function createNextBoard(data: string[], startPosition: number, gridSize = 5) {
  const regExp = /[ ]+/;
  const board = initializeBoard(gridSize);
  for (let i = startPosition; i < startPosition + gridSize; i++) {
    const rowData = data[i]
      .split(regExp)
      .filter((item) => item !== "")
      .map((strNum) => parseInt(strNum));
    board[`row-${i - startPosition}`] = [...rowData];
    for (let j = 0; j < gridSize; j++) {
      board[`column-${j}`].push(rowData[j]);
    }
  }
  return board;
}

function readFileToCallAndBoard(filename: string): [number[], Board[]] {
  const data = Deno.readTextFileSync(filename).split("\n");
  const boards = [];
  if (data.length < 6) {
    throw new Error("Dataset provided is incompatible");
  }
  // Assuming that the first line will always be the order of call
  const orderOfCall = data[0].split(",").map((strNum) => parseInt(strNum));
  for (let i = 1; i < data.length; i++) {
    if (data[i] === "") {
      boards.push(createNextBoard(data, i + 1));
    }
  }
  return [orderOfCall, boards];
}

function winningScore(board: Board, call: number): number {
  let sum = 0;
  (Object.keys(board) as Array<keyof typeof board>)
    .filter((key) => key.includes("row"))
    .forEach((row) => board[row].forEach((num) => (sum += num)));
  return sum * call;
}

function processCallsOnBoards([orderOfCall, boards]: [
  number[],
  Board[],
]): number {
  let winnerFound = false;
  let winnerScore = 0;
  for (const call of orderOfCall) {
    const winnerIndex = [] as number[];
    boards.forEach((board, index) => {
      (Object.keys(board) as Array<keyof typeof board>).forEach(
        (rowColumn) => (board[rowColumn] = board[rowColumn].filter(
          (number) => number !== call,
        )),
      );
      for (const rowColumn of Object.keys(board) as Array<keyof typeof board>) {
        if (board[rowColumn].length === 0) {
          winnerScore = winningScore(board, call);
          winnerFound = true;
          winnerIndex.push(index);
          break;
        }
      }
    });
    let a = winnerIndex.pop();
    while (a) {
      boards.splice(a, 1);
      a = winnerIndex.pop();
    }
    if (winnerFound && boards.length === 1) break;
  }
  return winnerScore;
}

console.log(processCallsOnBoards(readFileToCallAndBoard("./input-data")));

Deno.test("Test data should have winning score of 4512", () => {
  assertEquals(
    processCallsOnBoards(readFileToCallAndBoard("./test-data")),
    4512,
  );
});

Deno.test("Test data should have the last winning score of 1924", () => {
  assertEquals(
    processCallsOnBoards(readFileToCallAndBoard("./test-data")),
    1924,
  );
});
