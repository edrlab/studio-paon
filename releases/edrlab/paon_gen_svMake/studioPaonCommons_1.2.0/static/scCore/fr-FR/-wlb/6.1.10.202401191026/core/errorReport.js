import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{RespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/errorLog.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ErrorViewer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/dialogs/errorViewer.js"
export var ERROR;(function(ERROR){async function report(msg,cause,ctx){return reportError({msg:msg,cause:cause,ctx:ctx,adminDetails:await extractAdminDetails(cause)})}ERROR.report=report
async function show(msg,cause,ctx){return showError({msg:msg,cause:cause,ctx:ctx,adminDetails:await extractAdminDetails(cause)})}ERROR.show=show
async function log(msg,cause,ctx){return logError({msg:msg,cause:cause,ctx:ctx,adminDetails:await extractAdminDetails(cause)})}ERROR.log=log
async function reportError(error){await logError(error)
await showError(error)}ERROR.reportError=reportError
async function showError(error){try{await POPUP.showDialog((new ErrorViewer).initialize({error:error}),document.body,{titleBar:{barLabel:{label:"Erreur"}},resizer:{},initWidth:"40em",fixSize:false}).onNextClose()}catch(e){console.error(e)}}ERROR.showError=showError
async function logError(error){try{const errorLog=REG.reg.getSvc("errorLog")
if(errorLog)errorLog.logError(error)
else console.error(error.msg,error.adminDetails,error.cause)}catch(e){console.error(e)}}ERROR.logError=logError
async function extractDescError(cause){if(cause instanceof RespError){const traceDoc=await extractXmlDoc(cause)
return traceDoc?traceDoc.documentElement.getAttribute("desc"):null}}ERROR.extractDescError=extractDescError
async function extractAdminDetails(cause){if(cause instanceof RespError){const traceDoc=await extractXmlDoc(cause)
if(traceDoc)return`url: ${cause.response.url}\ntrace:\n${DOM.ser(DOM.indentDom(traceDoc))}`}return null}ERROR.extractAdminDetails=extractAdminDetails
async function extractXmlDoc(cause){if(cause instanceof RespError){try{const respContent=await cause.response.text()
return DOM.parseDomValid(respContent)}catch(e){console.log(e)}}return null}ERROR.extractXmlDoc=extractXmlDoc
function getReport(error){let report=error.msg
if(error.details)report+=`\n\n${error.details}`
if(error.adminDetails)report+=`\n\n--- Admin details ---\n${error.adminDetails}`
if(error.ctx){report+=`\n\n--- Context ---`
for(const propName in error.ctx){if(propName==="shortDesc"||propName==="shortDescs"){const json=JSON.stringify(error.ctx[propName],simpleObjectReplacer)
report+=`\n${propName}: ${json}`}else if(propName==="reg"&&"getRegDef"in error.ctx[propName]){report+=`\nreg: ${JSON.stringify(error.ctx[propName].getRegDef())}`}else{try{report+=`\n${propName}: ${JSON.stringify(error.ctx[propName],simpleObjectReplacer)}`}catch(e){}}}}if(error.cause)report+=`\n\n--- Js stack ---\n${error.cause.stack}`
report+=`\n\n--- App context ---\nurl: ${window.location.href},\ntimestamp: ${(new Date).toLocaleString()}\nuserAgent: ${navigator.userAgent}`
return report}ERROR.getReport=getReport})(ERROR||(ERROR={}))
function simpleObjectReplacer(key,value){if(value==null||typeof value!=="object")return value
const constr=value.constructor
return constr===Object||constr===Array||constr===Date?value:undefined}
//# sourceMappingURL=errorReport.js.map