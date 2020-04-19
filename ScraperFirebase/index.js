require('colors');
const req = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
let rootURL = 'https://www.fifaindex.com/players/2/';
const firebase = require('firebase');
const Init = require('./database/config');

//firebase initialization
// Init.initialize();

req(rootURL, function (error, response, body) {
    const load = cheerio.load(body);
    const links = [];
    load('.player a').each(function () {
        var link = load(this).attr('href');
        links.push(link);
    })

    const url = 'https://www.fifaindex.com/players/';
    getData(url);

    // links.forEach((link) => {
    //     const url = `https://www.fifaindex.com${link}`;
    //     getData(url);
    // })
});


function getData(url) {
    const data = [];
    req(url)
        .then(function (html) {
            //get the id
            const id = url.split('/');
            const plrId = id[4];
            data.push({id:plrId})

            // get the name
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
            const skills = cheerio('.item .card-body p', html).text().split(/(\d+)/).filter(Boolean);

            const skillset = []
            for (let i = 0; i < skills.length; i += 2) {
                const ab = skills[i].replace('.', '').split(' ');
                skillset.push(ab.join(''));
            };

            const val = []
            for (let j = 1; j < skills.length; j += 2) {
                val.push(skills[j]);
            }

            for (let i = 0; i < 34; i++) {
                data.push({ [skillset[i]]: val[i] });
            }

            var obj = null;
            data.forEach((arr) => {
                obj = Object.assign([], obj, arr)
            })
            // console.log(obj);

            // firebase
            //     .database()
            //     .ref("/PLAYERS")
            //     .push(obj)
            // console.log("Sent !");
        })
        .catch(function (err) {
            throw err;
        })

}

