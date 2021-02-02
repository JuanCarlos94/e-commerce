const Category = require('../models/Category');

module.exports = {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const category = new Category(req.body);
        await category.save();
        return res.status(201).json(category);
    },
    async list(req, res){
        const categories = await Category.find();
        return res.status(200).json(categories);
    }
}