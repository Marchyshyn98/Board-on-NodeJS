const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema({
    body: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: true
    },
    advert: {
        type: Schema.Types.ObjectId, // зв'язок з оголошенням під яким стоїть коментар
        ref: "Advert"
    },
    parent: { // батьківський коментар
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    children: [
        { // дочірні коментарі - масив
            type: Schema.Types.ObjectId,
            ref: "Comment",
            autopopulate: true
        }
    ],
    createdAt: { // дата створення комента
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
);

schema.set("toJSON", {
    virtuals: true
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Comment", schema);