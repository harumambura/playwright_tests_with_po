/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const { BaseSwagLabPage } = require('./BaseSwagLab.page');
const { generateRandomNumbers } = require('../HelperFunctions');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    get inventoryItemNames() { return this.page.locator('.inventory_item_name'); }

    get inventoryItemDescriptions() { return this.page.locator('.inventory_item_desc'); }

    get inventoryItemPrices() { return this.page.locator('.inventory_item_price'); }

    get inventorySort() { return this.page.locator('.product_sort_container'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async itemsCount() {
        const count = await this.inventoryItems.count();
        return count;
    }

    async itemData(id) {
        return {
            name: await this.inventoryItemNames.nth(id).textContent(),
            descr: await this.inventoryItemDescriptions.nth(id).textContent(),
            price: await this.inventoryItemPrices.nth(id).textContent()
        }
    }

    async getAllItems() {
        const allItems = [];
        const count = await this.itemsCount();
        for (let i = 0; i < count; i++){
            allItems.push(await this.itemData(i));
        }
        return allItems;
    }

    async selectNItems(selectedCount) {
        const inventoryItemsCount = await this.itemsCount();
        const products = [];
        const randomProductNumbers = generateRandomNumbers(selectedCount, inventoryItemsCount);
        for (let i = selectedCount - 1; i >= 0; i--) {
            await this.addItemToCartById(randomProductNumbers[i]);
            products[i] = await this.itemData(randomProductNumbers[i]);
        }
        return products.slice().reverse();
    }

    async selectSorting(sortType) {
        await this.inventorySort.selectOption(sortType);
    }
}
