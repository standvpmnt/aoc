/*
  Day 3 of Advent of Code 2021
  Exercise attempted with TS and Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

function readFileToArray(fileName: string): string[] {
  return Deno.readTextFileSync(fileName).split("\n");
}

interface PositionCounts {
  "1": { [key: string]: number };
  "0": { [key: string]: number };
}

function initializePositionCounter(numberOfBits: number): PositionCounts {
  const positionCounts = { "1": {}, "0": {} } as PositionCounts;
  for (let i = 0; i < numberOfBits; i++) {
    positionCounts["1"][String(i)] = 0;
    positionCounts["0"][String(i)] = 0;
  }
  return positionCounts;
}

// Assumption: that each item in the dataset has the same number of bits
function positionCounts(data: string[]): PositionCounts {
  if (data.length < 1) {
    throw new Error("This dataset is invalid");
  }
  const numberOfBits = data[0].length;
  const positionCounts = initializePositionCounter(numberOfBits);

  data.forEach((item) => {
    for (let i = 0; i < numberOfBits; i++) {
      if (item[i] === "1") {
        const currentCount = positionCounts["1"][i];
        positionCounts["1"][i] = currentCount + 1;
      } else {
        const currentCount = positionCounts["0"][i];
        positionCounts["0"][i] = currentCount + 1;
      }
    }
  });
  return positionCounts;
}

function gammaEpsilonCalculator(fileName: string): [number, number] {
  const bitCounts = positionCounts(readFileToArray(fileName));
  let gamma = "";
  let epsilon = "";
  Object.keys(bitCounts["1"]).forEach((index) => {
    if (bitCounts["1"][index] > bitCounts["0"][index]) {
      gamma += "1";
      epsilon += "0";
    } else {
      gamma += "0";
      epsilon += "1";
    }
  });
  return [parseInt(gamma, 2), parseInt(epsilon, 2)];
}

// const [gamma, epsilon] = gammaEpsilonCalculator("./input-data");
// console.log(`Power is ${gamma * epsilon}`);

function scrubbingRatings(fileName: string): [number, number] {
  let co2Ratings = readFileToArray(fileName);
  let o2Ratings = readFileToArray(fileName);
  let position = 0;
  while (co2Ratings.length > 1) {
    const counts = positionCounts(co2Ratings);
    const leastCommon = leastCommonValue(counts, position);
    co2Ratings = [
      ...co2Ratings.filter((item) => item[position] === leastCommon),
    ];
    position += 1;
  }
  position = 0;
  while (o2Ratings.length > 1) {
    const counts = positionCounts(o2Ratings);
    const mostCommon = mostCommonValue(counts, position);
    o2Ratings = [...o2Ratings.filter((item) => item[position] === mostCommon)];
    position += 1;
  }
  return [parseInt(o2Ratings[0], 2), parseInt(co2Ratings[0], 2)];
}

function mostCommonValue(counts: PositionCounts, position: number): "1" | "0" {
  return counts["1"][position] >= counts["0"][position] ? "1" : "0";
}

function leastCommonValue(counts: PositionCounts, position: number): "1" | "0" {
  return counts["1"][position] >= counts["0"][position] ? "0" : "1";
}

const [o2Rating, co2Rating] = scrubbingRatings("./input-data");
console.log(`Life support rating is ${o2Rating * co2Rating}`);

Deno.test("power Value of test data is 198", () => {
  const [gamma, epsilon] = gammaEpsilonCalculator("./test-data.txt");
  assertEquals(gamma * epsilon, 198);
});

Deno.test("life support rating for test data is 230", () => {
  const [o2Rating, co2Rating] = scrubbingRatings("./test-data.txt");
  assertEquals(o2Rating * co2Rating, 230);
});
