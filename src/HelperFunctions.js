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

export function sortItems(itemsBefore, sortType) {
    let itemsSorted = [];
    switch (sortType){
        case 'za':
            itemsSorted = itemsBefore.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'az':
            itemsSorted = itemsBefore.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'lohi':
            itemsSorted = itemsBefore.sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
            break;
        case 'hilo':
            itemsSorted = itemsBefore.sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
    }
    return itemsSorted;

}
