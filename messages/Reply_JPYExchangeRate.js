const request = require('request');
const cheerio = require('cheerio');

// 台銀匯率頁面 url
const rateUrl = 'https://rate.bot.com.tw/xrt?Lang=zh-TW';

// 每半小時重置暫存匯率
const t = 30 * 60 * 1000;

// 暫存匯率
let jpyExRateTemp = 0;

// 重置暫存匯率
setInterval(() => jpyExRateTemp = 0, t);

// 爬台灣銀行匯率
const getJapanExRate = () => new Promise((resolve, reject) => {

    request({
        url: 'http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm',
        method: 'GET'
    }, (error, response, body) => {

        if (body && !error) {

            const querySelector = cheerio.load(body);
            // 日本現金賣出匯率 element
            const target = querySelector('.rate-content-cash.text-right.print_hide')[15];
            const jpyExRate = +target.children[0].data;

            resolve(jpyExRate);
            
        }
        else {

            console.log(error);
            reject(error);

        }

    });

});
  
module.exports = (bot) => {

    bot.on('message', async (evt) => {

        // 收到文字訊息
        if (evt.message.type === 'text') {

            const msg = evt.message.text;
    
            // 文字包含關鍵字: '匯率'
            if (msg.indexOf('匯率') !== -1) {

                let replyMsg = '';

                // 檢查是否有暫存匯率, 沒有就去爬
                if (jpyExRateTemp === 0) {

                    // 爬匯率
                    const jpyExRate = await getJapanExRate();

                    // 暫存匯率以供下次使用
                    jpyExRateTemp = jpyExRate;

                }

                
                replyMsg = `日幣匯率 ${jpyExRateTemp}
${rateUrl}`;

                // 回應訊息
                evt.reply(replyMsg);

            }
            
        }
    
    });
    
}
