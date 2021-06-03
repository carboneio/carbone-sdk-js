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