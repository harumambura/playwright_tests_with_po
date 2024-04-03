const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class BaseItemsPage extends BaseSwagLabPage {

    itemSelector = '.cart_item';

    itemNameSelector = '.inventory_item_name';

    itemDescrSelector = '.inventory_item_desc';

    itemPriceSelector = '.inventory_item_price';

    get invItems() { return this.page.locator(this.itemSelector); }

    get itemsName() { return this.page.locator(this.itemNameSelector); }

    get itemsDescr() { return this.page.locator(this.itemDescrSelector); }

    get itemsPrice() { return this.page.locator(this.itemPriceSelector); }

    async itemData(id) {
        return {
            name: await this.itemsName.nth(id).textContent(),
            descr: await this.itemsDescr.nth(id).textContent(),
            price: await this.itemsPrice.nth(id).textContent()
        }
    }

    async itemsCount() {
        const count = await this.invItems.count();
        return count;
    }

    async getAllItems() {
        const allItems = [];
        const count = await this.itemsCount();
        for (let i = 0; i < count; i++){
            allItems.push(await this.itemData(i));
        }
        return allItems;
    } 
}