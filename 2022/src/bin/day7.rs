use std::collections::{HashMap, HashSet};

fn part_1(inp: &str) {
    let mut directories = HashSet::new();
    let mut files = HashMap::new();

    let mut cur_path = "".to_owned();
    directories.insert("/".to_owned().clone());
    inp.lines().for_each(|i| {
        if i.contains("$ cd ") {
            let c_dir = i.replace("$ cd ", "");
            if c_dir == "/".to_owned() {
                // cur_path = c_dir;
                // directories.insert(cur_path.clone());
            } else if c_dir == ".." {
                let (first, _) = cur_path.rsplit_once("/").unwrap();
                cur_path = first.to_owned();
            } else {
                cur_path = format!("{}/{}", cur_path, c_dir);
                directories.insert(cur_path.clone());
            }
        } else if i.contains("$ ls") {
            ();
        } else {
            let (first, second) = i.split_once(" ").unwrap();
            if first == "dir" {
                directories.insert(format!("{}/{}", cur_path, second));
            } else {
                files.insert(
                    format!("{}/{}", cur_path, second),
                    first.parse::<u32>().unwrap(),
                );
            }
        }
    });
    let mut dir_sizes = HashMap::new();
    let mut less_than_100k = 0;
    for directory in directories {
        let mut dir_size: u32 = 0;
        files
            .keys()
            .filter(|i| i.starts_with(directory.as_str()))
            .for_each(|item| dir_size += files.get(item).unwrap());
        dir_sizes.insert(directory, dir_size);
        if dir_size <= 100_000 {
            less_than_100k += dir_size;
        }
    }
    // println!("Directories are {:#?}", directories);
    // println!("Files are {:#?}", files);
    // println!("Directory sizes are {:#?}", dir_sizes);
    println!("Directory size total is {:#?}", less_than_100k);
    const TOTAL_FS: u32 = 70000000;
    const FREE_REQUIRED: u32 = 30000000;
    let total_used = dir_sizes.get("/").unwrap();
    let required_to_be_freed = FREE_REQUIRED - (TOTAL_FS - total_used);
    println!(
        "Total used spaced: {}, to be freed up: {}",
        total_used, required_to_be_freed
    );
    let res = dir_sizes
        .values()
        .filter(|v| v > &&required_to_be_freed)
        .min()
        .unwrap();
    println!("result is {}", res);
}

fn main() {
    let inp = include_str!("../../inputs/day7/input_test.txt");

    part_1(inp);
}
