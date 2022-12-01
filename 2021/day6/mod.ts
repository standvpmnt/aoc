/*
    Day 6 of Advent Of Code 2021
    Attempted with TS and Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

function readFileToArray(filename: string): number[] {
  return Deno.readTextFileSync(filename).split(",").map((item) =>
    parseInt(item)
  );
}

function spawnFishes(startCounts: number[], days: number): number[] {
  for (let i = 1; i <= days; i++) {
    let newAdditions = 0;
    startCounts = startCounts.map((daysInCycle) => {
      if (daysInCycle === 0) {
        newAdditions += 1;
        return 6;
      } else {
        return daysInCycle - 1;
      }
    });
    for (let j = 1; j <= newAdditions; j++) {
      startCounts.push(8);
    }
  }
  return startCounts;
}

function countNumbers(counts: number[]): number {
  return counts.length;
}

function initializeDayWiseFishCount(
  lifeSpanInDays: number,
  startCounts: number[],
): number[] {
  const initial = new Array(lifeSpanInDays + 1).fill(0);
  startCounts.forEach((day) => {
    const numberOfFishes = initial[day];
    initial[day] = numberOfFishes + 1;
  });
  return initial;
}

function fishCountUpdater(
  lifespanOfNewFish: number,
  startCounts: number[],
  days: number,
) {
  const fishStatus = initializeDayWiseFishCount(
    lifespanOfNewFish,
    startCounts,
  );
  for (let i = 1; i <= days; i++) {
    let temp = 0;
    for (let j = lifespanOfNewFish; j >= 0; j--) {
      const swap = fishStatus[j];
      fishStatus[j] = temp;
      temp = swap;
      if (j === 0) {
        const existingCount = fishStatus[lifespanOfNewFish - 2];
        fishStatus[lifespanOfNewFish - 2] = existingCount + temp;
        fishStatus[fishStatus.length - 1] = temp;
      }
    }
  }
  let sum = 0;
  fishStatus.forEach((item) => {
    sum += item;
  });
  return sum;
}

// console.log(countNumbers(spawnFishes(readFileToArray("./test-data"), 256)));

console.log(fishCountUpdater(8, readFileToArray("./input-data"), 256));

Deno.test("after 256 days fish count is absurdly high for test data", () => {
  assertEquals(
    fishCountUpdater(8, readFileToArray("./test-data"), 256),
    26984457539,
  );
});
