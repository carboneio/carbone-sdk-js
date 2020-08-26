# Carbone Render Javascript SDK

The Carbone Javascript SDK provides a simple interface to communicate with Carbone Render easily.

## Install the Javascript SDK

```sh
$ npm install github.com/Ideolys/carbone-sdk-javascript
```

## Quickstart with the Javascript SDK

Try the following code to render a report in 10 seconds. Just replace your API key, the template you want to render (file input), and the data object.

```javascript
// SDK constructor with the api access token
const _carboneService = window.carboneRenderSDK("eyJhbGc...");
// Template from a file input OR template ID
const _template = document.getElementById("inputFile").files[0];
// Data from an input, for example: {"data" :{"firstname":"John","lastname":"Wick"},"convertTo":"pdf"}
let _data = JSON.parse(document.getElementById("inputData").value);
// Render the report from an DOCX template and a JSON Data
_carboneService.render(_template, _data).then(({ content, name }) => {
  // name == report name as a String
  // content == report content as a Blob, it can be used to download the file
});
```

## Javascript SDK API

### CarboneSDK Constructor

The SDK is available through the global `window` variable.

```javascript
// Carbone access token passed as parameter
const _carboneService = window.carboneRenderSDK("eyJhbGc...");
```
### Render

```javascript
async function render(templateIdOrFile, data, payload = "", responseType = "blob");
```

The render function takes `templateIdOrFile` a File/Blob from an input OR a template ID, `data` JSON (not stringified), an optional `payload`, and an optional `responseType` which correspond to the type of the response.

It returns the report as a `Blob` by default and a unique report name as a `string`. Carbone engine deletes files that have not been used for a while. By using this method, if your file has been deleted, the `render` function upload automatically the template again and return the result.

When a **File or Blob** is passed as an argument, the function verifies if the template has been uploaded to render the report. If not, it calls `addTemplate` to upload the template to the server. Then it calls `renderReport` and `getReport` to generate the report.

When a **template ID** is passed as an argument, the function renders with the `renderReport` function then call `getReport` to return the report. If the template ID does not exist, an error is returned.

### addTemplate
```javascript
async function addTemplate (file, payload = '');
```
The function adds the template to the API and returns the response (that contains a `templateId`). The `file` argument is a type File or Blob.
You can add multiple times the same template and get different template ID thanks to the optional `payload`.

**Example**
```javascript
const carboneService = window.carboneRenderSDK("eyJhbGc...");

carboneService.addTemplate(file).then(data => {
  if (data.success === true) {
    // templateId: data.data.templateId
  } else {
    // error: data.error
  }
});
```
### getTemplate
```javascript
async function getTemplate(templateId, responseType = "blob");
```

Pass a `templateId` to the function and it returns the template as a `blob`. The template ID must exist otherwise an error is returned by the server.

```javascript
const carboneService = window.carboneRenderSDK("eyJhbGc...");

carboneService.getTemplate("templateId").then(file => {
  // `file` is Blob type
});
```

### deleteTemplate
```javascript
async function deleteTemplate(templateId);
```

**Example**
```javascript
const carboneService = window.carboneRenderSDK("eyJhbGc...");

carboneService.deleteTemplate("templateId").then(resp => {
  if (resp.success === false) {
    throw new Error(resp.error);
  }
});
```
### generateTemplateId
```javascript
async function generateTemplateId(fileContent, payload = "");
```
The Template ID is predictable and idempotent, pass the template path and it will return the `templateId`.
Different template ID can be returned thanks to the optional `payload`.


### setAccessToken
```javascript
function setAccessToken(newToken)
```
It sets the Carbone access token.

### set_api_version
```javascript
function setApiVersion(version)
```
It sets the the Carbone version requested. By default, it is calling the version `2` of Carbone.

*Note:* You can only set a major version of carbone.