const { mongoose } = require('../db/database');
const mongoosePaginate = require('mongoose-paginate-v2');



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
});

productSchema.plugin(mongoosePaginate);

mongoose.model('Product', productSchema);