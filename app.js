// Require node packages and other tools
const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios").default;
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

// Set up view engine and directory for easier file path navigation
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// Choose ports for development/production mode
const paperboy_back = process.env.PAPERBOY_BACK || "localhost";
const paperboy_back_port = process.env.PAPERBOY_BACK_PORT || 8080;
console.log(`${paperboy_back}:${paperboy_back_port}`);

// Initialize variables
let world_lstDate = "";
let world_news = [];
let technology_lstDate = "";
let technology_news = [];
let science_lstDate = "";
let science_news = [];
let environment_lstDate = "";
let environment_news = [];
let search_news = [];

// Home page
app.get(
  "/",
  catchAsync(async function (req, res, next) {
    let home_news = [];
    // Fetch news to display on home page
    let result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/technology?size=1`
    );
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/world?size=2`
    );
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/science?size=2`
    );
    home_news = home_news.concat(result.data.Summaries);
    result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/environment?size=2`
    );
    home_news = home_news.concat(result.data.Summaries);
    res.render("home", { news: home_news, type: "home" });
  })
);

// About page
app.get("/about", async function (req, res) {
  res.render("about", { type: "about" });
});

// World News page
app.get(
  "/world",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/world?size=6`
    );
    // Update world news values if no world news have been loaded, or if there are new world news in the db
    if (
      !world_news.length ||
      world_news[0].ObjectId != result.data.Summaries[0].ObjectId
    ) {
      world_news = result.data.Summaries;
      world_lstDate = result.data.LastDate;
    }
    console.log(world_news.length);
    res.render("index", { news: world_news, type: "world" });
  })
);

// Technology News page
app.get(
  "/technology",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/technology?size=6`
    );
    // Update technology news values if no technology news have been loaded, or if there are new technology news in the db
    if (
      !technology_news.length ||
      technology_news[0].ObjectId != result.data.Summaries[0].ObjectId
    ) {
      technology_news = result.data.Summaries;
      technology_lstDate = result.data.LastDate;
    }
    console.log(technology_news.length);
    res.render("index", { news: technology_news, type: "technology" });
  })
);

// Science News page
app.get(
  "/science",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/science?size=6`
    );
    // Update science news values if no science news have been loaded, or if there are new science news in the db
    if (
      !science_news.length ||
      science_news[0].ObjectId != result.data.Summaries[0].ObjectId
    ) {
      science_news = result.data.Summaries;
      science_lstDate = result.data.LastDate;
    }
    console.log(science_news.length);
    res.render("index", { news: science_news, type: "science" });
  })
);

// Environment News page
app.get(
  "/environment",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summaries/environment?size=6`
    );
    // Update environment news values if no environment news have been loaded, or if there are new environment news in the db
    if (
      !environment_news.length ||
      environment_news[0].ObjectId != result.data.Summaries[0].ObjectId
    ) {
      environment_news = result.data.Summaries;
      environment_lstDate = result.data.LastDate;
    }
    console.log(environment_news.length);
    res.render("index", { news: environment_news, type: "environment" });
  })
);

// Searched News page
app.get(
  "/search",
  catchAsync(async function (req, res, next) {
    const { q } = req.query;
    console.log(q);
    // Fetch 36 news with the requested query
    const result = await axios.get(
      encodeURI(
        `http://${paperboy_back}:${paperboy_back_port}/api/summaries?q=${q}&size=36`
      )
    );
    search_news = result.data;
    res.render("index", { news: search_news, type: "search", query: q });
  })
);

// For loading more news to create infinite scrolling effect
app.get(
  "/loadmore",
  catchAsync(async function (req, res, next) {
    const { type } = req.query;
    console.log(type);
    if (type != "search") {
      if (type == "world") {
        // Fetch 6 more world news after the last news in the current world news array
        const result = await axios.get(
          `http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${world_lstDate}&size=6`
        );
        // If there are more, update current world news values
        if (result.data.Summaries) {
          world_lstDate = result.data.LastDate;
          world_news = await world_news.concat(result.data.Summaries);
          console.log(world_news.length);
          res.send(result.data);
        }
      } else if (type == "technology") {
        // Fetch 6 more technology news after the last news in the current technology news array
        const result = await axios.get(
          `http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${technology_lstDate}&size=6`
        );
        // If there are more, update current technology news values
        if (result.data.Summaries) {
          technology_lstDate = result.data.LastDate;
          technology_news = await technology_news.concat(result.data.Summaries);
          console.log(technology_news.length);
          res.send(result.data);
        }
      } else if (type == "science") {
        // Fetch 6 more science news after the last news in the current science news array
        const result = await axios.get(
          `http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${science_lstDate}&size=6`
        );
        // If there are more, update current science news values
        if (result.data.Summaries) {
          science_lstDate = result.data.LastDate;
          science_news = await science_news.concat(result.data.Summaries);
          console.log(science_news.length);
          res.send(result.data);
        }
      } else if (type == "environment") {
        // Fetch 6 more environment news after the last news in the current environment news array
        const result = await axios.get(
          `http://${paperboy_back}:${paperboy_back_port}/api/summaries/${type}?end=${environment_lstDate}&size=6`
        );
        // If there are more, update current environment news values
        if (result.data.Summaries) {
          environment_lstDate = result.data.LastDate;
          environment_news = await environment_news.concat(
            result.data.Summaries
          );
          console.log(environment_news.length);
          res.send(result.data);
        }
      }
    }
    res.send({ Summaries: null });
  })
);

// Helper function to create an array of related stories for a specific news
async function getRelated(item, id) {
  let related = [];
  let ind = 0;
  // Loop through the news' keywords until at least 4 news are found
  while (related.length < 4 && ind <= 9) {
    console.log(item.Article.Keywords[ind].Word);
    let result = await axios.get(
      encodeURI(
        `http://${paperboy_back}:${paperboy_back_port}/api/summaries?q=` +
          item.Article.Keywords[ind].Word
      )
    );
    let relates = result.data;
    if (relates) {
      related = related.concat(relates);
      related = related.filter((ele) => ele.ObjectId != id); // exclude the current news from the array
      related = Array.from(new Set(related.map((a) => a.ObjectId))).map(
        (id) => {
          return related.find((a) => a.ObjectId === id);
        }
      ); // remove duplicates from the array
    }
    ind++;
  }
  return related;
}

// World news show page
app.get(
  "/world/:id",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`
    );
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render("show", { item, related: related.slice(0, 4), type: "world" });
  })
);

// Technology news show page
app.get(
  "/technology/:id",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`
    );
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render("show", {
      item,
      related: related.slice(0, 4),
      type: "technology",
    });
  })
);

// Technology news show page
app.get(
  "/science/:id",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`
    );
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render("show", { item, related: related.slice(0, 4), type: "science" });
  })
);

// Environment news show page
app.get(
  "/environment/:id",
  catchAsync(async function (req, res, next) {
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`
    );
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render("show", {
      item,
      related: related.slice(0, 4),
      type: "environment",
    });
  })
);

// Search news show page
app.get(
  "/search/:id",
  catchAsync(async function (req, res, next) {
    const { q } = req.query;
    const result = await axios.get(
      `http://${paperboy_back}:${paperboy_back_port}/api/summary?id=${req.params.id}`
    );
    const item = result.data;
    let related = await getRelated(item, req.params.id);
    res.render("show", {
      item,
      related: related.slice(0, 4),
      type: "search",
      query: q,
    });
  })
);

// Redirect all other routes as error to the error handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Uh oh, something went wrong...";
  else if (err.message == "Request failed with status code 404")
    err.message =
      "Something went wrong with your request. Please check your url and try again.";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
