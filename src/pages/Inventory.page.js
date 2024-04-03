const { BaseItemsPage } = require('./BaseItems.page');
const { generateRandomNumbers } = require('../HelperFunctions');

export class InventoryPage extends BaseItemsPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } 

    get invItems() { return this.page.locator('.inventory_item'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    get inventorySort() { return this.page.locator('.product_sort_container'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async itemsCount() {
        const count = await this.invItems.count();
        return count;
    }

    async selectItems() {
        const inventoryItemsCount = await this.itemsCount();
        const products = [];
        const selectedCount = generateRandomNumbers(1, inventoryItemsCount)[0] || 1;
        const randomProductNumbers = generateRandomNumbers(selectedCount, inventoryItemsCount);

        for (const randomNumber of randomProductNumbers) {
            products.push(await this.itemData(randomNumber));
            await this.invItems.nth(randomNumber).locator('[id^="add-to-cart"]').click();
        }
        return products;
    }

    async selectSorting(sortType) {
        await this.inventorySort.selectOption(sortType);
    }
}
