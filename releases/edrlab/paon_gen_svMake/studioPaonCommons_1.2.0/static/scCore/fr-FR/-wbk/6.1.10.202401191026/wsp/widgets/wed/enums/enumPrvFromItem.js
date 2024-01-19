import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{BoxEnumEntry,WedEnumProvider}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
export async function jslibAsyncInit(jsEndPoint,elt,reg){reg.registerSvc("wsp-wed-enumprovider-fromitem",1,(tpl,widget)=>{const wedMgr=widget.wedlet.wedMgr
const env=wedMgr.reg.env
let wsp
if(tpl.hasAttribute("publicWspCode")){const wspCd=tpl.getAttribute("publicWspCode")
wsp=env.universe.wspServer.wspsLive.findWsp(wspCd,true)}else{wsp=env.wsp}const wspCache=wsp.reg.cache
let enumPrv=wspCache.get(tpl)
if(!enumPrv){enumPrv=new EnumPrvFromItem(tpl,wedMgr,wsp)
wspCache.set(tpl,enumPrv)}if(!enumPrv.usedBy.has(wedMgr)){enumPrv.usedBy.add(wedMgr)
wedMgr.listeners.on("killEditor",()=>{enumPrv.usedBy.delete(wedMgr)
if(enumPrv.usedBy.size===0){enumPrv.killEnum()
wspCache.delete(tpl)}})}return enumPrv})}class EnumPrvFromItem extends WedEnumProvider{constructor(tpl,wedMgr,wsp){super(null)
this.onEnumChange=new EventMgr
this.usedBy=new Set
this.fetchCounter=0
this.reg=wedMgr.reg
this.wsp=wsp
this.initing=this.init(tpl,wedMgr)}async init(tpl,wedMgr){try{if(tpl.hasAttribute("xslUrl")){this.xslUrl=this.reg.env.itemType.datas.wspResUrl.resolve(tpl.getAttribute("xslUrl"))
try{const xsl=await this.xslUrl.fetchDom()
this.xslt=new XSLTProcessor
this.xslt.importStylesheet(xsl)}catch(e){console.error(e)
this.xslt=null
return}}if(this.wsp!==this.reg.env.wsp){this.wsp.listenChanges()}this.place=this.wsp.newPlaceWsp()
this.place.eventsMgr.on("wspUriChange",(msg,from)=>{if(msg.wspCd!==this.wsp.code)return
if(msg.type===EWspChangesEvts.r&&SRC.isSubUriOrEqual(msg.srcUri,this.itemSrcUri)||msg.type===EWspChangesEvts.u&&this.itemSrcUri===msg.srcUri){if(this.resetActions())this.onEnumChange.emit()}})
const reset=()=>{if(this.resetActions())this.onEnumChange.emit()}
this.place.eventsMgr.on("wspLiveStateChange",reset)
this.place.eventsMgr.on("onConnectionRenewed",reset)
this.itemSrcUri=tpl.getAttribute("itemSrcUri")
this.transform=tpl.getAttribute("transform")}finally{this.initing=null}}killEnum(){this.place.closePlace()
if(this.wsp!==this.reg.env.wsp)this.wsp.stopListenChanges()}async fetchEnum(){if(this.initing)await this.initing
if(!this.fetching&&!this._actions)this.fetching=this._fetchEnum()
while(this.fetching)await this.fetching}async _fetchEnum(){const counter=this.fetchCounter
if(this.xslt===null){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement du composant en erreur")]
await Promise.resolve()
this.fetching=null
return}if(this.wsp!==this.reg.env.wsp){if(!this.wsp.isLoaded){try{await this.wsp.waitForLoad()
if(counter!==this.fetchCounter)return}catch(e){this.fetching=null
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("L\'atelier contenant cette liste est inaccessible")]
console.error(e)
return}}if(!this.wsp.isPublic){this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("L\'atelier contenant cette liste n\'est pas déclaré \'public\' (voir les propriétés de l\'atelier)")]
await Promise.resolve()
this.fetching=null
return}}try{let dom=await WSP.fetchStreamDom(this.wsp,this.reg.env.uiRoot,this.itemSrcUri,this.transform)
if(counter!==this.fetchCounter)return
if(!dom)throw Error(`Item '${this.itemSrcUri}' not found in wsp '${this.wsp.code}'`)
if(this.xslt)dom=this.xslt.transformToDocument(dom)
this._actions=dom?WedEnumProvider.buildActions(dom.documentElement,this):[]
this.fetching=null}catch(e){this.fetching=null
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Construction de l\'énumération en erreur")]
throw e}}resetActions(){this.fetchCounter++
if(this.fetching)this.fetching=this._fetchEnum()
if(this._actions){this._actions=null
return true}return false}getActions(widget,filter){if(!this._actions)return this.fetchEnum().then(()=>super.getActions(widget,filter))
return super.getActions(widget,filter)}getAction(key,widget){if(!this._actions)return this.fetchEnum().then(()=>super.getAction(key,widget))
return super.getAction(key,widget)}}
//# sourceMappingURL=enumPrvFromItem.js.map