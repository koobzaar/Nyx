

const currentChampions = require('./currentChampions.json'); // Here you shoud change to Riot's default champion.json
const fs = require('fs')

const version = "11.8.1" // Current version of the game



let treatedChampions = Object.entries(currentChampions.data)
let res = []
treatedChampions.map(champion => {
    res.push({
        "id":champion[1].id.toLowerCase(),
        "key":champion[1].key.toString(),
        "name":champion[1].name,
        "title":champion[1].title,
        "icon":`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion[1].id}.png`,
        "description":champion[1].blurb
    })
})
let data  = JSON.stringify(res)
fs.writeFile('champions.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
console.log(res)
