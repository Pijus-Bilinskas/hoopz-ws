import express from 'express';
import { matchesRouter } from './routes/matches.js';

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/matches', matchesRouter);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});