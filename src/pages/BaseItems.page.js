const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class BaseItemsPage extends BaseSwagLabPage {

    get invItems() { return this.page.locator('[data-test="inventory-item"]'); }

    get itemsName() { return this.page.locator('[data-test="inventory-item-name"]'); }

    get itemsDescr() { return this.page.locator('[data-test="inventory-item-desc"]'); }

    get itemsPrice() { return this.page.locator('[data-test="inventory-item-price"]'); }

    async itemData(id) {
        return {
            name: await this.itemsName.nth(id).textContent(),
            descr: await this.itemsDescr.nth(id).textContent(),
            price: await this.itemsPrice.nth(id).textContent()
        }
    }

    async getAllItemsData() {
        const allItems = [];
        const count = await this.invItems.count();
        for (let i = 0; i < count; i++){
            allItems.push(await this.itemData(i));
        }
        return allItems;
    } 
}