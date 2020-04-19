const Player = require('./database/Mongo/player');


require('colors');
const req = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
let rootURL = 'https://www.fifaindex.com/team/11/manchester-utd/';

//connect to mlab db
// const mdb = 'mongodb://garlic:tpzaitpzai66@ds249873.mlab.com:49873/gql-football';
// const db = mongoose.connection
// db.once('open', () => {
//     console.log("connected !");
// })

// mongoose.connect(mdb, { useNewUrlParser: true, useUnifiedTopology: true });

req(rootURL, function (error, response, body) {
    const load = cheerio.load(body);
    const uri = [];
    const links = [];
    load('.link-player').each(function () {
        var link = load(this).attr('href');
        uri.push(link)
    })
    for (let i = 0; i < 40; i += 2) {
        links.push(uri[i])
    }

    links.forEach((link) => {
        const url = `https://www.fifaindex.com${link}`;
        getData(url);
    })
    // db.close()
});

function getData(url) {
    const data = [];
    req(url)
        .then(function (html) {
            //get the club
            const clb = rootURL.split('/');
            const club = clb[5].split('-').join(' ')
            data.push({ club: club })

            //get the position
            const gg = cheerio('span .position', html).map(function (i, el) {
                return cheerio(this).text()
            }).get().join(' ');

            const position = [];
            const pos = gg.split(' ');
            if (pos.length === 5 || pos.length === 4) {
                for (let i = 0; i < pos.length - 2; i++) {
                    position.push(pos[i]);
                }
            } else if (pos.length === 3) {
                for (let i = 0; i < pos.length - 1; i++) {
                    if (pos[i] !== 'Sub') {
                        position.push(pos[i]);
                    }
                }
            } else if (pos.length < 3) {
                position.push(pos[0])
            }

            if (position.length === 1) {
                data.push({ position: position[0] })
            } else {
                data.push({ position: position })
            }


            //get the id
            const id = url.split('/');
            const plrId = id[4];
            data.push({ id: plrId })

            //get the name
            let name2 = '';
            const name = cheerio('h1', html).text().split(' ');
            if (name.length === 5) {
                name2 = name.slice(0, 3).join(' ');
                data.push({ name: name2 });
            } else if (name.length === 4) {
                name2 = name.slice(0, 2).join(' ');
                data.push({ name: name2 });
            } else if (name.length < 4) {
                name2 = name.slice(0, 1).join(' ');
                data.push({ name: name2 });
            }

            //get the skills
            const skills = cheerio('.item .card-body p', html).removeAttr('i[class=fa-minus]').map(function (i, el) {
                return cheerio(this).text();
            }).get()

            const skillset = [];
            skills.forEach((skill) => {
                const length = skill.split(' ');
                if (length.length <= 2) {
                    skillset.push(length[0].replace('.', ''))
                } else if (length.length > 2) {
                    skillset.push((length[0] + length[1]).replace('.', ''))
                }
            })

            const val = cheerio('.item .card-body p span .rating', html).removeAttr('i[class=fa-minus]').map(function (i, el) {
                return cheerio(this).text();
            }).get()

            for (let i = 0; i < 34; i++) {
                data.push({ [skillset[i]]: val[i] });
            }

            var obj = null;
            data.forEach((arr) => {
                obj = Object.assign({}, obj, arr)
            })


            console.log(obj);

            //save document model (obj) to db (mlab)
            // var newplr = new Player(obj);
            // newplr.save()
            // console.log("success");

            // var newPlr = new Player(obj);
            // newPlr.save(function (err) {
            //     if (err) {
            //         throw err;
            //     }
            //     console.log("added");
            // })
        })
        .catch(function (err) {
            throw err;
        })
}