import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BoxEnumEntry,WedEnumProvider}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
export async function jslibAsyncInit(jsEndPoint,elt,reg){reg.registerSvc("wsp-wed-enumprv-currentItem",1,(tpl,widget)=>{const wedMgr=widget.wedlet.wedMgr
const cache=wedMgr.getDatasForModel(tpl)
let enumPrv=cache["wsp-wed-enumprv-currentItem"]
if(!enumPrv){enumPrv=new EnumPrvFromCurrentItem(tpl,wedMgr)
cache["wsp-wed-enumprv-currentItem"]=enumPrv}return enumPrv})}export class EnumPrvFromCurrentItem extends WedEnumProvider{constructor(tpl,wedMgr){super(null)
this.wedMgr=wedMgr
this.onEnumChange=new EventMgr
this.reg=wedMgr.reg
this.initing=this.init(tpl)}get itemSrcUri(){var _a
return(_a=this.wedMgr)===null||_a===void 0?void 0:_a.reg.env.longDesc.srcUri}get itemLongDesc(){var _a
return(_a=this.wedMgr)===null||_a===void 0?void 0:_a.reg.env.longDesc}async init(tpl){try{const doc=this.wedMgr.docHolder.getDocument()
this.msgItemUndef=tpl.getAttribute("msgItemUndef")||"L\'item spécifiant les valeurs n\'est pas défini"
if(tpl.hasAttribute("contextualXpathBlackListExpEnabled"))this.contextualXpathBlackListExpEnabled=doc.createExpression(tpl.getAttribute("contextualXpathBlackListExpEnabled"),prefix=>DOM.lookupNamespaceURI(doc,prefix))
if(tpl.hasAttribute("contextualXpathBlackListExpVisible"))this.contextualXpathBlackListExpVisible=doc.createExpression(tpl.getAttribute("contextualXpathBlackListExpVisible"),prefix=>DOM.lookupNamespaceURI(doc,prefix))
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
this.wedMgr.listeners.on("killEditor",()=>{const place=this.reg.env.place
place.eventsMgr.removeListener("wspUriChange",this._wspUriChange)
place.eventsMgr.removeListener("wspLiveStateChange",this._needReset)
place.eventsMgr.removeListener("onConnectionRenewed",this._needReset)})
if(this._actions){this.resetActions()
this.onEnumChange.emit()}}finally{this.initing=null}}makeEnum(){if(this.xslt===null){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement du composant en erreur")]
return}else if(this.xslt===undefined){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement en cours...")]
return}try{let dom=this.wedMgr.docHolder.getDocument()
if(this.xslt){this.xslt.clearParameters()
for(const entry in this.itemLongDesc){this.xslt.setParameter("",`item.${entry}`,this.itemLongDesc[entry])}dom=this.xslt.transformToDocument(dom)}this._actions=dom?WedEnumProvider.buildActions(dom.documentElement,this):[]}catch(e){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Construction de l\'énumération en erreur")]
throw e}}isKeyVisible(key){var _a
if((_a=this.currentBlackListValuesVisible)===null||_a===void 0?void 0:_a.has(key))return false
return true}isKeyEnabled(key){var _a
if((_a=this.currentBlackListValuesEnabled)===null||_a===void 0?void 0:_a.has(key))return false
return true}resetActions(){if(this._actions){this._actions=null
return true}return false}getActions(widget,filter){this.makeEnum()
this.refreshBlackListValues(widget)
return super.getActions(widget,filter)}getAction(key,widget){if(!this._actions)this.makeEnum()
this.refreshBlackListValues(widget)
const action=super.getAction(key,widget)
if(action)return action
if(!action&&key)return new BoxEnumEntry(null).setEnabled(false).setLabel(ctx=>`Valeur indéterminée : \'${key}\'`).override("initButtonNode",(buttonNode,ctx)=>{buttonNode.classList.add("error")})}refreshBlackListValues(widget){if(this.contextualXpathBlackListExpEnabled||this.contextualXpathBlackListExpVisible){const wedMgr=widget.wedlet.wedMgr
let noVirtualWedlet=widget.wedlet
while(noVirtualWedlet===null||noVirtualWedlet===void 0?void 0:noVirtualWedlet.isVirtual())noVirtualWedlet=noVirtualWedlet.wedParent
const from=noVirtualWedlet?XA.findDomContainer(noVirtualWedlet.wedAnchor,wedMgr.docHolder.getDocument()):wedMgr.docHolder.getDocument()
if(this.contextualXpathBlackListExpEnabled){const res=this.contextualXpathBlackListExpEnabled.evaluate(from,XPathResult.ORDERED_NODE_ITERATOR_TYPE)
if(this.currentBlackListValuesEnabled)this.currentBlackListValuesEnabled.clear()
else this.currentBlackListValuesEnabled=new Set
for(let n=res.iterateNext();n;n=res.iterateNext())this.currentBlackListValuesEnabled.add(n.textContent)}if(this.contextualXpathBlackListExpVisible){const res=this.contextualXpathBlackListExpVisible.evaluate(from,XPathResult.ORDERED_NODE_ITERATOR_TYPE)
if(this.currentBlackListValuesVisible)this.currentBlackListValuesVisible.clear()
else this.currentBlackListValuesVisible=new Set
for(let n=res.iterateNext();n;n=res.iterateNext())this.currentBlackListValuesVisible.add(n.textContent)}}}}
//# sourceMappingURL=enumPrvFromCurrentItem.js.map