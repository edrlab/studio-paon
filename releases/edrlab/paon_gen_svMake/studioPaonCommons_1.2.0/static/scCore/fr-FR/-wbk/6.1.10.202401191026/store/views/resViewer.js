import{BaseAreaView,VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{InfoCurrentRes,InfoFocusRes,InfoReqCurrentRes,InfoUpdatePendingRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/res.js"
import{EHttpStatusCode,isRespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BaseElement,BaseElementAsync,BASIS,isEltRefreshable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{URLTREE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
export class ResViewerSingle extends BaseElement{async setResPath(resPath,lastDatas){var _a,_b
if(this.view){if(this.view.resPath===resPath)return
VIEWS.onViewHidden(this.view,true)
this.view.remove()
this.view=null}else if(resPath==null)return
if(resPath!=null){const resReg=this.reg.env.universe.newDepotResUiRegFromDepotUiReg(this.reg,resPath)
while(resReg.env.nodeInfosPending)await resReg.env.nodeInfosPending
if(this.view!=null)return
if(!resReg.env.nodeInfos){return this.setResPath(URLTREE.extractParentPath(resPath))}else{resReg.env.path=resReg.env.resType.livePath(resReg.env.nodeInfos.permaPath)
const view=this.view=(new ResRoot).initialize({reg:this.reg,keyView:this.keyView,resReg:resReg,lastDatas:lastDatas,onErrorFallback:this.onErrorFallback})
this.shadowRoot.appendChild(view)
if(this._shown)VIEWS.onViewShown(view);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.dispatchInfo(new InfoCurrentRes(this.view.resPath,this.view.reg.env.nodeInfos),this)}}else{(_b=this.reg.env.infoBroker)===null||_b===void 0?void 0:_b.dispatchInfo(new InfoCurrentRes(null),this)}}_initialize(init){var _a,_b,_c
this.reg=this.findReg(init)
this.keyView=init.keyView
this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init);(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.addConsumer(this);(_b=this.reg.env.depotEvents)===null||_b===void 0?void 0:_b.on("resChange",this._onResChange=this.onResChange.bind(this));(_c=this.reg.env.depotEvents)===null||_c===void 0?void 0:_c.on("connOpened",this._onConnOpened=this.onConnOpened.bind(this))
let startPath=init.startWithResPath
if(startPath==null&&init.lastDatas)startPath=init.lastDatas.lastPath
if(startPath!=null)this.setResPath(startPath,init.lastDatas)}onResChange(m){var _a
if(this.view){const livePath=(_a=this.view.reg.env.resType)===null||_a===void 0?void 0:_a.livePath(m.props.path)
if((livePath!==m.props.path||m.props.movedTo)&&livePath===this.view.resPath){this.setResPath(m.props.movedTo||m.props.path)}}}onConnOpened(){if(this.view&&!this.view.reg.env.nodeInfosPending){const path=this.view.resPath
this.setResPath(null)
this.setResPath(path)}}visitViews(visitor,options){if(!this.view)return
if((options===null||options===void 0?void 0:options.visible)&&!this._shown)return
return visitor(this.view)}visitViewsAsync(visitor,options){if(!this.view)return
if((options===null||options===void 0?void 0:options.visible)&&!this._shown)return
return visitor(this.view)}onViewShown(){this._shown=true
if(this.view)VIEWS.onViewShown(this.view)}onViewHidden(closed){var _a,_b,_c
this._shown=false
try{if(this.view)VIEWS.onViewHidden(this.view,closed)}finally{if(closed){this.view=null;(_a=this.reg.env.infoBroker)===null||_a===void 0?void 0:_a.removeConsumer(this);(_b=this.reg.env.depotEvents)===null||_b===void 0?void 0:_b.removeListener("resChange",this._onResChange);(_c=this.reg.env.depotEvents)===null||_c===void 0?void 0:_c.removeListener("connOpened",this._onConnOpened)}}}_refresh(){var _a;(_a=this.view)===null||_a===void 0?void 0:_a.refresh()}onInfo(info){var _a
if(info instanceof InfoReqCurrentRes){if(this.view){info.resPath=this.view.resPath
info.resProps=this.view.reg.env.nodeInfos}}else if(info instanceof InfoFocusRes){this.setResPath(info.resPath)
info.focusHandled=this}else if(info instanceof InfoUpdatePendingRes){const current=(_a=this.view)===null||_a===void 0?void 0:_a.resPath
if(current){const currentType=this.view.reg.env.resType
if(currentType&&currentType.livePath(info.resPath)===current){this.setResPath(null)
info.done.then(r=>{if(r===null){this.setResPath(URLTREE.extractParentPath(current))}else{this.setResPath(r.path)}}).catch(e=>{this.setResPath(current)})}}}}onErrorFallback(resRoot){const me=DOMSH.findHost(resRoot)
me.setResPath(URLTREE.extractParentPath(resRoot.resPath))}}REG.reg.registerSkin("store-resviewer-single",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\tstore-res-root {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n`)
customElements.define("store-resviewer-single",ResViewerSingle)
export class ResRoot extends BaseElementAsync{visitViews(visitor,options){if(!this.view)return
if((options===null||options===void 0?void 0:options.visible)&&!this._shown)return
return visitor(this.view)}visitViewsAsync(visitor,options){if(!this.view)return
if((options===null||options===void 0?void 0:options.visible)&&!this._shown)return
return visitor(this.view)}onViewShown(){this._shown=true
if(this.view)VIEWS.onViewShown(this.view)}onViewHidden(closed){this._shown=false
try{if(this.view)VIEWS.onViewHidden(this.view,closed)}finally{if(closed)this.reg.close()}}async _initialize(init){this.dptReg=init.reg
this.keyView=init.keyView||"main"
this.onErrorFallback=init.onErrorFallback
if(init.lastDatas)this._lastDatas=init.lastDatas
if(init.resReg){this.resPath=init.resReg.env.path
this.setResReg(init.resReg)}else{this.resPath=init.resPath
this.createResReg()}}createResReg(){this.setResReg(this.dptReg.env.universe.newDepotResUiRegFromDepotUiReg(this.dptReg,this.resPath))}setResReg(reg){var _a
this.reg=reg
const lstn=this.reg.env.nodeInfosChange
if(lstn)lstn.on("nodeChange",this.refresh.bind(this))
else(_a=this.reg.env.nodeInfosPending)===null||_a===void 0?void 0:_a.then(this.refresh.bind(this))}_refresh(){const env=this.reg.env
if(env.nodeInfos){if(env.resType!==this.resType){let lastDatas
if(this.resType){this.reg.close()
this.createResReg()}else if(this._lastDatas){lastDatas=this._lastDatas
this._lastDatas=null}this.resType=env.resType
this.draw(lastDatas)}else if(isEltRefreshable(this.view)){this.view.refresh()}else{this.draw(null)}}else if(env.nodeInfosPending){}else{this.resType=null
this.drawError()}}async draw(lastDatas){this.view=await this.resType.resView(this.keyView).loadBody(this.reg,lastDatas)
if(this.reg.isClosed)return
this.clear()
this.appendChild(this.view)
if(this._shown)VIEWS.onViewShown(this.view)}clear(){VIEWS.clearContent(this,true)}drawError(){this.clear()
if(this.reg.env.nodeInfos===null){this.appendChild(JSX.createElement("c-msg",{level:"warning",label:"Ce contenu n\'existe pas ou a été supprimé"}))}else{const err=this.reg.env.nodeInfosError
if(isRespError(err)&&err.response.status==EHttpStatusCode.forbidden){this.appendChild(JSX.createElement("c-msg",{level:"warning",label:"Vous ne disposez pas des permissions pour consulter ce contenu"}))}else{this.appendChild(JSX.createElement("c-msg",{level:"error",label:"Erreur au chargement"}))}}if(this.onErrorFallback)this.onErrorFallback(this)}}customElements.define("store-res-root",ResRoot)
export class ResBodyView extends BaseAreaView{_refresh(){const env=this.reg.env
if(env.nodeInfos){this.clear()
this.draw()}else if(env.nodeInfosPending){env.nodeInfosPending.then(this.refresh.bind(this))}else{this.clear()
this.drawError()}}initBarActions(init,parent){if(init.actionsBar)parent.appendChild(JSX.createElement(BarActions,{id:"bodyActions","î":BASIS.newInit(init.actionsBar,this.reg)}))}clear(){BASIS.clearContent(this.shadowRoot)}drawError(){if(this.reg.env.nodeInfos===null){this.shadowRoot.appendChild(JSX.createElement("c-msg",{level:"warning",label:"Ce contenu n\'existe pas ou a été supprimé"}))}else{const err=this.reg.env.nodeInfosError
if(isRespError(err)&&err.response.status==EHttpStatusCode.forbidden){this.shadowRoot.appendChild(JSX.createElement("c-msg",{level:"warning",label:"Vous ne disposez pas des permissions pour consulter ce contenu"}))}else{this.shadowRoot.appendChild(JSX.createElement("c-msg",{level:"error",label:"Erreur au chargement"}))}}}}
//# sourceMappingURL=resViewer.js.map