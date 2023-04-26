### v1.2.1
  - Update documentation & examples

### v1.2.0
  - Updated default version of Carbone API from `3` to `4`
  - Added method `setApiHeaders` to add custom headers, headers will be added automatically to HTTP requests, usage:
    ```js
    _carboneSDK.setApiHeaders({
      "carbone-template-delete-after": "86400",
      "carbone-webhook-url": "https://..."
    });
    ```
  - Updated esbuilt from `0.14.6` to `0.17.18`

### v1.1.7
  - Update packages

### v1.1.6
  - generates a CJS module

### v1.1.5
  - Update documentation, license and lint code

### v1.1.4
  - Update documentation

### v1.1.3
  - Update documentation

### v1.1.2
  - Update documentation

### v1.1.1
  - Fix project name & update documentation

### v1.1.0
  - Turn the SDK into a javascript module. The build script creates an ESM file. Instead of accessing the SDK globally through the "window.carboneRenderSDK", it is possible to import it through: `import carboneRenderSDK from "carbone-sdk-js"`
  - Update the default value of "version", so that, it requests the latest version 3 of Carbone
  - Update comments and examples on the doc folder

### v1.0.0
  - It is possible to interact with the Carbone Render API with the following methods:
    - addTemplate: upload a template and return a templateId
    - getTemplate: return an uploaded template from a templateId
    - deleteTemplate: delete a template from a templateId
    - render: render a report from a templateId
    - generateTemplateId: Pre compute the templateId