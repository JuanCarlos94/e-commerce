const msg = require('../config/Messages');
const { body } = require('express-validator');

module.exports = {
    create(){
        return [
            body('name').notEmpty().withMessage(msg.PRODUCTS.NAME_NOT_INFORMED),
            body('description').notEmpty().withMessage(msg.PRODUCTS.DESCRIPTION_NOT_INFORMED),
            body('count').notEmpty().withMessage(msg.PRODUCTS.COUNT_NOT_INFORMED),
            body('unitValue').notEmpty().withMessage(msg.PRODUCTS.UNIT_VALUE_NOT_INFORMED)
        ];
    },
    update(){
        return [
            body('name').notEmpty().withMessage(msg.PRODUCTS.NAME_NOT_INFORMED),
            body('description').notEmpty().withMessage(msg.PRODUCTS.DESCRIPTION_NOT_INFORMED),
            body('count').notEmpty().withMessage(msg.PRODUCTS.COUNT_NOT_INFORMED),
            body('unitValue').notEmpty().withMessage(msg.PRODUCTS.UNIT_VALUE_NOT_INFORMED)
        ];
    }
}