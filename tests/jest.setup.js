/* eslint-disable no-undef */
const crypto = require("crypto");
const { TextEncoder } = require("util");

// FormDataMock for addTemplate
global.FormData = function () {
  this.append = jest.fn();
};
// Text encoder + crypto for getTemplateId
global.TextEncoder = TextEncoder;
global.crypto = {
  subtle: {
    digest: function (algo, content) {
      return new Promise((resolutionFunc) => {
        resolutionFunc(
          arrayBufferToUint8Array(
            crypto
              .createHash("sha256")
              .update(new Buffer.from(content))
              .digest()
          )
        );
      });
    },
  },
};

global.generateTemplateIdFromNode = function (content, payload = "") {
  return crypto
    .createHash("sha256")
    .update(new Buffer.from(payload))
    .update(new Buffer.from(content))
    .digest("hex");
};

/** UTILS */

function arrayBufferToUint8Array(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
