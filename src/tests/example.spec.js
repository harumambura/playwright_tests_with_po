const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { sortItems, priceNumber } = require('../HelperFunctions');


test.describe('', () => {
    test.beforeEach( async ( { loginPage } ) => {    
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    })

    test('Perform login', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.invItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ inventoryPage, shopingCartPage }) => {
        await inventoryPage.addItemToCartByIndex(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');
        await inventoryPage.clickOnCart();
        expect(await shopingCartPage.invItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.invItems).not.toBeAttached();
    });

    const sortingTypes = [{sort: 'za', sortFunc: (itemsBefore) => itemsBefore.sort((a, b) => b.name.localeCompare(a.name))}, 
                          {sort: 'az', sortFunc: (itemsBefore) => itemsBefore.sort((a, b) => a.name.localeCompare(b.name))}, 
                          {sort: 'lohi', sortFunc: (itemsBefore) => itemsBefore.sort((a, b) => priceNumber(a.price) - priceNumber(b.price))}, 
                          {sort: 'hilo', sortFunc: (itemsBefore) => itemsBefore.sort((a, b) => priceNumber(b.price) - priceNumber(a.price))}];
    for (const sortType of sortingTypes) {
        test(`check ${sortType.sort} sorting`, async ({ inventoryPage }) => {            
            const itemsBefore = await inventoryPage.getAllItemsData();
            await inventoryPage.selectSorting(sortType.sort);
            //const itemsSorted = sortItems(itemsBefore, sortType);   
            const itemsSorted = sortType.sortFunc(itemsBefore);
            const itemsAfter = await inventoryPage.getAllItemsData();
            expect(itemsAfter).toEqual(itemsSorted);
        });
    }

    test('Add product to the cart and compare', async ({ inventoryPage, shopingCartPage }) => {
        const selectedProducts = await inventoryPage.selectItems();
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedProducts.length.toString());
        await inventoryPage.clickOnCart();               
        const cartProducts = await shopingCartPage.getAllItemsData();
        expect(cartProducts).toEqual(selectedProducts);
    });

    test('Add product and continue purchase', async ({
        inventoryPage, shopingCartPage, checkoutInfoPage, checkoutOverviewPage }) => {
        const selectedProducts = await inventoryPage.selectItems();
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedProducts.length.toString());
        await inventoryPage.clickOnCart();
        await shopingCartPage.clickCheckout();
        await checkoutInfoPage.fillInfo({ firstName: 'John', lastName: 'Doe', zipCode: '123123' });
        await checkoutInfoPage.clickContinue();

        const itemTotal = await checkoutOverviewPage.totalPriceCalculated();
        const totalOnPage = await checkoutOverviewPage.totalNumber();
        const tax = await checkoutOverviewPage.tax();
        expect(totalOnPage).toBe(parseFloat((itemTotal + tax).toFixed(2)));
                       
        const overviewProducts = await shopingCartPage.getAllItemsData();
        expect(overviewProducts).toEqual(selectedProducts);
    });
});
