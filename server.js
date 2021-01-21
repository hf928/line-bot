const linebot = require('linebot');
const express = require('express');
const { ID, Secret, AccessToken } = require('./config/channel');

const app = express();

const bot = linebot({
    channelId: ID,
    channelSecret: Secret,
    channelAccessToken: AccessToken
});

const Reply_JPYExchangeRate = require('./messages/Reply_JPYExchangeRate');
Reply_JPYExchangeRate(bot);
// 停用
// const JPYExchangeRate = require('./pushs/JPYExchangeRate');
// JPYExchangeRate(bot);

bot.on('message', (evt) => {

    console.log('message', evt);

});

const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);
app.listen(process.env.PORT || 8080);
