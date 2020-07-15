const request = require('request');
const cheerio = require('cheerio');

module.exports = (bot) => {

    let timer;
    const delay = 60 * 1000;
    const nextPushDelay = 10 * delay;

    const checkJapanExRate = () => {

        clearTimeout(timer);

        request({
            url: 'http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm',
            method: 'GET'
        }, (error, response, body) => {

            if (body && !error) {

                let curDelay = delay;

                const querySelector = cheerio.load(body);
                // 日本現金賣出匯率 element
                const target = querySelector('.rate-content-cash.text-right.print_hide')[15];
                const jpyExRate = +target.children[0].data;
                
                const utcHour = new Date().getHours();

                // 台銀匯率低於目標匯率
                if (jpyExRate < +process.env.JPYBuyExRate
                    // +08:00時區, 8點後24點前, 才推送
                    && (utcHour > 0 && utcHour < 16)) {

                    bot.broadcast(`現在日幣匯率 ${jpyExRate}`);

                    curDelay += nextPushDelay;

                }

                timer = setTimeout(checkJapanExRate, curDelay);
                
            }

        });

    }

    checkJapanExRate();

}
