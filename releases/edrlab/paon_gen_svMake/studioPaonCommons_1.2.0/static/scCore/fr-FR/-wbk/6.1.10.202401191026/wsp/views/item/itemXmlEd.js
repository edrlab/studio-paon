import{BaseElementAsync,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{Button}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ShowOutlineAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/outlineBar.js"
import{ShowPreviewAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/previewBar.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{WedEditorBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditorBox.js"
import{boxTagsDefined}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{txtTagsDefined}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{InlLink}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{isItemUiEnv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{SrcDrawer,SRCDRAWER}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{ptrItemTagsDefined,sgnPatternFromTxtElement,TxtPtrItemBlock,TxtPtrItemInline,WspDataTransferWedAnalyzer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/ptrItem.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EHttpStatusCode,RespError}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{VIEWS,ViewsContainer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{InfoFocusItem,InfoFocusNodeInItem,InfoHighlighItemSgn,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspWorkingSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{EItemTypeFamily}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspMetaUi.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{InsertScComment}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxScComment.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{SearchItemSgnRegexp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{TxtSelMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/itemEditorExt.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/wed/wspSearchBar.js"
import{ItemViewerSingle}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemViewerSingle.js"
import{HistoEditAction,isHistoEditEnv}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/histoEditPoints.js"
export class ItemXmlEd extends BaseElementAsync{isClosed(){return!this.view}closeEditor(leaveState){if(!this.view)return
VIEWS.onViewHidden(this.view,true)
if(this.configs.saveOnClose&&this.isDirty())this.save()
this.view.wedMgr.killEditor()
if(this.configs.reg.env.place!==this.reg.env.place){this.reg.env.place.closePlace()
this.reg.env.place=null}else{if(leaveState!=null)this.reg.env.place.setState(WSP.buildWspRef(this.configs.wspCd,this.configs.srcRef),leaveState)}this.view=null}_refresh(){super._refresh()
if(this.view){const wedMgr=this.view.wedMgr
const docHolder=wedMgr.docHolder
if(docHolder.isAvailable){if(!wedMgr.setReadOnly("locked",docHolder.house.lockedBy!=null,"perms",!this.reg.hasPerm(this._writePermToCheck()))){WEDLET.refreshEditMode(wedMgr.rootWedlet)}}}}_writePermToCheck(){return this.configs.writePerms||"action.itemXmlEd#edit"}isDirty(){return this.view?this.view.wedMgr.docHolder.house.isDirty:false}async save(){return this._saveAct.execute(this.view)}_initialize(init){this.style.display="contents"
this.configs=init||{}
if(!this.configs.reg)this.configs.reg=this.findReg(init)
return this.launchEditor()}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("wsp"))init.wspCd=BASIS.extractAttr(this,"wsp")
if(this.hasAttribute("src-ref"))init.srcRef=BASIS.extractAttr(this,"src-ref")
if(this.hasAttribute("editor-key"))init.editorKey=BASIS.extractAttr(this,"editor-key")
if(this.hasAttribute("editor-config"))init.editorConfig=JSON.parse(BASIS.extractAttr(this,"editor-config"))
if(this.hasAttribute("wedmgr-config"))init.wedMgrConfig=JSON.parse(BASIS.extractAttr(this,"wedmgr-config"))
return init}async launchEditor(){var _a
let confReg=this.configs.reg
const originalEnv=confReg.env
const place=originalEnv.place||originalEnv.universe.wspServer.wspsLive.newPlace()
let wsp=originalEnv.wsp
if(!wsp){const chain=originalEnv.universe
if(!chain||!this.configs.wspCd)throw Error("Universe or wspCd not found")
wsp=await place.getWsp(this.configs.wspCd).waitForAvailable(this)}else if(!wsp.isAvailable){await wsp.waitForAvailable(this)}let srcRef=this.configs.srcRef
if(!srcRef){srcRef=ITEM.srcRefInContext(originalEnv.longDesc)
if(((_a=originalEnv.itemType)===null||_a===void 0?void 0:_a.getFamily())===EItemTypeFamily.res){let targetUri=originalEnv.itemType.getMainXmlSrcUri(originalEnv.longDesc)
if(SRC.isSrcId(srcRef)){srcRef=await WSP.fetchSrcId(originalEnv.wsp,this,targetUri,true)||targetUri}else{srcRef=targetUri}}}const docHolder=await place.newDocHolder(wsp,srcRef)
if(!docHolder)throw Error("Source not found")
const itemType=originalEnv.itemType||docHolder.house.itemType
if(confReg.env.wsp!==wsp)confReg=REG.createSubRegMixed(confReg,wsp.reg)
if(confReg.env.itemType!==itemType)confReg=REG.createSubRegMixed(confReg,itemType.reg)
this.reg=REG.createSubReg(confReg)
this.reg.env.place=place
if(!this.reg.env.longDesc){const longDesc=this.reg.env.longDesc=await wsp.fetchLongDesc(srcRef)
this.reg.env.securityCtx=SEC.createSub(wsp.reg.env.securityCtx,longDesc.srcRoles,longDesc.srcRi,longDesc)}const editorConfig=Object.assign({},this.configs.editorConfig)
const wedMgrConfig=Object.assign({},this.configs.wedMgrConfig)
if(!wedMgrConfig.fetchContentThreshold)wedMgrConfig.fetchContentThreshold=6e3
if(!editorConfig.metaBarMode)editorConfig.metaBarMode="available"
if(!wedMgrConfig.dataTransferAnalyzer)wedMgrConfig.dataTransferAnalyzer=WspDataTransferWedAnalyzer.SINGLETON
const dataEditor=this.configs.datasEditor||itemType.getEditor(this.configs.editorKey)
if(!dataEditor)throw Error("No editor found: "+this.configs.editorKey)
this.view=new WedEditorBox
if(dataEditor.help)(await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/helpBar.js")).initHelpOnEditor(dataEditor.help,this.reg,editorConfig,wedMgrConfig,this.view)
if(dataEditor.initReg)await dataEditor.initReg(this.reg,this.view)
if(dataEditor.overrideConfigs)await dataEditor.overrideConfigs(editorConfig,wedMgrConfig,this.view)
if(this.configs.initItemReg)this.configs.initItemReg(this.reg,this)
editorConfig.reg=this.reg
const parentDatas=this.configs.lastDatas
editorConfig.lastDatasKey="ed:"+srcRef
const lastDatas=parentDatas&&parentDatas[editorConfig.lastDatasKey]
if(lastDatas){editorConfig.lastDatas=lastDatas
parentDatas[editorConfig.lastDatasKey]=null}this.view.addAsyncLib(boxTagsDefined)
this.view.addAsyncLib(txtTagsDefined)
this.view.addAsyncLib(ptrItemTagsDefined)
const mainEndP=itemType.getWed(dataEditor.mainWed)
this.view.addAsyncLib(WED.loadWedModel(mainEndP,mainEndP).then(wed=>this.view.wedModel=wed))
if(dataEditor.outlineWed){const outlineEndP=itemType.getWed(dataEditor.outlineWed)
this.view.addAsyncLib(WED.loadWedModel(outlineEndP,outlineEndP).then(wed=>this.view.outlineWedModel=wed))}if(dataEditor.previewWed){const altviewEndP=itemType.getWed(dataEditor.previewWed)
this.view.addAsyncLib(WED.loadWedModel(altviewEndP,altviewEndP).then(wed=>this.view.previewWedModel=wed))}const lockBtn=new LockAction
wedMgrConfig.readOnlyCauses=wedMgrConfig.readOnlyCauses?wedMgrConfig.readOnlyCauses.concat():[]
if(itemType.datas.readOnly)wedMgrConfig.readOnlyCauses.push("itemType")
if(docHolder.house.lockedBy)wedMgrConfig.readOnlyCauses.push("locked")
else if(!this.reg.hasPerm(this._writePermToCheck())){if(!this.configs.noNotifIfReadOnly){if(!this.reg.hasSystemRights(this._writePermToCheck())){if(!ITEM.isHistoryOrTrashUri(this.reg.env.longDesc.srcUri)){POPUP.showNotifInfo("Ce contenu n\'est pas éditable.",this)}}else{POPUP.showNotifForbidden("Vous ne disposez pas des droits pour modifier ce contenu.",this)}}wedMgrConfig.readOnlyCauses.push("perms")}docHolder.houseLstn.on("onLock",this.refresh.bind(this))
docHolder.houseLstn.on("onPermChange",house=>{this.reg.env.securityCtx=SEC.createSub(wsp.reg.env.securityCtx,house.srcFields.srcRoles,house.srcFields.srcRi,house.srcFields)
this.refresh()})
this._saveAct=new SaveAction(this,docHolder)
this.reg.addToList("actions:wed:commonbar:start","save",1,this._saveAct,0)
this.reg.addToList("actions:wed:commonbar:start","lock",1,lockBtn)
if(isHistoEditEnv(originalEnv)&&originalEnv.infoBroker){wedMgrConfig.histoEditPointsMgr=originalEnv.histoEditMgr
wedMgrConfig.histoEditHolder=new EditHolder(SRC.srcRef(this.reg.env.longDesc),originalEnv.infoBroker)
const act=new HistoEditAction(originalEnv.histoEditMgr)
this.reg.addToList("actions:wed:commonbar:start","histoEdit",1,act,55)
this.reg.addToList("accelKeys:wed:global","q-accel-shift",1,act)}this.reg.addToList("accelKeys:wed:global","s-accel",1,this._saveAct)
this.reg.addToList("accelKeys:wed:global","i-accel-alt-shift",1,viewXmlAction)
this.reg.addToList("actions:wed:commonbar:end","outline",1,new ShowOutlineAction,51)
this.reg.addToList("actions:wed:commonbar:end","preview",1,new ShowPreviewAction,61)
this.reg.registerSvc("wedTxtSelMgrClass",1,WspTxtSelMgr)
this.view.initialize(editorConfig)
if(await this.view.initFromDocHolder(docHolder,wedMgrConfig)){this.appendChild(this.view)
place.setState(docHolder.house.wspRef,EWspWorkingSt.r)}else{this.view=null
this._saveAct=null
throw Error("Init editor failed")}}onViewHidden(closed){var _a
if(this.view&&this.reg)(_a=this.reg.env.histoEditMgr)===null||_a===void 0?void 0:_a.onEditorLooseFocus(this.view.wedMgr.config.histoEditHolder)
if(closed)this.closeEditor()
else VIEWS.onViewHidden(this.view,closed)}visitViews(visitor){if(this.view)return visitor(this.view)}visitViewsAsync(visitor,options){return this.view?visitor(this.view):Promise.resolve(undefined)}}customElements.define("wsp-item-xmled",ItemXmlEd)
class SaveAction extends Action{constructor(itemEditor,docHolder){super("save")
this.itemEditor=itemEditor
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/save.svg")
this.setLabel("Enregistrer")
docHolder.houseLstn.on("dirtyChange",()=>{if(this.button)this.button.refresh()})
docHolder.houseLstn.on("onSave",(state,e)=>{if(!this.button)return
this.button.classList.toggle("saving",state==="saving")
if(state==="saveFailed"){if(e instanceof RespError&&e.response.status===EHttpStatusCode.forbidden){const wedMgr=itemEditor.view.wedMgr
wedMgr.writeRangeToClipboard(XA.newRangeAround(wedMgr.rootWedlet.wedAnchor)).then(()=>{POPUP.showNotifForbidden("Vous ne disposez plus des droits en édition, vos modifications annulées ont été copiées dans le presse-papier.",itemEditor,{autoHide:2e4})}).catch(()=>{POPUP.showNotifForbidden("Vous ne disposez plus des droits en édition, vos modifications ont dû être annulées.",itemEditor,{autoHide:2e4})})
return docHolder.place.abortChangesAndReload(docHolder.house)}else{POPUP.showNotifError("Échec à l\'enregistrement, connexion au serveur impossible. Attention, vous risquez de perdre vos modifications.",itemEditor)}this.saving=false}})}buildCustomButton(ctx,uiContext,parent){return this.button?null:undefined}initButtonNode(buttonNode,ctx){this.button=buttonNode
this.itemEditor.reg.installSkin("wsp-item-xmled/saveBtn",buttonNode.shadowRoot)}isVisible(ctx){if(ctx.wedMgr.readOnly)return false
return super.isVisible(ctx)}isEnabled(ctx){if(this.saving)return false
return super.isEnabled(ctx)&&ctx.wedMgr.docHolder.house.isDirty}async execute(ctx,ev){const docHolder=ctx.wedMgr.docHolder
if(!docHolder.save)return
try{this.saving=true
await docHolder.save()}finally{this.saving=false}}}REG.reg.registerSkin("wsp-item-xmled/saveBtn",1,`\n\t:host(.saving) {\n\t\t--icon-color: red;\n\t}\n`)
class LockAction extends Action{constructor(){super("lock")
this.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/widgets/itemEditor/editing.svg")
this.setDescription("Ce contenu n\'est pas éditable car il est actuellement en cours d\'édition.")}isVisible(ctx){return this.getLockedBy(ctx)!=null}getLabel(ctx){const lock=this.getLockedBy(ctx)
return lock?"Édité par "+lock.account:null}initButtonNode(buttonNode,ctx){buttonNode._hideLabel=false
buttonNode.tabIndexCustom=-2}getLockedBy(ctx){return ctx.wedMgr.docHolder.house.lockedBy}}const viewXmlAction=(new Action).setExecute((ctx,ev)=>{POPUP.showDialog((new ItemXmlEd).initialize({reg:ctx.reg,datasEditor:{mainWed:"rawXml"},wedMgrConfig:{noCleanup:true},noNotifIfReadOnly:true}),ctx,{initHeight:"90%",initWidth:"90%",titleBar:{barLabel:{label:"Source XML"}},resizer:{}})})
REG.reg.addToList("actions:wed:box","scComment",1,new InsertScComment("scComment"))
REG.reg.registerSvc("wedItemBlock",1,SRCDRAWER.previewAndItemCodeAndTitleTpl)
REG.reg.registerSvc("wedItemBlockCompact",1,SRCDRAWER.itemCodeAndTitleTpl)
REG.reg.registerSvc("wedItemBlockOver",1,SRCDRAWER.detailsOrTypesTpl)
REG.reg.registerSvc("wedItemBlockOverCompact",1,SRCDRAWER.detailsPreviewOrTypesTpl)
REG.reg.registerSvc("wedItemInline",1,SRCDRAWER.itemTitleOrCodeTpl)
REG.reg.registerSvc("wedItemInlineOver",1,SRCDRAWER.detailsPreviewOrTypesTpl)
REG.reg.registerSvc("wedItemInlULink",1,(function wedItemInlULink(){if(!this._wedItemInlULinkInited){this._wedItemInlULinkInited=true
POPUP.promiseTooltip(this,(owner,tooltip)=>{const reg=this.wedMgr.reg
const infoBroker=reg.env.infoBroker
const btnShow=infoBroker?(new Button).initialize({reg:reg,label:"Afficher l\'item lié",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/showItem.svg",uiContext:"dialog"}):undefined
if(btnShow)btnShow.onclick=()=>{const srcRef=this.wedAttributes["sc:refUri"]
if(srcRef){const subItemId=ITEM.extractSubItemId(srcRef)
if(subItemId){infoBroker.dispatchInfo(new InfoFocusNodeInItem(`//*[@xml:id='${subItemId}']`,ITEM.extractSrcRef(srcRef,subItemId)),this)}else{infoBroker.dispatchInfo(new InfoFocusItem(srcRef),this)}tooltip.close()}}
const btnEdit=WEDLET.isWritableWedlet(this)?(new Button).initialize({reg:reg,label:"Changer d\'item lié",icon:"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/actions/fastFind.svg",uiContext:"dialog"}):undefined
if(btnEdit)btnEdit.onclick=async ev=>{tooltip.close()
const{FastFindItem:FastFindItem}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js")
const sgnPattern=sgnPatternFromTxtElement(this)
const subSgnPattern=sgnPatternFromTxtElement(this,true)
const ct=(new FastFindItem).initialize({reg:reg,restrictions:sgnPattern?new SearchItemSgnRegexp(sgnPattern.source):null,subItemsFind:subSgnPattern?{subItemSgnPattern:subSgnPattern}:undefined})
const sd=await POPUP.showMenuFromEvent(ct,ev,this,null,{initMaxHeight:"50vh"}).onNextClose()
if(sd&&this.isConnected){this.wedMgr.docHolder.newBatch().setAttr(XA.append(this.wedAnchor,"sc:refUri"),ITEM.srcRefSub(sd)).doBatch()}}
const srcDrawer=(new SrcDrawer).initialize({reg:reg,skin:"wsp-src-drawer/tooltip",tpl:SRCDRAWER.detailsItemIconPreviewTpl})
tooltip.addEventListener("c-show",ev=>{const srcRef=this.wedAttributes["sc:refUri"]
if(srcRef)srcDrawer.setSrcRef(srcRef,null)
else ev.preventDefault()})
return JSX.createElement("div",null,btnShow,btnEdit,srcDrawer)},{skinOver:"wsp-src-drawer/tooltip",hoverAllowed:true,anchor:{posFrom:this,fromX:"end",marginX:-1,notAvailableSpace:{posFrom:this,fromX:"start",targetX:"end",marginX:1}}})}}))
REG.reg.registerSvc("wedItemInlImg",1,(function wedItemInlULink(){let ch=DOM.findFirstChild(this,n=>n instanceof TxtPtrItemInline)
if(!ch){const reg=REG.findReg(this.wedlet.wedMgr.wedEditor)
ch=this.appendChild((new TxtPtrItemInline).initialize({reg:reg,place:reg.env.place,dispatchHighlight:true,tpl:reg.getSvc("wedItemInlImgTpl")||SRCDRAWER.previewOrItemTitleOrCodeTpl,tplOver:reg.getSvc("wedItemInlImgTplOver",SRCDRAWER.detailsOrTypesTpl)}))
this.appendChild(newEditLinkBtn())}ch.initSrcRef(this.wedAttributes["sc:refUri"])}))
function newEditLinkBtn(){return JSX.createElement("span",{class:"editLnk",onclick:function(ev){var _a
const ptrItem=this.previousSibling;(_a=ptrItem===null||ptrItem===void 0?void 0:ptrItem.editAction)===null||_a===void 0?void 0:_a.executeIfAvailable(ptrItem,ev)}})}REG.reg.registerSvc("wedItemInlObject",1,(function wedItemInlObject(){let ch=DOM.findFirstChild(this,n=>n instanceof TxtPtrItemInline)
if(!ch){const reg=REG.findReg(this.wedlet.wedMgr.wedEditor)
ch=this.appendChild((new TxtPtrItemInline).initialize({reg:reg,place:reg.env.place,dispatchHighlight:true,tpl:reg.getSvc("wedItemInlObjectTpl")||SRCDRAWER.itemTitleOrCodeTpl,tplOver:reg.getSvc("wedItemInlObjectTplOver",SRCDRAWER.detailsPreviewOrTypesTpl)}))
this.appendChild(newEditLinkBtn())}ch.initSrcRef(this.wedAttributes["sc:refUri"])}))
REG.reg.registerSvc("wedItemTxtObject",1,(function wedItemTxtObject(){let ch=DOM.findFirstChild(this,n=>n instanceof TxtPtrItemBlock)
if(!ch){const reg=REG.findReg(this.wedlet.wedMgr.wedEditor)
ch=this.appendChild((new TxtPtrItemBlock).initialize({reg:reg,place:reg.env.place,dispatchHighlight:true,tpl:reg.getSvc("wedItemTxtObjectTpl")||SRCDRAWER.previewAndItemCodeAndTitleTpl,tplOver:reg.getSvc("wedItemTxtObjectTplOver",SRCDRAWER.detailsOrTypesTpl)}))
this.appendChild(newEditLinkBtn())}ch.initSrcRef(this.wedAttributes["sc:refUri"])}))
REG.reg.registerSvc("wedItemTxtObjectDiff",1,{addDiff(elt,annot){if(!elt.wedAnnotDiff)(new WEDLET.diffLib.WedDiffTxtObj).initDiffTxtObj(elt,annot,{redrawDiff(diffTxtObj){const srcDiff=diffTxtObj.skAnnots.find(d=>d.type==="diffValue"&&d.start[diffTxtObj.txtObjDepth]==="sc:refUri")
if(srcDiff){if(!diffTxtObj.foreignPtrItem){const reg=diffTxtObj.txtObj.wedMgr.reg
const tag=(new TxtPtrItemBlock).initialize({reg:reg,place:reg.env.place,dispatchHighlight:true,tpl:reg.getSvc("wedItemTxtObjectTpl")||SRCDRAWER.previewAndItemCodeAndTitleTpl,tplOver:reg.getSvc("wedItemTxtObjectTplOver",SRCDRAWER.detailsOrTypesTpl)})
tag.initSrcRef(srcDiff.otherValue)
diffTxtObj.foreignPtrItem=JSX.createElement("div",{style:"background-color:var(--edit-diff-bgcolor)"},tag)
diffTxtObj.txtObj.prepend(diffTxtObj.foreignPtrItem)}}else if(diffTxtObj.foreignPtrItem){diffTxtObj.txtObj.removeChild(diffTxtObj.foreignPtrItem)
diffTxtObj.foreignPtrItem=null}diffTxtObj.txtObj.classList.toggle("diffInMeta",diffTxtObj.skAnnots.length>(srcDiff?1:0))}})
else elt.wedAnnotDiff.addAnnotForMetas(annot)},removeDiff(elt,annot){if(elt.wedAnnotDiff)elt.wedAnnotDiff.removeAnnotForMetas(annot)}})
REG.reg.registerSvc("wedItemTxtEmptyDiff",1,{addDiff(elt,annot){if(!elt.wedAnnotDiff)(new WEDLET.diffLib.WedDiffTxtObj).initDiffTxtObj(elt,annot,{redrawDiff(diffTxtObj){diffTxtObj.txtObj.classList.toggle("diffInMeta",diffTxtObj.skAnnots.length>0)}})
else elt.wedAnnotDiff.addAnnotForMetas(annot)},removeDiff(elt,annot){if(elt.wedAnnotDiff)elt.wedAnnotDiff.removeAnnotForMetas(annot)}})
REG.reg.registerSvc("wedExternalizeItem",1,(async function(from,content,itTypesReducer,uiCtx){const{ItemCreator:ItemCreator}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js")
const itemReg=REG.findReg(uiCtx)
const root=DOM.newDomDoc().createElementNS(DOM.SCCORE_NS,DOM.SCITEM_TAG)
root.appendChild(root.ownerDocument.importNode(content,true))
return ItemCreator.openCreateItem(ItemCreator.setDefaultConfigFromReg(from,{body:new Blob([DOM.ser(root,true)],{type:"text/xml"}),itemTypesTree:{itemTypeReducer:itTypesReducer},spaceUri:isItemUiEnv(itemReg.env)?ITEM.extractSpaceUri(itemReg.env.longDesc.srcUri):null}),"Externaliser le contenu vers un item...",uiCtx).onNextClose()}))
export class ItemEditInDialogInfoBroker extends InfoBrokerBasic{constructor(reg){super()
this.reg=reg}async dispatchInfo(info,from){if(info instanceof InfoFocusItem){const shortDesc=info.shortDesc||await this.reg.env.wsp.fetchShortDesc(info.srcRef,this.reg.env.uiRoot)
const itemType=this.reg.env.wsp.wspMetaUi.getItemType(shortDesc.itModel)
const subReg=REG.createSubRegMixed(this.reg,itemType.reg)
subReg.env.infoBroker=new InfoBrokerBasic
const itemViewer=new ItemViewerSingle({mainViewCode:":hideWspStruct:"})
const root=JSX.createElement(ViewsContainer,{"î":{views:[itemViewer]},style:"flex:1;display:flex;min-height:0;min-width:0;flex-direction:column;"})
await itemViewer.initViewer(subReg,root,null,info.srcRef)
if(info instanceof InfoFocusNodeInItem){subReg.env.infoBroker.dispatchInfo(new InfoFocusNodeInItem(info.xpath,info.srcRef),this)}const popup=POPUP.findPopupableParent(from)
if(popup&&popup.infoBroker===this){const currentEd=popup.firstElementChild
if(currentEd.configs.srcRef===info.srcRef)return
VIEWS.onViewHidden(currentEd,true)
popup.firstElementChild.remove()
popup.appendChild(root)}else{const newPopup=POPUP.showDialog(root,this.reg.env.uiRoot,{titleBar:{barLabel:{label:"Sous-item"}},initWidth:"90%",initHeight:"90%",resizer:{}})
newPopup.infoBroker=this}info.handled=true
return}super.dispatchInfo(info,from)}}class WspTxtSelMgr extends TxtSelMgr{constructor(root){super(root)
if(this._root.wedMgr.docHolder)this._infoBroker=this._root.wedMgr.reg.env.infoBroker}onBlur(ev){super.onBlur(ev)
if(this._highlightForLink){this._highlightForLink=null
if(this._highlightSgn){this._highlightSgn=null
this._infoBroker.dispatchInfo(new InfoHighlighItemSgn(null),this)}}}onSelChange(){super.onSelChange()
if(this._sel.focusNode&&this._infoBroker){const inlLink=DOM.findParent(this._oldSel.commonAncestorContainer,this._root,n=>n instanceof InlLink)
if(this._highlightForLink!==inlLink){this._highlightForLink=inlLink
let sgn=null
let assigned
if(inlLink){const path=inlLink.wedAnchor
path.push("sc:refUri")
assigned=inlLink.wedAttributes&&inlLink.wedAttributes["sc:refUri"]
const struct=this._root.wedMgr.docHolder.getStruct(path,assigned!==undefined?null:["@"])
sgn=struct&&struct.itSgnPattern}if(this._highlightSgn!==sgn){this._highlightSgn=sgn
this._infoBroker.dispatchInfo(new InfoHighlighItemSgn(sgn,assigned),this)}}}}}class EditHolder{constructor(srcRef,infoBroker){this.srcRef=srcRef
this.infoBroker=infoBroker}isSame(other){return other.srcRef===this.srcRef}goTo(targetAddr){this.infoBroker.dispatchInfo(new InfoFocusNodeInItem(targetAddr.addr,this.srcRef),this)
return true}}
//# sourceMappingURL=itemXmlEd.js.map