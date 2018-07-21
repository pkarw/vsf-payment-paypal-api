# PayPal payment API extension

This API extension execute payment to PayPal gateway.
It use `develodesign/m2-paypal-payment` composer module so you have to install it in your Magento instance.

in your `local.json` file you should register the extension:
`"registeredExtensions": ["mailchimp-subscribe", "example-magento-api", "paypal-payment"],`

And need add the `paypal` settings to `extensions` key in `local.json`:
```
  "extensions": {
    "mailchimp": {
      ...
    },
    "paypal": {
      "api": "https://api.sandbox.paypal.com",
      "client": "",
      "secret": ""
    }
  }
```

The API endpoitns are:
```
/api/ext/paypal-payment/create
/api/ext/paypal-payment/execute
```