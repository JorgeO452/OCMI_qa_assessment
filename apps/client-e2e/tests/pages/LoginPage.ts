import { Page, Locator } from '@playwright/test';
import { HelperBase } from './HelperBase';

export class LoginPage extends HelperBase {
    
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signinButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('input[placeholder="Username"]');
        this.passwordInput = page.locator('input[placeholder="Password"]');
        this.signinButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('text="Invalid credentials"');
    }

    async goto(): Promise<void> {
        await this.page.goto('/login');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signinButton.click();
    }

    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitFor({ state: 'visible' });
        return this.errorMessage.textContent();
    }
}
