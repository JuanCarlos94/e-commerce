const { body } = require('express-validator');
const MSG = require('../config/Messages');

module.exports = {
    create() {
        return [
            body('name').notEmpty().withMessage(MSG.DISCOUNT.NAME_NOT_INFORMED),
            body('value').notEmpty().withMessage(MSG.DISCOUNT.VALUE_NOT_INFORMED),
            body('expiresAt').notEmpty().withMessage(MSG.DISCOUNT.EXPIRES_AT_NOT_INFORMED),
            body('percentage').notEmpty().withMessage(MSG.DISCOUNT.PERCENTAGE_NOT_INFORMED)
        ];
    }
}