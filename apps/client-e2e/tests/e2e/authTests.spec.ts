import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should log in successfully with valid credentials', async ({ page }) => {
        await loginPage.login('testuser', 'testpassword');
        await expect(page).toHaveURL('/posts');
    });

    test('should display error with invalid credentials', async () => {
        await loginPage.login('testuser1', 'testpassword');
        const errorMessage = await loginPage.getErrorMessage();
        await expect(errorMessage).toBe('Invalid credentials');
    });

});
