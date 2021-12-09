/*
    Day 9 of Advent of Code 2021
    Attempted on Deno with TS
*/

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function arrangeDataToArray(data: string[]): number[][] {
  const formattedData = [];
  for (const line of data) {
    formattedData.push(line.split("").map((strNum) => parseInt(strNum)));
  }
  return formattedData;
}

function findLocalLowest(data: number[][]): number[] {
  const numRows = data.length;
  const numCols = data[0].length;
  const minimums = [];
  const minPositions = [];
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let [checkLeft, checkRight, checkTop, checkBottom] = boundaryChecks(
        i,
        j,
        numRows,
        numCols,
      );
      let lowPos = [i, j];
      [checkLeft, checkRight, checkTop, checkBottom].forEach((item, index) => {
        if (item) {
          if (index === 0) {
            if (isLeftSmaller([i, j], data)) {
              lowPos = [i, j - 1];
            }
          } else if (index === 1) {
            if (isRightSmaller([i, j], data)) {
              lowPos = [i, j + 1];
            }
          } else if (index === 2) {
            if (isTopSmaller([i, j], data)) {
              lowPos = [i - 1, j];
            }
          } else if (index === 3) {
            if (isBottomSmaller([i, j], data)) {
              lowPos = [i + 1, j];
            }
          }
        }
      });
      const [minR, minC] = lowPos;
      if (minR === i && minC === j) {
        minimums.push(data[i][j]);
        minPositions.push([i, j]);
      }
    }
  }

  const finalData = [];

  for (const aPos of minPositions) {
    const relevantPositions = [] as Array<Set<number>>;
    for (let i = 0; i < numRows; i++) {
      relevantPositions.push(new Set());
    }
    const alsoCheckPositions = [aPos] as [number, number][];
    while (alsoCheckPositions.length > 0) {
      const position = alsoCheckPositions.shift();
      if (position !== undefined) {
        const [i, j] = position;
        relevantPositions[i].add(j);
        let [checkLeft, checkRight, checkTop, checkBottom] = boundaryChecks(
          i,
          j,
          numRows,
          numCols,
        );
        [checkLeft, checkRight, checkTop, checkBottom].forEach(
          (item, index) => {
            if (item) {
              if (index === 0) {
                if (!isLeftSmaller([i, j], data) && data[i][j - 1] !== 9) {
                  if (!relevantPositions[i].has(j - 1)) {
                    relevantPositions[i].add(j - 1);
                    alsoCheckPositions.push([i, j - 1]);
                  }
                }
              } else if (index === 1) {
                if (!isRightSmaller([i, j], data) && data[i][j + 1] !== 9) {
                  if (!relevantPositions[i].has(j + 1)) {
                    relevantPositions[i].add(j + 1);
                    alsoCheckPositions.push([i, j + 1]);
                  }
                }
              } else if (index === 2) {
                if (!isTopSmaller([i, j], data) && data[i - 1][j] !== 9) {
                  if (!relevantPositions[i - 1].has(j)) {
                    relevantPositions[i - 1].add(j);
                    alsoCheckPositions.push([i - 1, j]);
                  }
                }
              } else if (index === 3) {
                if (!isBottomSmaller([i, j], data) && data[i + 1][j] !== 9) {
                  if (!relevantPositions[i + 1].has(j)) {
                    relevantPositions[i + 1].add(j);
                    alsoCheckPositions.push([i + 1, j]);
                  }
                }
              }
            }
          },
        );
      }
    }
    finalData.push(relevantPositions);
  }
  const counts = finalData.map((
    item,
  ) => (item.reduce((sum, count) => count.size + sum, 0)));

  const topThree = [];
  for (let i = 0; i < 3; i++) {
    const num = Math.max(...counts);
    const ind = counts.findIndex((item) => item === num);
    topThree.push(num);
    counts.splice(ind, 1);
  }
  console.log(topThree[0] * topThree[1] * topThree[2]);

  return minimums;
}

function boundaryChecks(
  i: number,
  j: number,
  numRows: number,
  numCols: number,
): [boolean, boolean, boolean, boolean] {
  let [checkLeft, checkRight, checkTop, checkBottom] = [
    true,
    true,
    true,
    true,
  ];
  if (i === 0) {
    checkTop = false;
  }
  if (i === numRows - 1) {
    checkBottom = false;
  }
  if (j === 0) {
    checkLeft = false;
  }
  if (j === numCols - 1) {
    checkRight = false;
  }
  return [checkLeft, checkRight, checkTop, checkBottom];
}

function isRightSmaller(
  position: [number, number],
  array: number[][],
): boolean {
  return array[position[0]][position[1] + 1] <=
    array[position[0]][position[1]];
}
function isLeftSmaller(position: [number, number], array: number[][]): boolean {
  return array[position[0]][position[1] - 1] <=
    array[position[0]][position[1]];
}
function isTopSmaller(position: [number, number], array: number[][]): boolean {
  return array[position[0] - 1][position[1]] <=
    array[position[0]][position[1]];
}
function isBottomSmaller(
  position: [number, number],
  array: number[][],
): boolean {
  return array[position[0] + 1][position[1]] <=
    array[position[0]][position[1]];
}

const arrays = findLocalLowest(
  arrangeDataToArray(readFileToArray("input-data")),
);

// console.log(arrays.reduce((sum, value) => sum + value + 1, 0));
