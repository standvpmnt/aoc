/*
  Advent of Code 2021 Day-2 Challenge
  Attempted in Deno with TS
*/

import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

type Heading = "forward" | "up" | "down";

interface Position {
  forward: number;
  up: number;
  down: number;
  aim?: number;
}

function positionFinder(line: string[]): Position {
  const currentPosition = { forward: 0, up: 0, down: 0 };
  for (const entry of line) {
    const heading = entry.split(" ")[0];
    const count = parseInt(entry.split(" ")[1]);
    const currentValue = currentPosition[heading as Heading];
    currentPosition[heading as Heading] = currentValue + count;
  }
  return currentPosition;
}

function positionFinderWithAim(line: string[]): Position {
  const currentPosition = { forward: 0, up: 0, down: 0, aim: 0 };
  for (const entry of line) {
    const heading = entry.split(" ")[0] as Heading;
    const count = parseInt(entry.split(" ")[1]);
    const startAim = currentPosition.aim;
    switch (heading) {
      case "down": {
        currentPosition.aim = startAim + count;
        break;
      }
      case "forward": {
        // Increasing depth is the same as having a down value
        const currentDown = currentPosition.down;
        const currentForward = currentPosition.forward;
        currentPosition.down = currentDown + startAim * count;
        currentPosition.forward = currentForward + count;
        break;
      }
      case "up": {
        currentPosition.aim = startAim - count;
        break;
      }
      default: {
        break;
      }
    }
    console.log(entry);
    console.log(currentPosition);
  }
  return currentPosition;
}

function calculateProduct(position: Position): number {
  return position.forward * (position.down - position.up);
}

console.log(
  calculateProduct(positionFinderWithAim(readFileToArray("./first_input")))
);
Deno.test("test data returns product of 150", () => {
  assertEquals(
    calculateProduct(positionFinder(readFileToArray("./basic_test.txt"))),
    150
  );
});

Deno.test("with aim adjustment value result is 900", () => {
  assertEquals(
    calculateProduct(
      positionFinderWithAim(readFileToArray("./basic_test.txt"))
    ),
    900
  );
});
