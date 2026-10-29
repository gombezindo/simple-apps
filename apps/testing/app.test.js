const request = require('supertest');
const mysql = require('mysql');
require('dotenv').config();

const connection = require('../middleware/db_connect');
const app = require('../app'); // Replace with the path to your application file

describe('Unit Test /', () => {
  it('should respond with index.html', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

describe('Unit Test /app1', () => {
  it('should respond with "Hello App1!"', async () => {
    const response = await request(app).get('/app1');
    expect(response.status).toBe(200);
  });
});

describe('Unit Test /app2', () => {
  it('should respond with "Hello App2!"', async () => {
    const response = await request(app).get('/app2');
    expect(response.status).toBe(200);
  });
});

describe('Integration Test Connect Database', () => {
  let querySpy;

  beforeEach(() => {
    // Set mock connection query for the application to use
    querySpy = jest.spyOn(connection, 'query').mockImplementation((sql, callback) => {
      const mockUsers = [
        { id: 1, name: 'dominic', email: 'dominic@gmail.com', no_telp: 5551234 },
        { id: 2, name: 'brian', email: 'brian@gmail.com', no_telp: 5551233 }
      ];
      callback(null, mockUsers);
    });
  });

  afterEach(() => {
    if (querySpy) {
      querySpy.mockRestore();
    }
  });

  it('should respond with users data', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });
});
