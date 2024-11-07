import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { useApiFetch } from '../hooks';
import PostsPage from '../app/posts';
import { describe, it, expect, vi } from 'vitest';
import { Mock } from '@vitest/spy';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useApiFetch: vi.fn(),
}));

describe('PostsPage Component', () => {
  const mockNavigate = vi.fn();
  const mockGetPosts = vi.fn();
  const mockDeletePost = vi.fn();
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useApiFetch as Mock).mockReturnValue({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: null,
      error: null,
      isLoading: false,
    });
  });

  it('should render loading message when data is loading', () => {
    (useApiFetch as Mock).mockReturnValueOnce({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: null,
      error: null,
      isLoading: true,
    });

    render(<PostsPage />);
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it('should display error message if there is an error loading posts', () => {
    const error = new Error('Failed to load posts');
    (useApiFetch as Mock).mockReturnValueOnce({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: null,
      error,
      isLoading: false,
    });

    render(<PostsPage />);
    expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
  });

  it('should render posts when data is available', () => {
    const mockPosts = [
      { id: '1', title: 'First Post', content: 'Content of first post', authorId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Second Post', content: 'Content of second post', authorId: '2', createdAt: new Date(), updatedAt: new Date() },
    ];

    (useApiFetch as Mock).mockReturnValueOnce({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: mockPosts,
      error: null,
      isLoading: false,
    });

    render(<PostsPage />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('should navigate to post creation page on "Create Post" button click', () => {
    render(<PostsPage />);
    fireEvent.click(screen.getByText(/create post/i));

    expect(mockNavigate).toHaveBeenCalledWith('/posts/new');
  });

  it('should navigate to edit post page when edit button is clicked', () => {
    const mockPosts = [
      { id: '1', title: 'First Post', content: 'Content of first post', authorId: '1', createdAt: new Date(), updatedAt: new Date() },
    ];

    (useApiFetch as Mock).mockReturnValueOnce({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: mockPosts,
      error: null,
      isLoading: false,
    });

    render(<PostsPage />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/posts/1/edit');
  });

  it('should call deletePost and refresh posts when delete button is clicked and confirmed', async () => {
    window.confirm = vi.fn().mockReturnValueOnce(true);

    const mockPosts = [
      { id: '1', title: 'First Post', content: 'Content of first post', authorId: '1', createdAt: new Date(), updatedAt: new Date() },
    ];

    (useApiFetch as Mock).mockReturnValueOnce({
      get: mockGetPosts,
      delete: mockDeletePost,
      data: mockPosts,
      error: null,
      isLoading: false,
    });

    render(<PostsPage />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockDeletePost).toHaveBeenCalledWith(expect.stringContaining('/posts/1'));
    expect(mockGetPosts).toHaveBeenCalled();
  });
});
