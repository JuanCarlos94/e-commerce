module.exports = {
    Authentication: {
        EMAIL_NOT_INFORMED: 'Email not informed',
        PASSWORD_NOT_INFORMED: 'Password not informed'
    },
    Authorization: {
        ACCESS_DENIED: 'Access denied',
        PERMISSION_DENIED: 'Permission denied',
        TOKEN_INVALID: 'Token invalid',
        USER_NOT_FOUND: 'User not found',
        WRONG_PASSWORD: 'Wrong password'
    },
    USERS: {
        NAME_NOT_INFORMED: 'Name not informed',
        EMAIL_NOT_INFORMED: 'E-mail not informed',
        EMAIL_INVALID: 'E-mail invalid',
        PASSWORD_NOT_INFORMED: 'Password not informed',
        PASSWORD_MUST_BETWEEN_6_AND_10: 'Password size must between 6 and 10',
        CONFIRM_PASSWORD_NOT_INFORMED: 'Confirm password not informed',
        ID_NOT_INFORMED: 'ID not informed',
        CELLPHONE_NOT_INFORMED: 'Cellphone not informed',
        CELLPHONE_NUMBER_INVALID: 'Cellphone invalid',
        PERMISSION_NOT_INFORMED: 'User permission not informed',
        ERROR_CREATE: 'Error creating user.',
        EMAIL_REGISTERED: 'E-mail registered for another user',
        USER_NOT_FOUND: 'User not found',
        USER_ID_INVALID: 'User ID invalid',
        USER_ERROR_DELETING: 'Error when deleting user',
        PASSWORD_NOT_MATCH: 'Passwords not match'
    },
    PRODUCTS: {
        NAME_NOT_INFORMED: 'Name not informed',
        DESCRIPTION_NOT_INFORMED: 'Description not informed',
        COUNT_NOT_INFORMED: 'Count not informed',
        CATEGORY_NOT_INFORMED: 'Category not informed',
        UNIT_VALUE_NOT_INFORMED: 'Unit value not informed'
    },
    PRODUCTS_EVALUATIONS: {
        REGISTERED: 'Evaluation registered with success',
        ERROR_WHEN_SAVING: 'Error, try again!',
        PRODUCT_NOT_FOUND: 'Product not found.',
        USER_NOT_FOUND: 'User not found',
        EVALUATION_NOT_FOUND: 'Evaluation not found',
        ERROR_WHEN_LIST_EVALUATIONS_BY_PRODUCT: 'Error when list evaluations by product'
    },
    PURCHASE: {
        STATUS: {
            REGISTERED: '',
            AWAITING_PAYMENT: 'Awaiting payment',
            DELIVERED: 'Delivered',
            SENT: 'Sent',
            CANCELED: 'Canceled'
        },
        CREATED: 'Purchase created',
        ERROR_WHEN_REGISTERING_PURCHASE: 'Error when registering purchase, try again'
    },
    PAYMENT: {
        STATUS: {
            AWAITING_PAYMENT: 'Awaiting payment',
            PAID: 'Paid',
            CANCELED: 'Canceled',
            EXPIRED: 'Expired'
        },
        METHODS: {
            CREDIT_CARD: 'Credit card',
            BILLET: 'Billet'
        }
    },
    COUPON: {
        ERROR_WHEN_CREATED: 'Error when try create coupon, try again.'
    },
    DISCOUNT: {
        ERROR_WHEN_CREATING: 'Error when try create discount, try again.',
        DELETED: 'Deleted with success.',
        NAME_NOT_INFORMED: 'Name not informed',
        PRODUCTS_NOT_INFORMED: 'Products not informeds',
        VALUE_NOT_INFORMED: 'Value not informed',
        EXPIRES_AT_NOT_INFORMED: 'Expires at not informed',
        PERCENTAGE_NOT_INFORMED: 'Percentage not informed'
    }
}