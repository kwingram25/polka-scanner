import express from 'express';
import expressBasicAuth from 'express-basic-auth';

import 'dotenv/config';

const { PORT = 3001, USERS = '{}' } = process.env;

const users = JSON.parse(USERS as string);

const app = express();

// Password protect all static pages
app.use(expressBasicAuth({ challenge: true, users }));

// Serve app production bundle
app.use(express.static('dist'));

// Handle client routing, return all requests to the app
app.all('*', (_, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
