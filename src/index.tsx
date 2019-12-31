import express from 'express';
import morgan from 'morgan';
import exphbs from 'express-handlebars';

interface Manifest {
  [key: string]: string;
}

import manifest from './config/manifest.json';

require('dotenv').config();

const app = express();


const PORT = process.env.PORT || 8081;
const JS_MANIFEST_KEY = process.env.JS_MANIFEST_KEY || 'app.js';
const JS_BUNDLE_PATH = (manifest as Manifest)[JS_MANIFEST_KEY] || 'app.js';
const BASE_PATH = process.env.BASE_PATH || '';
const PAGE_TITLE = process.env.PAGE_TITLE || 'App';
const APP_CONTAINER_ID = process.env.APP_CONTAINER_ID || 'app';
const jsSource = `${BASE_PATH}${JS_BUNDLE_PATH}`;

console.log(process.env.BASE_PATH, BASE_PATH, jsSource);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/health', (_request, response) => {
  return response.json({ health: 'ok' });
});

app.get('*', (_request, response) => {
  response.render('index', {
    layout: false,
    title: PAGE_TITLE,
    appContainerId: APP_CONTAINER_ID,
    jsSource,
  });
});

app.listen({ port: PORT }, () => {
  console.log(`🚀 app server ready on port ${PORT}`);
});
