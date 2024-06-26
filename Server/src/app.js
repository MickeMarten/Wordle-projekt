import express from 'express';
import fs from 'fs/promises';
import { engine } from 'express-handlebars';
import playerScoreRouter from '../routes/playerScoreHandler.js';
import wordHandlerRouter from '../routes/gameModeHandler.js';
import highScorePageRouter from '../routes/highScore.js';
import aboutUsRouter from '../routes/aboutUs.js';
import mongoose from 'mongoose';

const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.json());
app.use('/api', wordHandlerRouter);
app.use('/api', playerScoreRouter);
app.use('/', highScorePageRouter);
app.use('/', aboutUsRouter);

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
app.get('/', async (req, res) => {
  try {
    const html = await fs.readFile('../B7-Wordle/dist/index.html');
    res.type('html').send(html);
  } catch (error) {
    console.error('Error occurred while reading the file:', error);
    res.status(500).send('Internal Server Error');
  }
});

express.static('public');

app.use('/assets', express.static('../B7-Wordle/dist/assets'));

export default app;
