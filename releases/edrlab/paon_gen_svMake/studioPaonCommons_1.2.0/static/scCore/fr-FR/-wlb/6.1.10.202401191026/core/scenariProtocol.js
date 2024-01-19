import{ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{UNIVERSE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class ScUniverseProtocolExec{findUniverse(params,reg){return params.universe?UNIVERSE.all.get(params.universe):reg.env.universe}}export function captureScenariProtocol(frame,reg){var _a;(_a=frame.contentDocument)===null||_a===void 0?void 0:_a.addEventListener("click",ev=>{if(ev.defaultPrevented)return
const target=ev.target
let link=null
if(target.localName=="a"||target.localName=="area")link=target
if(!link){const targetPaths=ev.composedPath()
for(let i=1;i<targetPaths.length;i++){const target=targetPaths[i]
if(target.nodeType!=ENodeType.element)break
else if(target.localName=="a"||target.localName=="area"){link=target
break}}}if(!link)return
const href=link.getAttribute("href")
if(!href||!href.startsWith("scenari:"))return
ev.preventDefault()
new Promise(async(resolve,refuse)=>{try{const params=JSON.parse(href.substr(8))
const action=SCPRTC.findAction(params.action,reg)
if(!action)throw new Error(`No action registered for scenari: protocol '${params.action}'`)
resolve(action.execute(params,reg,frame,ev))}catch(e){refuse(ERROR.show(`Exécution de l\'action impossible`,e,{href:href}))}}).then()})}export var SCPRTC;(function(SCPRTC){SCPRTC.LIST_EXECUTORS="protocol.executors"
function findAction(code,reg){var _a
return(_a=reg.getListAsMap(SCPRTC.LIST_EXECUTORS))===null||_a===void 0?void 0:_a[code]}SCPRTC.findAction=findAction})(SCPRTC||(SCPRTC={}))
export class DoEachScProtocolExec{async execute(params,reg,emitter,ev){if(!("stopOnError"in params))params.stopOnError=true
if(!("stopOnNotExecuteAction"in params))params.stopOnNotExecuteAction=false
try{await LANG.promisesMap(params.subActions,async(act,number)=>{const action=SCPRTC.findAction(act.action,reg)
if(action){try{const result=await action.execute(act,reg,emitter,ev)
if(result===false&&params.stopOnNotExecuteAction)throw"canceled"}catch(e){if(params.stopOnError)throw e
else console.log(e)}}else{console.log(`No action registered for scenari: protocol '${act.action}'`)}},1)}catch(e){if(e!=="canceled")throw e}}}REG.reg.addToList(SCPRTC.LIST_EXECUTORS,"doEach",1,new DoEachScProtocolExec)

//# sourceMappingURL=scenariProtocol.js.map