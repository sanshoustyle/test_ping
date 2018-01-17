/*
Application: HeartBeat - toy website monitoring tool
Description: Notifies (by email) whenever application access is unavail
Usage: node heartbeat.js <website_to_ping>

Date modified: 1/16/18

Author: Thien Van

References:
Pre-built services
https://www.supermonitoring.com/blog/the-updated-list-of-website-monitoring-services/
Tutorials
https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
***https://blog.ragingflame.co.za/2013/2/14/roll-out-your-own-uptime-monitor-with-nodejs
Standard Module prereqs:
request
nodemailer (use dummy email account)
fs
//http
//express

Future work:
- use linter and proper code style for JS
- find out list of acceptable status codes, special responses
- ***test other status code or messages: https://httpstat.us/
- support for redirects
- fs support for input, or output (logging)
- list of websites
- email notification, active after specified time
*/
//var nodemailer = require('nodemailer');
//const nodemailer = require('nodemailer');

// Usage
if (process.argv.length !== 3) {
  console.log("Usage: node heartbeat.js <website_to_ping>");
  return;
}

var website = process.argv[2];

//var express = require('express');
//var http = require('http');
var request = require('request');

var statusCode = 200;
var startUpTime = new Date().toUTCString();

console.log("HeartBeat Application starting now: " + startUpTime);

// Define request parameters
var options = {
  url: website,
  method: 'GET',
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10,
  headers: {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8'
  }
};

setInterval(
  function() { request(website, function (err, res, body) {
    if (err) {
      return console.log(err);
    }
    // Logic for OK conditions
    if (res && res.statusCode >= 200 && res.statusCode <= 299) {
      statusCode = res.statusCode;
      console.log("Everything OK. Status Code is: " + statusCode);
    }
    // Determine what information to send out. I.e. time
    else {
      console.log("some kind of error, send notification here");
    }
    console.log(statusCode);
    console.log(new Date().toUTCString());
  });
}, 10000);

/* SAMPLE EMAIL MODULE
var from_email = process.argv[3];
var from_pw = process.argv[4];
var to_email = process.argv[5];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport({
  service: 'smtp.netzero.com',
  auth: {
    user: from_email,
    pass: from_pw
  }
});

var mailOptions = {
  from: from_email,
  to: to_email,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
