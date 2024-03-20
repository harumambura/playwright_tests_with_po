const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //

    get inventoryItems() { return this.page.locator('.inventory_item'); }

    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }

    get inventoryItemNames() { return this.page.locator('.inventory_item_name'); }

    get inventoryItemDescriptions() { return this.page.locator('.inventory_item_desc'); }

    get inventoryItemPrices() { return this.page.locator('.inventory_item_price'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }

    async itemsCount() {
        const count = await this.inventoryItems.count();
        return count;
    }

    async itemData(id) {
        const item = {};
        item.name = await this.inventoryItemNames.nth(id).textContent();
        item.descr = await this.inventoryItemDescriptions.nth(id).textContent();
        item.price = await this.inventoryItemPrices.nth(id).textContent();
        return item;
    }
}
