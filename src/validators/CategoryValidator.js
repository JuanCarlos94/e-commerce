const { body } = require('express-validator');

module.exports = {
    create() {
        return [
            body('name').notEmpty(),
            body('key').notEmpty(),
        ];
    }
}