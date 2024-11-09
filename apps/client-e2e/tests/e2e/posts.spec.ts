import { test, expect } from '@playwright/test';
import { PostsPage } from '../pages/PostsPage';
import { LoginPage } from '../pages/LoginPage';
import { CreatePostPage } from '../pages/CreatePostPage';
import { EditPostPage } from '../pages/EditPostPage';

test.describe('Post Management', () => {
    let loginPage: LoginPage;
    let postsPage: PostsPage;
    let createPostPage: CreatePostPage;
    let editPostPage: EditPostPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        postsPage = new PostsPage(page);
        createPostPage = new CreatePostPage(page);
        editPostPage = new EditPostPage(page);

        await loginPage.goto();
        await loginPage.login('testuser', 'testpassword');
    });

    test('Should create a new post', async () => {
        await postsPage.clickCreatePostButton();
        await createPostPage.createPost('New post', 'Content of post');
        await expect(await postsPage.getPostByTitle('New post')).toBeVisible();
    });

    test('Should edit an existing post', async () => {
        await postsPage.openPost(); 
        await editPostPage.editPost('Updated post', 'Updated content');
        await expect(await postsPage.getPostByTitle('Updated post')).toBeVisible();
    });

    test('Should delete a post', async () => {
        await postsPage.deletePost();
        await expect(await postsPage.getPostByTitle('Updated post')).toHaveCount(0);
    });
});
