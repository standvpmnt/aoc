/*
    Day 7 of Advent of Code 2021
    Attempted with TS and Deno
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

function readFileToArray(filename: string): number[] {
  return Deno.readTextFileSync(filename).split(",").map((item) =>
    parseInt(item)
  );
}

function findFuelToLowestPosition(positions: number[]): number {
  const max = Math.max(...positions);
  const fuel = Array(max + 1).fill(0);

  for (const position of positions) {
    for (let i = 0; i <= max; i++) {
      const fuelToThisPosition = Math.abs(position - i);
      const temp = fuel[i];
      fuel[i] = temp + fuelToThisPosition;
    }
  }

  console.log(fuel);
  return (Math.min(...fuel));
}

function findLowestFuelConsumptionWithRevision(positions: number[]) {
  const max = Math.max(...positions);
  const fuel = Array(max + 1).fill(0);

  for (const position of positions) {
    for (let i = 0; i <= max; i++) {
      const differenceInPosition = Math.abs(position - i);
      const fuelUsed = (differenceInPosition * (differenceInPosition + 1)) / 2;
      const temp = fuel[i];
      fuel[i] = temp + fuelUsed;
    }
  }

  console.log(Math.min(...fuel));
}

// findFuelToLowestPosition(readFileToArray("./test-data"));
findLowestFuelConsumptionWithRevision(readFileToArray("./input-data"));
Deno.test("check setup", () => {
  assertEquals(5, 5);
});
