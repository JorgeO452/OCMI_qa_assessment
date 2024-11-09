import { Page, Locator } from '@playwright/test';
import { HelperBase } from './HelperBase';

export class EditPostPage extends HelperBase {
    private readonly titleInput: Locator;
    private readonly contentInput: Locator;
    private readonly updatePostButton: Locator;

    constructor(page: Page) {
        super(page);
        this.titleInput = page.getByPlaceholder('Enter your post title');
        this.contentInput = page.getByPlaceholder('Write your post content here...');
        this.updatePostButton = page.locator('button:has-text("Update Post")');
    }

    async editPost(title: string, content: string) {
        await this.fillEditForm(title, content);
        await this.updatePostButton.click();
    }

    private async fillEditForm(title: string, content: string) {
        await this.titleInput.fill(title);
        await this.contentInput.fill(content);
    }
}
