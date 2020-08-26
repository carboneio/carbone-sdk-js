/* eslint-disable no-undef */
require("../src/main.js");
var fs = require("fs");
const fetchMock = require("fetch-mock-jest");

// `global` jest === `document.window`
const carboneRenderSDK = global.carboneRenderSDK;

describe("Tests configurations", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should define and get the access token, api version and apiUrl", () => {
    expect(_carboneSDK.getAccessToken()).toBe("Token1234");
    expect(_carboneSDK.getApiUrl()).toBe("https://render.carbone.io");
    expect(_carboneSDK.getApiVersion()).toBe(2);
  });
  test("should update and get the access token", () => {
    _carboneSDK.setAccessToken("Hello4321");
    expect(_carboneSDK.getAccessToken()).toBe("Hello4321");
  });
  test("should update and get the api version", () => {
    _carboneSDK.setApiVersion(3);
    expect(_carboneSDK.getApiVersion()).toBe(3);
  });
  test("should update and get the api Url", () => {
    _carboneSDK.setApiUrl("http://localhost");
    expect(_carboneSDK.getApiUrl()).toBe("http://localhost");
  });
});

describe("Test addTemplate", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should throw an error if the file argument is missing", async () => {
    await expect(() => _carboneSDK.addTemplate()).rejects.toThrow(
      "Carbone SDK addTemplate error: the file argument is not valid."
    );
  });
  test("should upload a template and check the access token", async () => {
    var data = fs.readFileSync("./tests/template.xml");
    const _requestResponse = {
      success: true,
      data: { templateId: "ABCDEF1234" },
    };
    fetchMock.post("https://render.carbone.io/template", (url, options) => {
      expect(options.headers.Authorization).toBe("Bearer Token1234");
      return _requestResponse;
    });
    const _resp = await _carboneSDK.addTemplate(data);
    expect(_resp).toStrictEqual(_requestResponse);
    fetchMock.reset();
  });
  test("should upload a template with a payload (test form data)", async () => {
    var data = fs.readFileSync("./tests/template.xml");
    const _expectedPayload = "12345";
    const _requestResponse = {
      success: true,
      data: { templateId: "ABCDEF1234" },
    };
    fetchMock.post("https://render.carbone.io/template", _requestResponse);
    const _resp = await _carboneSDK.addTemplate(
      data.toString(),
      _expectedPayload
    );
    expect(_resp).toStrictEqual(_requestResponse);
    expect(fetchMock.calls(true)[0][1].body.append.mock.calls[0][0]).toBe(
      "payload"
    );
    expect(fetchMock.calls(true)[0][1].body.append.mock.calls[0][1]).toBe(
      _expectedPayload
    );
    expect(fetchMock.calls(true)[0][1].body.append.mock.calls[1][0]).toBe(
      "template"
    );
    expect(fetchMock.calls(true)[0][1].body.append.mock.calls[1][1]).toBe(
      data.toString()
    );
    fetchMock.reset();
  });
});

describe("Test getTemplate", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should throw an error if the templateId is missing", async () => {
    await expect(() => _carboneSDK.getTemplate()).rejects.toThrow(
      "Carbone SDK getTemplate error: the templateId argument is not valid."
    );
  });

  test("should throw an error if the responseType is invalid", async () => {
    await expect(() =>
      _carboneSDK.getTemplate("templateId", "json")
    ).rejects.toThrow(
      "Carbone SDK getTemplate error: the responseType argument is not valid."
    );
  });

  test("should get the template as a text", async () => {
    const _content = "<html>{d.firstname}</html>";
    fetchMock.get("https://render.carbone.io/template/templateId1234", {
      body: _content,
    });
    const _response = await _carboneSDK.getTemplate("templateId1234", "text");
    expect(_response).toBe(_content);
    fetchMock.reset();
    // var reader = new FileReader();
    // reader.addEventListener("load", function(event) {
    //   console.log("'load' event has been fired!");
    // });
    // reader.readAsText(value);
  });

  test("should get the template as a blob", async () => {
    const _content = "<html>{d.firstname}</html>";
    fetchMock.get("https://render.carbone.io/template/templateId1234", {
      body: _content,
    });
    //by default, getTemplate return the template as a blob
    const _response = await _carboneSDK.getTemplate("templateId1234");
    // Convert blob to string
    const _res = await _response.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_res).toBe(_content);
    fetchMock.reset();
  });
});

describe("Test deleteTemplate", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should throw an error if the templateId is missing", async () => {
    await expect(() => _carboneSDK.deleteTemplate()).rejects.toThrow(
      "Carbone SDK deleteTemplate error: the templateId argument is not valid."
    );
  });

  test("should delete a template from a templateId", async () => {
    fetchMock.delete("https://render.carbone.io/template/templateId4321", {
      success: true,
      error: null,
    });
    const _resp = await _carboneSDK.deleteTemplate("templateId4321");
    expect(_resp.success).toStrictEqual(true);
    expect(_resp.error).toStrictEqual(null);
    fetchMock.reset();
  });

  test("should not delete a template because it has already been deleted", async () => {
    const _response = {
      success: false,
      error: "Error: Cannot remove template, does it exist ?",
    };
    fetchMock.delete(
      "https://render.carbone.io/template/templateId4321",
      _response
    );
    const _resp = await _carboneSDK.deleteTemplate("templateId4321");
    expect(_resp).toStrictEqual(_response);
    fetchMock.reset();
  });
});

describe("Test renderReport", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should throw an error if the templateId is missing", async () => {
    await expect(() => _carboneSDK.renderReport()).rejects.toThrow(
      "Carbone SDK renderReport error: the templateId argument is not valid."
    );
  });

  test("should throw an error if the data argument is missing", async () => {
    await expect(() => _carboneSDK.renderReport("templateId")).rejects.toThrow(
      "Carbone SDK renderReport error: the data argument is not valid."
    );
  });

  test("should render a report from a templateId and a dataset", async () => {
    const _templateId =
      "f90e67221d7d5ee11058a000bdb997fb41bf149b1f88b45cb1aba9edcab8f868";
    const _renderId = "r3209jf903j2f90j2309fj3209fj";
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      `{"success" : true,"error"   : null,"data": {"renderId": "` +
        _renderId +
        `"}}`
    );
    const _resp = await _carboneSDK.renderReport(_templateId, {
      data: { name: "john" },
    });
    expect(_resp.success).toStrictEqual(true);
    expect(_resp.error).toStrictEqual(null);
    expect(_resp.data.renderId).toStrictEqual(_renderId);
    fetchMock.reset();
  });
});

describe("Test getReport", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should throw an error if the reportId is missing", async () => {
    await expect(() => _carboneSDK.getReport()).rejects.toThrow(
      "Carbone SDK getReport error: the renderId argument is not valid."
    );
  });

  test("should throw an error if the responseType is invalid", async () => {
    await expect(() =>
      _carboneSDK.getReport("reportId", "json")
    ).rejects.toThrow(
      "Carbone SDK getReport error: the responseType argument is not valid."
    );
  });

  test("should get the template as a text", async () => {
    const _content = "<html>This is the report content</html>";
    fetchMock.get("https://render.carbone.io/render/renderId4321", {
      body: _content,
    });
    const _response = await _carboneSDK.getReport("renderId4321", "text");
    expect(_response).toBe(_content);
    fetchMock.reset();
  });

  test("should get the template as a blob", async () => {
    const _content = "<html>This is the report content</html>";
    fetchMock.get("https://render.carbone.io/render/renderId4321", {
      body: _content,
    });
    const _response = await _carboneSDK.getReport("renderId4321");
    // Convert blob to string
    const _res = await _response.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_res).toBe(_content);
    fetchMock.reset();
  });
});

describe("Test render", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should render a report from an existing templateID (use only renderReport method) [Case 1]", async function () {
    const _templateId =
      "20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4";
    const _renderId = "renderId4321";
    const _fakeData = { data: { firstname: "John", age: "30" } };
    const _expectedContent = "<html>This is the report content</html>";

    /** Mock Requests */
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      `{"success" : true, "error" : null,"data": {"renderId": "` +
        _renderId +
        `"}}`
    );
    fetchMock.get(`https://render.carbone.io/render/${_renderId}`, {
      body: _expectedContent,
    });
    const _renderResponse = await _carboneSDK.render(
      _templateId,
      _fakeData,
      "text"
    );
    // Convert blob to string
    const _resp = await _renderResponse.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_resp).toBe(_expectedContent);
    fetchMock.reset();
  });

  // TODO: should render a report from an existing template, the template has already been uploaded (it generate the templateId + renderReport) [case 2]

  test("should render a report from a fresh new template (path as argument + payload) [case 3]", async function () {
    const data = fs.readFileSync("./tests/template.xml");
    const _fakeData = { data: { firstname: "John", lastname: "wick" } };
    const _templateId =
      "20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4";
    const _renderId = "renderId43215";
    const _expectedContent = data
      .toString()
      .replace("{d.firstname}", _fakeData.data.firstname)
      .replace("{d.lastname}", _fakeData.data.lastname);
    /** Mock request */
    fetchMock.post("https://render.carbone.io/template", {
      success: true,
      data: { templateId: _templateId },
    });
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      `{"success" : true, "error" : null,"data": {"renderId": "` +
        _renderId +
        `"}}`
    );
    fetchMock.get(`https://render.carbone.io/render/${_renderId}`, {
      body: _expectedContent,
    });

    const _respBlob = await _carboneSDK.render(
      data.toString(),
      _fakeData,
      "text"
    );
    // Convert blob to string
    const _resp = await _respBlob.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_resp).toStrictEqual(_expectedContent);
    fetchMock.reset();
  });

  test("[error test] should throw because the template content is invalid", async function () {
    fetchMock.post("https://render.carbone.io/template", {
      success: false,
      error: "invalid file",
    });
    await expect(() =>
      _carboneSDK.render("Some invalid content", {})
    ).rejects.toThrow("Carbone SDK render error: Something went wrong.");
    fetchMock.reset();
  });

  test("[error test] should throw because the second rendering is returning is not working", async function () {
    const _templateId =
      "20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4";
    fetchMock.post(`https://render.carbone.io/render/${_templateId}`, {
      success: false,
    });
    fetchMock.post("https://render.carbone.io/template", {
      success: true,
      data: { templateId: _templateId },
    });
    await expect(() => _carboneSDK.render(_templateId, {})).rejects.toThrow(
      "Carbone SDK render error: the rendering has failled."
    );
    fetchMock.reset();
  });

  test("[error test] should throw if the first argument templateIdOrFile is undefined", async function () {
    await expect(() => _carboneSDK.render()).rejects.toThrow(
      "Carbone SDK render error: the templateId argument is not valid."
    );
  });

  test("[error test] should throw if the second argument data is undefined", async function () {
    await expect(() => _carboneSDK.render("templateId1234")).rejects.toThrow(
      "Carbone SDK render error: the data argument is not valid."
    );
  });
});

describe("Test Calculate hash", function () {
  const _carboneSDK = carboneRenderSDK("Token1234");
  test("should convert a file content into a templateId 1", async function () {
    const _content = "<html>This is some content</html>";
    const _templateIdNode = global.generateTemplateIdFromNode(_content);
    const _templateId = await _carboneSDK.generateTemplateId(_content);
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content into a templateId with a payload 2", async function () {
    const _content = "<html>This is some content</html>";
    const _payload = "Payload1234";
    const _templateIdNode = global.generateTemplateIdFromNode(
      _content,
      _payload
    );
    const _templateId = await _carboneSDK.generateTemplateId(
      _content,
      _payload
    );
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content into a templateId 3 ", async function () {
    const _content =
      "<html>This is some content {d.firstname} {d.lastname}</html>";
    const _templateIdNode = global.generateTemplateIdFromNode(_content);
    const _templateId = await _carboneSDK.generateTemplateId(_content);
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content into a templateId with a payload 4", async function () {
    const _content =
      "<html>This is some content {d.firstname} {d.lastname}</html>";
    const _payload =
      "Payload1234This is a long payload with different characters 1 *5 &*9 %$ 3%&@9 @(( 3992288282 29299 9299929";
    const _templateIdNode = global.generateTemplateIdFromNode(
      _content,
      _payload
    );
    const _templateId = await _carboneSDK.generateTemplateId(
      _content,
      _payload
    );
    expect(_templateId).toStrictEqual(_templateIdNode);
  });
});
