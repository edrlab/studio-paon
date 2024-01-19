import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{InfoCurrentItem,InfoFocusItem,InfoFocusNodeInItem,InfoReqCurrentItem,InfoSrcUriMoved,ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
export class ItemViewerSingle{constructor(conf){this.conf=conf||{}}initViewer(reg,mainViewParent,lastDatas,select){if(this.reg)console.error("ItemViewerSingle already inited")
this.reg=reg
this.mainViewParent=mainViewParent
const infoBroker=reg.env.infoBroker
if(infoBroker)infoBroker.addConsumer(this)
this.lastDatas=lastDatas
this.onWspUriChange=this._onWspUriChange.bind(this)
reg.env.place.eventsMgr.on("wspUriChange",this.onWspUriChange)
if(select)return this.openSrcRef(select)}onInfo(info){if(!this.conf.disableAutoChangeCurrentItem&&info instanceof InfoFocusItem){if(info.handled)return
if(info instanceof InfoFocusNodeInItem){this.focusNodeInItem(info)}else{this.focusItem(info)}info.handled=true}else if(info instanceof InfoReqCurrentItem){info.srcUri=this.longDesc?this.longDesc.srcUri:null
info.shortDesc=this.longDesc}else if(info instanceof InfoSrcUriMoved){this.onSrcMoved(info)}}focusItem(info){this.openSrcRef(info.srcRef)}async focusNodeInItem(info){if(this.longDesc&&info.srcRef===SRC.srcRef(this.longDesc))return
if(await this.openSrcRef(info.srcRef)){this.reg.env.infoBroker.dispatchInfo(new InfoFocusNodeInItem(info.xpath,info.srcRef),this)}}onSrcMoved(info){if(this.longDesc.srcUri===info.oldSrcUri)this.openSrcRef(info.newSrcUri)}async openSrcRef(srcRef,silent){if(!srcRef)return this.tryCloseMainView(true)
if(this.longDesc&&srcRef===SRC.srcRef(this.longDesc))return true
const wsp=this.reg.env.wsp
const longDesc=this.longDesc=await wsp.fetchLongDesc(srcRef)
if(longDesc.srcSt<0||longDesc.itModel==null){if(this.fallbackOpenSrcRef){return this.fallbackOpenSrcRef(srcRef,longDesc,silent)}else{if(!silent)POPUP.showNotifInfo("Ce contenu n\'est plus disponible.",this.mainViewParent)
return null}}return this.openSrc(longDesc)}async openSrc(longDesc){let count=0
while(this.mainView){const v=await this.tryCloseMainView(false)
if(++count>1)console.warn("ItemViewerSingle.openSrc() called twice",v)
if(v===false)return false}const wsp=this.reg.env.wsp
const itemType=wsp.wspMetaUi.getItemType(longDesc.itModel)
const reg=REG.createSubRegMixed(this.reg,itemType.reg)
if(!reg.env.infoBroker)reg.env.infoBroker=new InfoBrokerBasic
const ctx={reg:reg,shortDesc:longDesc,longDesc:longDesc,mainViewCode:this.conf.mainViewCode}
const view=itemType.getSrcMainArea(ctx).buildBody(ctx,this.lastDatas)
if(this.lastDatas)this.lastDatas=null
this.mainViewParent.appendChild(view)
await view.initializedAsync
const infoBroker=reg.env.infoBroker
if(infoBroker)infoBroker.dispatchInfo(new InfoCurrentItem(longDesc.srcUri,longDesc),this)
return true}async tryCloseMainView(dispatchInfo){const mainView=this.mainView
if(!mainView)return null
if(await VIEWS.canHideView(mainView,true)){this.closeMainView(dispatchInfo)
return true}return false}closeMainView(dispatchInfo){this.longDesc=null
const mainView=this.mainView
if(mainView){this.mainViewParent.textContent=null
VIEWS.onViewHidden(mainView,true)
if(dispatchInfo&&this.reg.env.infoBroker)this.reg.env.infoBroker.dispatchInfo(new InfoCurrentItem(null),this)}}get mainView(){return this.mainViewParent.firstElementChild}onViewShown(){VIEWS.onViewShown(this.mainView)}onViewHidden(closed){if(closed){this.reg.env.place.eventsMgr.removeListener("wspUriChange",this.onWspUriChange)
this.closeMainView(false)
const infoBroker=this.reg.env.infoBroker
if(infoBroker)infoBroker.removeConsumer(this)}else{VIEWS.onViewHidden(this.mainView,closed)}}_onWspUriChange(msg,from){if(this.longDesc){const msgSrcRef=SRC.srcRef(msg)
if(msg.type===EWspChangesEvts.r){if(SRC.srcRef(this.longDesc)===msgSrcRef){this.closeMainView(true)}else if(ITEM.getSrcUriType(msg.srcUri)==="space"&&SRC.isSubUri(msg.srcUri,this.longDesc.srcUri)){this.closeMainView(true)}}else if(msg.type===EWspChangesEvts.u&&SRC.srcRef(this.longDesc)===msgSrcRef){const oldItModel=this.longDesc.itModel
this.reg.env.wsp.fetchLongDesc(msgSrcRef,this.mainViewParent).then(ld=>{if(oldItModel!==ld.itModel){if(oldItModel!==this.longDesc.itModel||SRC.srcRef(this.longDesc)===msgSrcRef)return
this.openSrc(ld)}})}}}}
//# sourceMappingURL=itemViewerSingle.js.map