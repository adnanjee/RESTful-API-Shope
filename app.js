const express = require ('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products'); 
const ordersRoutes = require('./api/routes/orders'); 
const userRoutes = require ('./api/routes/user');

mongoose.connect(
                    'mongodb://adnan:'
                    + process.env.MONGO_PASSWORD
                    + '@cluster0-shard-00-00-5yjx2.mongodb.net:27017,cluster0-shard-00-01-5yjx2.mongodb.net:27017,cluster0-shard-00-02-5yjx2.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
                    { useNewUrlParser: true }
                );
                
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );
    if (req.method == 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT, POST, PATCH ,DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);
app.use('/user',userRoutes);


app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((req, res, next) => {   //to address all types of errors
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});
module.exports = app;