const Router = require('express')
const router = new Router()
const authMiddleWare = require('../middleWare/auth.middleWare')
const Product = require('../models/product.model')
const Basket = require('../models/basket.model')

router.get('/basket', authMiddleWare, async (req, res)=> {
    try{
        const bascket = await Basket.find({email: req.user.userEmail})
        res.json(bascket)
    }catch (e){
        res.status(400).json({message: '404'})
    }
})

router.get('/:id', async (req, res)=> {
    try{
        const product = await Product.find({_id: req.params.id})
        res.json(product)
    }catch (err){
        res.status(500).json({message: '404'})
    }
})
router.post('/addProduct', authMiddleWare, async (req, res)=> {
    try{
        if (req.user.userEmail !== 'admin@admin.com') return res.status(401).json({message: 'only ADMIN'})
        const {img, title, desc, price, type} = req.body
        const product = new Product({img, title, desc, price, type})
        await product.save()
        res.status(201).json({message: 'Success fully saved'})
    }catch (e){
        res.status(400).json({message: '404'})
    }
})

router.post('/addToBasket', authMiddleWare, async (req, res)=> {
    try{
        const {productId} = req.body
        const product = await Product.find({_id: productId})
        const basket = new Basket({
            productId: product[0]._id,
            email: req.user.userEmail,
            img: product[0].img,
            title: product[0].title,
            desc: product[0].desc,
            price: product[0].price,
            type: product[0].type,
            data: product[0].data,
            owner: product[0].owner
        })
        await basket.save()
        res.status(201).json({message: 'Success fully saved'})
    }catch (e){
        res.status(400).json({message: '404'})
    }
})
router.post('/delete', authMiddleWare, async (req, res)=> {
    try{
        const {productId} = req.body
        await Basket.deleteOne({_id: productId})
        res.status(201).json({message: 'Success fully deleted'})
    }catch (e){
        res.status(400).json({message: '404'})
    }
})



module.exports = router
