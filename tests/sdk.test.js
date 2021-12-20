import "core-js/stable";
import "regenerator-runtime/runtime";
import carboneSDK from "../src/main.js";
var fs = require("fs");
const fetchMock = require("fetch-mock-jest");

describe("Tests configurations", function () {
  const _carboneSDK = carboneSDK("Token1234");
  test("should define a new instance from the global window variable (v1.0.0 carboneRenderSDK)", () => {
    // jest global === document.window
    const _sdk = global.carboneRenderSDK("Lala");
    expect(_sdk.getAccessToken()).toStrictEqual("Lala");
  });

  test("should define a new instance from the global window variable (v1.1.0 carboneSDK)", () => {
    // jest global === document.window
    const _sdk = global.carboneSDK("Lala");
    expect(_sdk.getAccessToken()).toStrictEqual("Lala");
  });

  test("should define and get the access token, api version and apiUrl", () => {
    expect(_carboneSDK.getAccessToken()).toBe("Token1234");
    expect(_carboneSDK.getApiUrl()).toBe("https://render.carbone.io");
    expect(_carboneSDK.getApiVersion()).toBe(3);
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
  const _carboneSDK = carboneSDK("Token1234");
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
  const _carboneSDK = carboneSDK("Token1234");
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
  const _carboneSDK = carboneSDK("Token1234");
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
  const _carboneSDK = carboneSDK("Token1234");
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
    const _data = { data: { name: "john" }, exportTo: "pdf" };
    const _templateId =
      "f90e67221d7d5ee11058a000bdb997fb41bf149b1f88b45cb1aba9edcab8f868";
    const _renderId = "r3209jf903j2f90j2309fj3209fj";
    fetchMock.post(`https://render.carbone.io/render/${_templateId}`, function (
      url,
      options
    ) {
      expect(JSON.parse(options.body)).toStrictEqual(_data);
      return (
        `{"success" : true,"error"   : null,"data": {"renderId": "` +
        _renderId +
        `"}}`
      );
    });
    const _resp = await _carboneSDK.renderReport(_templateId, _data);
    expect(_resp.success).toStrictEqual(true);
    expect(_resp.error).toStrictEqual(null);
    expect(_resp.data.renderId).toStrictEqual(_renderId);
    fetchMock.reset();
  });
});

describe("Test getReport", function () {
  const _carboneSDK = carboneSDK("Token1234");
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
    const _filename = "OIQWJDWQOI.html";
    const _content = "<html>This is the report content</html>";
    fetchMock.get("https://render.carbone.io/render/renderId4321", {
      body: _content,
      headers: {
        "content-disposition": `filename="${_filename}"`,
      },
    });
    const _response = await _carboneSDK.getReport("renderId4321", "text");
    expect(_response.content).toBe(_content);
    expect(_response.name).toBe(_filename);
    fetchMock.reset();
  });

  test("should get the template as a blob", async () => {
    const _filename = "OIQWJDWQOI.xml";
    const _content = "<html>This is the report content</html>";
    fetchMock.get("https://render.carbone.io/render/renderId4321", {
      body: _content,
      headers: {
        "content-disposition": `filename="${_filename}"`,
      },
    });
    const _response = await _carboneSDK.getReport("renderId4321");
    // Convert blob to string
    const _res = await _response.content.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_res).toBe(_content);
    expect(_response.name).toBe(_filename);
    fetchMock.reset();
  });
});

describe("Test render", function () {
  const _carboneSDK = carboneSDK("Token1234");
  test("should render a report from an existing templateID (use only renderReport method) [Case 1]", async function () {
    const _templateId =
      "20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4";
    const _renderId = "renderId4321";
    const _fakeData = { data: { firstname: "John", age: "30" } };
    const _expectedContent = "<html>This is the report content</html>";
    const _expectedFileName = "DWIQ982DWIQUH.xml";
    /** Mock Requests */
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      `{"success" : true, "error" : null,"data": {"renderId": "` +
        _renderId +
        `"}}`
    );
    fetchMock.get(`https://render.carbone.io/render/${_renderId}`, {
      body: _expectedContent,
      headers: {
        "content-disposition": `filename="${_expectedFileName}"`,
      },
    });

    const _renderResponse = await _carboneSDK.render(
      _templateId,
      _fakeData,
      "text"
    );
    // Convert blob to string
    const _resp = await _renderResponse.content.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_resp).toBe(_expectedContent);
    expect(_renderResponse.name).toBe(_expectedFileName);
    fetchMock.reset();
  });

  test("should render a report from an existing template, the template has already been uploaded (it generate the templateId + renderReport) [case 2]", async function () {
    const _content =
      "<html>This is some content {d.firstname} {d.lastname}</html>";
    const _templateId =
      "eced89abaf7ab36dfb5f1507759cd53c5347ef06a45f42e791b487ee45c7b404";
    const _renderId = "RenderId1234";
    const _expectedFileName = "FOEWIFJEWO12324.pdf";
    const _expectedContent = "<html>This is some content John Wick</html>";
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      `{"success" : true, "error" : null,"data": {"renderId": "${_renderId}"}}`
    );
    fetchMock.get(`https://render.carbone.io/render/${_renderId}`, {
      body: _expectedContent,
      headers: {
        "content-disposition": `filename="${_expectedFileName}"`,
      },
    });
    const _response = await _carboneSDK.render(
      _content,
      { data: { firstname: "John", lastname: "Wick" }, exportTo: "pdf" },
      "",
      "blob"
    );
    // Convert blob to string
    const _resp = await _response.content.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_resp).toStrictEqual(_expectedContent);
    expect(_response.name).toStrictEqual(_expectedFileName);

    const _fetchCalls = fetchMock.calls();
    expect(_fetchCalls[0][0]).toBe(
      `https://render.carbone.io/render/${_templateId}`
    );
    expect(_fetchCalls[1][0]).toBe(
      `https://render.carbone.io/render/${_renderId}`
    );
    expect(_fetchCalls.length).toBe(2);
    fetchMock.reset();
  });

  test("should render a report from a fresh new template (path as argument + payload) [case 3]", async function () {
    const data = fs.readFileSync("./tests/template.xml");
    const _fakeData = { data: { firstname: "John", lastname: "wick" } };
    const _templateId =
      "0a05c07abca8829654d4df98352057b6ba98a26e8319e825203ab7800e30cc18";
    const _renderId = "renderId43215";
    const _expectedContent = data
      .toString()
      .replace("{d.firstname}", _fakeData.data.firstname)
      .replace("{d.lastname}", _fakeData.data.lastname);
    const _expectedFileName = "DWIQ982DWIQUH.xml";
    /** Mock request */
    fetchMock.post("https://render.carbone.io/template", {
      success: true,
      data: { templateId: _templateId },
    });
    let _renderCounter = 0;
    fetchMock.post(
      `https://render.carbone.io/render/${_templateId}`,
      function () {
        _renderCounter++;
        if (_renderCounter >= 2) {
          return `{"success" : true, "error" : null,"data": {"renderId": "${_renderId}"}}`;
        }
        return `{"success" : false, "error" : "the template does not exist"}`;
      }
    );
    fetchMock.get(`https://render.carbone.io/render/${_renderId}`, {
      body: _expectedContent,
      headers: {
        "content-disposition": `filename="${_expectedFileName}"`,
      },
    });

    const _response = await _carboneSDK.render(
      data.toString(),
      _fakeData,
      "",
      "blob"
    );
    // Convert blob to string
    const _resp = await _response.content.arrayBuffer().then((buf) => {
      return Buffer.from(buf).toString();
    });
    expect(_resp).toStrictEqual(_expectedContent);
    expect(_response.name).toStrictEqual(_expectedFileName);

    const _fetchCalls = fetchMock.calls();
    expect(_fetchCalls[0][0]).toBe(
      `https://render.carbone.io/render/${_templateId}`
    );
    expect(_fetchCalls[1][0]).toBe(`https://render.carbone.io/template`);
    expect(_fetchCalls[2][0]).toBe(
      `https://render.carbone.io/render/${_templateId}`
    );
    expect(_fetchCalls[3][0]).toBe(
      `https://render.carbone.io/render/${_renderId}`
    );
    expect(_fetchCalls.length).toBe(4);
    fetchMock.reset();
  });

  test("[error test] should throw because the template content is invalid", async function () {
    fetchMock.post(
      "https://render.carbone.io/render/e9b98135998afcefd4da38d000b284293e0f6c44abb17d2a31d8e1625e43eb21",
      { success: false }
    );
    fetchMock.post("https://render.carbone.io/template", {
      success: false,
      error: "invalid file",
    });
    await expect(() =>
      _carboneSDK.render("Some invalid content", {})
    ).rejects.toThrow("Carbone SDK render error: the rendering has failled.");
    fetchMock.reset();
  });

  test("[error test] should throw because the second rendering is returning is not working", async function () {
    const _templateId =
      "20f36c2e4d1702a839ec001295696fa730a521d3afabed5f2ddc824c6897aea4";
    fetchMock.post(`https://render.carbone.io/render/${_templateId}`, {
      success: false,
    });
    fetchMock.post(
      `https://render.carbone.io/render/07015dd3447d7e1467ce24d847983465f61629883a8b2dd9ff3348118d3c4c93`,
      {
        success: false,
      }
    );
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

describe("Test Calculate hash templateId", function () {
  const _carboneSDK = carboneSDK("Token1234");
  test("should convert a file content as string into a templateId 1", async function () {
    const _content = "<html>This is some content</html>";
    const _templateIdNode = global.generateTemplateIdFromNode(_content);
    const _templateId = await _carboneSDK.generateTemplateId(_content);
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content as string into a templateId with a payload 2", async function () {
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

  test("should convert a file content as string into a templateId 3", async function () {
    const _content =
      "<html>This is some content {d.firstname} {d.lastname}</html>";
    const _templateIdNode = global.generateTemplateIdFromNode(_content);
    const _templateId = await _carboneSDK.generateTemplateId(_content);
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content as string into a templateId with a payload 4", async function () {
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

  test("should convert a file content as a buffer into a templateId 5", async function () {
    const _content = new Buffer.from(
      "<html>This is some content {d.firstname} {d.lastname}</html>"
    );
    const _templateIdNode = global.generateTemplateIdFromNode(_content);
    const _templateId = await _carboneSDK.generateTemplateId(_content);
    expect(_templateId).toStrictEqual(_templateIdNode);
  });

  test("should convert a file content as a buffer into a templateId with a payload 6", async function () {
    const _content = new Buffer.from(
      "<html>This is some content {d.firstname} {d.lastname}</html>"
    );
    const _payload = new Buffer.from(
      "Payload1234This is a long payload with different characters 1 *5 &*9 %$ 3%&@9 @(( 3992288282 29299 9299929"
    );
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

describe("getReportNameFromHeader", () => {
  const _carboneSDK = carboneSDK("Token1234");
  test("should parse the report file name on the header", function () {
    const _filename = "01EGN9TBHYTS3PVGRG6DCJC7HG.pdf";
    const _headers = new Map();
    _headers.set("content-disposition", `filename="${_filename}"`);
    expect(_carboneSDK.getReportNameFromHeader(_headers)).toStrictEqual(
      _filename
    );
  });
  test("should parse the report file name (without double quotes) on the header", function () {
    const _filename = "01EGN9TBHYTS3PVGRG6DCJC7HG.pdf";
    const _headers = new Map();
    _headers.set("content-disposition", `filename=${_filename}`);
    expect(_carboneSDK.getReportNameFromHeader(_headers)).toStrictEqual(
      _filename
    );
  });
  test("should not parse the report file name on the header and return null", function () {
    const _headers = new Map();
    _headers.set("content-disposition", `filename=`);
    expect(_carboneSDK.getReportNameFromHeader(_headers)).toStrictEqual(null);
    _headers.set("content-disposition", `filename`);
    expect(_carboneSDK.getReportNameFromHeader(_headers)).toStrictEqual(null);
    _headers.set("content-disposition", ``);
    expect(_carboneSDK.getReportNameFromHeader(_headers)).toStrictEqual(null);
    expect(_carboneSDK.getReportNameFromHeader()).toStrictEqual(null);
  });
});
