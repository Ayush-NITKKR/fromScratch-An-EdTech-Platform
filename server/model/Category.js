const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    course:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"course"
        }
    ]

},{ timestamps: true });

module.exports = mongoose.model("tags" , categorySchema);
