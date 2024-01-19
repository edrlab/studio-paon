import{AccelKeyMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{EventMgr,EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
export class Desk{constructor(name){this.name=name||window.location.pathname.replace(/^.+\/(.+)\..*$/,"$1")
this.state="start"
REG.reg.addToList(Desk.LC_init,"skin",1,()=>{REG.reg.installSkin("basis")})}async launch(){if(Desk.electron){function importsLstn(ev){if(ev.data.type=="client-imports"){const imports=ev.data.imports
window.removeEventListener("message",importsLstn)
Promise.all(imports.map(imp=>REG.reg.env.resolver.resolve(imp).importJs())).catch(e=>console.error(e))}}window.addEventListener("message",importsLstn)
window.postMessage({type:"desk-launch-start"},location.origin)}const initialized=new Promise((resolve,reject)=>{const init=async()=>{try{const lstns=REG.reg.getList(Desk.LC_init)
if(lstns)for(const lstn of lstns){const result=lstn()
if(result instanceof Promise)await result}this.state="inited"
resolve()}catch(e){this.state="initFailed"
reject(e)}}
if(document.readyState!="loading")init()
else document.addEventListener("DOMContentLoaded",init)})
const loaded=new Promise((resolve,reject)=>{const load=async()=>{try{await initialized
const lstns=REG.reg.getList(Desk.LC_load)
if(lstns)for(const lstn of lstns){const result=lstn()
if(result instanceof Promise)await result}this.state="loaded"
if(REG.reg.isListFilled(Desk.LIST_accelKeys)){this.accelKeys=(new AccelKeyMgr).initFromMapActions(REG.reg.getListAsMap(Desk.LIST_accelKeys))
window.addEventListener("keydown",this.onGloablKeyDown)}resolve()}catch(e){this.state="loadFailed"
reject(e)}}
if(document.readyState=="complete")load()
else window.addEventListener("load",load)})
return loaded}onGloablKeyDown(ev){window.desk.accelKeys.handleKeyboardEvent(ev,window)}showInfo(text){console.log(text)}assignProps(cstr){const from=cstr.prototype
for(const key of Object.getOwnPropertyNames(from)){if(key!=="constructor")Object.defineProperty(this,key,Object.getOwnPropertyDescriptor(from,key))}}static checkCompat(key){const res=this.compatTable.get(key)
if(res==null){console.warn("Check compat not found: ",key)
return true}if(typeof res==="boolean")return res
const result=res()
this.compatTable.set(key,result)
return result}static get knownNavCompat(){if("knownNavCompat"in window)return window.knownNavCompat
else return[]}initDefaultTheme(url){const style=document.createElement("link")
style.setAttribute("rel","stylesheet")
style.setAttribute("type","text/css")
style.setAttribute("href",url||"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/themes/light-bluegrey.css")
document.head.appendChild(style)}isSimpleClickPrefered(from,ctx){const reg=REG.findReg(from,ctx)
return(reg===null||reg===void 0?void 0:reg.getUserData("simpleClickPrefered"))==true||false}}Desk.electron=navigator.userAgent.indexOf("Electron")>=0
Desk.noMouse=(()=>{try{return!matchMedia("(any-pointer:fine)").matches}catch(e){return false}})()
Desk.LC_init="desk:init"
Desk.LC_load="desk:load"
Desk.LIST_accelKeys="desk:accelKeys"
Desk.compatTable=new Map
Desk.navVersions=navigator.userAgent.match(/\w+\/\d+/g).reduce((navVersions,navVersion)=>{const[nav,version]=navVersion.split("/")
navVersions[nav]=parseInt(version)
return navVersions},{})
export class CanCloseDeskFeat extends Desk{static add(desk){if(this.isIn(desk))return desk
desk.assignProps(this)
const d=desk
d.canCloseLstn=new EventsMgr
window.addEventListener("beforeunload",ev=>{if(!d.canClose(true)){ev.returnValue="Vos actions en cours seront perdues, souhaitez-vous vraiment fermer cette page ?"
return ev.returnValue}})
return d}static isIn(desk){return"canClose"in desk}canClose(silentMode){return this.canCloseLstn.emitUntil("canClose",silentMode)!==false}}export class UrlHashObjDeskFeat extends Desk{static add(desk){if(this.isIn(desk))return desk
desk.assignProps(this)
const d=desk
d.onUrlHashChange=new EventMgr
window.addEventListener("hashchange",()=>{d._updateFromHash(true)})
d._updateFromHash(false)
return d}static isIn(desk){return"onUrlHashChange"in desk}getUrlHash(){return this._urlHash}async setUrlHash(newVal,replace){const old=this._urlHash
this._urlHash=newVal||{}
this._urlHashSer=newVal?CDM.stringify(this._urlHash):null
if(replace)location.replace(newVal?"#"+encodeURIComponent(this._urlHashSer):"#")
else location.hash=encodeURIComponent(this._urlHashSer||"")
await this.onUrlHashChange.emitAsyncCatched(old,this._urlHash)}_updateFromHash(emit){const newHashSer=location.hash?decodeURIComponent(location.hash.substr(1)):""
if(this._urlHashSer===newHashSer)return
const old=this._urlHash
try{this._urlHash=newHashSer?CDM.parse(newHashSer):{}
if(emit)this.onUrlHashChange.emitAsyncCatched(old,this._urlHash)}catch(e){}}}export class UserActiveDeskFeat extends Desk{static add(desk,activeTimeout=18e4,checkInterval=1e4){if(this.isIn(desk))return desk
desk.assignProps(this)
const d=desk
d.activeTimeout=activeTimeout
d.userActiveLstn=new EventsMgr
d._mark=true
d._lastMark=Date.now()
d._isUserActive=true
setInterval(()=>{const now=Date.now()
const delta=now-d._lastMark
d.userActiveLstn.emit("cyclicNotif",delta)
if(d._isUserActive&&delta>activeTimeout){d._isUserActive=false
d.userActiveLstn.emit("inactive",delta)}d._mark=false},checkInterval)
const markActive=d.markAsUserActive.bind(d)
window.addEventListener("mousemove",markActive,true)
window.addEventListener("touchstart",markActive,true)
window.addEventListener("keypress",markActive,true)
window.addEventListener("focus",markActive,true)
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")d.markAsUserActive()},true)
return d}static isIn(desk){return"markAsUserActive"in desk}get isUserActive(){return this._isUserActive}markAsUserActive(){if(!this._mark){this._mark=true
this._lastMark=Date.now()
if(!this._isUserActive){this._isUserActive=true
this.userActiveLstn.emit("active")}}}}
//# sourceMappingURL=desk.js.map