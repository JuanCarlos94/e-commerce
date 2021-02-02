const { Router } = require('express');
const routes = Router();

/**
 * Middlewares
 */
const Authorization = require('./middlewares/Authorization');

/**
 * Controllers
 */
const UsersController = require('./controllers/UsersController');
const SuperAdminController = require('./controllers/SuperAdminController');
const UsersPermissionsController = require('./controllers/UsersPermissionsController');
const AddressController = require('./controllers/AddressController');
const ProductController = require('./controllers/ProductController');
const AuthenticationController = require('./controllers/AuthenticationController');
const CategoryController = require('./controllers/CategoryController');

/**
 * Validators
 */
const UserValidator = require('./validators/UserValidator');
const ProductValidator = require('./validators/ProductValidator');
const AuthenticationValidator = require('./validators/AuthenticationValidator');
const CategoryValidator = require('./validators/CategoryValidator');

/**
 * Permissions
 */
const UserPermissions = require('./models/UserPermission');

/**
 * Authentication
 */
routes.post('/login', AuthenticationValidator.login(), AuthenticationController.login)
    .post('/logout', AuthenticationController.logout);

/**
 * Users
 */
routes.post('/signup', UserValidator.create(), UsersController.create)
    .get('/me', UsersController.me)
    .put('/users', UserValidator.update(), UsersController.update);

/**
 * Addresses
 */
routes.post('/address/:userId', AddressController.create);

/**
 * Products
 */
routes.post('/products', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), ProductValidator.create(), ProductController.create)
    .get('/products/:id', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), ProductController.find)
    .get('/products', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), ProductController.list)
    .put('/products/:id', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), ProductValidator.update(), ProductController.update);

/**
 * Categories
 */
routes.post('/categories', CategoryValidator.create(), CategoryController.create)
    .get('/categories', CategoryController.list);

/**
 * Super Admin only
 */
routes.post('/super-admin/users', Authorization([UserPermissions.SUPER_ADMIN]), UserValidator.create(true), SuperAdminController.create)
    .get('/super-admin/users/:id', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), SuperAdminController.find)
    .get('/super-admin/users', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), SuperAdminController.index)
    .put('/super-admin/users/:id', Authorization([UserPermissions.SUPER_ADMIN]), UserValidator.update(true), SuperAdminController.update)
    .delete('/super-admin/users/:id', Authorization([UserPermissions.ADMIN, UserPermissions.SUPER_ADMIN]), SuperAdminController.remove);

/**
 * User permissions
 */
routes.get('/user-permissions', Authorization(UserPermissions.SUPER_ADMIN), UsersPermissionsController.index)

/**
 * Middleware errors format
 */
routes.use((error, req, res, next) => {
    console.log(error)
    res.status(error.httpStatusCode).json({
        message: error.message
    })
})

module.exports = routes;