import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AgEltBoxSelection,AgWedletBoxSelectionSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{TxtSelMgr,TxtSelMgrFrozen}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{isWedChildrenElt,NoneModel,WED,WedModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{AgEltBoxInputAnnotable,removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{copyAsXml,createTxtAction,pasteAsString,pasteAsText,spellcheckMenu}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtActions.js"
import{InlEmpty,InlImg,InlLeaf,InlLink,InlNote,InlObject,InlPhrase,InlStyle,TxtCaption,TxtCell,TxtCol,TxtDiv,TxtElement,TxtEmpty,TxtLI,TxtMember,TxtObject,TxtOL,TxtPara,TxtParaLike,TxtRow,TxtSL,TxtStr,TxtTable,TxtTitle,TxtUL}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{adjustVirtualsPara,adjustVirtualsStr,beforeInputHandler,deleteFromSel,doInput,findTxtEltFirstChild,findTxtEltOrRootParent,findTxtParaLikeFrom,findTxtStrFirstChild,findTxtStrLastChild,findTxtStrNext,findTxtStrParent,findTxtStrPrevious,IS_TxtElement,IS_TxtStr,keyDownHandler,keyPressHandler}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{EWedletEditMode,EWedletEditModeLabel,WEDLET,WedletActionCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{AccelKeyMgr,ACTION,Action,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMetaTxt.js"
import{AgEltBoxInsertDrawerTxt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgrTxt.js"
import{BoxModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
export const TXT_NS="scenari.eu:wed:txt"
export class TxtModel{get modes(){return WED.DEFAULT_MODES}set modes(val){}get isInline(){return false}get roleAttName(){return TxtModel.ATTNAME_role}get hasRefresh(){return this.refreshSvc!=null||this.refreshLib!=null}callRefresh(elt){let refresh
if(this.refreshSvc)refresh=REG.findReg(elt).getSvc(this.refreshSvc)
if(!refresh){const lib=elt.wedMgr.wedModel.jsLibs[this.refreshLib]
if(lib)refresh=lib[this.refreshMeth]}if(refresh)refresh.call(elt)
else console.log("ITxtRefresh function not found. svc="+this.refreshSvc+" lib="+this.refreshLib+"."+this.refreshMeth)}get hasOnCreateHook(){return this.onCreateSvc!=null||this.onCreateLib!=null}callOnCreateHook(parent){let hook
if(this.onCreateSvc)hook=REG.findReg(parent).getSvc(this.onCreateSvc)
if(!hook){const lib=(parent instanceof TxtElement?parent:parent.wedlet).wedMgr.wedModel.jsLibs[this.onCreateLib]
if(lib){hook=lib[this.onCreateMeth]}}if(hook)return hook.call(this,parent)
console.log("ITxtOnCreateHook function not found. svc="+this.onCreateSvc+" lib="+this.onCreateLib+"."+this.onCreateMeth)
return Promise.resolve(null)}get txtWedModels(){return null}getTxtWedModel(tagName,role){if(this.txtWedModels)for(const txtModel of this.txtWedModels)if(txtModel.nodeName===tagName&&(role==null||txtModel.role===role))return txtModel
return null}get paraModel(){return this.txtRootModel?this.txtRootModel.paraModel:null}get strModel(){return this.txtRootModel?this.txtRootModel.strModel:null}initModel(cnf){this.config=cnf
this.role=cnf.getAttributeNS(TXT_NS,"role")
this.nodeLabel=cnf.getAttribute("label")
this.txtRootModel=cnf.closest("txt-root,txt-root-inline")
for(let tag=cnf.firstElementChild;tag;tag=tag.nextElementSibling){if(tag.namespaceURI===TXT_NS){const nm=tag.localName
if(nm==="metas"){this.metasName=tag.getAttribute("eltName")}else if(nm==="refresh"){this.refreshSvc=tag.getAttribute("svc")
const lib=tag.getAttribute("lib")
if(lib){this.refreshLib=lib
this.refreshMeth=tag.getAttribute("method")}}else if(nm==="onCreate"){this.onCreateSvc=tag.getAttribute("svc")
const lib=tag.getAttribute("lib")
if(lib){this.onCreateLib=lib
this.onCreateMeth=tag.getAttribute("method")}}else if(nm==="panel"){this.panelModel=WED.newWedletModel(tag.getAttribute("wedlet")||"Box")
this.panelModel.nodeType=this.nodeType
this.panelModel.nodeName=this.nodeName
this.panelModel.perms=WED.parsePerms(tag)
this.panelModel.initModel(tag)}else if(nm==="rendering"){this.renderingModel=WED.newWedletModel(tag.getAttribute("wedlet")||"Box")
this.renderingModel.nodeType=this.nodeType
this.renderingModel.nodeName=this.nodeName
this.renderingModel.perms=WED.parsePerms(tag)
this.renderingModel.initModel(tag)}else if(nm==="diff"){this.initDiff(tag)}}}}initDiff(tag){}createWedlet(parent,displayContext){return this.newWedlet().initWedlet(this,parent,displayContext)}createRootWedlet(wContainer,insertBefore,wedMgr){throw Error("Txt wedlets not allowed as root wedlet.")}newJml(){const jml={"":this.nodeName}
if(this.role)jml[TxtModel.ATTNAME_role]=this.role
return jml}buildModelForFragment(insertCtx){return insertCtx.txtRoot.wedlet.model}}TxtModel.ATTNAME_role="role"
TxtModel.wedSelector=function(wedModel,node,ctx){if(wedModel instanceof TxtModel){if(wedModel.nodeType===ENodeType.element&&(node==null||JML.jmlNode2nodeType(node)===ENodeType.element)){if(wedModel.role===null){return 10}else if(wedModel.role===(node&&node[TxtModel.ATTNAME_role]||"")){return WedModel.SELECTOR_PERFECT_MATCH}return WedModel.SELECTOR_REJECT}return WedModel.SELECTOR_PERFECT_MATCH}else if(wedModel instanceof NoneModel){return 1}return WedModel.SELECTOR_REJECT}
export class TxtContainerModel extends TxtModel{initModel(cnf){super.initModel(cnf)}get txtWedModels(){return this.txtRootModel?this.txtRootModel.preferedBlockTxtModels:null}}export class InlineContentModel extends TxtModel{get txtWedModels(){return this.txtRootModel?this.txtRootModel.preferedInlineTxtModels:null}}export class TxtParaModel extends InlineContentModel{newWedlet(){return new TxtPara}newJml(){const jml={"":this.nodeName,"xml:space":"preserve"}
if(this.role)jml[TxtModel.ATTNAME_role]=this.role
return jml}}WED.registerWedletModel("TxtPara",TxtParaModel)
export class TxtULModel extends TxtModel{initModel(cnf){super.initModel(cnf)
for(let ch=cnf.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="item"&&ch.namespaceURI===TXT_NS){this.itemModel=WED.buildBind(ch,"TxtLI")}else if(ch.localName==="title"&&ch.namespaceURI===TXT_NS){this.titleModel=WED.buildBind(ch,"TxtTitle")}}if(!this.itemModel)throw Error("No txt:item tag declared in wed: "+DOM.debug(cnf))
this.childrenModels=this.titleModel?[this.titleModel,this.itemModel]:[this.itemModel]}get txtWedModels(){return this.childrenModels}newWedlet(){return new TxtUL}}WED.registerWedletModel("TxtUL",TxtULModel)
export class TxtOLModel extends TxtULModel{newWedlet(){return new TxtOL}}WED.registerWedletModel("TxtOL",TxtOLModel)
export class TxtSLModel extends TxtModel{initModel(cnf){super.initModel(cnf)
for(let ch=cnf.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="member"&&ch.namespaceURI===TXT_NS){this.memberModel=WED.buildBind(ch,"TxtMember")}else if(ch.localName==="title"&&ch.namespaceURI===TXT_NS){this.titleModel=WED.buildBind(ch,"TxtTitle")}}if(!this.memberModel)throw Error("No txt:member tag declared in wed: "+DOM.debug(cnf))
this.childrenModels=this.titleModel?[this.titleModel,this.memberModel]:[this.memberModel]}get paraModel(){return this.memberModel}get txtWedModels(){return this.childrenModels}newWedlet(){return new TxtSL}}WED.registerWedletModel("TxtSL",TxtSLModel)
export class TxtDivModel extends TxtContainerModel{newWedlet(){return new TxtDiv}}WED.registerWedletModel("TxtDiv",TxtDivModel)
export class TxtTableModel extends TxtModel{constructor(){super(...arguments)
this.colModels=[]
this.rowModels=[]
this.childrenModels=[]}initModel(cnf){super.initModel(cnf)
for(let ch=cnf.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.namespaceURI===TXT_NS){let model
if(ch.localName==="column"){model=WED.buildBind(ch,"TxtCol")
if(model)this.colModels.push(model)}else if(ch.localName==="row"){model=WED.buildBind(ch,"TxtRow")
if(model)this.rowModels.push(model)}else if(ch.localName==="caption"){model=this.captionModel=WED.buildBind(ch,"TxtTitle")}if(model)this.childrenModels.push(model)}}}get txtWedModels(){return this.childrenModels}newWedlet(){return new TxtTable}}WED.registerWedletModel("TxtTable",TxtTableModel)
export class TxtLIModel extends TxtContainerModel{newWedlet(){return new TxtLI}}WED.registerWedletModel("TxtLI",TxtLIModel)
export class TxtMemberModel extends TxtParaModel{newWedlet(){return new TxtMember}}WED.registerWedletModel("TxtMember",TxtMemberModel)
export class TxtTitleModel extends TxtParaModel{newWedlet(){return new TxtTitle}}WED.registerWedletModel("TxtTitle",TxtTitleModel)
export class TxtCaptionModel extends TxtParaModel{newWedlet(){return new TxtCaption}}WED.registerWedletModel("TxtCaption",TxtCaptionModel)
export class TxtColModel extends TxtModel{initModel(cnf){super.initModel(cnf)
const widthMgr=cnf.getAttributeNS(TXT_NS,"widthMgr")
if(widthMgr){const offs=widthMgr.indexOf(".")
if(offs>0){this.widthMgrLib=widthMgr.substring(0,offs)
this.widthMgrKey=widthMgr.substring(offs+1)}}if(!this.widthMgrLib)console.log("WidthMgr is required on table column definition: "+DOM.ser(cnf))}widthMgr(wedMgr){return wedMgr.wedModel.jsLibs[this.widthMgrLib][this.widthMgrKey]}get hasRefresh(){return this.widthMgrLib!=null||this.refreshSvc!=null||this.refreshLib!=null}callRefresh(elt){this.widthMgr(elt.wedMgr).refreshW(elt)
if(this.refreshSvc||this.refreshLib)super.callRefresh(elt)}newWedlet(){return new TxtCol}}WED.registerWedletModel("TxtCol",TxtColModel)
export class TxtRowModel extends TxtModel{constructor(){super(...arguments)
this.cellModels=[]}initModel(cnf){super.initModel(cnf)
for(let ch=cnf.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="cell"&&ch.namespaceURI===TXT_NS){const model=WED.buildBind(ch,"TxtCell")
if(model)this.cellModels.push(model)}}}get txtWedModels(){return this.cellModels}newWedlet(){return new TxtRow}}WED.registerWedletModel("TxtRow",TxtRowModel)
export class TxtCellModel extends TxtContainerModel{initModel(cnf){super.initModel(cnf)
const widthMgr=cnf.getAttributeNS(TXT_NS,"spanMgr")
if(widthMgr){const offs=widthMgr.indexOf(".")
if(offs>0){this.spanMgrLib=widthMgr.substring(0,offs)
this.spanMgrKey=widthMgr.substring(offs+1)}}}get hasRefresh(){return this.spanMgrLib!=null||this.refreshSvc!=null||this.refreshLib!=null}callRefresh(elt){if(this.spanMgrLib)elt.spanMgr.refreshSpan(elt)
if(this.refreshSvc||this.refreshLib)super.callRefresh(elt)}newWedlet(){return new TxtCell}}WED.registerWedletModel("TxtCell",TxtCellModel)
export class TxtObjectModel extends TxtModel{initDiff(tag){this.diffSvc=tag.getAttribute("svc")}newWedlet(){return new TxtObject}addDiffCustom(elt,annot){if(!this.diffSvc)return false
const diffCustom=REG.findReg(elt).getSvc(this.diffSvc)
if(diffCustom){diffCustom.addDiff(elt,annot)
return true}console.log("ITxtAnnotDiff function not found. svc="+this.diffSvc)
return false}removeDiffCustom(elt,annot){if(!this.diffSvc)return false
const diffCustom=REG.findReg(elt).getSvc(this.diffSvc)
if(diffCustom){diffCustom.removeDiff(elt,annot)
return true}return false}}WED.registerWedletModel("TxtObject",TxtObjectModel)
export class TxtEmptyModel extends TxtObjectModel{newWedlet(){return new TxtEmpty}}WED.registerWedletModel("TxtEmpty",TxtEmptyModel)
export class InlPhraseModel extends InlineContentModel{get isInline(){return true}get splitPriority(){return 20}newWedlet(){return new InlPhrase}}WED.registerWedletModel("InlPhrase",InlPhraseModel)
export class InlStyleModel extends InlineContentModel{get isInline(){return true}get splitPriority(){return 10}newWedlet(){return new InlStyle}}WED.registerWedletModel("InlStyle",InlStyleModel)
export class InlLinkModel extends InlineContentModel{get isInline(){return true}get splitPriority(){return 30}newWedlet(){return new InlLink}}WED.registerWedletModel("InlLink",InlLinkModel)
export class InlLeafModel extends TxtModel{get isInline(){return true}get splitPriority(){return 0}newWedlet(){return new InlLeaf}get txtWedModels(){return this.txtRootModel?[this.txtRootModel.strModel]:null}}WED.registerWedletModel("InlLeaf",InlLeafModel)
export class InlImgModel extends TxtModel{get isInline(){return true}newWedlet(){return new InlImg}}WED.registerWedletModel("InlImg",InlImgModel)
export class InlObjectModel extends TxtModel{get isInline(){return true}newWedlet(){return new InlObject}}WED.registerWedletModel("InlObject",InlObjectModel)
export class InlEmptyModel extends TxtModel{get isInline(){return true}newWedlet(){return new InlEmpty}}WED.registerWedletModel("InlEmpty",InlEmptyModel)
export class InlNoteModel extends TxtContainerModel{newWedlet(){return new InlNote}}WED.registerWedletModel("InlNote",InlNoteModel)
export class TxtStrModel extends TxtModel{constructor(){super(...arguments)
this.keepSpaces=false}initModel(cnf){this.config=cnf
this.nodeLabel=cnf.getAttribute("label")}newJml(){return""}newWedlet(){return new TxtStr}}WED.registerWedletModel("TxtStr",TxtStrModel)
function isOnTypingFactory(ot){return ot&&"buildOnTyping"in ot}function findOnTyping(def,reg){const svcCode=def.getAttribute("svc")
if(svcCode){const ot=reg.getSvc(svcCode)
if(isOnTypingFactory(ot))return new OnTypingFromSvc(ot,def)
return ot}const lib=def.getAttribute("lib")
return lib?new OnTypingFromLib(lib,def.getAttribute("identifier"),def):null}class OnTypingFromLib{constructor(lib,identifier,config){this.lib=lib
this.identifier=identifier
this.config=config}buildOnTyping(wedMgr,config){const lib=wedMgr.wedModel.jsLibs[this.lib]
if(!lib||!(this.identifier in lib))return null
const ot=lib[this.identifier]
return isOnTypingFactory(ot)?ot.buildOnTyping(wedMgr,this.config):ot}}class OnTypingFromSvc{constructor(ot,config){this.ot=ot
this.config=config}buildOnTyping(wedMgr,config){return this.ot.buildOnTyping(wedMgr,this.config)}}export class TxtRoot extends HTMLElement{constructor(){super()
this._RefreshCycle=0
this.addEventListener("focusin",this.onFocusin)
this.addEventListener("blur",this.onBlur)
this.addEventListener("keydown",this.onKeyDown)
this.addEventListener("keypress",this.onKeyPress)
this.addEventListener("compositionstart",this.onCompositionStart)
this.addEventListener("compositionupdate",this.onCompositionUpdate)
this.addEventListener("compositionend",this.onCompositionEnd)
this.addEventListener("beforeinput",this.onBeforeinput)
this.addEventListener("copy",this.onCopy)
this.addEventListener("cut",this.onCut)
this.addEventListener("paste",this.onPaste)
this.addEventListener("dragstart",this.onDragstart)
this.addEventListener("drop",this.onDrop)
this.addEventListener("click",this.onClick)
this.style.whiteSpace="pre-wrap"
this.beforeInputHandler=beforeInputHandler
this.keyPressHandler=keyPressHandler
this.keyDownHandler=keyDownHandler}static buildWedSelector(elt){return TxtModel.wedSelector}get wedAnchor(){return this.wedlet.wedAnchor}get txtRoot(){return this}get focusedElt(){return this}get isTextContainer(){return false}get isMonoPara(){return false}get selMgr(){if(this._selMgrFrozen)return this._selMgrFrozen
this.selMgrAsIs.fixupSel()
return this.selMgrAsIs}connectedCallback(){var _a
if(((_a=this.wedlet.wedParent)===null||_a===void 0?void 0:_a.model.nodeType)!==ENodeType.element||this.getAttribute("stretch")==="vertical"){const st=this.style
st.flex="1"
let n=DOMSH.getFlatParentElt(this)
const root=this.wedMgr.wedEditor.rootNode
while(n){const st=n.style
st.flex="1"
st.display="flex"
st.flexDirection="column"
st.padding="0"
if(n===root)break
st.border="none"
n=DOMSH.getFlatParentElt(n)}}}get txtWedModels(){return this.wedConfig.wedChildrenElt.wedPreferedModels}get paraModel(){return this.wedConfig.paraModel}get strModel(){return this.wedConfig.strModel}getTxtWedModel(tagName,role){if(role==null)role=""
for(const txtModel of this.txtWedModels)if(txtModel.nodeName===tagName&&txtModel.role===role)return txtModel
return null}insertVirtualPara(before){const paraModel=this.paraModel
if(!paraModel)return null
const childrenElt=this.wedConfig.wedChildrenElt
const para=paraModel.createWedlet(this.wedlet,childrenElt.wedDefaultDisplay)
para.configWedletElt(paraModel.config,para)
if(childrenElt.wedSlotName){para.setAttribute("slot",childrenElt.wedSlotName)
if(!this.hasAttribute("mono-para"))evalPlaceHolder(this,para)}para.fromChildrenElt=childrenElt
this.insertBefore(para,before)
return para.bindAsVirtual()}insertVirtualStr(before){console.trace("Should not be called!!")}onRefreshCycle(before){if(before){if(!(this.selMgrAsIs.focusNode||this).isConnected)return"stop"
if(0===this._RefreshCycle++)this._selMgrFrozen=new TxtSelMgrFrozen(this.selMgrAsIs)}else if(this._RefreshCycle>0){if(--this._RefreshCycle===0)this._selMgrFrozen=null}}unfreezeSel(){this._RefreshCycle=0
this._selMgrFrozen=null}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.wedMgr=wedlet.wedMgr
this.selMgrAsIs=new(this.wedMgr.reg.getSvc("wedTxtSelMgrClass")||TxtSelMgr)(this)
this.contentEditable=WEDLET.isWritableWedlet(this.wedlet)?"true":"false"
this.wedConfig=tpl
this.wedlet.element.setDelegatedHost(this)
if(!this.wedConfig.wedChildrenElt){for(let ch=this.wedConfig.firstElementChild;ch;ch=ch.nextElementSibling){if(isWedChildrenElt(ch)){if(this.wedConfig.wedChildrenElt)throw Error("'wed:children' found twice in txt-root wed: "+DOM.debug(this.wedConfig))
this.wedConfig.wedChildrenElt=ch
this.wedConfig.preferedBlockTxtModels=[]
this.wedConfig.preferedInlineTxtModels=[]
const childrenModels=this.wedConfig.wedChildrenElt.wedPreferedModels
if(childrenModels)for(const model of childrenModels)this._indexModel(model)
const descendants=DOM.findFirstChild(this.wedConfig,n=>n.localName==="descendants")
if(descendants)for(let bind=descendants.firstElementChild;bind;bind=bind.nextElementSibling){this._indexModel(WED.buildBind(bind))}if(!this.wedConfig.strModel)this.wedConfig.strModel=this.wedMgr.wedModel.findModelForVirtual(ENodeType.text,null,null,null,this.wedlet,TxtModel.wedSelector,null)}}if(!this.wedConfig.wedChildrenElt)throw Error("No 'wed:children' tag found in txt-root wed: "+DOM.debug(this.wedConfig))}const inlineMarks=this.wedMgr.reg.getUserData("wedTxtInlineMarkers",this.wedMgr.reg.getPref("userdata.default.wedTxtInlineMarkers",false))
if(inlineMarks)this.inlineMarkers=true}get txtRootProps(){const props=this.wedMgr.getDatasForModel(this.wedConfig)
if(props.onTypings!==undefined)return props
let onTypings
let focusBarActions
const tableBarsActions={}
const subReg=REG.createSubReg(REG.findReg(this))
props.accelKeyMgr=new AccelKeyMgr
props.accelKeyMgr.addAccelKey("c","accel,shift",copyAsXml)
props.accelKeyMgr.addAccelKey("v","accel,shift",pasteAsText)
props.accelKeyMgr.addAccelKey("v","accel,shift,alt",pasteAsString)
for(let ch=this.wedConfig.firstElementChild;ch;ch=ch.nextElementSibling){if(ch.localName==="uiconfig"){for(let conf=ch.firstElementChild;conf;conf=conf.nextElementSibling){if(conf.namespaceURI!==TXT_NS)continue
if(conf.localName==="accelKeys"){const list=split(conf.getAttribute("lists"))
if(list){for(let defKey=conf.firstElementChild;defKey;defKey=defKey.nextElementSibling){if(defKey.localName==="accelKey")subReg.addToList(list[0],defKey.getAttribute("key")+"-"+(defKey.getAttribute("modifiers")||"accel"),REG.LEVELAUTH_MODEL,createTxtAction(defKey.firstElementChild,defKey.getAttribute("actionId"),subReg,false))}props.accelKeyMgr.initFromMapActions(subReg.mergeListsAsMap(...list))}else{for(let bind=conf.firstElementChild;bind;bind=bind.nextElementSibling){if(bind.localName==="accelKey"){props.accelKeyMgr.addAccelKey(bind.getAttribute("key"),bind.getAttribute("modifiers")||"accel",createTxtAction(bind.firstElementChild,bind.getAttribute("actionId"),subReg,false))}}}}else if(conf.localName==="toolbar"){const list=split(conf.getAttribute("lists"))
let actions=list?null:[]
for(let btn=conf.firstElementChild;btn;btn=btn.nextElementSibling){if(btn.localName==="button"){const id=btn.getAttribute("actionId")
const action=createTxtAction(btn.firstElementChild,id,subReg,true,list)
if(actions&&action)actions.push(action)}}if(list)actions=subReg.mergeLists(...list)
focusBarActions=actions.length>0?ACTION.injectSepByGroup(actions,"",this):null}else if(conf.localName==="tableToolbar"){const list=split(conf.getAttribute("lists"))
let actions=list?null:[]
for(let btn=conf.firstElementChild;btn;btn=btn.nextElementSibling){if(btn.localName==="button"){const id=btn.getAttribute("actionId")
const action=createTxtAction(btn.firstElementChild,id,subReg,true,list)
if(actions&&action)actions.push(action)}}if(list)actions=subReg.mergeLists(...list)
tableBarsActions[conf.getAttribute("role")||""]=actions.length>0?actions:null}else if(conf.localName==="onTypings"){const list=split(conf.getAttribute("lists"))
if(list){for(let otElt=conf.firstElementChild;otElt;otElt=otElt.nextElementSibling){if(otElt.localName==="onTyping")subReg.addToList(list[0],otElt.getAttribute("otId"),REG.LEVELAUTH_MODEL,findOnTyping(otElt,subReg))}onTypings=subReg.mergeLists(...list)}else{onTypings=subReg.getList("wed:text:onTyping")
for(let otElt=conf.firstElementChild;otElt;otElt=otElt.nextElementSibling){if(otElt.localName==="onTyping"){const ot=findOnTyping(otElt,subReg)
if(ot)onTypings.push(ot)}}}}else if(conf.localName==="inlineMarkerStyle"){subReg.registerSkin("txt-root/InlineMarker",REG.LEVELAUTH_MODEL,conf.textContent)}}}}if(!onTypings)onTypings=REG.findReg(this).getList("wed:text:onTyping")
if(!onTypings){props.onTypings=null}else{props.onTypings=[]
for(let i=0;i<onTypings.length;i++){let ot=onTypings[i]
if(isOnTypingFactory(ot))ot=ot.buildOnTyping(this.wedMgr)
if(ot)props.onTypings.push(ot)}}props.focusBar=(new BarActions).initialize({actions:focusBarActions||[],actionContext:new WedTxtRootCtx})
for(const k in tableBarsActions){if(!props.tableBars)props.tableBars={}
props.tableBars[k]=(new BarActions).initialize({actions:tableBarsActions[k],actionContext:new WedTxtRootCtx})}props.inlineMarkStyle=subReg.getSvc(REG.SKIN_PREFIX+"txt-root/InlineMarker")
return props}_indexModel(model){if(model instanceof TxtStrModel){this.wedConfig.preferedInlineTxtModels.push(model)
if(!model.role)this.wedConfig.strModel=model}else if(model.isInline){this.wedConfig.preferedInlineTxtModels.push(model)}else{this.wedConfig.preferedBlockTxtModels.push(model)
if(model instanceof TxtParaModel&&!model.role)this.wedConfig.paraModel=model}}refreshBindValue(val){if(this.wedlet.isVirtual())removeAnnots(this)}setEditMode(mode){this.contentEditable=mode===EWedletEditMode.write?"true":"false"
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}onChildWedletsChange(){adjustVirtualsPara(this)
if(this.hasAttribute("mono-para")){const para=findTxtEltFirstChild(this)
if(para)evalPlaceHolder(this,para.findOrCreateTxtStr(false))}}get accelKeyMgr(){return this.txtRootProps.accelKeyMgr}get onTypings(){return this.txtRootProps.onTypings}get inlineMarkers(){const styleDef=this.txtRootProps.inlineMarkStyle
if(!styleDef)return false
const style=styleDef.getSkinIfExist(DOMSH.findDocumentOrShadowRoot(this))
return style?!style.disabled:false}set inlineMarkers(val){const styleDef=this.txtRootProps.inlineMarkStyle
if(!styleDef)return
if(!("showTxtStackBar"in this.wedMgr.wedEditor))return
const shRoot=DOMSH.findDocumentOrShadowRoot(this)
const style=styleDef.getSkinIfExist(shRoot)
if(style){style.disabled=!val}else{if(val)styleDef.installSkin(shRoot)}if(val)this.wedMgr.wedEditor.showTxtStackBar()
else this.wedMgr.wedEditor.hideTxtStackBar()}storeInlineMarkers(){const persist=this.wedMgr.reg.getPersistUserStates()
if(persist)persist.setUserDatas({wedTxtInlineMarkers:this.inlineMarkers})}get focusBar(){const bar=this.txtRootProps.focusBar
if(bar)bar.actionContext.focusedElt=this
return bar}get ctxMenuActions(){const bar=this.focusBar
let actions=Desk.electron&&this.contentEditable==="true"?[spellcheckMenu]:[]
let actionContext
if(bar){actions.push(new ActionSeparator,...bar.actions)
actionContext=bar.actionContext}else{actionContext=new WedTxtRootCtx}actionContext.focusedElt=this
return{actionContext:actionContext,actions:actions}}handleEventFromContainer(ev){this.selMgr.selectAll()
if(ev instanceof KeyboardEvent&&ev.key.length===1&&this.contentEditable){const d=new DataTransfer
d.setData("text/plain",ev.key)
this.doPaste("string",d)}}onFocusin(ev){this.selMgrAsIs.onFocus(ev)}onBlur(ev){this.selMgrAsIs.onBlur(ev)}onCompositionStart(ev){const selMgr=this.selMgr
if(selMgr.type!=="Caret")deleteFromSel(this,false,"character")
const textNode=selMgr.focusNode
const txtStr=findTxtStrParent(selMgr.focusNode)
textNode.ime={start:selMgr.focusOffset,len:0}
this.pendingIme=textNode}onCompositionUpdate(ev){this.pendingIme.ime.len=ev.data.length}onCompositionEnd(ev){if(ev.data){this.webUpdateDone=true
doInput(ev.data,ev,this)
this.webUpdateDone=false}this.pendingIme.ime=null
this.pendingIme=null}onBeforeinput(ev){const type=ev.inputType
if(type in this.beforeInputHandler)this.beforeInputHandler[type](ev,this)
else if(ev.cancelable)ev.preventDefault()}onKeyPress(ev){const key=ev.key
if(key in this.keyPressHandler)this.keyPressHandler[key](ev,this)}onKeyDown(ev){if(this.accelKeyMgr&&(ev.ctrlKey||ev.metaKey)){if(this.accelKeyMgr.handleKeyboardEvent(ev,this)===2)return}const key=ev.key
if(key in this.keyDownHandler)this.keyDownHandler[key](ev,this)}onClick(ev){if(ev.defaultPrevented)return
if(ev.detail===2){this.selMgr.trim()}else if(ev.detail===3){const selMgr=this.selMgr
const from=findTxtParaLikeFrom(selMgr.focusNode)
if(from)selMgr.selectAround(from)}}onCopy(ev){ev.preventDefault()
ev.stopImmediatePropagation()
const selMgr=this.selMgr
if(selMgr.tableLayout)selMgr.tableLayout.onCopy(ev)
else this.wedMgr.writeRangeToClipboard(selMgr.getXaRange(),ev.clipboardData)}async onCut(ev){ev.preventDefault()
ev.stopImmediatePropagation()
if(!WEDLET.isWritableWedlet(this.wedlet))return
const selMgr=this.selMgr
if(selMgr.tableLayout)selMgr.tableLayout.onCut(ev)
else{await this.wedMgr.writeRangeToClipboard(selMgr.getXaRange(),ev.clipboardData)
deleteFromSel(this,false,"character")}}async onPaste(ev){ev.preventDefault()
ev.stopImmediatePropagation()
this.doPaste(undefined,ev.clipboardData)}async doPaste(targetHint,dataTransfer){if(!WEDLET.isWritableWedlet(this.wedlet))return
let selMgr=this.selMgr
const txtElt=findTxtEltOrRootParent(selMgr.commonAncestor,true)
if(!txtElt)return
const wedMgr=this.wedMgr
const txStamp=wedMgr.txStamp
let impCtx=this.buildImportContext(txtElt,selMgr,targetHint)
if(!impCtx)return
const imports=await wedMgr.tryPaste(impCtx,{},dataTransfer)
if(!imports||imports.length===0){POPUP.showNotifInfo("Aucun contenu du presse-papier n\'a pu être importé.",this)}else{const doImport=async importer=>{if(importer.needAsyncBuild&&await importer.buildContentToImport(this)==="stop")return
if(txtElt.isConnected){if(txStamp!==wedMgr.txStamp){selMgr=this.selMgr
impCtx=this.buildImportContext(txtElt,selMgr,targetHint)
if(!impCtx)return}if(this.wedlet.isVirtual()){const batch=wedMgr.docHolder.newBatch()
importer.doImport(impCtx,batch)
try{wedMgr.freezeFocus=true
batch.doBatch()
if(txtElt.isConnected){const str=findTxtStrLastChild(this)
this.selMgr.setCaretAtEnd(str)}}finally{wedMgr.freezeFocus=false}}else{const sel=selMgr.getXaRange()
const batch=wedMgr.docHolder.newBatch(sel)
if(selMgr.type==="Object"){batch.setSelBefore(sel.start)}importer.doImport(impCtx,batch)
batch.doBatch()}}}
if(imports.length===1){doImport(imports[0])}else{const actions=imports.map(imp=>(new Action).setLabel(imp.getLabel()).setExecute(()=>{doImport(imp)}))
if(selMgr.tableLayout){selMgr.tableLayout.locked=true
try{POPUP.showPopupActions({actions:actions,restoreFocus:selMgr.tableLayout.tblEditNode},selMgr.tableLayout.focusCell,this)}finally{selMgr.tableLayout.locked=false}}else{POPUP.showPopupActions({actions:actions},txtElt,this)}}}}buildImportContext(txtElt,selMgr,targetHint){if(selMgr.tableLayout)return selMgr.tableLayout.buildImportContext()
return{sel:selMgr.getXaRange(true),virtualPath:WEDLET.buildVirtualPath(txtElt.wedlet),targetHint:targetHint}}onDragstart(ev){ev.preventDefault()
ev.stopImmediatePropagation()}onDrop(ev){ev.preventDefault()}fixupCaret(selMgr){let node=selMgr.focusNode
node=node.childNodes[selMgr.focusOffset]||node.lastChild||node
let txtStr=findTxtStrPrevious(node)
if(txtStr){txtStr.setCaretIn(selMgr,false)
return true}txtStr=findTxtStrNext(node)
if(txtStr){txtStr.setCaretIn(selMgr,true)
return true}console.log("TxtRoot.fixupCaret(sel) fail to find a TxtStr.")
return false}fixupSelection(selMgr,what,oldFocus,oldOffset){const range=selMgr.range
if(what&1){const anchorNode=selMgr.anchorNode
const child=anchorNode.childNodes[selMgr.anchorOffset]
if(range.startContainer===anchorNode){let txtStr=findTxtStrNext(child||DOM.findNextUncle(anchorNode,this))
if(txtStr){const node=DOM.findNext(txtStr,txtStr,DOM.IS_text)
selMgr.setSelAnchor(node,node.startBoundary?1:0)}else{txtStr=findTxtStrPrevious(child||anchorNode.lastChild||anchorNode)
if(txtStr){const node=DOM.findPreviousIn(txtStr,DOM.IS_text)
selMgr.setSelAnchor(node,node.endBoundary?node.length-1:node.length)}else{console.log("fixupSelection : no txtStr Found (1)")}}}else{let txtStr=child?findTxtStrPrevious(child):findTxtStrLastChild(anchorNode)||findTxtStrPrevious(anchorNode)
if(txtStr){const node=DOM.findPreviousIn(txtStr,DOM.IS_text)
selMgr.setSelAnchor(node,node.endBoundary?node.length-1:node.length)}else{txtStr=findTxtStrNext(child||DOM.findNextUncle(anchorNode,this))
if(txtStr){const node=DOM.findNext(txtStr,txtStr,DOM.IS_text)
selMgr.setSelAnchor(node,node.startBoundary?1:0)}else{console.log("fixupSelection : no txtStr Found (2)")}}}}if(what&2){const focusNode=selMgr.focusNode
const child=focusNode.childNodes[selMgr.focusOffset]
if(range.startContainer===focusNode){let txtStr=findTxtStrNext(child||DOM.findNextUncle(focusNode,this))
if(txtStr){const node=DOM.findNext(txtStr,txtStr,DOM.IS_text)
selMgr.setSelFocus(node,node.startBoundary?1:0)}else{txtStr=findTxtStrPrevious(child||focusNode.lastChild||focusNode)
if(txtStr){const node=DOM.findPreviousIn(txtStr,DOM.IS_text)
selMgr.setSelFocus(node,node.endBoundary?node.length-1:node.length)}else{console.log("fixupSelection : no txtStr Found (3)")}}}else{let txtStr=child?findTxtStrPrevious(child):findTxtStrLastChild(focusNode)||findTxtStrPrevious(focusNode)
if(txtStr){const node=DOM.findPreviousIn(txtStr,DOM.IS_text)
selMgr.setSelFocus(node,node.endBoundary?node.length-1:node.length)}else{txtStr=findTxtStrNext(child||DOM.findNextUncle(focusNode,this))
if(txtStr){const node=DOM.findNext(txtStr,txtStr,DOM.IS_text)
selMgr.setSelFocus(node,node.startBoundary?1:0)}else{console.log("fixupSelection : no txtStr Found (4)")}}}}return false}moveCaret(backward,alter="move",granularity="character"){const selMgr=this.selMgr
const focusNode=selMgr.focusNode
if(focusNode instanceof Text){findTxtStrParent(focusNode).moveCaretFrom(selMgr,backward,alter,granularity)}else if(IS_TxtElement(focusNode)){focusNode.moveCaretOut(selMgr,backward,"move")}else{(findTxtStrFirstChild(this)||findTxtEltFirstChild(this)).setCaretIn(selMgr,true)}}moveCaretV(backward,alter="move"){const selMgr=this.selMgrAsIs
const focusNode=selMgr.focusNode
let paraSib=null
if(focusNode){const p=findTxtParaLikeFrom(focusNode)
if(p){const selType=selMgr.type
if(selType==="Caret"||selType==="Range"){const rCaret=selMgr._sel.getRangeAt(0).getBoundingClientRect()
const rgP=new Range
rgP.selectNodeContents(p)
const pCaret=rgP.getBoundingClientRect()
if(backward){if(rCaret.top>pCaret.top)return false}else{if(rCaret.bottom<pCaret.bottom)return false}}paraSib=p}else{paraSib=DOM.findParentOrSelf(focusNode,this,n=>n instanceof TxtObject)
if(!paraSib&&this.isMonoPara){return false}}}if(paraSib){let nextP
if(backward){nextP=DOM.findPrevious(paraSib,this,n=>n instanceof TxtParaLike||n instanceof TxtObject)}else{nextP=DOM.findNext(paraSib,this,n=>n instanceof TxtParaLike||n instanceof TxtObject)}if(nextP){if(paraSib instanceof TxtParaLike&&nextP instanceof TxtParaLike){}nextP.setCaretIn(selMgr,!backward,alter)}else{paraSib.setCaretIn(selMgr,backward,alter)}}else{(findTxtStrFirstChild(this)||findTxtEltFirstChild(this)).setCaretIn(selMgr,backward)}return true}}AgEltBoxInsertDrawerTxt(AgEltBoxSelection(AgEltBoxInputAnnotable(TxtRoot),{selMode:"caret"}))
window.customElements.define("txt-root",TxtRoot)
class WedTxtRootCtx extends WedletActionCtx{get wedlet(){return this.focusedElt.wedlet}get reg(){return this.focusedElt.wedMgr.reg}get wedMgr(){return this.focusedElt.wedMgr}get txtRoot(){return this.focusedElt}get accelKeyMgr(){return this.focusedElt.accelKeyMgr}onRefreshCycle(before){return this.focusedElt.onRefreshCycle(before)}}class TxtRootInline extends TxtRoot{get isMonoPara(){return true}constructor(){super()
this.addEventListener("focusout",this.onFocusout)}onChildWedletsChange(){adjustVirtualsStr(this)}insertVirtualStr(before){const strModel=this.strModel
const childrenElt=this.wedConfig.wedChildrenElt
const str=strModel.createWedlet(this.wedlet,childrenElt.wedDefaultDisplay)
str.configWedletElt(strModel.config,str)
if(childrenElt.wedSlotName)str.setAttribute("slot",childrenElt.wedSlotName)
str.fromChildrenElt=childrenElt
this.insertBefore(str,before)
str.bindAsVirtual()}onFocusin(ev){super.onFocusin(ev)
DOMSH.findHost(this).setAttribute("selectin","")}onFocusout(ev){DOMSH.findHost(this).removeAttribute("selectin")}}window.customElements.define("txt-root-inline",TxtRootInline)
export class StrModel extends TxtStrModel{get isBoxFamily(){return true}get modes(){return this._modes||WED.DEFAULT_MODES}set modes(val){this._modes=val}createWedlet(parent,displayContext){return(new TxtStrAlone).initWedlet(this,parent,displayContext)}newWedlet(){throw"notUsed"}}WED.registerWedletModel("Str",StrModel)
export class TxtStrAlone extends TxtStr{get element(){return this._element}getVirtualXaPart(){if(this.model.nodeType===ENodeType.attribute)return this.model.nodeName
return super.getVirtualXaPart()}bindWithNode(xaOffest,node,children){this.refreshEditMode()
return super.bindWithNode(xaOffest,node,children)}bindAsVirtual(){this.refreshEditMode()
return super.bindAsVirtual()}bindWithAttr(nameAttr,value){this.refreshEditMode()
this.xaPart=nameAttr
this.element.refreshBindValue(value)}refreshEditMode(){this.txtRoot.contentEditable=WEDLET.isWritableWedlet(this.wedlet.wedParent)?"true":"false"}refreshBindValue(val){super.refreshBindValue(val)}insertElement(parent,insertBefore,slotName,caller){var _a
const tpl=this.model.config
const root=this._element=document.importNode(tpl.firstElementChild,false)
if(slotName)root.setAttribute("slot",slotName)
root.configWedletElt(tpl.firstElementChild,this)
if(caller)root.fromChildrenElt=caller;(_a=root.subEltWedlets)===null||_a===void 0?void 0:_a.push(this)
const strRoot=root instanceof TxtRootStr?root:root.shadowRoot.querySelector("txt-root-str")
strRoot.appendChild(this)
evalPlaceHolder(strRoot,this)
parent.insertBefore(root,insertBefore)}onAddedSkAnnot(annot,xaTarget){var _a
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()&&LANG.in(annot.type,"diffValue","diffMark")){if(annot.type==="diffValue"){document.createElement("wed-diff-value").initDiffValue(annot,this.element,this.wedMgr)}else{document.createElement("wed-diff-mark").initDiffAnnot(this.parentElement,annot,this).defaultInject()}}else{super.onAddedSkAnnot(annot,xaTarget)}}onRemovedSkAnnot(annot,xaTarget){var _a,_b,_c
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()&&LANG.in(annot.type,"diffValue","diffMark")){if(annot.type==="diffValue"){const parent=this.element
if(((_b=parent.wedAnnotDiff)===null||_b===void 0?void 0:_b.skAnnot)===annot)parent.wedAnnotDiff.removeDiffWidget()}else{const parent=this.parentElement
if(((_c=parent.wedAnnotDiff)===null||_c===void 0?void 0:_c.skAnnot)===annot)parent.wedAnnotDiff.removeDiffWidget()}}else{super.onRemovedSkAnnot(annot,xaTarget)}}}AgWedletBoxSelectionSingleElt(TxtStrAlone)
window.customElements.define("txt-str-alone",TxtStrAlone)
export class TxtRootStr extends TxtRoot{get isMonoPara(){return true}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.wedMgr=wedlet.wedMgr
this.selMgrAsIs=new(this.wedMgr.reg.getSvc("wedTxtSelMgrClass")||TxtSelMgr)(this)
this.contentEditable=WEDLET.isWritableWedlet(wedlet.wedParent)?"true":"false"
this.wedConfig=tpl}async doPaste(targetHint,dataTransfer){var _a
if(dataTransfer){const oldD=dataTransfer.getData("text/plain")
const newD=(_a=DOM.findFirstChild(this,IS_TxtStr))===null||_a===void 0?void 0:_a.transformInsertData(oldD)
if(!newD)return
if(oldD!==newD){dataTransfer=new DataTransfer
dataTransfer.setData("text/plain",newD)}}else{console.trace("TODO:::TxtRootStr.doPaste with async clipboard API for calling TxtStr.transformInsertData()")}super.doPaste(targetHint||"text",dataTransfer)}makeInputForDiff(annot){console.log(":::makeInputForDiff",annot.otherValue)
return null}}window.customElements.define("txt-root-str",TxtRootStr)
REG.reg.registerSkin("txt-root/InlineMarker",1,`\n\tinl-style::before,\n\tinl-phrase::before,\n\tinl-leaf::before,\n\tinl-link::before {\n\t\tcontent: '<';\n\t\tcolor: var(--edit-tagmark-color, rgba(194, 194, 194, .64));\n\t}\n\n\tinl-style::after,\n\tinl-phrase::after,\n\tinl-leaf::after,\n\tinl-link::after {\n\t\tcontent: '>';\n\t\tcolor: var(--edit-tagmark-color, rgba(194, 194, 194, .64));\n\t}\n\n\ttxt-ul,\n\ttxt-ol,\n\ttxt-sl {\n\t\tborder-inline-start: 2px solid var(--edit-tagmark-color, rgba(194, 194, 194, .64));\n\t\tpadding-inline-start: 2px;\n\t}\n`)
function split(str){return str?str.trim().split(/ +/):null}function evalPlaceHolder(eltFrom,eltTarget){if(eltFrom.hasAttribute("placeholder"))eltTarget.setAttribute("placeholder",eltFrom.getAttribute("placeholder"))
else if(eltFrom.hasAttribute("placeholderup")){const placeholderupAtt=eltFrom.getAttribute("placeholderup")
const axePos=placeholderupAtt.indexOf(":")
if(axePos!=-1){const axe=placeholderupAtt.substring(0,axePos)
let wedlet
let minLevel
let maxLevel
const bounds=placeholderupAtt.substring(axePos+1)
if(bounds.indexOf(":")>-1){minLevel=parseInt(bounds.substring(0,bounds.indexOf(":")),10)
maxLevel=parseInt(bounds.substring(bounds.indexOf(":")+1),10)}else{minLevel=0
maxLevel=parseInt(bounds,10)}switch(axe){case"down":wedlet=eltFrom.wedlet
for(let i=0;wedlet&&i<minLevel;i++)wedlet=wedlet.wedParent
let lastFindPlaceholder=""
for(let i=minLevel;wedlet&&i<maxLevel;i++){wedlet=wedlet.wedParent
if(wedlet&&isWedletSingleElt(wedlet)&&wedlet.element.getAttribute("placeholder"))lastFindPlaceholder=wedlet.element.getAttribute("placeholder")}if(lastFindPlaceholder)eltTarget.setAttribute("placeholder",lastFindPlaceholder)
break
case"up":wedlet=eltFrom.wedlet
for(let i=0;wedlet&&i<minLevel;i++)wedlet=wedlet.wedParent
for(let i=minLevel;wedlet&&i<maxLevel;i++){if(wedlet&&isWedletSingleElt(wedlet)&&wedlet.element.getAttribute("placeholder")){eltTarget.setAttribute("placeholder",wedlet.element.getAttribute("placeholder"))
return}wedlet=wedlet.wedParent}break
default:throw"axe unknown in : "+placeholderupAtt}}else{const up=parseInt(placeholderupAtt,10)
let wedlet=eltFrom.wedlet
for(let i=0;wedlet&&i<up;i++)wedlet=wedlet.wedParent
if(wedlet&&isWedletSingleElt(wedlet)&&wedlet.element.getAttribute("placeholder"))eltTarget.setAttribute("placeholder",wedlet.element.getAttribute("placeholder"))}}}export class Box2TxtModel extends BoxModel{buildModelForFragment(insertCtx){return this}}WED.registerWedletModel("Box2Txt",Box2TxtModel)
export const txtTagsDefined=Promise.resolve()

//# sourceMappingURL=txt.js.map