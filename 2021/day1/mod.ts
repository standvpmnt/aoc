/* 
  This is the day1 challenge# 1 
  for advent of code 2021
  exercise is done using TS with Deno
  runtime
*/
import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
// Read the input file

function readFileToArray(fileName: string): number[] {
  const fileText = Deno.readTextFileSync(fileName);
  const data = fileText.split("\n").map((strNum) => parseInt(strNum));
  return data;
}

// Count

function countSubsequentIncrement(data: number[]): number {
  if (data.length < 2) {
    throw new Error("this is not a valid data set for this challenge");
  }
  let counter = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i - 1]) {
      counter += 1;
    }
  }
  return counter;
}

function windowedAnalysis(data: number[]): number {
  if (data.length < 3) {
    throw new Error(
      "this dataset if incompatible with window analysis requirements"
    );
  }
  let counter = 0;
  const windowSize = 3;
  for (let i = 1; i <= data.length - windowSize; i++) {
    let [sumFirst, sumSecond] = [0, 0];
    Array.from(Array(windowSize).keys()).forEach((num) => {
      sumFirst += data[i - 1 + num];
      sumSecond += data[i + num];
    });
    if (sumSecond > sumFirst) {
      counter += 1;
    }
  }
  return counter;
}

// console.log(countSubsequentIncrement(readFileToArray("./actual_data")));

console.log(windowedAnalysis(readFileToArray("./actual_data")));

Deno.test("test data has 7 increments", () => {
  assertEquals(countSubsequentIncrement(readFileToArray("./test_data.txt")), 7);
});

Deno.test("windowed analysis of test data has 5 increments", () => {
  assertEquals(windowedAnalysis(readFileToArray("./test_data.txt")), 5);
});
