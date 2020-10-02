const express = require('express');
const cors = require('cors');
const app = express();
const questionRouter = require('./routes/questions');

app.use(cors());

app.use(express.json());

app.use('/questions', questionRouter);

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}...)`));