/*
    Day 12 of Advent of Code 2021
    Attempted in TS and Deno
*/

main("input-data");

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function findNextOptions<T>(char: T, data: Array<T[]>): T[][] {
  const options = [] as T[][];
  data.forEach((item) => {
    if (item.includes(char)) options.push(item);
  });
  return options;
}

function otherEnd<T>(char: T, data: T[]): T[] {
  return data.filter((item) => item !== char);
}

function checkAllPathsHaveEnded(paths: string[][]): boolean {
  let haveEnded = true;
  for (const path of paths) {
    if (path[path.length - 1] !== "end") {
      haveEnded = false;
      break;
    }
  }
  return haveEnded;
}

/*
    Ideally there would be a data-structure that would perfectly fit this case
    The idea is to form a chain, i.e. for any position wherein there are multiple
    options to proceed, a new option needs to be added for consideration to all
    potential cases
    Imagine a stack containing all of the possible options
*/
function main(filename: string) {
  let data = readFileToArray(filename).map((item) => item.split("-"));
  const potentialPaths = [] as string[][];
  findNextOptions("start", data).forEach((item) => {
    potentialPaths.push(["start", otherEnd("start", item).join("")]);
  });
  // remove start points from data
  data = [...data.filter((item) => !item.includes("start"))];
  while (!checkAllPathsHaveEnded(potentialPaths)) {
    const startWhile = Date.now();
    const path = potentialPaths.shift();
    if (path) {
      const lastChar = path[path.length - 1];
      if (lastChar !== "end") {
        const copyOfPath = [...path];
        findNextOptions(lastChar, data).forEach((nextOption) => {
          const startOptionsFiltering = Date.now();
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
          console.log(
            `Took ${
              (Date.now() - startOptionsFiltering) / 1000
            }s in findNextOption Loop`,
          );
        });
      } else {
        potentialPaths.push(path);
      }
    }
    console.log(`Took ${(Date.now() - startWhile) / 1000}s in while loop`);
  }
  //   console.log(potentialPaths.map((item) => item.join(",")).join("\n"));
  console.log(potentialPaths.length);
}
