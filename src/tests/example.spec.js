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
    /*    Add several random products to the Shopping Cart
    Verify products are displayed correctly (check Name, Description, and Price values) */
    test('Add product to the cart and check', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        await loginPage.navigate();
        await loginPage.performLogin('standard_user', 'secret_sauce');
        const inventoryItemsCount = await inventoryPage.itemsCount();
        const randomProductNumbers = [];
        const products = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 3; i++) {
            randomProductNumbers[i] = Math.floor(Math.random() * inventoryItemsCount);
            await inventoryPage.addItemToCartById(randomProductNumbers[i]);
            products[i] = await inventoryPage.itemData(randomProductNumbers[i]);
        }
        expect(await inventoryPage.getNumberOfItemsInCart()).toBe('3');

        await inventoryPage.shopingCart.click();
        //expect(await shopingCartPage.cartItems.count()).toBeGreaterThanOrEqual(1);

        //await shopingCartPage.removeCartItemById(0);
        //await expect(shopingCartPage.cartItems).not.toBeAttached();
    });
});
