const { expect } = require('@playwright/test');
const { test } = require('../fixture');
const { generateRandomNumbers, sortItems } = require('../HelperFunctions');


test.describe('', () => {
    test.beforeEach( async ( { loginPage } ) => {    
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
    })

    test('Perform login', async ({ inventoryPage }) => {
        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ inventoryPage, shopingCartPage }) => {
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
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
        const inventoryItemsCount = await inventoryPage.itemsCount();
        const selectedCount = generateRandomNumbers(1, inventoryItemsCount)[0];
        const sortedProducts = await inventoryPage.selectNItems(selectedCount);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedCount.toString());

        await inventoryPage.shopingCart.click();
        for (let i = 0; i < selectedCount; i++) {
            expect(await shopingCartPage.cartItemName(i)).toBe(sortedProducts[i].name);
            expect(await shopingCartPage.cartItemDescr(i)).toBe(sortedProducts[i].descr);            
            expect(await shopingCartPage.cartItemPrice(i)).toBe(sortedProducts[i].price);
        }
    });

    test('Add product and continue purchase', async ({
        inventoryPage, shopingCartPage, checkoutInfoPage, checkoutOverviewPage
    }) => {
        const inventoryItemsCount = await inventoryPage.itemsCount();
        const selectedCount = generateRandomNumbers(1, inventoryItemsCount)[0];
        const info = { firstName: 'John', lastName: 'Doe', zipCode: '123123' };
        const selectedProducts = await inventoryPage.selectNItems(selectedCount);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedCount.toString());

        await inventoryPage.shopingCart.click();
        await shopingCartPage.clickCheckout();
        await checkoutInfoPage.fillInfo(info);
        await checkoutInfoPage.clickContinue();

        const itemTotal = await checkoutOverviewPage.totalPriceCalculated();
        const totalOnPage = await checkoutOverviewPage.totalNumber();
        const tax = await checkoutOverviewPage.tax();
        expect(totalOnPage).toBe(itemTotal + tax);

        for (let i = 0; i < selectedCount; i++) {
            expect(await checkoutOverviewPage.cartItemName(i)).toBe(selectedProducts[i].name);
            expect(await checkoutOverviewPage.cartItemDescr(i)).toBe(selectedProducts[i].descr);
            expect(await checkoutOverviewPage.cartItemPrice(i)).toBe(selectedProducts[i].price);
        }
    });
});
