const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    basket: {type: Types.ObjectId, ref: 'basket'}
})

module.exports = model('user', schema)