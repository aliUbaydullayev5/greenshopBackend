const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true},
    img: {type: String, required: true},
    title: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: String, required: true},
    type: {type: String, required: true},
    data: {type: Date, default: Date.now()},
    owner: {type: Types.ObjectId, ref: 'user'}

})

module.exports = model('basket', schema)