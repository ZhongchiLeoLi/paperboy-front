# paperboy-front

[**Paperboy**](http://paperboynews.ca) is a news website that automatically aggregates and summarizes news articles from [The Guardian](https://www.theguardian.com) using [basically](https://github.com/algao1/basically). It extracts keywords, removes transition phrases and other unimportant details.

## How It Was Built

The frontend was built with **Node**, **Express** and **EJS templating engine**. It fetches all the news from the backend through **axios** requests and displays them nicely with custom css scripts and **bootstrap**. The code is then containerized using **Docker** and deployed together with the backend using **GCP Kubernetes Engine**.

## This website features 

* **Fully responsive layout**: all pages are responsive to fit any screen sizes
* **Horizontal infinite scrolling**: more news will be fetched and added when the end of the page has been reached
* **Memorized scroll position**: the user will be brought back to the same scroll position with all their previously loaded news restored upon clicking the "Back to <category> news" button in a specific news page
* **Categorical tags**: to suit users with specific interests
* **Search bar**: functional search bar on the home page to find news with any keywords/phrases 
* **Related queries**: a list of keywords in every news article for interested user to perform quick searches
* **Related stories**: up to four related news stories at the bottom of each news article to fulfill the users' desire to keep reading
* **Error pages**: for when things don't go as expected

## What We Learned

* CSS adjustments and restrictions for a horizontal website
* How to combine jQuery, javascript event listeners and axios requests to make infinite scrolling pages
* How to utilize local storage to restore scroll positions
* How to create a sidebar controled by a hamburger menu
* How to containerize packages into Docker images and interact with other images hosted by Google Cloud

## Next Steps

* Create a Summarizer page that allows users input their own news articles to be summarized
* Migrate project to React
  