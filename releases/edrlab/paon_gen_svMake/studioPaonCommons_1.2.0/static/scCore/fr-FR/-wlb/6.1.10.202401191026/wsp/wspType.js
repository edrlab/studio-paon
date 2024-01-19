import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export var WSPTYPE;(function(WSPTYPE){async function getNewEditor(wspServer,wspCodeTpl,params){return wspServer.config.wspMetaEditorUrl.fetchDom(IO.qs("cdaction","GetNewEditor","param",wspCodeTpl,"createParams",CDM.stringify(params)))}WSPTYPE.getNewEditor=getNewEditor
async function getUpdateEditor(wspServer,wspCodeTpl){return wspServer.config.wspMetaEditorUrl.fetchDom(IO.qs("cdaction","GetUpdateEditor","param",wspCodeTpl))}WSPTYPE.getUpdateEditor=getUpdateEditor})(WSPTYPE||(WSPTYPE={}))

//# sourceMappingURL=wspType.js.map