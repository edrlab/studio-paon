import{AgBoxSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgCommonBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/commonBar.js"
import{AgTxtSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{WedEditorBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export function AgPreviewBarEditor(cls){const proto=cls.prototype
proto.showPreview=function(show){if(show){if(!this.previewWedModel)return
if(!this.previewBar){const init=Object.create(this.config)
if(this.commonBar){init.commonBar=this.commonBar}else{init.hideCommonBar=true}init.lastDatasKey="prv"
init.lastDatas=this.config.lastDatas&&this.config.lastDatas[init.lastDatasKey]
init.disableBoxSelection=true
init.disableVirtuals=this.wedMgr.reg.getPref("wed.previewBar.disableVirtuals",true)
this.previewBar=(new PreviewBar).initialize(init).initPreview(this)}else this.previewBar.hidden=false
this.barLayout.showBar(this.previewBar)}else if(this.previewBar){if(DOM.setHidden(this.previewBar,true))this.barLayout.onHideBar(this.previewBar)}}
if(!proto.initLastDatasHooks)proto.initLastDatasHooks=[]
proto.initLastDatasHooks.push((function(lastDatas){if(lastDatas.prv){if(this.wedMgr.rootWedlet){this.showPreview(true)}else{this.wedMgr.listeners.once("redrawAtEnd",()=>{this.showPreview(true)})}}}))
if(!proto.buildLastDatasHooks)proto.buildLastDatasHooks=[]
proto.buildLastDatasHooks.push((function(lastDatas){if(this.previewBar&&!this.previewBar.hidden)this.previewBar.buildLastDatas(lastDatas)}))
return cls}class PreviewBar extends WedEditorBase{constructor(){super()
this.id="previewBar"
this.setAttribute("label","Rendu")}initPreview(mainEditor){this.mainEditor=mainEditor
const mainWedMgr=this.mainEditor.wedMgr
this.wedModel=this.mainEditor.previewWedModel||mainWedMgr.wedModel
mainWedMgr.hookFct("clearEditor",()=>{this.wedMgr.clearEditor()})
mainWedMgr.hookFct("detachDocHolder",()=>{this.wedMgr.detachDocHolder()})
const redrawPreview=()=>{this.wedMgr.detachDocHolder()
const wedMgrConfig={}
wedMgrConfig.xaRoot=mainWedMgr.config.xaRoot
wedMgrConfig.readOnlyCauses=Array.from(mainWedMgr.readOnlyCauses)
wedMgrConfig.noFocus=true
this.initFromDocHolder(mainWedMgr.docHolderAsync.cloneDocHolder(),wedMgrConfig)}
mainWedMgr.listeners.on("redrawAtEnd",redrawPreview)
if(mainWedMgr.drawn)redrawPreview()
return this}}AgBoxSelEditor(AgTxtSelEditor(AgCommonBarEditor(PreviewBar)))
customElements.define("wed-preview-bar",PreviewBar)
export class ShowPreviewAction extends Action{constructor(){super("preview")
this._label="Rendu"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/previewBtn.svg"}isVisible(ctx){return ctx.previewWedModel!=null}isToggle(){return true}getDatas(api,ctx){return ctx.previewBar!=null&&!ctx.previewBar.hidden}execute(ctx,ev){ctx.showPreview(!ctx.previewBar||ctx.previewBar.hidden)}}
//# sourceMappingURL=previewBar.js.map