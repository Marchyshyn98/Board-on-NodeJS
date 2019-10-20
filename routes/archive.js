const express = require("express");
const router = express.Router();
const models = require("../models");
const config = require("../config");
const moment = require("moment"); // плагін для обробки дати в гарний вигляд
moment.locale("uk"); 

async function adverts(req, res) { // функція для адреси archive і головної сторінки....вказуємо що вона буде працювати асинхронно
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    const perPage = +config.PER_PAGE; // кількість постів на сторінці
    const page = req.params.page || 1; // конкретна сторінка...беремо значення з url, якщо не задана то 1 cт.

    try {
        const adverts = await models.Advert.find({
            status: "published"
        }) // await це поки ми не візьмемо дані з бд, тоді скріпт продовжується
            .skip(perPage * page - perPage)
            .limit(perPage)
            .populate('owner')
            .sort({ createdAt: -1 });

        const count = await models.Advert.count(); // зупинка на наступне звернення до бд, тоді йдем далі

        res.render("archive/index", {
            adverts,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
                id: userId,
                login: userLogin
            }
        });

    } catch (error) {
        throw new Error("Server Error");
    }

    // models.Advert.find({})
    //     .skip(perPage * page - perPage)
    //     .limit(perPage)
    //     .populate('owner')
    //     .sort({ createdAt: -1 })
    //     .then(adverts => {
    //         models.Advert.count()
    //             .then(count => {
    //                 res.render("archive/index", {
    //                     adverts,
    //                     current: page,
    //                     pages: Math.ceil(count / perPage),
    //                     user: {
    //                         id: userId,
    //                         login: userLogin
    //                     }
    //                 });
    //             })
    //     })
    //     .catch(() => {
    //         throw new Error("Server Error");
    //     });
}

router.get('/archive/:page', (req, res) => adverts(req, res));
router.get("/", (req, res) => adverts(req, res));

// GET Advert
router.get("/adverts/:advert", async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const url = req.params.advert.trim().replace(/ +(?= )/g, ''); // беремо параметри з адреси сторінки

    if (!url) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    } else {
        try {
            const advert = await models.Advert.findOne({
                url,
                status: "published"
            })
            .populate("owner");
            
            if (!advert) {
                const err = new Error('Not Found');
                err.status = 404;
                next(err);
            } else {
                const comments = await models.Comment.find({
                    advert: advert.id,
                    parent: { $exists: false } // виводимо спочатку ті коментарі які не містять в собі поля parent тобто батьківські
                })

                console.log(comments);
                
                res.render("advert/advert", {   
                    advert,
                    comments,
                    moment,
                    user: {
                        id: userId,
                        login: userLogin
                    }
                });
            }
        } catch (error) {
            throw new Error("Server Error");
        }

        // models.Advert.findOne({
        //     url
        // }).then(advert => {
        //     if (!advert) {
        //         const err = new Error('Not Found');
        //         err.status = 404;
        //         next(err);
        //     } else {
        //         res.render("advert/advert", {
        //             advert,
        //             user: {
        //                 id: userId,
        //                 login: userLogin
        //             }
        //         });
        //     }
        // });
    }
});

router.get("/users/:login/:page*?", async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;
    const login = req.params.login;

    try {
        const user = await models.User.findOne({
            login
        });
        const adverts = await models.Advert.find({
            owner: user.id,
            status: "published"
        })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .populate('owner')
            .sort({ createdAt: -1 });
        const count = await models.Advert.count({
            owner: user.id
        });

        res.render("archive/index", {
            adverts,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
                id: userId,
                login: userLogin
            }
        });

    } catch (error) {
        throw new Error("Server Error");
    }

    // models.User.findOne({
    //     login
    // }).then(user => {
    //     models.Advert.find({
    //         owner: user.id
    //     })
    //         .skip(perPage * page - perPage)
    //         .limit(perPage)
    //         .populate('owner')
    //         .sort({ createdAt: -1 })
    //         .then(adverts => {
    //             models.Advert.count({
    //                 owner: user.id
    //             })
    //                 .then(count => {
    //                     res.render("archive/index", {
    //                         adverts,
    //                         current: page,
    //                         pages: Math.ceil(count / perPage),
    //                         user: {
    //                             id: userId,
    //                             login: userLogin
    //                         }
    //                     });
    //                 })
    //         })
    //         .catch(() => {
    //             throw new Error("Server Error");
    //         })
    // })
});

//Get Adverts by owner

module.exports = router;