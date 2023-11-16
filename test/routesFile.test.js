// Import necessary modules and libraries
const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../src/route/routes'); // Adjust the path accordingly

// Configure the Express app
app.use(express.json());
app.use(router);

// Test for the GET /users route
describe('GET /users', () => {
    it('should return orders for the authenticated user', async () => {
      // Mocking the authenticated user ID
      const authenticatedUserId = 1; // Replace with the actual authenticated user's id
  
      // Mocking the database query result
      const mockDbQueryResult = {
        rows: [
          { id: 1, user_id: authenticatedUserId, movie_id: 101, delivery_date: '2023-01-01' },
          { id: 2, user_id: authenticatedUserId, movie_id: 102, delivery_date: '2023-01-02' },
          // Add more mocked rows as needed
        ],
      };
  
      // Mocking the database query method
      db.query.mockResolvedValueOnce(mockDbQueryResult);
  
      // Making a request to the route
      const response = await request(app).get('/users');
  
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(response.body.orders).toBeInstanceOf(Array);
      expect(response.body.orders.length).toBe(mockDbQueryResult.rows.length);
  
      // Check that all returned orders belong to the authenticated user
      response.body.orders.forEach((order, index) => {
        expect(order.user_id).toBe(authenticatedUserId);
        expect(order.id).toBe(mockDbQueryResult.rows[index].id);
        expect(order.movie_id).toBe(mockDbQueryResult.rows[index].movie_id);
        expect(order.delivery_date).toBe(mockDbQueryResult.rows[index].delivery_date);
        // Add more assertions as needed
      });
    });
  });
  

// Test for the POST /orders route
describe('POST /orders', () => {
  it('should place an order', async () => {
    const orderData = [
      {
        userId: 1,
        movieId: 123,
        deliveryDate: '2023-01-01',
        deliveryAgentId: 456,
        deliveryCharge: 300,
      },
    ];

    const response = await request(app)
      .post('/orders')
      .send(orderData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Successfully ordered!');
    expect(response.body).toHaveProperty('orders');
    expect(response.body.orders).toBeInstanceOf(Array);
  });
});

// Test for the POST /pickups route
describe('POST /pickups', () => {
  it('should schedule a pickup', async () => {
    const pickupData = [
      {
        pickupDate: '2023-01-02',
        orderId: 1, // Replace with a valid order ID
        pickupAgentId: 789,
        userId: 1, // Replace with a valid user ID
      },
    ];

    const response = await request(app)
      .post('/pickups')
      .send(pickupData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Successfully updated pickups!');
    expect(response.body).toHaveProperty('orders');
    expect(response.body.orders).toBeInstanceOf(Array);
  });
});

// Add more test cases as needed
