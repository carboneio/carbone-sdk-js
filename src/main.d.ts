declare module 'main'{
    export function setApiHeaders(header:object):void
    export function getApiHeaders():object

    export function setAccessToken(newToken:string):void
    export function getAccessToken():string

    export function setApiVersion(version:String|Number):void
    export function getApiVersion():string

    export function setApiUrl(url:string):void
    export function getApiUrl():string

    export function addTemplate(file:string | File | Blob, playload:string):Promise<object>;

    export function deleteTemplate(teplateId:string):Promise<object>;

    export function getTemplate(teplateId:string, responseType:string):Promise<Blob|string>;

    export function renderReport(teplateId:string, data:object):Promise<object>;

    export function getReport(renderId:string, responseType:string):Promise<{ content:Blob | string, name:string }>;

    export function render(templateIdOrFile:Blob|File|string, data:object, playoad:string, responseType:string):Promise<{ content:Blob | string, name:string }>;

    export function generateTemplateId(fileContent:Buffer|Uint8Array|string, playload:Buffer|Uint8Array|string):string

    export function getReportNameFromHeader(header:string):string
}