import { Page, Locator } from '@playwright/test';
import { HelperBase } from './HelperBase';

export class CreatePostPage extends HelperBase {
    private readonly titleInput: Locator;
    private readonly contentInput: Locator;
    private readonly savePostButton: Locator;

    constructor(page: Page) {
        super(page);
        this.titleInput = page.getByPlaceholder('Enter your post title');
        this.contentInput = page.getByPlaceholder('Write your post content here...');
        this.savePostButton = page.locator('button:has-text("Create Post")');
    }

    async createPost(title: string, content: string) {
        await this.fillPostForm(title, content);
        await this.savePostButton.click();
    }

    private async fillPostForm(title: string, content: string) {
        await this.titleInput.fill(title);
        await this.contentInput.fill(content);
    }
}
