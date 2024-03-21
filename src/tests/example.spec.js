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

    test('Add product to the cart and check', async ({ loginPage, inventoryPage, shopingCartPage }) => {
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
});
