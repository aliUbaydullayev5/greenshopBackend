const {Schema, model } = require('mongoose')

const schema = new Schema({
    img: {type: String, required: true},
    title: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: String, required: true},
    type: {type: String, required: true},
    data: {type: Date, default: Date.now()},
})

module.exports = model('product', schema)