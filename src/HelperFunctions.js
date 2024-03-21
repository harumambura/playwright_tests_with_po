/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
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
