import{ActionWrapper}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{GenAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/gen/genActions.js"
import{ActionActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export class ShowPortalFrontsGenAction extends GenAction{constructor(frontsDescPath,id){super(id||"show")
this.frontsDescPath=frontsDescPath
this._label="Ouvrir"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/views/generators/show.svg"
this._description="Ouvrir l\'environnement de test..."
this._hideForStatuses="failed,null"}async findFrontsUrl(ctx){const urlPub=ctx.wsp.wspServer.config.pubUrl.resolve(ctx.genInfo.uriPub.substr(1))
const resp=await urlPub.fetchJson(this.frontsDescPath)
return resp.fronts}buildCustomButton(ctx,uiContext,parent){if(!this.isVisible(ctx))return null
const actWeb=(new GenAction).setLabel("Ouvrir dans un navigateur").setExecute(async(ctx1,ev)=>{const fronts=await this.findFrontsUrl(ctx)
window.open(fronts[0].url,"_blank")
if(fronts.length>1)console.log("TODO multi-fronts",fronts)})
const actElectron=(new GenAction).setLabel("Ouvrir dans une nouvelle fenêtre").setVisible(ctx=>Desk.electron).setExecute(async(ctx1,ev)=>{const fronts=await this.findFrontsUrl(ctx)
window.postMessage({type:"client:servers:open",url:fronts[0].url,name:`${fronts[0].title} - SCENARItest`,save:false,newWindow:{transient:true}},location.origin)
if(fronts.length>1)console.log("TODO multi-fronts",fronts)})
const actClipboard=(new GenAction).setLabel("Copier l\'URL dans le presse-papier").setExecute(async(ctx1,ev)=>{const fronts=await this.findFrontsUrl(ctx)
try{await navigator.clipboard.writeText(fronts[0].url)}catch(e){POPUP.showNotifForbidden("Copie dans le presse-papier impossible. Vérifiez dans votre navigateur que vous avez autorisé ce site à accéder au presse-papier.",ctx.uiContext)}if(fronts.length>1)console.log("TODO multi-fronts",fronts)})
let mainAction
let otherActions=[]
if(Desk.electron){mainAction=actElectron
otherActions.push(actWeb,actClipboard)}else{mainAction=actWeb
otherActions.push(actClipboard)}return(new ActionActions).initialize({reg:ctx.reg,actionContext:ctx,actionBtn:{action:(new ActionWrapper).setOverridenSvc(mainAction).setLabel(this.getLabel(ctx)).setIcon(this.getIcon(ctx))},actionsBtn:{actions:otherActions},skinOver:"dialog/c-button",uiContext:uiContext})}isVisible(ctx){if(!ctx.genInfo.uriPub)return false
return super.isVisible(ctx)}}
//# sourceMappingURL=genActions.js.map