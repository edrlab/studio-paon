import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{BoxEnumEntry,WedEnumProvider}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
export async function jslibAsyncInit(jsEndPoint,elt,reg){reg.registerSvc("wsp-wed-enumprv-xpath-refItem",1,(tpl,widget)=>{const wedMgr=widget.wedlet.wedMgr
const cache=wedMgr.getDatasForModel(tpl)
let enumPrv=cache["wsp-wed-enumprv-xpath-refItem"]
if(!enumPrv){enumPrv=new EnumPrvFromXPathRefItem(tpl,wedMgr)
cache["wsp-wed-enumprv-xpath-refItem"]=enumPrv}return enumPrv})}class EnumPrvFromXPathRefItem extends WedEnumProvider{constructor(tpl,wedMgr){super(null)
this.onEnumChange=new EventMgr
this.fetchCounter=0
this.reg=wedMgr.reg
this.initing=this.init(tpl,wedMgr)}async init(tpl,wedMgr){try{const doc=wedMgr.docHolder.getDocument()
this.xpathExp=doc.createExpression(tpl.getAttribute("xpathRefItem"),prefix=>DOM.lookupNamespaceURI(doc,prefix))
this.msgItemUndef=tpl.getAttribute("msgItemUndef")||"L\'item spécifiant les valeurs n\'est pas défini"
if(tpl.hasAttribute("xslUrl")){this.xslUrl=this.reg.env.itemType.datas.wspResUrl.resolve(tpl.getAttribute("xslUrl"))
try{const xsl=await this.xslUrl.fetchDom()
this.xslt=new XSLTProcessor
this.xslt.importStylesheet(xsl)}catch(e){console.error(e)
this.xslt=null
return}}this.transform=tpl.getAttribute("transform")
const place=this.reg.env.place
this._wspUriChange=(msg,from)=>{if(msg.wspCd!==this.reg.env.wsp.code)return
if(msg.type===EWspChangesEvts.r&&SRC.isSubUriOrEqual(msg.srcUri,this.itemSrcUri)||msg.type===EWspChangesEvts.u&&this.itemSrcUri===msg.srcUri){if(this.resetActions())this.onEnumChange.emit()}}
place.eventsMgr.on("wspUriChange",this._wspUriChange)
this._needReset=()=>{if(this.resetActions())this.onEnumChange.emit()}
place.eventsMgr.on("wspLiveStateChange",this._needReset)
place.eventsMgr.on("onConnectionRenewed",this._needReset)
wedMgr.listeners.on("killEditor",()=>{const place=this.reg.env.place
place.eventsMgr.removeListener("wspUriChange",this._wspUriChange)
place.eventsMgr.removeListener("wspLiveStateChange",this._needReset)
place.eventsMgr.removeListener("onConnectionRenewed",this._needReset)})}finally{this.initing=null}}async fetchEnum(){if(this.initing)await this.initing
if(!this.fetching&&!this._actions)this.fetching=this._fetchEnum()
while(this.fetching)await this.fetching}async _fetchEnum(){if(this.xslt===null){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement du composant en erreur")]
await Promise.resolve()
this.fetching=null
return}const counter=this.fetchCounter
try{let dom=await WSP.fetchStreamDom(this.reg.env.wsp,this.reg.env.uiRoot,this.itemSrcUri,this.transform)
if(counter!==this.fetchCounter)return
if(dom){if(this.xslt)dom=this.xslt.transformToDocument(dom)
this._actions=dom?WedEnumProvider.buildActions(dom.documentElement,this):[]}else{this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel(this.msgItemUndef)]}this.fetching=null}catch(e){this.fetching=null
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Construction de l\'énumération en erreur")]
throw e}}resetActions(){this.fetchCounter++
if(this.fetching)this.fetching=this._fetchEnum()
if(this._actions){this._actions=null
return true}return false}refreshItemSrcUri(widget){const wedMgr=widget.wedlet.wedMgr
const from=XA.findDomContainer(widget.wedlet.wedAnchor,wedMgr.docHolder.getDocument())
const newItemUri=this.xpathExp.evaluate(from,XPathResult.STRING_TYPE).stringValue
if(newItemUri){if(this.itemSrcUri!=newItemUri){this.resetActions()
this.itemSrcUri=newItemUri}}else{if(this.itemSrcUri)this.resetActions()
this.itemSrcUri=null
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel(this.msgItemUndef)]}}getActions(widget,filter){this.refreshItemSrcUri(widget)
if(!this._actions)return this.fetchEnum().then(()=>super.getActions(widget,filter))
return super.getActions(widget,filter)}getAction(key,widget){this.refreshItemSrcUri(widget)
if(!this._actions)return this.fetchEnum().then(()=>super.getAction(key,widget))
return super.getAction(key,widget)}}
//# sourceMappingURL=enumPrvFromXPathRefItem.js.map