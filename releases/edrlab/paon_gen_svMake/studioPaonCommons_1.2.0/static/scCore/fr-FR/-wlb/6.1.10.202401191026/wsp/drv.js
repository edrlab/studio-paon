import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
export var WSP_DRV;(function(WSP_DRV){function getDrvStateLabel(st){switch(st){case"notComputed":case"createdNotComputed":return""
case"notOverriden":return"Non surchargé, non achevé"
case"notOverridenDone":return"Non surchargé, marqué \'achevé\'"
case"notOverridenDirty":return"Non surchargé, à contrôler"
case"overridenNew":return"Surchargé, non \'achevé\'"
case"overridenDone":return"Surchargé, marqué \'achevé\'"
case"overridenDirty":return"Surchargé, à contrôler"
case"createdNew":return"Local, non \'achevé\'"
case"createdDone":return"Local, marqué \'achevé\'"
case"createdDirty":return"Local, à contrôler"
case"erased":return"Supprimé"}return st}WSP_DRV.getDrvStateLabel=getDrvStateLabel
function getDrvStateDone(st){switch(st){case"notOverriden":case"overridenNew":case"createdNew":return"Non \'achevé\'"
case"notOverridenDone":case"overridenDone":case"createdDone":return"Marqué \'achevé\'"
case"notOverridenDirty":case"overridenDirty":case"createdDirty":return"À contrôler"
case"erased":case"notComputed":case"createdNotComputed":return""}return st}WSP_DRV.getDrvStateDone=getDrvStateDone
function getDrvStateLayer(st){switch(st){case"notOverriden":case"notOverridenDone":case"notOverridenDirty":return"Non surchargé"
case"overridenNew":case"overridenDone":case"overridenDirty":return"Surchargé"
case"createdNew":case"createdDone":case"createdDirty":case"createdNotComputed":return"Local"
case"erased":return"Supprimé"
case"notComputed":return""}return st}WSP_DRV.getDrvStateLayer=getDrvStateLayer
function isDrv(props){if(!props)return undefined
return props.drvAxis?true:false}WSP_DRV.isDrv=isDrv
async function createWspDrv(wspMaster,params,wspType){params.wspMaster=wspMaster.code
if(wspType==null){if(!wspMaster.isLoaded)await wspMaster.waitForLoad()
wspType=wspMaster.wspType}return WSP.createWsp(wspMaster.wspServer,params,wspType)}WSP_DRV.createWspDrv=createWspDrv
async function deleteDrvOverride(wsp,srcUris){const formData=new FormData
formData.append("refUris",Array.isArray(srcUris)?srcUris.join("\t"):srcUris)
return wsp.wspServer.config.drvUrl.fetchVoid("?cdaction=DeleteDrvOverride&param="+wsp.code,{method:"POST",body:formData})}WSP_DRV.deleteDrvOverride=deleteDrvOverride
async function srcDeleteOverride(wsp,uiContext,itemIdents){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
const fd=new FormData
fd.append("refUris",itemIdents.map(SRC.srcRef).join("\t"))
return wsp.wspServer.config.drvUrl.fetchVoid(IO.qs("cdaction","DeleteDrvOverride","param",wsp.code),{method:"POST",body:fd})}WSP_DRV.srcDeleteOverride=srcDeleteOverride
async function srcMarkDrvDone(wsp,uiContext,itemIdents){if(!wsp.isAvailable)await wsp.waitForAvailable(uiContext)
await wsp.wspServer.wspsLive.saveItems(wsp.code,itemIdents)
const fd=new FormData
fd.append("refUris",itemIdents.map(SRC.srcRef).join("\t"))
return wsp.wspServer.config.drvUrl.fetchVoid(IO.qs("cdaction","MarkOverrideDone","param",wsp.code),{method:"POST",body:fd})}WSP_DRV.srcMarkDrvDone=srcMarkDrvDone})(WSP_DRV||(WSP_DRV={}))

//# sourceMappingURL=drv.js.map