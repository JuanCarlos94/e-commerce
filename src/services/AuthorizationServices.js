const jwt = require('jsonwebtoken');
const userServices = require('./UserServices');
const Messages = require('../config/Messages');

module.exports = {
    searchUserOwnerToken: async function(token){
        const user = await jwt.verify(this.removeBearerName(token), process.env.SECRET, async (err, decoded) => {
            if (err)
                throw Messages.Authorization.TOKEN_INVALID;
            return await userServices.find(decoded.id);
        })
        return user;
    },
    getUserIdFromToken: async function(token){
        const userId = await jwt.verify(this.removeBearerName(token), process.env.SECRET, async (err, decoded) => {
            if (err)
                throw Messages.Authorization.TOKEN_INVALID;
            return decoded.id;
        })
        return userId;
    },
    removeBearerName: function(token){
        if (!token) {
            throw Messages.Authorization.ACCESS_DENIED;
        }
        return token.slice(7);
    }
}