const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => console.log('server is open'));

app.post('/ready', async (req, res) => {

  const amount = req.body.amount;
  axios({
    method: 'POST',
    url: 'https://kapi.kakao.com/v1/payment/ready',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': 'KakaoAK 4e81eea49a31de2aed5854460d16fa0c',
    },
    params: {
      cid: 'TC0ONETIME',
      partner_order_id: 'partner_order_id',
      partner_user_id: 'partner_user_id',
      item_name: '페이오티 1000원 결제',
      quantity: 1,
      total_amount: amount,
      vat_amount: 0,
      tax_free_amount: 0,
      approval_url: 'http://localhost:3000/success',
      fail_url: 'http://localhost:3000/fail',
      cancel_url: 'http://localhost:3000/cancel',
    },
  })
    .then(result => {
      // console.log("result => ");
      // console.log(result);
      return res.status(200).json(result.data);
    }).catch(error => {
      // console.log("error => ");
      // console.log(error);
      return res.status(400).json(error);
    });
});

app.post('/pay', (req, res) => {
  const tid = req.body.tid;
  const pg_token = req.body.pg_token;

  console.log({ tid, pg_token });

  axios({
    method: 'POST',
    url: 'https://kapi.kakao.com/v1/payment/approve',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': 'KakaoAK 4e81eea49a31de2aed5854460d16fa0c',
    },
    params: {
      cid: 'TC0ONETIME',
      tid,
      partner_order_id: 'partner_order_id',
      partner_user_id: 'partner_user_id',
      pg_token,
    },
  }).then(result => {
    return res.status(200).json(result.data);
  }).catch(error => {
    return res.status(400).json(error);
  });
});

app.get('/success', (req, res) => {
  console.log(req.query);
  console.log('success');

  return res.status(200).json({ result: true });
});