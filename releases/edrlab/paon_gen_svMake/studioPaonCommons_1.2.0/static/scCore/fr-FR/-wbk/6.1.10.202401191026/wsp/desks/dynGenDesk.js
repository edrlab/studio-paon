import{CanCloseDeskFeat,Desk,UserActiveDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{AuthEndPoint,IO,PublicEndPoint}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ChainUniverse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/chain.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
window.desk=UserActiveDeskFeat.add(CanCloseDeskFeat.add(new Desk))
export function noModules(){window.IO=IO
window.AuthEndPoint=AuthEndPoint
window.PublicEndPoint=PublicEndPoint
return window}export function initEnv(conf){universe=new ChainUniverse(conf.universe)
place=universe.wspServer.wspsLive.newPlace()
wsp=place.getWsp(conf.wspCd)
window.pageUpdatesMgr=pageUpdatesMgr=new PageUpdatesMgr
window.commentsBackend={}}export function addEditors(conf){new InlineEditors(conf)}let universe
let wsp
let place
class PageUpdatesMgr extends EventsMgr{constructor(){super()
this.updateRoots=new Map
place.eventsMgr.on("wspUriChange",(msg,from)=>{if(msg.type===EWspChangesEvts.u&&msg.wspCd===wsp.code){let toRefresh
for(const updtRoot of this.updateRoots.values()){if(updtRoot.srcRefs.has(msg.srcId||msg.srcUri)){if(!toRefresh)toRefresh=[updtRoot.webCtn]
else toRefresh.push(updtRoot.webCtn)}}if(!toRefresh)return
for(const lstn of this.getListeners("shouldRefresh")){toRefresh=lstn(toRefresh)
if(!toRefresh)return}for(const webCtn of toRefresh){const updt=this.updateRoots.get(webCtn)
if(updt)updt.refresh()}}})
place.eventsMgr.on("onConnectionRenewed",async()=>{const srcRefs=new Set
for(const updtRoot of this.updateRoots.values()){for(const srcRef of updtRoot.srcRefs.keys())srcRefs.add(srcRef)}const srcs=await WSP.fetchSrcs(wsp,null,Array.from(srcRefs.keys()),[wsp.srcRefField,"srcDt"])
let toRefresh
for(const updtRoot of this.updateRoots.values()){for(const src of srcs){const srcDt=updtRoot.srcRefs.get(SRC.srcRef(src))
if(srcDt&&srcDt!==src.srcDt){if(!toRefresh)toRefresh=[updtRoot.webCtn]
else toRefresh.push(updtRoot.webCtn)
break}}}if(!toRefresh)return
for(const lstn of this.getListeners("shouldRefresh")){toRefresh=lstn(toRefresh)
if(!toRefresh)return}for(const webCtn of toRefresh){const updt=this.updateRoots.get(webCtn)
if(updt)updt.refresh()}})}inject(webCtn,req,options){let updateRoot=this.updateRoots.get(webCtn)
if(!updateRoot){updateRoot=new UpdateRoot(webCtn,options)
this.updateRoots.set(webCtn,updateRoot)}return updateRoot.setEndPoint(req)}removeInjectPoint(webCtn){const updateRoot=this.updateRoots.get(webCtn)
if(updateRoot){updateRoot.kill()
this.updateRoots.delete(webCtn)}}}let pageUpdatesMgr
class UpdateRoot{constructor(webCtn,options){this.webCtn=webCtn
this.options=options
this.srcRefs=new Map}kill(){delete this.webCtn}setEndPoint(refreshEndP){this.refreshEndP=refreshEndP
return this.refresh()}async refresh(){if(this.waiting)return this.waiting
const promise=pageUpdatesMgr.emitUntil("beforeUpdates",this.webCtn)
if(promise instanceof Promise){return this.waiting=new Promise(async resolve=>{await promise
this.waiting=null
return this.refresh().then(resolve)})}const txt=await this.refreshEndP.fetchText()
const doc=DOM.parseDom(txt,this.refreshEndP)
const newCtn=doc.body
this.srcRefs.clear()
this.saveDataOrigins(newCtn);(this.options&&this.options.domUpdater||defaultUpdater)(doc,this.webCtn)
pageUpdatesMgr.emit("afterUpdates",this.webCtn)}saveDataOrigins(elt){const ori=elt.getAttribute("data-origin")
if(ori&&ori.charAt(0)==="@"){const sep=ori.indexOf("?",1)
const srcRef=ori.substring(1,sep)
const sep2=ori.indexOf("/",sep)
const srcDt=parseInt(sep2>0?ori.substring(sep+1,sep2):ori.substring(sep+1))
this.srcRefs.set(srcRef,srcDt)}for(let ch=elt.firstElementChild;ch;ch=ch.nextElementSibling)this.saveDataOrigins(ch)
return elt}}function defaultUpdater(newDatas,webCtn){webCtn.textContent=null
const newCtn=newDatas.body
while(newCtn.firstChild)webCtn.appendChild(document.adoptNode(newCtn.firstChild))}class InlineEditors{constructor(conf){this.conf=conf
this._onEdit=this.edit.bind(this)
pageUpdatesMgr.on("afterUpdates",this.onAfterUpdates.bind(this))}onAfterUpdates(webCtn){const editAnchors=webCtn.querySelectorAll(this.conf.rootsSelector)
for(let i=0;i<editAnchors.length;i++){const anchor=editAnchors[i]
if(anchor.inlineEditor)continue
anchor.inlineEditor=this
const btn=anchor.inlineEditorBtn=editAnchors[i].insertBefore(document.createElement("button"),editAnchors[i].firstChild)
btn.title="Éditer"
btn.textContent=String.fromCharCode(9997)
btn.classList.add("wui-edit")
btn.onclick=this._onEdit}}edit(ev){console.log("Edit...")}}
//# sourceMappingURL=dynGenDesk.js.map