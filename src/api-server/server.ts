import express from 'express';
import brainRoutes from './brain/routes';

const bodyParser = require('body-parser');

const port = 4114;

// Create the express application
const app = express();
app.use(bodyParser.json());
app.use('/api/brain', brainRoutes);

app.get('/', (req, res) => {
  res.send('AllAi server is running!');
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
