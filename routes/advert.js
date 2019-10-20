const express = require("express");
const router = express.Router();
const models = require("../models");
const tr = require("transliter");

// GET for Edit
router.get("/edit/:id", async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const id = req.params.id.trim().replace(/ +(?= )/g, '');

    if (!userId || !userLogin) {
        res.redirect("/");
    } else {
        try {
            const advert = await models.Advert.findById(id); // шукаємо оголошення в БД

            if (!advert) {
                const err = new Error('Not Found');
                err.status = 404;
                next(err);
            }

            res.render("advert/edit", {
                advert,
                user: {
                    id: userId,
                    login: userLogin
                }
            });
        } catch (error) {
            throw new Error("Server Error");
        }
    }
});

// GET for Add
router.get("/add", (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!userId || !userLogin) {
        res.redirect("/");
    } else {
        res.render("advert/edit", {
            user: {
                id: userId,
                login: userLogin
            }
        });
    }
});

// POST for Add
router.post("/add", async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!userId || !userLogin) {
        res.redirect("/");
    } else {
        const title = req.body.title.trim().replace(/ +(?= )/g, ''); // trim забирає пробіли спочатку і в кінці, replace забирає двойні пробіли і робить один
        const body = req.body.body;
        const phone = req.body.phone;
        const isDraft = !!req.body.isDraft; // !! перетворює в логічне значення - true або false 
        const advertId = req.body.advertId;
        // const url = `${tr.slugify(title)}-${Date.now().toString(36)}`; // оновлюємо url по заголовку, щоб була унікальна
        
        console.log(isDraft);
        console.log(advertId);

        if (!title || !body || !phone) {
            const fields = [];
            if (!title) fields.push('title');
            if (!body) fields.push('body');
            if (!phone) fields.push('phone');
            res.json({
                ok: false,
                error: "Всі поля повинні бути заповненими",
                fields
            });
        } else if (title.length < 3 || title.length > 64) {
            res.json({
                ok: false,
                error: "Довжина заголовка від 3 до 64 символів",
                fields: ['title']
            });
        } else if (body.length < 10) {
            res.json({
                ok: false,
                error: "Довжина тексту не менше 10 символів",
                fields: ['body']
            });
        } else {
            try {
                if (advertId) { // перевіряємо чи оголошення приходить з id(редагування)
                    const advert = await models.Advert.findOneAndUpdate( // знаходимо іd оновлюєм в БД, двома параметрами
                        {
                            _id: advertId,
                            owner: userId
                        },
                        { // 2 параметром передаєм редаговане оголошення
                            title,
                            body,
                            phone,
                            // url,
                            owner: userId,
                            status: isDraft ? 'draft' : 'published'
                        },
                        { new: true } // після оновлення це буде нове оголошення
                    );

                    console.log(advert);

                    if (!advert) { // якщо немає такого оголошення 
                        res.json({
                            ok: false,
                            error: "Оголошення не твоє!"
                        });
                    } else {
                        res.json({
                            ok: true
                        });
                    }
                } else { // якщо оголошення приходить БЕЗ id(створення нового)
                    const advert = await models.Advert.create({ // чи без id(створення)
                        title,
                        body,
                        phone,
                        // url,
                        owner: userId
                    });
                    res.json({
                        ok: true,
                        advert
                    });
                }
            } catch (error) {
                res.json({
                    ok: false
                });
            }
        }
    }
});

module.exports = router;