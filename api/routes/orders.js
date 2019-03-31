const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const checkAuth = require('../middleware/check-auth');

router.get('/',checkAuth, (req, res, next) => {
    Order
    .find()
    .select('product quantity _id')
    .exec()
    .then( docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc =>{
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity:doc.quantity,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
            
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

router.post('/', checkAuth,(req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
            });
        return order
        .save()
    })
    .then( result =>{
        console.log(result);
        res.status(201).json({
            message: "Order Saved",
            createOrder:{
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:orderId', checkAuth,(req, res, next) => {
    res.status(200).json({
        message: "Updated Orders!",
        orderId: req.params.orderId
    });
});

router.get('/:orderId',(req,res,next) =>{
    const id = req.params.orderId;
    Order
    .findById(id)
    .exec()
    .then(doc =>{
        console.log("From Database", doc);
        res.status(200).json(doc);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    })
    .catch(err =>{
        res.status(500).json({
            message: "Product not found",
            error: err
        })
    });

    
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then( result =>{
        res.status(200).json({
            message: "Order Removed Successfully"
        })
    })
    .catch(err =>{
        res.status(500).json({
            message: "Product not found",
            error: err
        })
    });
});
module.exports = router;