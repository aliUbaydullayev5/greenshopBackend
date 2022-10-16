const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth.router')
const productRouter = require('./routers/product.router')
const fileUpload = require('express-fileupload')

mongoose.connect('mongodb+srv://ali:python20050302@cluster0.1iyoajf.mongodb.net/?retryWrites=true&w=majority')

const PORT = process.env.PORT || 8084
const app = express()

app.use(express.static('static'))
app.use(fileUpload({}))
app.use(cors())
app.use(express.json());

app.use('/api', authRouter)
app.use('/product', productRouter)

app.get('/', (req, res)=> {
    res.send('<h1>Run Test</h1>')
})

app.listen(PORT, ()=> console.log(`Server has been started on PORT: ${PORT}`))

