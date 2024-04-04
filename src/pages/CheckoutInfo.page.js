const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutInfoPage extends BaseSwagLabPage {
    url = '/checkout-step-one.html';
    
    async clickContinue() {
        await this.page.locator('#continue').click();
    }

    async fillInfo(info) {
        await this.page.locator('#first-name').fill(info.firstName);
        await this.page.locator('#last-name').fill(info.lastName);
        await this.page.locator('#postal-code').fill(info.zipCode);
    }
}
