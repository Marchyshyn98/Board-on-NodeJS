const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const tr = require('transliter');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId, // робимо зв'язок між колекцією users і advert...у кожного оголошення є свій автор
        ref: "User"
    },
    status: { // опубліковане чи чорновик
        type: String,
        enum: ["published", "draft"],
        required: true,
        default: 'published'
    }
},
    {
        timestamps: true
    }
);

schema.plugin(
    URLSlugs('title', { // бере заголовок поста
        field: 'url', // створює поле url...також плагін робить url унікальним
        generator: text => tr.slugify(text) // генерує нову url з назви заголовка ...за допомогою транслітератора
    })
);

schema.set("toJSON", {
    virtuals: true
});

module.exports = mongoose.model("Advert", schema);