const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const {check, validationResult} = require("express-validator");
const User = require("./models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("./models/product.model");
const authMiddleWare = require("./middleWare/auth.middleWare");
const Basket = require("./models/basket.model");
mongoose.connect('mongodb+srv://ali:python20050302@cluster0.1iyoajf.mongodb.net/?retryWrites=true&w=majority')



const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json());


app.post('/register', [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
], async (req, res)=> {
    try{
        const error = validationResult(req)

        if (!error.isEmpty()){
            return res.status(400).json({
                errors: error.array(),
                message: 'min: 6'
            })
        }

        const {email, password} = req.body

        const condidate = await User.findOne({email})

        if (condidate) return res.status(400).json({message: 'Such a user exists'})

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User({email, password: hashedPassword})
        await user.save()
        res.status(200).json({message: 'User has been successfully created'})

    }catch (e){
        res.status(400).json({message: '404'})
    }
})

app.post('/login', [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пороль').exists()
], async (req, res)=> {
    try{
        const error = validationResult(req)

        if (!error.isEmpty()){
            return res.status(400).json({
                errors: error.array(),
                message: 'min: 6'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) return res.status(400).json({message: 'User not found'})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(400).json({message: 'Invalid password'})

        const token = jwt.sign(
            {userId: user.id, userEmail: user.email},
            'sekret key',
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})

    }catch (e){
        res.status(400).json({message: '404'})
    }
})











app.get('/' , async (req, res)=> {
    try{
        const products = await Product.find()
        res.json(products)
    }catch (e){
        res.status(400).json({message: '404'})
    }
})

app.get('/basket', authMiddleWare, async (req, res)=> {
    try{
        const bascket = await Basket.find({email: req.user.userEmail})
        res.json(bascket)
    }catch (e){
        res.status(400).json({message: '404'})
    }
})

app.get('/:id', async (req, res)=> {
    try{
        const product = await Product.find({_id: req.params.id})
        res.json(product)
    }catch (err){
        res.status(500).json({message: '404'})
    }
})

app.post('/addProduct', authMiddleWare, async (req, res)=> {
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

app.post('/addToBasket', authMiddleWare, async (req, res)=> {
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
app.post('/delete', authMiddleWare, async (req, res)=> {
    try{
        const {productId} = req.body
        await Basket.deleteOne({_id: productId})
        res.status(201).json({message: 'Success fully deleted'})
    }catch (e){
        res.status(400).json({message: '404'})
    }
})
// app.use('/api', authRouter)
// app.use('/product', productRouter)

app.get('/', (req, res)=> {
    res.send('<h1>Run Test</h1>')
})

app.listen(PORT, ()=> console.log(`Server has been started on PORT: ${PORT}`))

