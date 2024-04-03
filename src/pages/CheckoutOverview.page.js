import { priceNumber } from '../HelperFunctions';

const { BaseItemsPage } = require('./BaseItems.page');

export class CheckoutOverviewPage extends BaseItemsPage {
    url = '/checkout-step-one.html';

    totalSelector = '.summary_total_label';

    cartTaxSelector = '.summary_tax_label';

    get totalPrice() { return this.page.locator(this.totalSelector); }

    get cartTax() { return this.page.locator(this.cartTaxSelector); }

    async totalPriceCalculated(){
        const priceStrings = await this.itemsPrice.allTextContents();
        const initialValue = 0;
        return priceStrings.reduce((accumulator, currentValue) => accumulator + priceNumber(currentValue),
            initialValue,
        )
    }

    async totalNumber() {
        const priceString = await this.totalPrice.textContent();
        return priceNumber(priceString);
    }

    async tax() {
        const taxString = await this.cartTax.textContent();
        return priceNumber(taxString);
    }
}
