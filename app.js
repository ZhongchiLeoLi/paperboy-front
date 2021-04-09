if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const axios = require('axios').default;
const ejsMate = require('ejs-mate');
// const { ObjectId } = require('bson');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));

const paperboy_back = process.env.PAPERBOY_BACK || "localhost";
const paperboy_back_port = process.env.PAPERBOY_BACK_PORT || 8080;

console.log(`${paperboy_back}:${paperboy_back_port}`)

let world_lstDate = '';
let world_news =[];
let technology_lstDate = '';
let technology_news =[];
let science_lstDate = '';
let science_news =[];
let environment_lstDate = '';
let environment_news =[];
let search_news =[];

app.get('/', async function(req,res){
    let home_news = [];
    let result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/technology?size=1`)
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/world?size=2`)
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/science?size=2`)
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/environment?size=2`)
    home_news = home_news.concat(result.data.Summaries);
    res.render('home', {news: home_news});
})

app.get('/about', async function(req,res){
    res.render('about');
})

app.get('/world', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/world?size=6`)
    if(!world_news.length || world_news[0].ObjectId != result.data.Summaries[0].ObjectId) {
        world_news = result.data.Summaries;
        world_lstDate = result.data.LastDate;
    }
    console.log(world_news.length);
    res.render('index', {news: world_news, type: 'world'});
})

app.get('/technology', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/technology?size=6`)
    if(!technology_news.length || technology_news[0].ObjectId != result.data.Summaries[0].ObjectId) {
        technology_news = result.data.Summaries;
        technology_lstDate = result.data.LastDate;
    }
    console.log(technology_news.length);
    res.render('index', {news: technology_news, type: 'technology'});
})

app.get('/science', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/science?size=6`)
    if(!science_news.length || science_news[0].ObjectId != result.data.Summaries[0].ObjectId) {
        science_news = result.data.Summaries;
        science_lstDate = result.data.LastDate;
    }
    console.log(science_news.length);
    res.render('index', {news: science_news, type: 'science'});
})

app.get('/environment', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/environment?size=6`)
    if(!environment_news.length || environment_news[0].ObjectId != result.data.Summaries[0].ObjectId) {
        environment_news = result.data.Summaries;
        environment_lstDate = result.data.LastDate;
    }
    console.log(environment_news.length);
    res.render('index', {news: environment_news, type: 'environment'});
})

app.get('/search', async function(req, res) {
    const {q} = req.query;
    console.log(q);
    const result = await axios.get(encodeURI(`http://${paperboy_back}:${paperboy_back_port}/api/summaries?q=${q}&size=36`))
    search_news = result.data;
    res.render('index', {news: search_news, type: 'search', query: q});
})

app.get('/loadmore', async function(req,res){
    const {type} = req.query;
    console.log(type);
    if(type != 'search'){
        if( type == 'world') {
            const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${world_lstDate}&size=6`)
            if(result.data.Summaries) {
                world_lstDate = result.data.LastDate;
                world_news = await world_news.concat(result.data.Summaries);
                console.log(world_news.length);
                res.send(result.data);
            }
        }
        else if ( type == 'technology' ) {
            const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${technology_lstDate}&size=6`)
            if(result.data.Summaries) {
                technology_lstDate = result.data.LastDate;
                technology_news = await technology_news.concat(result.data.Summaries);
                console.log(technology_news.length);
                res.send(result.data);
            }
        }
        else if ( type == 'science' ) {
            const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${science_lstDate}&size=6`)
            if(result.data.Summaries) {
                science_lstDate = result.data.LastDate;
                science_news = await science_news.concat(result.data.Summaries);
                console.log(science_news.length);
                res.send(result.data);
            }
        }
        else if ( type == 'environment' ) {
            const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${environment_lstDate}&size=6`)
            if(result.data.Summaries) {
                environment_lstDate = result.data.LastDate;
                environment_news = await environment_news.concat(result.data.Summaries);
                console.log(environment_news.length);
                res.send(result.data);
            }
        }
    }
    res.send({Summaries: null});
})

async function getRelated(item, id) {
    let related = [];
    let ind = 0;
    while(related.length < 4 && ind <= 9) {
        console.log(item.Article.Keywords[ind].Word);
        let result = await axios.get(encodeURI(`http://${paperboy_back}:${paperboy_back_port}/api/summaries?q=` + item.Article.Keywords[ind].Word));
        let relates = result.data;
        if(relates) {
            related = related.concat(relates);
            related = related.filter(ele => ele.ObjectId != id);
            related = Array.from(new Set(related.map(a => a.ObjectId))).map(id => { return related.find(a => a.ObjectId === id)});
        }
        ind++;
    }
    return related;
}


app.get('/world/:id', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`);
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render('show', {item, related: related.slice(0, 4), type: 'world'});
})

app.get('/technology/:id', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`);
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render('show', {item, related: related.slice(0, 4), type: 'technology'});
})

app.get('/science/:id', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`);
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render('show', {item, related: related.slice(0, 4), type: 'science'});
})

app.get('/environment/:id', async function(req,res){
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`);
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render('show', {item, related: related.slice(0, 4), type: 'environment'});
})

app.get('/search/:id', async function(req,res){
    const {q} = req.query;
    const result = await axios.get(`http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`);
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render('show', {item, related: related.slice(0, 4), type: 'search', query: q});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
})