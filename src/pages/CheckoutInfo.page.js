const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutInfoPage extends BaseSwagLabPage {
    url = '/checkout-step-one.html';

    continueSelector = '#continue';
    firstNameSelector = '#first-name';
    lastNameSelector = '#last-name';
    zipCodeSelector = '#postal-code';

    async clickContinue() {
        await this.page.locator(this.continueSelector).click();
    }

    async fillInfo(info) {
        await this.page.locator(this.firstNameSelector).fill(info.firstName);
        await this.page.locator(this.lastNameSelector).fill(info.lastName);
        await this.page.locator(this.zipCodeSelector).fill(info.zipCode);
    }
}
