import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
export function isLastDatasBuilder(o){return o&&typeof o.buildLastDatas==="function"}export function isLastDatasHolder(o){return o&&typeof o.getParentLastDatas==="function"}export var LASTDATAS;(function(LASTDATAS){LASTDATAS.buildLastDatasHooks=new EventMgr
function buildDocumentLastDatas(){const datas=buildLastDatas({},document.body,true)
LASTDATAS.buildLastDatasHooks.emit(datas)
return datas}LASTDATAS.buildDocumentLastDatas=buildDocumentLastDatas
function buildLastDatas(datas,from,includeFrom){if(!from)return datas
if(includeFrom&&isLastDatasBuilder(from)){from.buildLastDatas(datas)}else{if(includeFrom&&from instanceof Element&&from.shadowRoot)buildLastDatas(datas,from.shadowRoot)
const tw=from.ownerDocument.createTreeWalker(from)
if(tw.nextNode())while(true){if(isLastDatasBuilder(tw.currentNode)){tw.currentNode.buildLastDatas(datas)
while(!tw.nextSibling())if(tw.parentNode()===from)return datas}else{if(tw.currentNode.shadowRoot)buildLastDatas(datas,tw.currentNode.shadowRoot)
if(!tw.nextNode())return datas}}}return datas}LASTDATAS.buildLastDatas=buildLastDatas
function getParentLastDatas(forChild){const parent=DOMSH.findLogicalFlatParent(forChild,null,isLastDatasHolder)
return parent?parent.getParentLastDatas(forChild):null}LASTDATAS.getParentLastDatas=getParentLastDatas
function getLastDatas(forChild,key){if(key==null)return null
const parent=getParentLastDatas(forChild)
return parent?parent[key]:null}LASTDATAS.getLastDatas=getLastDatas})(LASTDATAS||(LASTDATAS={}))

//# sourceMappingURL=lastDatas.js.map