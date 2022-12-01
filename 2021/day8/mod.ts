/*
    Day 8 of Advent of Code 2021
    Attempted on TS with Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

function readInputToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function getObservationAndOutput(lines: string[]): string[][][] {
  const formattedData = [];
  for (const line of lines) {
    const observations = [];
    const output = [];
    const [firstPart, secondPart] = line.split(" | ");
    observations.push(...firstPart.split(" "));
    output.push(...secondPart.split(" "));
    formattedData.push([observations, output]);
  }
  return formattedData;
}

function countRelevantOutputs(data: string[][][]): number {
  const relevantLengths = [2, 4, 3, 7];
  let count = 0;
  for (const point of data) {
    const [_observations, outputs] = point;
    for (const output of outputs) {
      if (relevantLengths.includes(output.length)) {
        count += 1;
      }
    }
  }
  return count;
}

interface Possibilities {
  [key: string]: string;
}

function initialPossibilities(): Possibilities {
  const starter = "abcdefg";
  return {
    tl: starter,
    bl: starter,
    tm: starter,
    mm: starter,
    bm: starter,
    tr: starter,
    br: starter,
  };
}

function updatedPossibilitiesWithUnique(filename: string): string[] {
  const updatedPossibilities = initialPossibilities();
  const data = getObservationAndOutput(readInputToArray(filename));
  const numbersToKeys = Array(10).fill("") as string[];
  const combinedOutputs = [];
  for (const round of data) {
    const outputInNumber = [] as string[];
    const [observations, output] = round;
    for (const observation of observations) {
      if (observation.length === 7) {
        numbersToKeys[8] = observation;
      } else if (observation.length === 4) {
        numbersToKeys[4] = observation;
      } else if (observation.length === 3) {
        numbersToKeys[7] = observation;
      } else if (observation.length === 2) {
        numbersToKeys[1] = observation;
      }
    }
    // between 1 and 7 top middle is the only different option
    const tm = numbersToKeys[7].split("").filter((key) =>
      !numbersToKeys[1].includes(key)
    ).join("");
    cleanupPossibilities(tm, ["tm"], updatedPossibilities);
    // handling of numbers with 6 segments on display
    const sixDisplayCases = observations.filter((observation) =>
      observation.length === 6
    );
    refineWithSixDisplay(sixDisplayCases, numbersToKeys, updatedPossibilities);
    const updatedNumberToKeys = updateNumberToKeys(
      numbersToKeys,
      updatedPossibilities,
    );
    output.forEach((item) => {
      const number = updatedNumberToKeys.findIndex((key) =>
        key === item.split("").sort().join("")
      );
      outputInNumber.push(String(number));
    });
    combinedOutputs.push(outputInNumber.join(""));
  }
  return combinedOutputs;
}

function updateNumberToKeys(
  numbersToKeys: string[],
  updatedPossibilities: Possibilities,
) {
  const starter = "abcdefg";
  numbersToKeys[0] = starter.split("").filter((key) =>
    key !== updatedPossibilities.mm
  ).join("");
  numbersToKeys[6] = starter.split("").filter((key) =>
    key !== updatedPossibilities.tr
  ).join("");
  numbersToKeys[9] = starter.split("").filter((key) =>
    key !== updatedPossibilities.bl
  ).join("");
  numbersToKeys[2] = starter.split("").filter((key) =>
    key !== updatedPossibilities.br && key !== updatedPossibilities.tl
  ).join("");
  numbersToKeys[3] = starter.split("").filter((key) =>
    key !== updatedPossibilities.tl && key !== updatedPossibilities.bl
  ).join("");
  numbersToKeys[5] = starter.split("").filter((key) =>
    key !== updatedPossibilities.tr && key !== updatedPossibilities.bl
  ).join("");

  return numbersToKeys.map((item) => item.split("").sort().join(""));
}

function refineWithSixDisplay(
  sixDisplayCases: string[],
  numbersToKeys: string[],
  updatedPossibilities: Possibilities,
) {
  // switched off segments in these are
  let unknownSegments = sixDisplayCases.map((segmentsOn) => {
    return numbersToKeys[8].split("").filter((segmentId) =>
      !segmentsOn.includes(segmentId)
    ).join("");
  });
  //  comparing these unknown against 4 to get mm segment id
  const mm = unknownSegments.filter((segment) =>
    numbersToKeys[4].includes(segment) && !numbersToKeys[1].includes(segment)
  ).join("");
  unknownSegments = unknownSegments.filter((segment) => segment !== mm);
  cleanupPossibilities(mm, ["mm"], updatedPossibilities);
  //   compare remaining unknown against 1 to finalize tr and br
  const tr = unknownSegments.filter((segment) =>
    numbersToKeys[1].includes(segment)
  ).join("");
  const bl = unknownSegments.filter((segment) =>
    !numbersToKeys[1].includes(segment)
  ).join("");
  cleanupPossibilities(tr, ["tr"], updatedPossibilities);
  cleanupPossibilities(bl, ["bl"], updatedPossibilities);
  const br = numbersToKeys[1].split("").filter((segment) => segment !== tr)
    .join("");
  cleanupPossibilities(br, ["br"], updatedPossibilities);
  const tl = numbersToKeys[4].split("").filter((segment) =>
    ![tr, br, mm].includes(segment)
  ).join("");
  cleanupPossibilities(tl, ["tl"], updatedPossibilities);
  const { tm } = updatedPossibilities;
  const bm = numbersToKeys[9].split("").filter((segment) =>
    ![tl, tm, tr, mm, br, bl].includes(segment)
  ).join("");
  cleanupPossibilities(bm, ["bm"], updatedPossibilities);
}

function cleanupPossibilities(
  options: string,
  keys: string[],
  currentPossibilities: Possibilities,
) {
  Object.keys(currentPossibilities).forEach((option) => {
    if (keys.includes(option)) {
      currentPossibilities[option] = options;
    }
  });
}

function sumOutput(numbers: string[]): number {
  return numbers.map((number) => parseInt(number)).reduce(
    (sum, value) => sum + value,
    0,
  );
}

// console.log(updatedPossibilitiesWithUnique("test-data"));

console.dir(sumOutput(updatedPossibilitiesWithUnique("input-data")));

// console.log(
//   countRelevantOutputs(
//     getObservationAndOutput(readInputToArray("input-data")),
//   ),
// );

Deno.test("all setup", () => {
  assertEquals(5, 5);
});

Deno.test("output with easily identifiable digits are 26 in test data", () => {
  assertEquals(
    countRelevantOutputs(
      getObservationAndOutput(readInputToArray("./test-data")),
    ),
    26,
  );
});

Deno.test("sum of all outputs in test data is 61229", () => {
  assertEquals(sumOutput(updatedPossibilitiesWithUnique("test-data")), 61229);
});
