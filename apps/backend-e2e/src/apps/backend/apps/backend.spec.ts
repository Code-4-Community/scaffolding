import axios from 'axios';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('GET /api/tasks/task', () => {
  it('should return all tasks', async () => {
    const res = await axios.get(`/api/tasks/task`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);

    const firstTask = res.data[0];
    expect(firstTask).toHaveProperty('id');
    expect(firstTask).toHaveProperty('title');
    expect(firstTask).toHaveProperty('description');
    expect(firstTask).toHaveProperty('category');
    expect(firstTask).toHaveProperty('dateCreated');
    expect(firstTask).toHaveProperty('dueDate');
    expect(firstTask).toHaveProperty('labels');
  });
});
