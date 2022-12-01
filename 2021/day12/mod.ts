/*
    Day 12 of Advent of Code 2021
    Attempted in TS and Deno
*/

// WARNING!!!!!
// Computationally expensive right now
// 33s - cahing didn't impact this

main("input-data");

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function memoizedFindNext() {
  const cache = {} as { [key: string]: string[][] };
  return function findNextOptionsInside(
    char: string,
    data: Array<string[]>,
  ): string[][] {
    if (Object.keys(cache).includes(char)) {
      return cache[char];
    } else {
      const options = [] as string[][];
      data.forEach((item) => {
        if (item.includes(char)) options.push(item);
      });
      cache[char] = options;
      return options;
    }
  };
}

function otherEnd<T>(char: T, data: T[]): T[] {
  const cache = {} as { [key: string]: string[] };
  return data.filter((item) => item !== char);
}

// TODO: instead of using arrays, try to use objects instead
/*
    To use objects instead try the following algorithm to see if possible:
    1. Pick out all the unique characters from the data
    2. Each character will become the key and their value will be all of the
    caves to which they can connect
    3. Now for every cave, finding the options to which that cave can connect
    will be significantly faster than the current filtering with includes
    4. Next see the optimum data-structure for handling each path
*/

/*
    Ideally there would be a data-structure that would perfectly fit this case
    The idea is to form a chain, i.e. for any position wherein there are multiple
    options to proceed, a new option needs to be added for consideration to all
    potential cases
    Imagine a stack containing all of the possible options
*/
function main(filename: string) {
  const start = Date.now();
  let data = readFileToArray(filename).map((item) => item.split("-"));
  const potentialPaths = [] as string[][];
  const findNextOptions = memoizedFindNext();
  findNextOptions("start", data).forEach((item) => {
    potentialPaths.push(["start", otherEnd("start", item).join("")]);
  });
  // remove start points from data
  data = [...data.filter((item) => !item.includes("start"))];
  const finalizedPaths = [];
  while (potentialPaths.length > 0) {
    const path = potentialPaths.shift();
    if (path) {
      const lastChar = path[path.length - 1];
      if (lastChar !== "end") {
        const copyOfPath = [...path];
        findNextOptions(lastChar, data).forEach((nextOption) => {
          const nextEnd = otherEnd(lastChar, nextOption).join("");
          if (nextEnd !== nextEnd.toLowerCase()) {
            potentialPaths.push([...copyOfPath, nextEnd]);
          } else if (!path.includes(nextEnd)) {
            potentialPaths.push([...copyOfPath, nextEnd]);
          } else {
            const visitedCaves = new Set();
            let hasVisitedASmallCaveMoreThanOnce = false;
            path.filter((item) => item === item.toLowerCase()).forEach(
              (cave) => {
                if (!visitedCaves.has(cave)) {
                  visitedCaves.add(cave);
                } else {
                  hasVisitedASmallCaveMoreThanOnce = true;
                }
              },
            );
            if (!hasVisitedASmallCaveMoreThanOnce) {
              potentialPaths.push([...copyOfPath, nextEnd]);
            }
          }
        });
      } else {
        finalizedPaths.push(path);
      }
    }
  }
  //   console.log(potentialPaths.map((item) => item.join(",")).join("\n"));
  console.log(finalizedPaths.length);
  console.log(`Total time taken was ${(Date.now() - start) / 1000}s`);
}
