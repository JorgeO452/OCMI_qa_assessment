import request from 'supertest';
import { postRepository, sessionRepository } from '../database';
import { makeExpressApp } from '../lib';
import { Session } from '@qa-assessment/shared';

describe('Posts', () => {
  const app = makeExpressApp();
  let mockSession: Session;
  const currentDate = new Date();

  beforeEach(() => {
    mockSession = {
      id: '1',
      userId: '1',
      token: 'test-session-token',
      createdAt: currentDate,
    };

    jest.spyOn(sessionRepository, 'findByToken').mockImplementation(async (token) =>
      token === mockSession.token ? mockSession : null
    );

    jest.spyOn(postRepository, 'all').mockResolvedValue([]);
    jest.spyOn(postRepository, 'find').mockResolvedValue({ id: '1', title: 'Test Post', content: 'Content', authorId: '1', createdAt: currentDate, updatedAt: currentDate });
    jest.spyOn(postRepository, 'create').mockResolvedValue({ id: '1', title: 'New Post', content: 'Content', authorId: '1', createdAt: currentDate, updatedAt: currentDate });
    jest.spyOn(postRepository, 'update').mockResolvedValue({ id: '1', title: 'Updated Post', content: 'Updated Content', authorId: '1', createdAt: currentDate, updatedAt: currentDate });
    jest.spyOn(postRepository, 'delete').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /posts', () => {
    it('should fetch all posts if authenticated', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', mockSession.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(postRepository.all).toHaveBeenCalledTimes(1);
    });

    it('should return unauthorized if no token is provided', async () => {
      const response = await request(app).get('/posts');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Unauthorized' });
    });
  });

  describe('GET /posts/:postId', () => {
    it('should fetch a post by ID if authenticated', async () => {
      const response = await request(app)
        .get('/posts/1')
        .set('Authorization', mockSession.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', title: 'Test Post', content: 'Content', authorId: '1', createdAt: currentDate.toISOString(), updatedAt: currentDate.toISOString() });
      expect(postRepository.find).toHaveBeenCalledWith('1');
    });

    it('should return 404 if post not found', async () => {
      jest.spyOn(postRepository, 'find').mockResolvedValueOnce(null as any);

      const response = await request(app)
        .get('/posts/unknown')
        .set('Authorization', mockSession.token);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Post not found' });
    });
  });

  describe('POST /posts', () => {
    it('should create a new post with valid data and authentication', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', mockSession.token)
        .send({ title: 'New Post', content: 'Content' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: '1', title: 'New Post', content: 'Content', authorId: '1', createdAt: currentDate.toISOString(), updatedAt: currentDate.toISOString() });
      expect(postRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should return 422 if validation fails', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', mockSession.token)
        .send({ title: '', content: '' }); // Invalid data

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /posts/:postId', () => {
    it('should update a post if authenticated and data is valid', async () => {
      const response = await request(app)
        .put('/posts/1')
        .set('Authorization', mockSession.token)
        .send({ title: 'Updated Post', content: 'Updated Content', authorId: '1', createdAt: currentDate, updatedAt: currentDate});

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '1', title: 'Updated Post', content: 'Updated Content', authorId: '1', createdAt: currentDate.toISOString(), updatedAt: currentDate.toISOString() });
      expect(postRepository.update).toHaveBeenCalledWith('1', {
        id: '1',
        title: 'Updated Post',
        content: 'Updated Content',
        authorId: '1',
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    });

    it('should return 404 if post not found for update', async () => {
      jest.spyOn(postRepository, 'find').mockResolvedValueOnce(null as any);

      const response = await request(app)
        .put('/posts/unknown')
        .set('Authorization', mockSession.token)
        .send({ title: 'Updated Post', content: 'Updated Content' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Post not found' });
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('should delete a post if authenticated', async () => {
      const response = await request(app)
        .delete('/posts/1')
        .set('Authorization', mockSession.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Post deleted' });
      expect(postRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should return 404 if post not found for delete', async () => {
      jest.spyOn(postRepository, 'delete').mockRejectedValue(new Error('Post not found'));

      const response = await request(app)
        .delete('/posts/unknown')
        .set('Authorization', mockSession.token);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Post not found' });
    });
  });
});
