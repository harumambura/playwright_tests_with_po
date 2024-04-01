export function generateRandomNumbers(count, maxCount) {
    let randomProductNumbers = [];
    for (let i = 0; i < count; i++) {
        let randomNumber;
        let isUnique;
        do {
            randomNumber = Math.floor(Math.random() * maxCount);
            isUnique = !randomProductNumbers.includes(randomNumber);
        } while (!isUnique);
        randomProductNumbers.push(randomNumber);
        randomProductNumbers = randomProductNumbers.sort((a, b) => a - b);
    }
    return randomProductNumbers;
}

export function priceNumber(string) {
    const arr = string.split('$');
    return Number(arr[1]);
}
