import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import {Provider} from 'react-redux';
import createLocation from 'history/lib/createLocation';
import {fetchComponentDataBeforeRender} from '../common/api/fetchComponentDataBeforeRender';

import configureStore from '../common/store/configureStore';
import {getUser} from '../common/api/user';
import routes from '../common/routes';
import config from '../config';
import Helmet from 'react-helmet';

import apiRoutes from './routes';

import {connect} from 'react-redux';
import {getUserInfo} from '../common/actions/user';


const app = express();


const renderFullPage = (html, initialState, head) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${head.title}</title>
        <link rel="stylesheet" type="text/css" href="/static/app.css">
      </head>
      <body>
          <div id="root">${html}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
          <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
};

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/static', express.static(__dirname + '/../../dist'));
}

app.use(cookieParser());
app.use(bodyParser.json());
// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'));

app.use(session({
  secret: 'zaguzi-oss!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

//api router
app.use("/api", apiRoutes);



//react router
app.use(function (req, res, next) {
  GLOBAL.navigator = {
    userAgent: req.headers['user-agent']
  }
  next();
});

app.use((req, res) => {

  const location = createLocation(req.url);

  const token = req.headers['X-TOKEN'];

  getUser(token || false, user => {
      // console.log(user);
      match({routes, location}, (err, redirectLocation, renderProps) => {

        if (err) {
          console.error(err);
          return res.status(500).end('Internal server error');
        }
        if (!renderProps) {
          return res.status(404).end('Not found');
        }

        var store = null;
        if (user) {
          console.log('Insert with user information')
          store = configureStore({
            version: config.version,
            user: {
              userId: user.id,
              info: user,
              token: req.cookies.token
            }
          });
        } else {
          console.log('Inser info without user')
          store = configureStore({version: config.version});
        }
        const InitialView = (
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        );

        //This method waits for all render component promises to resolve before returning to browser
        fetchComponentDataBeforeRender(store.dispatch, renderProps.components, renderProps.params)
          .then(html => {
            const componentHTML = ReactDOMServer.renderToString(InitialView);
            const initialState = store.getState();
            let head = Helmet.rewind();
            res.status(200).end(renderFullPage(componentHTML, initialState, head));
          })
          .catch(err => {
            console.log(err);
            res.end(renderFullPage("", {}));
          });
      });

    }
  );

});

const server = app.listen(config.port, function () {
  const port = server.address().port;
  console.log('app listening at http://localhost:%s', port);
});



