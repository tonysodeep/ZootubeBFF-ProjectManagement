const appTesting = require('./app-test');
const supertest = require('supertest');
const request = supertest(appTesting);

describe('/test end point', () => {
  it('should return a response', async () => {
    const response = await request.get('/test');
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });
});

// describe("Calculator tests", () => {
//   test('adding 1 + 2 should return 3', () => {
//     expect(mathOperations.sum(1, 2)).toBe(3);
//   });
// })
