const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  // gotcha: _id is not a string. actually an object so we need toString()
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
