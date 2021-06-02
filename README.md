# Carbone Render Javascript
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://carbone.io/api-reference.html#carbone-render-javascript-sdk)

> The javascript SDK to use Carbone Render easily into your frontend (Angular, Vuejs, Svelte, React, Ember.js...).

Carbone is a report generator (PDF, DOCX, XLSX, ODT, PPTX, ODS, XML, CSV...) using templates and JSON data.
[Learn more about the Carbone ecosystem](https://carbone.io/documentation.html).

## Install

```sh
npm install github.com/Ideolys/carbone-sdk-js
```

or 

```sh
yarn add https://github.com/Ideolys/carbone-sdk-js
```

## Usage

```js
  // SDK constructor, the access token have to be passed as an argument to carboneRenderSDK
  const _carboneService = window.carboneRenderSDK("eyJhbGc...");
  // Template from a file input OR template ID
  const _template = document.getElementById("inputFile").files[0];
  // Data from an input
  let _data = JSON.parse(document.getElementById("inputData").value);
  // Render the report from a template and a JSON Data
  _carboneService.render(_template, _data).then(({ content, name }) => {
    // name == report name as a String
    // content == report content as a Blob, it can be used to download the file
  });
```
***[Checkout an integration example.](./doc/index.render.example.html)***

## Documentation

- [SDK API REFERENCE](./doc/API-REFERENCE.md)
- [SDK quick integration example](./doc/index.render.example.html)
- [SDK full integration example](./doc/index.full.example.html)
- [Documentation to design a template](https://carbone.io/documentation.html#building-a-template)

## Build for production

To edit build options, look at the file ["build.js"](./bin/build.js) for more details.

```bash
$ npm run build
```

After running the command, the script is available on the folder "dist".

## Run tests
To run all the tests:
```bash
$ npm run test
```
If you need to test the generation of templateId, you can use the nodejs `main.js` to test the sha256 generation.
```bash
$ node ./tests/generate_template_id.js
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/Ideolys/carbone-sdk-js/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 👤 Author

- [**@steevepay**](https://github.com/steevepay)
