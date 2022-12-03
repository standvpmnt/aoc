use std::collections::{HashMap, HashSet};

fn duplicate_finder(line: &str) -> char {
    let in_line = line.chars().collect::<Vec<_>>();
    if in_line.len() % 2 != 0 {
        panic!("Unable to handle odd number of items");
    } else {
        let mut orig_hash = HashMap::new();
        in_line
            .iter()
            .take(in_line.len() / 2)
            .for_each(|c| *orig_hash.entry(c).or_insert(1) += 1);
        let mut repeated_char: Option<char> = None;
        in_line.iter().skip(in_line.len() / 2).for_each(|c| {
            if let Some(_) = orig_hash.get(c) {
                repeated_char = Some(c.clone());
            } else {
                // orig_hash.insert(c, 1);
            }
        });
        repeated_char.unwrap_or_else(|| panic!("Repetition should have happened"))
    }
}

fn same_char_finder(group: &[&str]) -> char {
    let mut elem_1 = HashSet::new();
    let mut elem_2 = HashSet::new();
    let mut elem_3 = HashSet::new();
    let [elf_1, elf_2, elf_3] = [group[0], group[1], group[2]];
    elf_1.chars().for_each(|x| {
        elem_1.insert(x);
    });
    elf_2.chars().for_each(|x| {
        elem_2.insert(x);
    });
    elf_3.chars().for_each(|x| {
        elem_3.insert(x);
    });
    let inters = elem_1
        .intersection(&elem_2)
        .filter(|x| elem_3.contains(x))
        .collect::<Vec<_>>();
    if inters.len() != 1 {
        panic!("Unable to handle case with no common element")
    } else {
        return inters[0].clone();
    }
}

fn score_of_char(ch: char) -> u32 {
    if ch.is_lowercase() {
        ch as u32 - 96
    } else {
        ch as u32 - 38
    }
}

fn part_1() {
    let inp = include_str!("../input_test.txt");
    let total = inp.lines().fold(0, |acc, line| {
        let dup_char = duplicate_finder(line);
        score_of_char(dup_char) + acc
    });
    println!("Score is {total}")
}

fn part_2() {
    let inp = include_str!("../input_test.txt");

    let data = inp.lines().collect::<Vec<_>>();
    let result = data.as_slice().chunks(3).fold(0, |acc, group_lines| {
        acc + score_of_char(same_char_finder(group_lines))
    });
    println!("result is {result}")
}

fn main() {
    part_1();
    part_2();
}
