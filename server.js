const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth.router')
const productRouter = require('./routers/product.router')
mongoose.connect('mongodb+srv://ali:python20050302@cluster0.1iyoajf.mongodb.net/?retryWrites=true&w=majority')

const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json());

app.use('/api', authRouter)
app.use('/product', productRouter)

app.get('/', (req, res)=> {
    res.send('<h1>Run Test</h1>')
})

app.listen(PORT, ()=> console.log(`Server has been started on PORT: ${PORT}`))

