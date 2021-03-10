if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const axios = require('axios').default;
const ejsMate = require('ejs-mate');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));


app.get('/', async function(req,res){
  const result = await axios.get('http://host.docker.internal:8080/api/summaries/world?size=5')
  // const result = await axios.get('http://localhost:8080/api/summaries/world?size=5')
  const news = result.data.Summaries;
  res.render('new_index', {news});
})

// app.get('/summarizor',function(req,res){
//     res.render('index');
//   })

// app.post('/summarizor', async (req, res) => {
//     let textOut = "";
//     try {
//         const result = await axios.post('http://localhost:8080/summarize', req.body)
//         // console.log(req.body);
//         // console.log(result.data);
//         textOut = result.data.textOut;
//     } catch (error) {
//         console.log('POST REQUEST TO SUMMARIZE ERROR');
//     }
//     let textIn = req.body.textIn;
//     res.render('result', {textIn, textOut});
// })

app.get('/:id', async function(req,res){
    const result = await axios.get(`http://host.docker.internal:8080/api/summary?id=${req.params.id}`);
    // const result = await axios.get(`http://localhost:8080/api/summary?id=${req.params.id}`);
    const item = result.data;
    const next_result = await axios.get(`http://host.docker.internal:8080/api/summaries/world?id=${req.params.id}&size=1`);
    // const next_result = await axios.get(`http://localhost:8080/api/summaries/world?id=${req.params.id}&size=1`);
    const next = next_result.data.Summaries[0];
    res.render('show', {item, next});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
})