import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ItemXmlEd}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/item/itemXmlEd.js"
import{Desk,UserActiveDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{CDM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/cdm.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DYNGEN}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/dyngen.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{EventMgr,EventsMgrProxy}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{FontSizeDeskFeat,UiThemeDeskFeat}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js"
import{captureScenariProtocol}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/scenariProtocol.js"
import{EWspChangesEvts,EWspWorkingSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
export class DynGen extends BaseElement{constructor(){super(...arguments)
this.srcRefs=new Map
this.wspRefsLockedBy=new Map
this.srcRefsLockedByGen=new Set}get onError(){return this._onError||(this._onError=new EventMgr)}_initialize(init){this.reg=this.findReg(init)
this.configs=init
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this.genFrame=sr.appendChild(JSX.createElement("iframe",null))
this.genFrame.setAttribute("sandbox","allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts")
this.genFrame.addEventListener("load",this.onLoadedPage)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
if(this.hasAttribute("auto-resize"))init.autoResize=BASIS.extractAttr(this,"auto-resize")!=="false"
return init}async onViewShown(){if(this.place)return
const universe=this.reg.env.universe
const wspCd=this.configs.w
const wspOrigin=this.reg.env.wsp
if(!wspOrigin||wspOrigin.code!==wspCd){this.place=universe.wspServer.wspsLive.newPlace()
this.wsp=this.place.getWsp(this.configs.w)
if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
this.wspReg=REG.createSubRegMixed(this.reg,this.wsp.reg)
this.wspReg.env.uiRoot=this
this.wspReg.env.place=this.place}else{this.wsp=wspOrigin
this.wspReg=this.reg
this.place=this.reg.env.place}if(!this.place)this.place=universe.wspServer.wspsLive.newPlace()
else this._eventsMgr=new EventsMgrProxy(this.place.eventsMgr);(this._eventsMgr||this.place.eventsMgr).on("wspUriChange",(msg,from)=>{if(!this.isConnected)return
if(msg.type===EWspChangesEvts.u&&msg.wspCd===this.configs.w){const srcRef=SRC.srcRef(msg)
if(DEBUG_DYNGEN)console.log("DYNGEN - wspUriChange:::::",srcRef,this.srcRefs.has(srcRef))
if(this.srcRefs.has(srcRef)){const win=this.genFrame.contentWindow
if(win.reloadPage)win.reloadPage([srcRef])
else win.location.reload()
if(from==="server")this.closeEditor()}}}).on("newWspWorkingState",(wspRef,wspCd,srcRef,st,account,clId)=>{if(!this.isConnected)return
const win=this.genFrame.contentWindow
if(!win.itemLocked)return
if(st===EWspWorkingSt.w){this.wspRefsLockedBy.set(wspRef,clId)
win.itemLocked(srcRef,true)}else if(this.wspRefsLockedBy.get(wspRef)===clId){this.wspRefsLockedBy.delete(wspRef)
win.itemLocked(srcRef,false)}}).on("houseDirtyChange",(wspRef,wsp,srcIdent,dirty)=>{if(!this.isConnected)return
const win=this.genFrame.contentWindow
if(!win.itemLocked)return
const srcRef=srcIdent.srcId||srcIdent.srcUri
if(this.srcRefs.has(srcRef))win.itemLocked(srcRef,dirty)}).on("onConnectionLost",()=>{if(!this.isConnected)return
const win=this.genFrame.contentWindow
if(DEBUG_DYNGEN)console.log("DYNGEN - onConnectionLost::::")
if(win&&win.onConnection)win.onConnection(false)}).on("onConnectionRenewed",async()=>{if(!this.isConnected)return
const win=this.genFrame.contentWindow
if(this.srcRefs.size>0){const srcRefs=Array.from(this.srcRefs.keys())
const ts=await WSP.fetchSrcs(this.wsp,this,srcRefs,["srcTreeDt"])
let reload
for(let i=0;i<srcRefs.length;i++){if(this.srcRefs.get(srcRefs[i])!==ts[i].srcTreeDt){if(!reload)reload=[]
reload.push(srcRefs[i])}}if(reload){if(DEBUG_DYNGEN)console.log("DYNGEN - onConnectionRenewed::::reloadPage",reload)
if(win.reloadPage)win.reloadPage(reload)
else win.location.reload()
return}if(DEBUG_DYNGEN)console.log("DYNGEN - onConnectionRenewed::::ok")
if(win&&win.onConnection)win.onConnection(true)
this.initLocks(win)}})
UserActiveDeskFeat.add(desk)
this.onInactiveUser=this._onInactiveUser.bind(this)
desk.userActiveLstn.on("inactive",this.onInactiveUser)
this.onActiveUser=this._onActiveUser.bind(this)
desk.userActiveLstn.on("active",this.onActiveUser)
this.reload()}reload(){this.genFrame.src=this.getDynGenUrl(this.configs).url}load(){if(this.place)this.reload()
else this.onViewShown()}getDynGenUrl(data){const params=Object.create(data.gp||null)
params.refUri=data.r
const path=encodeURIComponent(data.w)+"/"+data.c+"/"+DYNGEN.encodeUrl2(CDM.stringify(params))+"/"+(data.pp==null?"co/":data.pp)+(data.qs?"?"+data.qs:"")
return this.reg.env.universe.wspServer.config.itemDynGenUrl.resolve(path)}onViewHidden(closed){this.closeEditor()
if(closed){this.wsp=null
if(this.wspReg&&this.wspReg!==this.reg){this.wspReg.close()
this.wspReg=null}if(this.place){if(this._eventsMgr)this._eventsMgr.removeAllListeners()
else this.place.closePlace()
this.place=null
this._eventsMgr=null}if(this.onInactiveUser){desk.userActiveLstn.removeListener("inactive",this.onInactiveUser)
this.onInactiveUser=null}if(this.onActiveUser){desk.userActiveLstn.removeListener("active",this.onActiveUser)
this.onActiveUser=null}}}async canEdit(srcRef){if(!srcRef)return false
const h=this.place.wspsLive.getHouseIfFetched(WSP.buildWspRef(this.wsp.code,srcRef))
if(h)return this.wsp.reg.hasPermission(PERM_EDIT,h.srcFields.srcRoles,null,h.srcFields.srcRi)
try{const sd=await this.wsp.fetchShortDesc(srcRef,this)
return this.wsp.reg.hasPermission(PERM_EDIT,sd.srcRoles,null,sd.srcRi)}catch(e){console.log(e)
return false}}editFragment(editableNode){if(!Desk.checkCompat("edit")){POPUP.showNotifForbidden(JSX.createElement("div",null,JSX.createElement("p",null,"Ce navigateur n\'est pas compatible avec l\'édition de texte riche."),JSX.createElement("p",null,"Vous pouvez utiliser un des navigateurs à jour suivants :"),JSX.createElement("ul",null,Desk.knownNavCompat.map(n=>n.url?JSX.createElement("li",null,JSX.createElement("a",{href:n.url,target:"_blank"},n.name)):JSX.createElement("li",null,n.name)))),this)
return}let origin=DYNGEN.getOriginFrom(editableNode)
const editorConf=editableNode.editorConfig
if(editorConf.editEntryPoint)origin=editorConf.editEntryPoint.handleOrigin(origin)
if(!origin.srcRef)return
this.openEditor(origin,(new ItemXmlEd).initialize({reg:this.wspReg,srcRef:origin.srcRef,writePerms:PERM_EDIT,wedMgrConfig:{xaRoot:xaRootFromOrigin(origin)},editorKey:editorConf.editorKey,datasEditor:editorConf.editor,saveOnClose:true,initItemReg:reg=>{reg.addToList("wed.diffBar.actions","otherItem",2,null)}}),editorConf.editMode||"modal")}lockItem(srcRef){if(this.place.lockExternal(WSP.buildWspRef(this.wsp.code,srcRef))){this.srcRefsLockedByGen.add(srcRef)
this.closeEditor()
return true}return false}unlockItem(srcRef){if(this.srcRefsLockedByGen.has(srcRef)){this.srcRefsLockedByGen.delete(srcRef)
this.place.unlockExternal(WSP.buildWspRef(this.wsp.code,srcRef))}}injectTheme(){if(UiThemeDeskFeat.isIn(desk))desk.injectThemeInSubFrame(this.genFrame)
if(FontSizeDeskFeat.isIn(desk))desk.injectFontSizeInSubFrame(this.genFrame)}async hasPerm(perm){const libPath=await REG.findScPermLibPath(perm)
if(this.reg.env.resolver&&libPath)await import(this.reg.env.resolver.resolvePath(libPath))
return this.reg.hasPerm(perm)}async hasPermOnSrcRef(perm,srcRef){if(!this.wsp)return null
const libPath=await REG.findScPermLibPath(perm)
if(this.reg.env.resolver&&libPath)await import(this.reg.env.resolver.resolvePath(libPath))
if(srcRef){const sd=await this.wsp.fetchShortDesc(srcRef,this)
return this.wsp.reg.hasPermission(perm,sd.srcRoles,null,sd.srcRi)}else{return this.wsp.reg.hasPerm(perm)}}async onLoadedPage(){const dynGen=DOMSH.findHost(this)
const win=this.contentWindow
let winLoc
try{winLoc=win.location.href}catch(e){}if(!winLoc||winLoc==="about:blank"){dynGen.onUnloadPage()
return}if(dynGen._onError){const body=win.document.body
if(!body||!body.hasChildNodes()){dynGen._onError.emit("empty",null,dynGen)
dynGen.onUnloadPage()
return}else{}}if(dynGen.configs.autoResize)new ResizeObserver(dynGen.onBodyResize.bind(dynGen)).observe(win.document.documentElement)
if(win.initParentFrame)win.initParentFrame(dynGen)
await dynGen._initAfterLoad(win)
if(win.afterReloadPageLstn)win.afterReloadPageLstn.push((srcRef,updates)=>{dynGen._initAfterLoad(win)})
captureScenariProtocol(this,dynGen.wspReg)}onBodyResize(entries){this.genFrame.style.height=entries[entries.length-1].contentRect.height+"px"}async _initAfterLoad(win){if(!win.document.body){this.onUnloadPage()
return}this.initUrlCheck(win)
const oldSrcRefs=this.srcRefs
this.srcRefs=new Map
DYNGEN.findSrcRefs(win.rootEditableContents||win.document.body,(elt,srcRef,lastModif)=>{this.srcRefs.set(srcRef,lastModif)})
if(DEBUG_DYNGEN)console.log("DYNGEN - new map srcRefs::::",Array.from(this.srcRefs))
const editorConfigs=win.editorConfigs
if(editorConfigs){for(const conf of editorConfigs){win.enableEditors(conf)}if(this.currentOrigin&&win.markAsEditing)win.markAsEditing(this.currentOrigin)}await this.initLocks(win)
if(!this.wsp)return
const wspCd=this.wsp.code
for(const newSrcRef of this.srcRefs.keys()){if(oldSrcRefs.has(newSrcRef)){oldSrcRefs.delete(newSrcRef)}else{this.place.setState(WSP.buildWspRef(wspCd,newSrcRef),EWspWorkingSt.l)}}for(const srcRefToRem of oldSrcRefs.keys()){this.place.setState(WSP.buildWspRef(wspCd,srcRefToRem),EWspWorkingSt.none)}}onUnloadPage(){if(this.srcRefs.size>0){const wspCd=this.wsp.code
for(const srcRef of this.srcRefsLockedByGen){this.place.unlockExternal(WSP.buildWspRef(wspCd,srcRef))}this.srcRefsLockedByGen.clear()
for(const srcRef of this.srcRefs.keys()){this.place.setState(WSP.buildWspRef(wspCd,srcRef),EWspWorkingSt.none)}this.srcRefs.clear()}}async initLocks(win){this.wspRefsLockedBy.clear()
if(win.itemLocked){try{for(const srcRef of this.srcRefs.keys()){const wspRef=WSP.buildWspRef(this.wsp.code,srcRef)
let wspSt
if(this.place.isHouseDirty(wspRef)||(wspSt=(await this.place.getStates(wspRef)).find(st=>st.state===EWspWorkingSt.w))){if(wspSt)this.wspRefsLockedBy.set(wspRef,wspSt.clId)
if(DEBUG_DYNGEN)console.log("DYNGEN - lock::::",srcRef)
win.itemLocked(srcRef,true)}}}catch(e){if(win.onConnection)win.onConnection(false)}}}async openEditor(origin,editor,editMode){await this._killEditor()
try{await editor.initializedAsync
this.currentEditor=editor
this.currentOrigin=origin}catch(e){POPUP.showNotifError("Impossible d\'éditer ce fragment.",this)
throw e}if(editMode==="panel"){if(!this.panel){const sr=this.shadowRoot
this.genFrame.setAttribute("c-resizable","")
this.resizer=sr.appendChild(JSX.createElement(Resizer,{"c-orient":"row"}))
this.panel=sr.appendChild(JSX.createElement("div",{class:"panel","c-resizable":""}))}DOM.setHidden(this.panel,false)
DOM.setHidden(this.resizer,false)
this.panel.appendChild(editor)
const markAsEditing=this.genFrame.contentWindow.markAsEditing
if(markAsEditing)markAsEditing(origin)}else{const st=editor.style
st.display="flex"
st.minHeight="0"
st.minWidth="0"
st.flex="1"
this.modalPopup=POPUP.showDialog(editor,this,{titleBar:{barLabel:{label:"Édition du bloc"},closeButton:{uiContext:"dialog",label:"Fermer",title:"Fermer l\'édition du bloc"}},resizer:{},initWidth:"80vw",initHeight:"60vh"})
this.modalPopup.onNextClose().then(()=>{this.modalPopup=null
this.closeEditor()})}}onViewBeforeHide(closed){return!closed||!this.currentEditor||!this.currentEditor.isDirty()}async onViewWaitForHide(closed){if(!closed)return true
try{await this.closeEditor()
return true}catch(e){return false}}async closeEditor(){await this._killEditor()
if(this.modalPopup){this.modalPopup.close()
this.modalPopup=null}else if(this.panel){DOM.setHidden(this.panel,true)
DOM.setHidden(this.resizer,true)}}async _killEditor(){if(this.currentEditor){this.currentEditor.closeEditor()
this.currentEditor.remove()
this.currentEditor=null
this.currentOrigin=null}}_onInactiveUser(){this.locksByGenDisabled=true
for(const srcRef of this.srcRefsLockedByGen){this.place.unlockExternal(WSP.buildWspRef(this.wsp.code,srcRef))}}_onActiveUser(){this.locksByGenDisabled=false
for(const srcRef of this.srcRefsLockedByGen){this.place.lockExternal(WSP.buildWspRef(this.wsp.code,srcRef))}}initUrlCheck(win){const htmlElem=win.document.documentElement
if(htmlElem&&htmlElem.getAttribute("data-checkUrl-active")=="true"){const checkUrlItems=htmlElem.querySelectorAll("*[data-checkUrl]")
if(checkUrlItems.length){let param={}
const paramStr=htmlElem.getAttribute("data-checkUrl-param")
if(paramStr){try{param=JSON.parse(paramStr)}catch(e){ERROR.log("Error parsing global checkUrl param",e)}}if(!param.maxConcurrentCheckUrl)param.maxConcurrentCheckUrl=5
this.checkUrls(checkUrlItems,param)}}}async checkUrls(items,globalParam){const itemsByUrl={}
const requests=[]
for(const item of items){const url=item.getAttribute("data-checkUrl")
try{item.setAttribute("data-checkUrl-status","pending")
itemsByUrl[url]=item
let param=globalParam
const paramStr=item.getAttribute("data-checkUrl-param")
if(paramStr)param=Object.assign(Object.create(globalParam),JSON.parse(paramStr))
const request={url:url}
if(typeof param.headerList==="string")request.extractHeaders=param.headerList.split(",")
if(typeof param.method==="string")request.method=param.method.split(",")
requests.push(request)}catch(e){ERROR.log(`Error while preparing the checkUrl request: ${url}`,e)}}while(requests.length){const batch=requests.splice(0,globalParam.maxConcurrentCheckUrl)
const reports=await REMOTE.checkUrls(batch,globalParam.maxConcurrentCheckUrl,this.reg)
for(const url in reports){const item=itemsByUrl[url]
item.setAttribute("data-checkUrl-report",JSON.stringify(reports[url]))
item.dispatchEvent(new CustomEvent("checkUrlResponse",{bubbles:true,cancelable:true}))
item.setAttribute("data-checkUrl-status","done")}}}}REG.reg.registerSkin("wsp-dyngen",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\tiframe {\n\t\tflex: 1 1 15em;\n\t\tborder: none;\n\t\twidth: 0; /* sinon bloqué à 300px mini via un c-resizer */\n\t\tuser-select: none;\n\t}\n\n\t.panel {\n\t\tflex: 0 0 20%;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\twsp-item-xmled {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n`)
customElements.define("wsp-dyngen",DynGen)
const PERM_EDIT="action.dynGen#edit.node"
function xaRootFromOrigin(origin){const frags=origin.oriPath.split("/")
const xa=[]
for(let i=0;i<frags.length;i++)xa.push(parseInt(frags[i],10))
return xa}const DEBUG_DYNGEN=false

//# sourceMappingURL=dynGen.js.map