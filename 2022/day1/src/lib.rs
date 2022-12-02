use std::fs;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

pub fn read_file(file_path: &str) -> String {
    fs::read_to_string(file_path).expect("Should have been able to read the file")
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn test_day1() {
        let file_data = read_file("../actual_input.txt");
        let mut temp: Vec<u32> = vec![];
        let mut elf: HashMap<u8, Vec<u32>> = HashMap::new();
        let mut count = 1;
        for val in file_data.split('\n') {
            // println!("{val}");
            let chars = val.chars().collect::<Vec<_>>();
            if chars.len() == 0 {
                elf.insert(count, temp);
                temp = vec![];
                count += 1;
            } else {
                temp.push(val.parse::<u32>().unwrap());
            }
        }
        let mut max = 0;
        let mut highest_elf: u8 = 0;
        for (k, v) in elf.iter() {
            let mut sum = 0;
            for num in v {
                sum += num;
            }
            if sum > max {
                max = sum;
                highest_elf = k.clone();
            }
        }
        println!("Highest elf is number {highest_elf} with total count of {max}");
        let mut elf_sum: HashMap<u8, u32> = HashMap::new();
        for (k, v) in elf.iter() {
            elf_sum.insert(k.clone(), v.iter().sum());
        }
        // let v = elf_sum.values().collect::<Vec<_>>();
        let mut v = elf_sum.values().map(|x| x.clone()).collect::<Vec<_>>();
        v.sort();
        println!("{:#?}", v);
    }
}
