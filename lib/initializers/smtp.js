var nodemailer  = require("nodemailer");
var initializer = module.exports;
var path        = require('path');
var mkdirp      = require("mkdirp");
var Promise     = require("bluebird");

initializer.init = function(stex) {
  var smtpConf = stex.conf.get("smtp");
  if(smtpConf) {
    stex.smtp = nodemailer.createTransport("SMTP",smtpConf);
  } else {
    //ensure the path exists
    var emailPath = path.join(stex.root, "tmp", "smtp");
    mkdirp.sync(emailPath)
    stex.smtp = nodemailer.createTransport("PICKUP", emailPath);
  }

  stex.smtp.sendMailAsync = Promise.promisify(stex.smtp.sendMail);
};

initializer.activate = function(stex) {
  global.smtp = stex.smtp;
}

initializer.shutdown = function(stex) {
  if(stex.smtp) {
    stex.smtp.close();
  }
}