/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
// @ts-nocheck
const { expect } = require('@playwright/test');
const { test } = require('../fixture');

test.describe('', () => {
    test('Perform login', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');

        await expect(inventoryPage.headerTitle).toBeVisible();

        expect(await inventoryPage.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test('Add and remove product from the cart', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        await inventoryPage.addItemToCartById(0);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('1');

        await inventoryPage.shopingCart.click();
        expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        await shopingCartPage.removeCartItemById(0);
        await expect(shopingCartPage.cartItems).not.toBeAttached();
    });

    test('check backward sorting', async ({ loginPage, inventoryPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        const itemsBefore = await inventoryPage.inventoryItemNames.allInnerTexts();
        const itemsSorted = itemsBefore.sort().reverse();
        await inventoryPage.selectSorting('Name (Z to A)');
        const itemsAfter = await inventoryPage.inventoryItemNames.allInnerTexts();
        expect(itemsAfter).toEqual(itemsSorted);
    });

    test('Add product to the cart and compare', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        const selectedCount = 3;
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
        loginPage, inventoryPage, shopingCartPage, checkoutInfoPage, checkoutOverviewPage,
    }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        const selectedCount = 3;
        const info = { firstName: 'John', lastName: 'Doe', zipCode: '123123' };
        const sortedProducts = await inventoryPage.selectNItems(selectedCount);
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe(selectedCount.toString());

        await inventoryPage.shopingCart.click();
        await shopingCartPage.clickCheckout();
        await checkoutInfoPage.fillInfo(info);
        await checkoutInfoPage.clickContinue();

        const itemTotal = await checkoutOverviewPage.totalPriceCalculated(selectedCount);
        const totalOnPage = await checkoutOverviewPage.totalNumber();
        const tax = await checkoutOverviewPage.tax();
        expect(totalOnPage).toBe(itemTotal + tax);

        for (let i = 0; i < selectedCount; i++) {
            expect(await checkoutOverviewPage.cartItemName(i)).toBe(sortedProducts[i].name);
            expect(await checkoutOverviewPage.cartItemDescr(i)).toBe(sortedProducts[i].descr);
            expect(await checkoutOverviewPage.cartItemPrice(i)).toBe(sortedProducts[i].price);
        }
    });
});
