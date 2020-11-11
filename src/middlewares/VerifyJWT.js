const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({auth: false, message: 'Token not informed.'});
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err) 
            return res.status(500).json({auth: false, message: 'Failed to authenticate token.'});
        res.userId = decoded.id;
        next();
    })
}