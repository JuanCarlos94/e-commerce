module.exports = {
    index: function(){
        return res.json(Object.values(UserPermissions));
    }
}