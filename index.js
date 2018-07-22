import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import request from 'request';
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config, db }) => {

  let api = Router();

  api.post('/create', (req, res) => {
    const client = Magento2Client(config.magento2.api);

    request.post(config.extensions.paypal.api + '/v1/payments/payment', {
      auth: {
        user: config.extensions.paypal.client,
        pass: config.extensions.paypal.secret
      },
      body: {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        transactions: [{
          amount: {
            total: '5.99', // TODO: need get real data from client
            currency: 'USD'
          }
        }],
        redirect_urls: {
          return_url: 'https://www.mysite.com', // TODO: move to local.json
          cancel_url: 'https://www.mysite.com'
        }
      },
      json: true
    }, function (err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }

        // 3. Return the payment ID to the client
        res.json({
          id: response.body.id
        });
    });

  })

  api.post('/execute', (req, res) => {
    const client = Magento2Client(config.magento2.api);

    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID   = req.body.payerID;

    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(config.extensions.paypal.api + '/v1/payments/payment/' + paymentID + '/execute', {
      auth: {
        user: config.extensions.paypal.client,
        pass: config.extensions.paypal.secret
      },
      body: {
        payer_id: payerID,
        transactions: [{
          amount: {
            total: '10.99', // TODO: need get real data from client
            currency: 'USD'
          }
        }]
      },
      json: true
    }, function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      // 4. Return a success response to the client
      res.json({
        status: 'success'
      });
    });

  })

  return api
}
