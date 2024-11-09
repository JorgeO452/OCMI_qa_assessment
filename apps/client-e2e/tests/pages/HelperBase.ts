import { Page } from '@playwright/test';

export class HelperBase {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForMilliseconds(timeInMilliseconds: number): Promise<void> {
        await this.page.waitForTimeout(timeInMilliseconds);
    }
    
    async waitForSeconds(timeInSeconds: number): Promise<void> {
        await this.waitForMilliseconds(timeInSeconds * 1000);
    }
}
