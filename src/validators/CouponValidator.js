const { body } = require('express-validator');
const MSG = require('../config/Messages');

module.exports = {
    create() {
        return [
            body('name').notEmpty().withMessage(MSG.COUPON.NAME_NOT_INFORMED),
            body('code').notEmpty().withMessage(MSG.COUPON.CODE_NOT_INFORMED),
            body('products').notEmpty().withMessage(MSG.COUPON.PRODUCTS_NOT_INFORMED),
            body('value').notEmpty().withMessage(MSG.COUPON.VALUE_NOT_INFORMED),
            body('expiresAt').notEmpty().withMessage(MSG.COUPON.EXPIREAT_NOT_INFORMED),
            body('percentage').notEmpty().withMessage(MSG.COUPON.PERCENTAGE_NOT_INFORMED)
        ];
    }
}