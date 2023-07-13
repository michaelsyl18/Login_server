require('./config/db');

const express = require('express');
const app = express();
const port = 3000;

const UserRouter = require('./api/User');

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
