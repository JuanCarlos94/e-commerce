const { Router } = require('express');
const UsersController = require('./controllers/UsersController');
const AddressController = require('./controllers/AddressController');
const ProductController = require('./controllers/ProductController');
const AuthenticationController = require('./controllers/AuthenticationController');
const routes = Router();

/**
 * Authentication
 */
routes.post('/login', AuthenticationController.login)
    .post('/logout', AuthenticationController.logout);
routes.post('/users', UsersController.create)
    .get('/users', UsersController.all)
    .get('/users/:id', UsersController.find)

/**
 * Products
 */
routes.post('/products', ProductController.create)
    .get('/products/:id', ProductController.find)
    .get('/products', ProductController.list);

module.exports = routes