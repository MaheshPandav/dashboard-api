require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendSms = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
       body: message,
       from: "Mahesh",
       to: phone
     })
    .then(message => console.log(message.sid));
}

module.exports = sendSms;

const express = require('express');
const bodyParser = require('body-parser');
const sendSms = require('./twillio/twilio');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = 3000;

const userDatabase = [];

// Create users endpoint
// app.post('/users', (req, res) => {
//   const { email, password, phone } = req.body;
//   const user = {
//     email,
//     password,
//     phone
//   };

//   userDatabase.push(user);

//   const welcomeMessage = 'Welcome to my Chillz! Your verification code is 54875';

//   sendSms(user.phone, welcomeMessage);

//   res.status(201).send({
//     message: 'Account created successfully, kindly check your phone to activate your account!',
//     data: user
//   })
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// module.exports = app;