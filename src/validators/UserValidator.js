const { body } = require('express-validator');
const msg = require('../config/Messages');

module.exports = {
    create: function(adminAccess = false){
        let validations = [
            body('name').notEmpty().withMessage(msg.USERS.NAME_NOT_INFORMED),
            body('email').notEmpty().withMessage(msg.USERS.EMAIL_NOT_INFORMED).isEmail().withMessage(msg.USERS.EMAIL_INVALID),
            body('cellphone').notEmpty().withMessage(msg.USERS.CELLPHONE_NOT_INFORMED).isLength(11).withMessage(msg.USERS.CELLPHONE_NUMBER_INVALID)
        ];
        if(adminAccess){
            validations.push(body('permission').notEmpty().withMessage(msg.USERS.PERMISSION_NOT_INFORMED));
        } else {
            validations.push(body('password').notEmpty().withMessage(msg.USERS.PASSWORD_NOT_INFORMED).isLength({min: 6, max: 10}).withMessage(msg.USERS.PASSWORD_MUST_BETWEEN_6_AND_10));
            validations.push(body('confirmPassword').notEmpty().withMessage(msg.USERS.CONFIRM_PASSWORD_NOT_INFORMED));
        }
        return validations;
    },
    update: function(adminAccess = false){
        let validations = [
            body('_id').notEmpty().withMessage(msg.USERS.ID_NOT_INFORMED),
            body('name').notEmpty().withMessage(msg.USERS.NAME_NOT_INFORMED),
            body('cellphone').notEmpty().withMessage(msg.USERS.CELLPHONE_NOT_INFORMED).isLength(11).withMessage(msg.USERS.CELLPHONE_NUMBER_INVALID)
        ];
        return validations;
    }
}