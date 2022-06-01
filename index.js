process.traceDeprecation = true;

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening  at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

/* const api_key = process.env.API_KEY;
const content_url = process.env.CONTENT_URL;
const content_name = process.env.CONTENT_NAME;

const dataToSend = {
    status: 'success',
    api_key,
    content_url,
    content_name
};

app.post('/api', (request, response) => {
    console.log('I got a request!');
    console.log(request.body);

    response.json(dataToSend);
}) */

