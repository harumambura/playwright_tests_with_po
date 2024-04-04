const { BasePage } = require('./Base.page');

export class BaseSwagLabPage extends BasePage {

    get mainMenuBtn() { return this.page.locator('TBD'); }

    get shopingCart() { return this.page.locator('[data-test="shopping-cart-link"]'); }

    get shopingCartBadge() { return this.page.locator('[data-test="shopping-cart-badge"]'); }

    async getNumberOfItemsInCart() {
        return this.shopingCartBadge.textContent();
    }
}
