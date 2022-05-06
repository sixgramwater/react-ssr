import express from "express";
import cors from "cors";
import ReactDOM from "react-dom/server";
import * as React from "react";
import App from "../shared/App";
import { fetchPopularRepos } from '../shared/api';
import serialize from "serialize-javascript";
import { matchPath } from "react-router-dom"
import routes from '../shared/routes'

const app = express();

app.use(cors());
app.use(express.static("dist"));

app.get("*", (req, res, next) => {
  const activeRoute = routes.find((route) =>
    matchPath(route.path, req.url)
  ) || {}

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve();
  // instead of rendering immediately, we first fetch api and then renderToString after giving our component the fetched data
  // const markup = ReactDOM.renderToString(<App />);
  promise
    .then((data) => {
      const markup = ReactDOM.renderToString(<App serverData={data} />);

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with React Router</title>
          <script src="/bundle.js" defer></script>
          <link href="/main.css" rel="stylesheet">
          <script>
            window.__INITIAL_DATA__ = ${serialize(data)}
          </script>
        </head>

        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `);
    })
    .catch(next);

  // fetchPopularRepos()
  //   .then((data) => {
  //     // console.log(data);
  //     const markup = ReactDOM.renderToString(
  //       <App serverData={data} />
  //     )
  //     res.send(`
  //       <!DOCTYPE html>
  //       <html>
  //         <head>
  //           <title>SSR with React Router</title>
  //         </head>
  //         <script src="/bundle.js" defer></script>
  //         <link href="/main.css" rel="stylesheet" />
  //         <script>
  //           window.__INITIAL_DATA__ = ${serialize(data)}
  //         </script>
  //         <body>
  //           <div id="app">${markup}</div>
  //         </body>
  //       </html>
  //     `);
  //   })
  //   .catch(err => {
  //     res.send(err)
  //   })

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
