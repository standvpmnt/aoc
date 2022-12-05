use std::time;

fn create_stack(inp: &str) -> Vec<Vec<char>> {
    let lines = inp
        .split('\n')
        .filter(|item| item.contains("["))
        .map(|i| {
            i.replace("    ", "-")
                .replace(" ", "")
                .replace("[", "")
                .replace("]", "")
                .chars()
                .collect::<Vec<char>>()
        })
        .rev()
        .collect::<Vec<_>>();
    let num_of_stacks = lines[0].len();
    let mut stack: Vec<Vec<char>> = Vec::new();
    for _ in 0..num_of_stacks {
        stack.push(vec![])
    }
    for val in lines.iter() {
        val.iter().enumerate().for_each(|(col, ch)| {
            if ch != &'-' {
                stack[col].push(ch.to_owned());
            }
        });
    }
    return stack;
}

fn load_directions(directives: &str) -> Vec<Vec<usize>> {
    directives
        .replace("move ", "")
        .replace(" from ", ",")
        .replace(" to ", ",")
        .lines()
        .map(|l| {
            l.split(',')
                .map(|item| item.parse::<usize>().unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>()
}

fn top_of_stack(mut stack: Vec<Vec<char>>) {
    println!(
        "{:#?}",
        stack
            .iter_mut()
            .map(|stack| {
                // let length = stack.len();
                // stack[length - 1]
                stack.pop().unwrap()
            })
            .collect::<String>()
    );
}

fn part_1(mut stack: Vec<Vec<char>>, directions: Vec<Vec<usize>>) {
    for instruction in directions {
        if instruction.len() != 3 {
            panic!("Unable to handle case");
        }
        let crates_to_be_moved = instruction[0];
        let from = instruction[1] - 1;
        let to = instruction[2] - 1;
        for _ in 0..crates_to_be_moved {
            let ch = stack[from]
                .pop()
                .unwrap_or_else(|| panic!("no item found in the vector"));
            stack[to].push(ch)
        }
    }
    top_of_stack(stack)
}

fn part_2(mut stack: Vec<Vec<char>>, directions: Vec<Vec<usize>>) {
    for instruction in directions {
        if instruction.len() != 3 {
            panic!("Unable to handle case");
        }
        let crates_to_be_moved = instruction[0];
        let from = instruction[1] - 1;
        let to = instruction[2] - 1;
        let mut crates_in_crane = vec![];
        for _ in 0..crates_to_be_moved {
            crates_in_crane.push(
                stack[from]
                    .pop()
                    .unwrap_or_else(|| panic!("no item found in the vector")),
            );
        }
        crates_in_crane
            .iter()
            .rev()
            .for_each(|cr| stack[to].push(cr.clone()))
    }
    top_of_stack(stack)
}

fn main() {
    let t0 = time::Instant::now();
    let input: Vec<&str> = include_str!("../../inputs/day5/input_test.txt")
        .split("\n\n")
        .collect();
    println!(
        "to read data {:#?}",
        time::Instant::now().duration_since(t0)
    );
    let t0 = time::Instant::now();
    part_1(create_stack(input[0]), load_directions(input[1]));
    println!(
        "to solve part one {:#?}",
        time::Instant::now().duration_since(t0)
    );

    let t0 = time::Instant::now();
    part_2(create_stack(input[0]), load_directions(input[1]));
    println!(
        "to solve part two {:#?}",
        time::Instant::now().duration_since(t0)
    );
}
