// const faker = require('faker');
// const TurndownService = require('turndown');

// const models = require('./models');

// const owner = '5d986297501b3e3bf09c1451';

// module.exports = () => {
//     models.Advert.remove()
//         .then(() => {
//             Array.from({ length: 20 }).forEach(() => {
//                 const turndownService = new TurndownService();

//                 models.Advert.create({
//                     title: faker.lorem.words(5),
//                     body: turndownService.turndown(faker.lorem.words(100)),
//                     phone: 777,
//                     owner
//                 })
//                     .then(console.log)
//                     .catch(console.log);
//             });
//         })
//         .catch(console.log);
// };