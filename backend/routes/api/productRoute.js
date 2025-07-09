const express = require('express')
const router = express.Router();

// Product Model
const Product = require('../../models/Products');

// @route GET /products
// @desc Get ALL products
router.get('/', (req,res)=>{
    // Fetch all products from database
    Product.find({}, (error, products)=>{
        if (error) console.log(error)
        res.json(products)
    })
})

// @route POST /products
// @desc  Create a product
router.post('/', (req, res) => {
    // Clean the price input
    const rawPrice = req.body.price;
    const cleanedPrice = parseFloat(
        String(rawPrice).replace(/[^0-9.]/g, '') 
    );

    // Validate the cleaned price
    if (isNaN(cleanedPrice)) {
        return res.status(400).json({ error: 'Invalid price format' });
    }
    
    // Create a product item
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: cleanedPrice,
        quantity: req.body.quantity,
    });

    newProduct.save((err, product)=>{
        if (err) console.log(err)
        res.json(product)
    })
})
// @route PUT api/products/:id
// @desc  Update a product
router.put('/:id', (req,res)=>{
    // Update a product in the database
    Product.updateOne({_id:req.params.id},{
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        photo:req.body.photo
    }, {upsert: true}, (err)=>{
        if(err) console.log(err);
        res.json({success:true})
    })
})
// @route DELETE api/products/:id
// @desc  Delete a product
router.delete('/:id', (req,res)=>{
    // Delete a product from database
    Product.deleteOne({_id: req.params.id}, (err)=>{
        if (err){
            console.log(err)
            res.json({success:false})
        }else{
            res.json({success:true})
        }
    })
})

module.exports = router;