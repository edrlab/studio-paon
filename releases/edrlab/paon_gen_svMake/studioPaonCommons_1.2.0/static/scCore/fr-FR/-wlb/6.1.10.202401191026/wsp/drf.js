import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export var WSP_DRF;(function(WSP_DRF){function getDrfStateLabel(st){switch(st){case"notComputed":return""
case"notOverriden":return"Inchangé"
case"created":return"Nouveau"
case"createdDeleted":return"Nouveau en corbeille"
case"overriden":return"Modifié"
case"erased":return"Supprimé"}return st}WSP_DRF.getDrfStateLabel=getDrfStateLabel
function isDrf(props){if(!props)return undefined
return props.drfRefWsp?true:false}WSP_DRF.isDrf=isDrf
async function createWspDrf(wspRef,params,wspType){params.wspRef=wspRef.code
if(wspType==null){if(!wspRef.isLoaded)await wspRef.waitForLoad()
wspType=wspRef.wspType}return WSP.createWsp(wspRef.wspServer,params,wspType)}WSP_DRF.createWspDrf=createWspDrf
async function srcRevert(wsp,uiContext,itemIdents){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("refUris",itemIdents.map(SRC.srcRef).join("\t"))
return wsp.wspServer.config.drfUrl.fetchVoid(IO.qs("cdaction","Revert","param",wsp.code),{method:"POST",body:fd})}WSP_DRF.srcRevert=srcRevert
async function srcCommit(wsp,uiContext,itemIdents){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
await wsp.wspServer.wspsLive.saveItems(wsp.code,itemIdents)
const fd=new FormData
fd.append("refUris",itemIdents.map(SRC.srcRef).join("\t"))
return wsp.wspServer.config.drfUrl.fetchVoid(IO.qs("cdaction","Commit","param",wsp.code),{method:"POST",body:fd})}WSP_DRF.srcCommit=srcCommit})(WSP_DRF||(WSP_DRF={}))

//# sourceMappingURL=drf.js.map