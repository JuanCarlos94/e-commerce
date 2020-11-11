const { Router } = require('express');
const UsersController = require('./controllers/UsersController');
const AddressController = require('./controllers/AddressController');
const routes = Router()

routes.post('/users', UsersController.create)
    .get('/users', UsersController.all)
    .get('/users/:id', UsersController.find)

routes.post('/address/:userId', AddressController.create)

module.exports = routes