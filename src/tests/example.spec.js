const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { sortItems } = require('../HelperFunctions');


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
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.invItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.invItems).not.toBeAttached();
    });

    const sortingTypes = ['za', 'az', 'lohi', 'hilo'];
    for (const sortType of sortingTypes) {
        test(`check ${sortType} sorting`, async ({ inventoryPage }) => {            
            const itemsBefore = await inventoryPage.getAllItems();
            await inventoryPage.selectSorting(sortType);
            const itemsSorted = sortItems(itemsBefore, sortType);      
            const itemsAfter = await inventoryPage.getAllItems();
            expect(itemsAfter).toEqual(itemsSorted);
        });
    }

    test('Add product to the cart and compare', async ({ inventoryPage, shopingCartPage }) => {
        const selectedProducts = await inventoryPage.selectItems();
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedProducts.length.toString());
        await inventoryPage.shopingCart.click();                
        const cartProducts = await shopingCartPage.getAllItems();
        expect(cartProducts).toEqual(selectedProducts);
    });

    test('Add product and continue purchase', async ({
        inventoryPage, shopingCartPage, checkoutInfoPage, checkoutOverviewPage }) => {
        const selectedProducts = await inventoryPage.selectItems();
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedProducts.length.toString());
        await inventoryPage.shopingCart.click();
        await shopingCartPage.clickCheckout();
        await checkoutInfoPage.fillInfo({ firstName: 'John', lastName: 'Doe', zipCode: '123123' });
        await checkoutInfoPage.clickContinue();

        const itemTotal = await checkoutOverviewPage.totalPriceCalculated();
        const totalOnPage = await checkoutOverviewPage.totalNumber();
        const tax = await checkoutOverviewPage.tax();
        expect(totalOnPage).toBe(parseFloat((itemTotal + tax).toFixed(2)));
                       
        const overviewProducts = await shopingCartPage.getAllItems();
        expect(overviewProducts).toEqual(selectedProducts);
    });
});
