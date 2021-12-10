/*
    Day 10 of Advent of Code 2021
    Solution in TS and Deno
*/

function readFileToArray(filename: string): string[] {
  return Deno.readTextFileSync(filename).split("\n");
}

function findErrorInLine(line: string): [number, string[]] {
  const addedToStack = [];
  let syntaxErrorScore = 0;
  for (const char of line.split("")) {
    const lengthOfStack = addedToStack.length;
    const lastItem = addedToStack[lengthOfStack - 1];
    if (lengthOfStack === 0) {
      addedToStack.push(char);
    } else if (char === "[" || char === "<" || char === "(" || char === "{") {
      addedToStack.push(char);
    } else if (char === correspondingClosingTag(lastItem)) {
      addedToStack.pop();
    } else {
      if (char === ")") {
        syntaxErrorScore = 3;
        break;
      } else if (char === "]") {
        syntaxErrorScore = 57;
        break;
      } else if (char === "}") {
        syntaxErrorScore = 1197;
        break;
      } else if (char === ">") {
        syntaxErrorScore = 25137;
        break;
      }
    }
  }
  return [syntaxErrorScore, addedToStack];
}

function correspondingClosingTag(char: string): string {
  if (char === "(") return ")";
  if (char === "{") return "}";
  if (char === "<") return ">";
  if (char === "[") return "]";
  throw new Error("Unknown character type! You serious about this?");
}

function closingTagScore(char: string): number {
  if (char === ")") return 1;
  if (char === "]") return 2;
  if (char === "}") return 3;
  if (char === ">") return 4;
  throw new Error("Unknown character for closing tag!");
}

function calculateSyntaxErrorScore(filename: string): number {
  const data = readFileToArray(filename);
  let sum = 0;
  for (const line of data) {
    const [val, _data] = findErrorInLine(line);
    sum += val;
  }
  return sum;
}

function handleIncompleteLines(filename: string): number {
  const data = readFileToArray(filename);
  const scores = [];
  for (const line of data) {
    const closingTags = [] as string[];
    const [val, data] = findErrorInLine(line);
    if (val === 0) {
      for (const openTag of data) {
        closingTags.push(correspondingClosingTag(openTag));
      }
      let score = 0;
      for (let i = closingTags.length - 1; i >= 0; i--) {
        score = (5 * score) + closingTagScore(closingTags[i]);
      }
      scores.push(score);
    }
  }
  scores.sort((a, b) => a - b);
  return scores[((scores.length + 1) / 2) - 1];
}

// console.log(calculateSyntaxErrorScore("./input-data"));
console.log(handleIncompleteLines("./input-data"));
