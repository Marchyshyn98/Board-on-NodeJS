const express = require("express");
const router = express.Router();
const models = require("../models");

router.post("/add", async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const advert = req.body.advert;
    const body = req.body.body;
    const parent = req.body.parent;

    if (!userId || !userLogin) {
        res.json({
            ok: false,
            error: "Увійдіть в аккаунт"
        });
    } else if (!body) {
        res.json({
            ok: false,
            error: "Коментар не введено!"
        });
    } else {
        try {
            if (!parent) { // якщо нема батьківського коментаря(parent) то створюємо без нього
                await models.Comment.create({
                    advert,
                    body,
                    owner: userId
                });

                res.json({
                    ok: true
                });
            } else {
                const parentComment = await models.Comment.findById(parent);
                if (!parentComment) {
                    res.json({
                        ok: false
                    });
                } else {
                    const comment = await models.Comment.create({ // відправляємо дочірній коментар з id батьківського
                        advert,
                        body,
                        parent,
                        owner: userId
                    });

                    const children = parentComment.children; // беремо батьківський коментар і поміщаємо в нього дочірній - масив children
                    children.push(comment.id);
                    parentComment.children = children; // після додачі комента в масив присвоюємо його в модель коментаря
                    await parentComment.save();

                    res.json({
                        ok: true
                    });
                }
            }
        } catch (error) {
            throw new Error("Server Error");
        }
    }
});

module.exports = router;