const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    cartItemNameSelector = '.inventory_item_name';

    cartItemDescrSelector = '.inventory_item_desc';

    cartItemPriceSelector = '.inventory_item_price';

    checkoutSelector = '#checkout';

    get headerTitle() { return this.page.locator('.title'); }

    get cartItems() { return this.page.locator(this.cartItemSelector); }

    get itemName() { return this.page.locator(this.cartItemNameSelector); }

    get itemDescr() { return this.page.locator(this.cartItemDescrSelector); }

    get itemPrice() { return this.page.locator(this.cartItemPriceSelector); }

    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.cartItemSelector, { hasText: name }); }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    async clickCheckout() {
        await this.page.locator(this.checkoutSelector).click();
    }

    async cartItemData(id) {
        return {
            name: await this.itemName.nth(id).textContent(),
            descr: await this.itemDescr.nth(id).textContent(),
            price: await this.itemPrice.nth(id).textContent()
        }
    }

    async cartItemName(id) {
        return (await this.cartItemData(id)).name;
    }

    async cartItemDescr(id) {
        return (await this.cartItemData(id)).descr;
    }

    async cartItemPrice(id) {
        return (await this.cartItemData(id)).price;
    }
}
