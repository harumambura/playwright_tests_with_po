export function generateRandomNumbers(count, maxCount) {
    const randomProductNumbers = new Set();
    while (randomProductNumbers.size < count) {
        const randomNumber = Math.floor(Math.random() * maxCount);
        randomProductNumbers.add(randomNumber);
    }
    return Array.from(randomProductNumbers);
}

export function priceNumber(string) {
    const arr = string.split('$');
    return Number(arr[1]);
}
/*
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

}*/
