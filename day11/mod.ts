/*
    Day 11 of Advent of Code 2021
    Solution attempted in TS and Deno
*/

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function makeLinesToDigits(line: string): number[] {
  return line.split("").map((i) => parseInt(i));
}

function main(filename: string, steps: number) {
  const data = [] as number[][];
  for (const line of readFileToArray(filename)) {
    data.push(makeLinesToDigits(line));
  }
  /*
    - The edge rows and columns need to be handled separately
    For each position the impacted positions need to tracked,
    unless that position has already flashed, in which case their
    value should be 0 in the next iteration
  */
  const maxRow = data.length;
  const maxCol = data[0].length;
  let flashCounter = 0;
  for (let k = 1; k <= steps; k++) {
    const flashedPositions = initializeEmptyArrayOfArrays(maxRow);
    for (let i = 0; i < maxRow; i++) {
      for (let j = 0; j < maxCol; j++) {
        if (willFlash([i, j], data) && !flashedPositions[i].includes(j)) {
          updatePositionWithFlash([i, j], data);
          flashCounter += 1;
          flashedPositions[i].push(j);
          let impactedLocations = impactedPositions([i, j], maxRow, maxCol);
          while (impactedLocations.length > 0) {
            const thisPosition = impactedLocations.pop();
            if (thisPosition) {
              if (willFlash([thisPosition[0], thisPosition[1]], data)) {
                if (
                  !flashedPositions[thisPosition[0]].includes(thisPosition[1])
                ) {
                  updatePositionWithFlash(thisPosition, data);
                  flashCounter += 1;
                  impactedLocations = [
                    ...impactedLocations,
                    ...impactedPositions(thisPosition, maxRow, maxCol),
                  ];
                  flashedPositions[thisPosition[0]].push(thisPosition[1]);
                }
              } else {
                if (
                  !flashedPositions[thisPosition[0]].includes(thisPosition[1])
                ) {
                  updatePositionCount([thisPosition[0], thisPosition[1]], data);
                }
              }
            }
          }
        } else {
          if (!flashedPositions[i].includes(j)) {
            updatePositionCount([i, j], data);
          }
        }
      }
    }
    // console.log(`End of step ${k}`);
    // console.log(data.map((i) => i.join("")));
    // console.log(flashCounter);
    if (checkAllFlashes(data, maxRow, maxCol)) {
      console.log(`It happened on iteration number ${k}`);
      break;
    }
  }
}

type Position = [number, number];

function checkAllFlashes(
  data: number[][],
  maxRow: number,
  maxCol: number,
): boolean {
  let allZeros = true;
  for (let i = 0; i < maxRow; i++) {
    if (allZeros) {
      for (let j = 0; j < maxCol; j++) {
        if (data[i][j] !== 0) {
          allZeros = false;
          break;
        }
      }
    }
  }
  return allZeros;
}

function updatePositionWithFlash(position: Position, data: number[][]) {
  data[position[0]][position[1]] = 0;
}

function initializeEmptyArrayOfArrays(rowCount: number): Array<Array<number>> {
  const arr = [];
  for (let i = 0; i < rowCount; i++) {
    arr.push([]);
  }
  return arr;
}

function updatePositionCount(position: Position, data: number[][]) {
  const temp = data[position[0]][position[1]];
  data[position[0]][position[1]] = temp + 1;
}

function willFlash(position: Position, data: number[][]): boolean {
  if (data[position[0]][position[1]] === 9) return true;
  return false;
}

function impactedPositions(
  position: Position,
  maxRow: number,
  maxCol: number,
): Position[] {
  const impactedPositions = [];
  impactedPositions.push(position);
  const [row, column] = position;
  for (let i = row - 1; i <= row + 1; i++) {
    if (i >= 0 && i <= maxRow - 1) {
      for (let j = column - 1; j <= column + 1; j++) {
        if (j >= 0 && j <= maxCol - 1) {
          impactedPositions.push([i, j] as Position);
        }
      }
    }
  }
  return impactedPositions;
}

main("./input-data", 500);
