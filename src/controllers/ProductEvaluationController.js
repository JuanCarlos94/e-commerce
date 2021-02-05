const ProductEvaluation = require('../models/ProductEvaluation');
const msg = require('../config/Messages');
const AuthorizationServices = require('../services/AuthorizationServices');
const ProductServices = require('../services/ProductServices');

module.exports = {
    async create(req, res){
        const token = req.headers['authorization'];
        const user = await AuthorizationServices.searchUserOwnerToken(token);
        if(!user) return res.status(201).json({message: msg.PRODUCTS_EVALUATIONS.USER_NOT_FOUND});

        const product = await ProductServices.find(req.body.productId);
        if(!product) res.status(404).json({message: msg.PRODUCTS_EVALUATIONS.PRODUCT_NOT_FOUND});

        const evaluation = new ProductEvaluation(req.body);
        const today = new Date();
        evaluation.date = today.toString();
        evaluation.user = user._id;
        evaluation.product = product._id;
        return evaluation.save((err, obj) => {
            if(err) return res.status(500).json({message: err});
            return res.status(201).json(obj);
        });
    },
    find(req, res){
        return ProductEvaluation.findById(req.params.id, (err, evaluation) => {
            if(err) return res.status(404).json({message: msg.PRODUCTS_EVALUATIONS.EVALUATION_NOT_FOUND});
            return res.status(200).json(evaluation);
        });
    },
    async listByProduct(req, res){
        const limit = 10;
        const page = parseInt(req.params.page);
        const skip = page <= 0 ? 0 : (page - 1) * 10;
        const evaluations = await ProductEvaluation.find({product: req.params.productID}, ['rating', 'message', 'date'], {skip, limit}).exec();
        const count = await ProductEvaluation.countDocuments({product: req.params.productID}).exec();
        return res.set('X-TOTAL', count).status(200).json(evaluations);
    }
}