/*
    Day 13 of Advent of Code 2021
    Attempted in TS with Deno
*/

type Point = [number, number];
type Fold = [string, number];

main("./input-data");

function main(filename: string) {
  let [points, folds] = readFileToArray(filename);
  folds.forEach((fold, index) => {
    if (index < 50) {
      const currentFold = identifyFoldDetails(fold);
      points = [...updateDataWithFold(currentFold, points)];
    }
  });
  console.log(points.length);
  plotOutput(points);
}

function getRowsAndCols(points: Point[]): [number, number] {
  const x = [] as number[];
  const y = [] as number[];
  points.forEach((item) => {
    x.push(item[0]);
    y.push(item[1]);
  });
  const cols = Math.max(...x);
  const rows = Math.max(...y);
  return [rows, cols];
}

function plotOutput(points: Point[]): void {
  const [rows, cols] = getRowsAndCols(points);
  const plainPlot = [] as string[][];
  for (let i = 0; i <= rows; i++) {
    plainPlot.push([]);
    for (let j = 0; j <= cols; j++) {
      plainPlot[i].push(".");
    }
  }
  points.forEach((item) => plainPlot[item[1]][item[0]] = "#");
  console.log(plainPlot.map((item) => item.join("")).join("\n"));
}

function containsPoint(data: Point[], point: Point): boolean {
  let contains = false;
  const len = data.length;
  for (let i = 0; i < len; i++) {
    if (data[i].join(",").trim() === point.join(",").trim()) {
      contains = true;
      break;
    }
  }
  return contains;
}

function updateDataWithFold(fold: Fold, data: Point[]): Point[] {
  const concernedIndex = fold[0] === "x" ? 0 : 1;
  const foldPosition = fold[1];
  const updatedPositions = [] as Point[];
  data.forEach((point) => {
    if (point[concernedIndex] < foldPosition) {
      if (!containsPoint(updatedPositions, point)) {
        updatedPositions.push(point);
      }
    } else if (point[concernedIndex] > foldPosition) {
      const newPoint = [0, 0] as Point;
      newPoint[concernedIndex] = (foldPosition * 2) - point[concernedIndex];
      newPoint[1 - concernedIndex] = point[1 - concernedIndex];
      if (!containsPoint(updatedPositions, newPoint)) {
        updatedPositions.push(newPoint);
      }
    } else {
      throw new Error("THIS WAS NOT EXPECTED!");
    }
  });
  return updatedPositions;
}

function identifyFoldDetails(foldDetails: string): Fold {
  const [axis, point] = foldDetails.split("=");
  return [axis, parseInt(point)];
}

function readFileToArray(filename: string): [Point[], string[]] {
  const folds = [] as string[];
  const data = [] as Point[];
  Deno.readTextFileSync(filename).split("\n").forEach((item) => {
    if (item !== "") {
      if (item.includes("fold")) {
        const foldDetails = item.split("=");
        folds.push([foldDetails[0].slice(-1), "=", foldDetails[1]].join(""));
      } else {
        data.push(
          item.split(",").map((element) => parseInt(element)) as Point,
        );
      }
    }
  });
  return [data, folds];
}
