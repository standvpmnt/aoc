use std::{collections::HashMap, env, fs};

fn read_input(file_path: String) -> String {
    fs::read_to_string(file_path).expect("unable to read input file")
}

fn part_1(inp: String) {
    let mut points = HashMap::new();
    points.insert("Rock", 1);
    points.insert("Paper", 2);
    points.insert("Scissors", 3);

    points.insert("Rock-Rock", 3);
    points.insert("Rock-Paper", 6);
    points.insert("Paper-Paper", 3);
    points.insert("Paper-Scissors", 6);
    points.insert("Scissors-Scissors", 3);
    points.insert("Scissors-Rock", 6);

    let mut encoding = HashMap::new();
    encoding.insert('A', "Rock");
    encoding.insert('B', "Paper");
    encoding.insert('C', "Scissors");
    encoding.insert('X', "Rock");
    encoding.insert('Y', "Paper");
    encoding.insert('Z', "Scissors");

    let mut result: u32 = 0;

    let strategy = inp
        .lines()
        .map(|line| {
            line.chars()
                .filter(|x| !x.is_whitespace())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    for round in strategy.iter() {
        let opp = encoding.get(&round[0]).unwrap();
        let user = encoding.get(&round[1]).unwrap();
        let selection_score = points.get(user).unwrap();
        let round_score = points
            .get(format!("{}-{}", opp, user).as_str())
            .unwrap_or_else(|| &0);
        result += selection_score + round_score;
    }

    println!("{:#?}", result);
}

fn part_2(inp: String) {
    let mut points = HashMap::new();
    points.insert("Rock", 1);
    points.insert("Paper", 2);
    points.insert("Scissors", 3);

    points.insert("Rock-Rock", 3);
    points.insert("Rock-Paper", 6);
    points.insert("Paper-Paper", 3);
    points.insert("Paper-Scissors", 6);
    points.insert("Scissors-Scissors", 3);
    points.insert("Scissors-Rock", 6);

    let mut encoding = HashMap::new();
    encoding.insert('A', "Rock");
    encoding.insert('B', "Paper");
    encoding.insert('C', "Scissors");

    let mut result: u32 = 0;

    let strategy = inp
        .lines()
        .map(|line| {
            line.chars()
                .filter(|x| !x.is_whitespace())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    for round in strategy.iter() {
        let opp = encoding.get(&round[0]).unwrap();
        let outcome = round[1];
        let user = user_selection(opp, &outcome);
        let selection_score = points.get(user.as_str()).unwrap();
        let round_score = points
            .get(format!("{}-{}", opp, user).as_str())
            .unwrap_or_else(|| &0);
        result += selection_score + round_score;
    }

    println!("Revised result is {:#?}", result);
}

fn user_selection(opp: &str, outcome: &char) -> String {
    // x -> loose, y -> draw, z -> win
    if outcome == &'Y' {
        return opp.to_owned();
    } else if outcome == &'Z' {
        // win
        if opp == "Rock" {
            return "Paper".to_owned();
        } else if opp == "Paper" {
            return "Scissors".to_owned();
        } else {
            return "Rock".to_owned();
        }
    } else {
        // loose
        if opp == "Rock" {
            return "Scissors".to_owned();
        } else if opp == "Paper" {
            return "Rock".to_owned();
        } else {
            return "Paper".to_owned();
        }
    }
}

fn main() {
    let cur_dir = env::current_dir().unwrap();
    let file_path = format!("{}{}", cur_dir.to_str().unwrap(), "/input_test.txt");
    let out = read_input(file_path);

    part_1(out.clone());
    part_2(out);
}
