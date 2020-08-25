/* eslint-disable no-undef */
const crypto = require("crypto");

function generateHash(content, payload) {
  return crypto
    .createHash("sha256")
    .update(new Buffer.from(payload))
    .update(new Buffer.from(content))
    .digest("hex");
}

const array_of_hash_generation_test = [
  function testGenerateTemplateId1(index) {
    // 20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4
    console.log(
      `Test${index}: `,
      generateHash("<html>This is some content</html>", "")
    );
  },
  function testGenerateTemplateId2(index) {
    // 2ec287a920778b7d8ee9ffa05b3f3669dfc48580676ee110f0504c320ab9bba8
    console.log(
      `Test${index}: `,
      generateHash("<html>This is some content</html>", "Payload1234")
    );
  },
  function testGenerateTemplateId3(index) {
    console.log(
      `Test${index}: `,
      generateHash(
        "<html>This is some content {d.firstname} {d.lastname}</html>",
        ""
      )
    );
  },
  function testGenerateTemplateId4(index) {
    console.log(
      `Test${index}: `,
      generateHash(
        "<html>This is some content {d.firstname} {d.lastname}</html>",
        "Payload1234This is a long payload with different characters 1 *5 &*9 %$ 3%&@9 @(( 3992288282 29299 9299929"
      )
    );
  },
];

array_of_hash_generation_test.forEach((fct, index) => {
  fct(index + 1);
});
