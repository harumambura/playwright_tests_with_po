const { BaseItemsPage } = require('./BaseItems.page');

export class ShopingCartPage extends BaseItemsPage {
    url = '/cart.html';

    removeItemSelector = '[id^="remove"]';

    checkoutSelector = '#checkout';

    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.itemSelector, { hasText: name }); }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.invItems.nth(id).locator(this.removeItemSelector).click();
    }

    async clickCheckout() {
        await this.page.locator(this.checkoutSelector).click();
    }
}
