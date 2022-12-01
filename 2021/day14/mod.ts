/*
    Day 14 of Advent of Code 2021
    Attempted with TS in Deno
*/

// have the insertion rules be saved with the format where
// key is pair and value is the polymer to be added in the
// middle
interface InsertionRules {
  [key: string]: string;
}

interface PolymerCounts {
  [key: string]: number; // NN: 5, CB: 4
}

function pairsFromTemplate(template: string): string[] {
  const len = template.length;
  const pairs = [] as string[];
  for (let i = 0; i < len - 1; i++) {
    pairs.push(`${template[i]}${template[i + 1]}`);
  }
  return pairs;
}

function readFileToArray(filename: string): [string, InsertionRules] {
  const insertionRules = {} as InsertionRules;
  let template = "";
  const data = Deno.readTextFileSync(filename).split("\n");
  for (const item of data) {
    if (item.includes(" -> ")) {
      const [k, v] = item.split(" -> ");
      insertionRules[k] = v;
    } else if (item !== "") {
      template = item;
    }
  }
  return [template, insertionRules];
}

function initializePolymerWithTemplate(template: string): PolymerCounts {
  const templatePairs = pairsFromTemplate(template);
  const startingObj = {} as PolymerCounts;
  for (const pair of templatePairs) {
    const currentKeys = Object.keys(startingObj);
    handleAdditionToObject(currentKeys, pair, startingObj);
  }
  return startingObj;
}

function handleAdditionToObject(
  currentKeys: string[],
  pair: string,
  startingObj: PolymerCounts,
  value = 1,
) {
  if (!currentKeys.includes(pair)) {
    startingObj[pair] = value;
  } else {
    const currentVal = startingObj[pair];
    if (value > 1) {
      startingObj[pair] = currentVal;
    } else {
      startingObj[pair] = currentVal + 1;
    }
  }
}

function makeCountOfElementFromPairs(polymer: PolymerCounts, lastChar: string) {
  const existingPairs = Object.keys(polymer).filter((key) => polymer[key] > 0);
  const uniqChars = new Set(existingPairs.join("").split(""));
  const obj = {} as PolymerCounts;
  for (const char of uniqChars) {
    obj[char] = 0;
  }
  let pair = existingPairs.shift();
  while (pair) {
    if (polymer[pair] > 0) {
      const currentCount = obj[pair[0]];
      obj[pair[0]] = currentCount + polymer[pair];
      const secondChar = pair[1];
      const nextIndex = existingPairs.findIndex((item) =>
        item[0] === secondChar
      );
      pair = existingPairs.splice(nextIndex, 1)[0];
    } else {
      pair = undefined;
      if (existingPairs.length > 0) {
        pair = existingPairs.shift();
      }
    }
  }
  const curVal = obj[lastChar];
  obj[lastChar] = curVal + 1;
  const values = Object.values(obj);
  console.log(`Difference is ${Math.max(...values) - Math.min(...values)}`);
}

function main(filename: string) {
  const [template, rules] = readFileToArray(filename);
  const lastChar = template[template.length - 1];
  let startingPairsCount = initializePolymerWithTemplate(template);

  for (let i = 1; i <= 40; i++) {
    const existingPairs = Object.keys(startingPairsCount).filter((key) =>
      startingPairsCount[key] > 0
    );
    const tempObj = {} as PolymerCounts;
    for (const pair of existingPairs) {
      const middleElement = rules[pair];
      const pairOccurences = startingPairsCount[pair];
      [`${pair[0]}${middleElement}`, `${middleElement}${pair[1]}`].forEach(
        (newPair) => {
          let currentValue = 0;
          if (Object.keys(tempObj).includes(newPair)) {
            currentValue = tempObj[newPair];
          }
          tempObj[newPair] = currentValue + pairOccurences;
        },
      );
    }
    startingPairsCount = { ...tempObj };
  }

  makeCountOfElementFromPairs(startingPairsCount, lastChar);
  console.log(
    `counts is ${Object.values(startingPairsCount).reduce((s, c) => s + c, 0)}`,
  );
}

main("./input-data");

// Difference
