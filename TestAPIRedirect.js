var http = require('http');
const axios = require('axios');
http
  .createServer(async (req, res) => {
    const localResponse = await axios.get('http://localhost:6721/session');
    res.write(JSON.stringify(localResponse.data));
    res.end();
  })
  .listen(7777);
