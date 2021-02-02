const msg = require('../config/Messages');
const { body } = require('express-validator');

module.exports = {
    login() {
        return [
            body('email').notEmpty().withMessage(msg.Authentication.EMAIL_NOT_INFORMED),
            body('password').notEmpty().withMessage(msg.Authentication.PASSWORD_NOT_INFORMED)
        ];
    }
}