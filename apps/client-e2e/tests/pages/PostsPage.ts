import { Page, Locator } from '@playwright/test';
import { HelperBase } from './HelperBase';

export class PostsPage extends HelperBase {
    private readonly createPostButton: Locator;
    private readonly editButton: Locator;
    private readonly deleteButton: Locator;

    constructor(page: Page) {
        super(page);
        this.createPostButton = page.locator('button:has-text("Create Post")');
        this.editButton = page.locator('.edit-button .lucide-pencil');
        this.deleteButton = page.locator('.delete-button .lucide-trash2');
    }

    async goto() {
        await this.page.goto('/posts');
    }

    async clickCreatePostButton() {
        await this.createPostButton.click();
    }

    async getPostByTitle(title: string) {
        return this.page.getByText(title);
    }

    async openPost() {
        await this.editButton.click();
    }

    async deletePost() {
        await this.handleDialog('accept');
        await this.deleteButton.click();
    }

    private async handleDialog(action: 'accept' | 'dismiss') {
        this.page.once('dialog', async dialog => {
            action === 'accept' ? await dialog.accept() : await dialog.dismiss();
        });
    }
}
