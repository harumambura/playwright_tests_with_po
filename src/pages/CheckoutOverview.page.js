import { priceNumber } from '../HelperFunctions';

const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutOverviewPage extends BaseSwagLabPage {
    url = '/checkout-step-one.html';

    totalSelector = '.summary_total_label';

    cartItemSelector = '.cart_item';

    cartItemNameSelector = '.inventory_item_name';

    cartItemDescrSelector = '.inventory_item_desc';

    cartItemPriceSelector = '.inventory_item_price';

    cartTaxSelector = '.summary_tax_label';

    get totalPrice() { return this.page.locator(this.totalSelector); }

    get cartTax() { return this.page.locator(this.cartTaxSelector); }

    get itemName() { return this.page.locator(this.cartItemNameSelector); }

    get itemDescr() { return this.page.locator(this.cartItemDescrSelector); }

    get itemPrice() { return this.page.locator(this.cartItemPriceSelector); }

    get cartItems() { return this.page.locator(this.cartItemSelector); }

    async totalPriceCalculated(){
        const priceStrings = await this.itemPrice.allTextContents();
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

    async itemsCount() {
        const count = await this.cartItems.count();
        return count;
    }

    async getAllItems() {
        const allItems = [];
        const count = await this.itemsCount();
        for (let i = 0; i < count; i++){
            allItems.push(await this.cartItemData(i));
        }
        return allItems;
    }
}
