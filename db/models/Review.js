const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({

    whoReview: {type:mongoose.SchemaTypes.ObjectId, required: true},
    whoGotReviewed: {type:mongoose.SchemaTypes.ObjectId, required: true},
    body: { type: String,required:true},
    date: { type: Date, default: Date.now }

},
{timestamps:true},
{ collection : 'reviews' }
);

module.exports = mongoose.model("Review", ReviewSchema);

