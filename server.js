const axios = require('axios');
require('dotenv').config();
const nodemailer = require('nodemailer');


async function sendKimp() {
    let kimp = 0;
    let headers = {
      'content-type' : 'application/json'
    }
    let date = getToday(); 
    
    let todayRate = 37;
    
    await axios.get("https://api.bitkub.com/api/market/ticker?sym=THB_BTC",
      {headers: headers}
    )
    .then(async function (response) {
      let coinPrice = parseInt(response.data.THB_BTC.last);
      let krwPrice;
      console.log(coinPrice);
      let bithumbData = await axios.get("https://api.bithumb.com/public/orderbook/BTC_KRW")
      .then((res) => {
        // console.log(res.data.data);
        krwPrice = (parseInt(res.data.data.bids[0].price) + parseInt(res.data.data.asks[0].price))/2;
      })
      console.log(todayRate);
      console.log(krwPrice);
      let thprice = coinPrice * todayRate;
      kimp = (krwPrice-thprice)/krwPrice *100;
      console.log((krwPrice-thprice)/krwPrice *100)
    })
  
    const startTime = new Date();
    
    const mailText = "<h1>" + startTime + "and kimp is " + kimp + "</h1>";
    console.log(process.env.GMAIL_MAIL);
    var mailOptions = {
        from: process.env.GMAIL_MAIL,
        to: process.env.GMAIL_MAIL,
        subject: '[Kimp]Now Kimp is '+kimp,
        html: mailText
    };
    
    transporter.sendMail(mailOptions, async function(error, info){
        if(error){
            console.log(error);
        }
    });
}



function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
  
    return year + month + day;
  }

  async function getRate() {
    let rate = 0;
    let date = await getToday();
    let data = await axios.get("https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=PEDuDguvC4GBdFFvGELsHpVngTEPR6Oz&searchdate=" + date +"&data=AP01")
    .then(async (res) => {
      console.log(res.data);
      for(let i=0;i<res.data.length;i++){
        if(res.data[i].cur_unit === "THB"){
          rate = parseInt(res.data[i].deal_bas_r);
        }
      }
      console.log(rate);
      return rate;
    })
}



  var transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
         user: process.env.GMAIL_MAIL,
         pass: process.env.GMAIL_PASS
    }
});
module.exports = { sendKimp, getToday};
  

// exports.api = functions.https.onRequest(app);
