use std::{collections::HashSet, time};

fn part_1(inp: &str, count: usize) {
    let interim = inp.chars().collect::<Vec<_>>();
    let mut counter = 0;
    interim
        .windows(count)
        .find(|i| {
            if i.iter().collect::<HashSet<_>>().len() == count {
                println!("marker position: {}", counter + count);
                true
            } else {
                counter += 1;
                false
            }
        })
        .unwrap();
}

fn main() {
    let t0 = time::Instant::now();
    let input = include_str!("../../inputs/day6/input_test.txt");
    println!(
        "Time taken to load data: {:#?}",
        time::Instant::now().duration_since(t0)
    );
    let t0 = time::Instant::now();
    part_1(input, 4);
    println!(
        "Time taken to load data: {:#?}",
        time::Instant::now().duration_since(t0)
    );
    let t0 = time::Instant::now();
    part_1(input, 14);
    println!(
        "Time taken to load data: {:#?}",
        time::Instant::now().duration_since(t0)
    );
}
