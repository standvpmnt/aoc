use std::{collections::HashSet, time};

fn ids_assigned_from_str(inp: &str) -> HashSet<usize> {
    let range = inp
        .split("-")
        .map(|i| i.parse::<usize>().unwrap())
        .collect::<Vec<_>>();
    (range[0]..=range[1]).collect::<HashSet<_>>()
}

fn part_1(inp: &str) {
    let mut count: u32 = 0;
    inp.lines().for_each(|l| {
        let assignments_to_pair = l.split(",").collect::<Vec<_>>();
        let first = ids_assigned_from_str(assignments_to_pair[0]);
        let second = ids_assigned_from_str(assignments_to_pair[1]);
        if first.is_subset(&second) | second.is_subset(&first) {
            count += 1;
        }
    });
    println!("subset cases are: {}", count);
}

fn part_2(inp: &str) {
    let mut count: u32 = 0;
    inp.lines().for_each(|l| {
        let assignments_to_pair = l.split(",").collect::<Vec<_>>();
        let first = ids_assigned_from_str(assignments_to_pair[0]);
        let second = ids_assigned_from_str(assignments_to_pair[1]);
        if first.intersection(&second).collect::<Vec<_>>().len() > 0 {
            count += 1;
        }
    });
    println!("overlapping cases are: {}", count);
}

fn main() {
    let t0 = time::Instant::now();
    let inp = include_str!("../input_test.txt");
    println!(
        "Took {:#?} to read input",
        time::Instant::now().duration_since(t0)
    );
    let t0 = time::Instant::now();
    part_1(inp);
    println!(
        "Took {:#?} to solve part 1",
        time::Instant::now().duration_since(t0)
    );
    let t0 = time::Instant::now();
    part_2(inp);
    println!(
        "Took {:#?} to solve part 2",
        time::Instant::now().duration_since(t0)
    );
}
