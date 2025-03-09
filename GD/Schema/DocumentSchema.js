const mongoose = require('mongoose')

const DocumentSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
})


const document = mongoose.model('document', DocumentSchema)

module.exports = document