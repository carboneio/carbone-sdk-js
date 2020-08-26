const carboneRenderSDK = function (accessToken) {
  const _config = {
    apiUrl: "https://render.carbone.io",
    accessToken: accessToken,
    apiVersion: 2,
  };
  return {
    getAccessToken: function () {
      return _config.accessToken;
    },
    setAccessToken: function (newToken) {
      _config.accessToken = newToken;
    },
    getApiVersion: function () {
      return _config.apiVersion;
    },
    setApiVersion: function (version) {
      _config.apiVersion = version;
    },
    getApiUrl: function () {
      return _config.apiUrl;
    },
    setApiUrl: function (url) {
      _config.apiUrl = url;
    },
    addTemplate: async function (file, payload = '') {
      var form = new FormData();
      if (!file) {
        throw new Error(
          "Carbone SDK addTemplate error: the file argument is not valid."
        );
      }
      form.append("payload", payload);
      form.append("template", file);
      const response = await fetch(`${_config.apiUrl}/template`, {
        method: "post",
        body: form,
        headers: {
          "carbone-version": _config.apiVersion,
          Authorization: "Bearer " + _config.accessToken,
        },
      });
      return await response.json();
    },
    deleteTemplate: async function (templateId) {
      if (!templateId) {
        throw new Error(
          "Carbone SDK deleteTemplate error: the templateId argument is not valid."
        );
      }
      const response = await fetch(`${_config.apiUrl}/template/${templateId}`, {
        method: "delete",
        headers: {
          "carbone-version": _config.apiVersion,
          Authorization: "Bearer " + _config.accessToken,
        },
      });
      return await response.json();
    },
    getTemplate: async function (templateId, responseType = "blob") {
      if (!templateId) {
        throw new Error(
          "Carbone SDK getTemplate error: the templateId argument is not valid."
        );
      }
      if (["blob", "text"].indexOf(responseType) === -1) {
        throw new Error(
          "Carbone SDK getTemplate error: the responseType argument is not valid."
        );
      }
      const response = await fetch(`${_config.apiUrl}/template/${templateId}`, {
        method: "get",
        headers: {
          "carbone-version": _config.apiVersion,
          Authorization: "Bearer " + _config.accessToken,
        },
      });
      return await response[responseType]();
    },
    renderReport: async function (templateId, data) {
      if (!templateId) {
        throw new Error(
          "Carbone SDK renderReport error: the templateId argument is not valid."
        );
      }
      if (!data) {
        throw new Error(
          "Carbone SDK renderReport error: the data argument is not valid."
        );
      }
      const response = await fetch(`${_config.apiUrl}/render/${templateId}`, {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          "carbone-version": _config.apiVersion,
          Authorization: "Bearer " + _config.accessToken,
        },
      });
      return await response.json();
    },
    getReport: async function (renderId, responseType = "blob") {
      if (!renderId) {
        throw new Error(
          "Carbone SDK getReport error: the renderId argument is not valid."
        );
      }
      if (["blob", "text"].indexOf(responseType) === -1) {
        throw new Error(
          "Carbone SDK getReport error: the responseType argument is not valid."
        );
      }
      const response = await fetch(`${_config.apiUrl}/render/${renderId}`, {
        method: "get",
        headers: {
          "carbone-version": _config.apiVersion,
          Authorization: "Bearer " + _config.accessToken
        },
      });
      return { content: await response[responseType](), name: this.getReportNameFromHeader(response.headers) };
    },
    render: async function (templateIdOrFile, data, payload = "", responseType = "blob") {
      if (!templateIdOrFile) {
        throw new Error(
          "Carbone SDK render error: the templateId argument is not valid."
        );
      }
      if (!data) {
        throw new Error(
          "Carbone SDK render error: the data argument is not valid."
        );
      }
      let _renderResponse = null;
      // 1 - if template ID, try to render the report, if return false, try 2
      if (
        typeof templateIdOrFile === "string" &&
        templateIdOrFile.length === 64 &&
        Object.prototype.hasOwnProperty.call(templateIdOrFile, "name") === false
      ) {
        _renderResponse = await this.renderReport(templateIdOrFile, data);
      }
      if (_renderResponse === null || _renderResponse.success === false) {
        // 2 - if the report has already been uploaded: Generate the templateID from the content and render from the template id, if success false else try solution 3
        // if templateIdOrFile is a File or Blob, convert to uint8array - todo: test the uint8array conversion with JSDOM+JEST
        const _fileContentBuffer = await (typeof templateIdOrFile === "string" ? templateIdOrFile : await templateIdOrFile.arrayBuffer().then(resp => new Uint8Array(resp)));
        const _templateId = await this.generateTemplateId(_fileContentBuffer, payload);
        if (_templateId) {
          _renderResponse = await this.renderReport(_templateId, data);
        }
        if (_renderResponse === null || _renderResponse.success === false) {
          // 3 - add the template, and render
          const _response = await this.addTemplate(templateIdOrFile, payload);
          if (
            _response &&
            _response.success === true &&
            _response.data.templateId
          ) {
            _renderResponse = await this.renderReport(
              _response.data.templateId,
              data
            );
          }
        }
      }
      if (!_renderResponse || _renderResponse.success === false || !_renderResponse.data.renderId) {
        throw new Error("Carbone SDK render error: the rendering has failled.");
      }
      return this.getReport(_renderResponse.data.renderId, responseType);
    },
    /**
     *
     * @param {Buffer|Uint8Array|String} fileContent
     * @param {Buffer|Uint8Array|String} payload
     */
    generateTemplateId: async function (fileContent, payload = "") {
      function arrayBufferToHexa(buffer) {
        var digest = "";
        var view = new DataView(buffer);
        for (var i = 0; i < view.byteLength; i += 4) {
          // We use getUint32 to reduce the number of iterations (notice the `i += 4`)
          var value = view.getUint32(i);
          // toString(16) will transform the integer into the corresponding hex string
          // but will remove any initial "0"
          var stringValue = value.toString(16);
          // One Uint32 element is 4 bytes or 8 hex chars (it would also work with 4
          // chars for Uint16 and 2 chars for Uint8)
          var padding = "00000000";
          var paddedValue = (padding + stringValue).slice(-padding.length);
          digest += paddedValue;
        }
        return digest;
      }
      // if string, convert to uint8array, else object === Blob or File
      var bufferContent = typeof fileContent === "string" ? new TextEncoder("utf-8").encode(fileContent) : fileContent;
      var bufferPayload = typeof payload === "string" ? new TextEncoder("utf-8").encode(payload) : payload;
      // Merge payload and file content
      var mergedArray = new Uint8Array(bufferPayload.length + bufferContent.length);
      mergedArray.set(bufferPayload);
      mergedArray.set(bufferContent, bufferPayload.length);
      return await crypto.subtle
        .digest("SHA-256", mergedArray)
        .then(function (hash) {
          return arrayBufferToHexa(hash);
        });
    },
    getReportNameFromHeader(headers) {
      if (!headers) {
        return null;
      }
      const _contentHeader = headers.get("content-disposition");
      if (!_contentHeader) {
        return null;
      }
      let splitted = _contentHeader.split('=')
      if (splitted.length === 1 || !splitted[1]) {
        return null;
      }
      let _reportName = splitted[1];
      if (_reportName[0] === "\"" && _reportName[_reportName.length -1] === "\"") {
        _reportName = _reportName.substr(1, splitted[1].length - 2);
      }
      return _reportName
    }
  };
};

window.carboneRenderSDK = carboneRenderSDK;
