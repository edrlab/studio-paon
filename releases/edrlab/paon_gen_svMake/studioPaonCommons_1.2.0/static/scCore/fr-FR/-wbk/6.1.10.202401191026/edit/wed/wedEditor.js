import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WED,WED_ROOT_SELECTOR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{isSkAnnotListener,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AccelKeyMgr,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{Desk}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js"
import{EventsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{FetchAnnots,FetchJml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{ListMsgOt,MsgOt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
import{ErrorMsg,InitSlaveRep,ResetStatesMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{isXmlMsg,XmlBatch,XmlDeleteMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{isSkAnnotated}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{SKMETA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{markdownParse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/markdown.js"
export class WedMgr{constructor(wedEditor){this.txStamp=0
this.listeners=new EventsMgr
this.readOnlyCauses=new Set
this._lastSelChanged=null
this.currentMsgsStack=[]
this.wedEditor=wedEditor
this.accelKeyMgr=new AccelKeyMgr
this.wedEditor.addEventListener("keydown",(function(ev){this.wedMgr.accelKeyMgr.handleKeyboardEvent(ev,this)}))}get reg(){return this.wedEditor.rootNode.reg}getDatasForModel(model){if(!this._datasModels)this._datasModels=new Map
let datas=this._datasModels.get(model)
if(!datas){datas={}
this._datasModels.set(model,datas)}return datas}get intersectObs(){if(!this._intersectObs){const scroll=this.wedEditor.scrollContainer
this._intersectObs=scroll?new IntersectionObserver(this.intersectObsCb,{root:scroll,rootMargin:"100%"}):null}return this._intersectObs}hookFct(name,fct,before){const overriden=this[name]
if(before){this[name]=()=>{fct.apply(this,arguments)
overriden.apply(this,arguments)}}else{this[name]=()=>{overriden.apply(this,arguments)
fct.apply(this,arguments)}}}get readOnly(){return this.docHolder==null||this.readOnlyCauses.size>0}setReadOnly(cause,readOnly,...moreTuples){const oldSt=this.readOnly
if(readOnly)this.readOnlyCauses.add(cause)
else this.readOnlyCauses.delete(cause)
if(moreTuples)for(let i=0;i<moreTuples.length;i=i+2){if(moreTuples[i+1])this.readOnlyCauses.add(moreTuples[i])
else this.readOnlyCauses.delete(moreTuples[i])}if(oldSt!==this.readOnly){WEDLET.refreshEditMode(this.rootWedlet)
this.listeners.emit("readOnlyChangeAfter",this,cause,readOnly,...moreTuples)
return true}return false}trackWindowChanges(){document.addEventListener("selectionchange",this._selectionchangeLstn=this.onSelectionChange.bind(this))
this._clipboardLstn=this.onClipboardEvent.bind(this)
document.addEventListener("copy",this._clipboardLstn)
document.addEventListener("cut",this._clipboardLstn)
document.addEventListener("paste",this._clipboardLstn)
if(!this._themeChangeLstn&&this.wedModel&&this.wedModel.themes.length>0&&desk&&desk.onThemeChange){this._themeChangeLstn=this.refreshTheme.bind(this)
desk.onThemeChange.add(this._themeChangeLstn)}}untrackWindowChanges(){document.removeEventListener("selectionchange",this._selectionchangeLstn)
document.removeEventListener("copy",this._clipboardLstn)
document.removeEventListener("cut",this._clipboardLstn)
document.removeEventListener("paste",this._clipboardLstn)
if(this._themeChangeLstn){desk.onThemeChange.delete(this._themeChangeLstn)
this._themeChangeLstn=null}}initWedMgr(wedModel,docHolder,config){docHolder.setSubRoot(config===null||config===void 0?void 0:config.xaRoot)
const rootNode=this.wedEditor.rootNode
if(!this.config){rootNode.wedMgr=this
rootNode.addEventListener("focus",onFocus,true)
rootNode.addEventListener("blur",onBlur,true)
rootNode.addEventListener("delegate-host",ev=>{const elt=ev.composedPath()[0]
const host=elt.delegatedHost
host.wedMgr=this
host.addEventListener("focus",onFocus,true)
host.addEventListener("blur",onBlur,true)})}if(this.docHolderAsync)this.detachDocHolder()
this.config=config||{}
this.wedModel=wedModel
this.readOnlyCauses.clear()
if(this.config.readOnlyCauses)for(const c of this.config.readOnlyCauses)this.readOnlyCauses.add(c)
if(!this._themeChangeLstn&&this.wedModel.themes.length>0&&desk&&desk.onThemeChange){this._themeChangeLstn=this.refreshTheme.bind(this)
desk.onThemeChange.add(this._themeChangeLstn)}rootNode.reg=REG.createSubReg(this.wedEditor,wedModel.reg)
if(config.overrideReg)config.overrideReg(rootNode.reg)
if(wedModel.themes.length>0)this.refreshTheme(desk&&desk.currentTheme)
this.docHolderAsync=docHolder
if(docHolder.isDocHolderSync()){this.docHolder=docHolder
this.docHolder.noCleanup=this.config.noCleanup||false}return this.redrawEditor((function(){var _a
this.docHolderAsync.addMsgListener(this._msgLstn=msg=>{if(this.rootWedlet===undefined)return
try{this.executeMsg(msg)}catch(e){ERROR.log("Exec msg failed, editor will be redrawn.",e)
this.redrawEditor()}});(_a=this.docHolder)===null||_a===void 0?void 0:_a.houseLstn.on("onSkAnnotsChange",this._onSkAnnots||(this._onSkAnnots=this.onSkAnnots.bind(this)))}))}getJsModule(key){var _a
return(_a=this.wedModel)===null||_a===void 0?void 0:_a.jsLibs[key]}refreshTheme(theme){const ctxTheme=theme?theme.getId():""
const st=this.wedEditor.rootNode.style
for(const th of this.wedModel.themes){if(!th.themeContext||ctxTheme.match(th.themeContext)){if(this._currentTheme)for(let n of Object.getOwnPropertyNames(this._currentTheme.themeVars))st.removeProperty(n)
this._currentTheme=th
for(let n of Object.getOwnPropertyNames(th.themeVars))st.setProperty(n,th.themeVars[n])
break}}}killEditor(){this.detachDocHolder()
if(this.asyncSkAnnotsTask)window.cancelIdleCallback(this.asyncSkAnnotsTask)
if(this.asyncSkAnnotsRecallTask)window.cancelIdleCallback(this.asyncSkAnnotsRecallTask)
this.listeners.emit("killEditor",this)}detachDocHolder(){if(this.docHolderAsync&&this.docHolderAsync.isAvailable){this.docHolderAsync.removeMsgListener(this._msgLstn)
if(this._asyncSkAnnots)this.docHolder.houseLstn.removeListener("onSkAnnotsChange",this._onSkAnnots)
this.docHolderAsync.close()
this.docHolderAsync=null
this.docHolder=null}this.clearEditor()}clearEditor(){this.drawn=false
if(this.wedEditor.rootNode)this.wedEditor.rootNode.textContent=null
this.rootWedlet=undefined
if(this._intersectObs){this._intersectObs.disconnect()
this._intersectObs=null}}onSelectionChange(){if(this.freezeFocus)return
const activeElt=DOMSH.findDeepActiveElement()
if(!DOMSH.isFlatAncestor(this.wedEditor.rootNode,activeElt)){if(DOMSH.isFlatAncestor(this.wedEditor,activeElt))return
if(this._lastSelChanged!==null){this._lastSelChanged=null
this.listeners.emitUntil("selection",this,null)}return}const sel=this._lastSelChanged=DOMSH.findDocumentOrShadowRoot(activeElt).getSelection()
this.listeners.emitUntil("selection",this,sel)}getCurrentSel(){return this.listeners.emitUntil("getCurrentSel",this)}onClipboardEvent(ev){const activeElt=DOMSH.findDeepActiveElement()
if(!DOMSH.isFlatAncestor(this.wedEditor.rootNode,activeElt)){return}ev.preventDefault()
this.listeners.emitUntil("clipboard",this,ev,activeElt)}intersectObsCb(entries,observer){for(let i=0,s=entries.length;i<s;i++){entries[i].target.onIntersectChange(entries[i])}}fetchContent(from){return this.docHolderAsync.fetchContent([new FetchJml(from,1,this.config.fetchContentThreshold)]).then(f=>f[0])}getContent(from){return this.config.fetchContentThreshold>0?this.docHolder.getContentThreshold(this.config.fetchContentThreshold,from):this.docHolder.getContent(from)}dispatchAnnotsAfterRebuildWedlet(xaFrom){if(this.config.noAnnots)return
if(this.docHolder&&this.rootWedlet){this.dispatchAddedSkAnnots(this.docHolder.getAnnots(xaFrom))}else{console.trace("TODO dispatchAnnotsAfterRedraw async")}}redrawEditor(execInSyncAfterRedraw){this.drawn=false
this._doAfterBatch=null
const xaRoot=this.config.xaRoot
const commands=[new FetchJml(xaRoot,1,this.config.fetchContentThreshold),new FetchAnnots(xaRoot)]
this.listeners.emit("redrawBeforeFetch",this,commands)
this.clearEditor()
return this.docHolderAsync.fetchContent(commands).then(async cmds=>{this.txStamp++
this.listeners.emit("redrawBeforeBinds",this,cmds)
const jml=cmds[0].result
const docModel=this.config.rootModel||this.wedModel.findModelForDocument(this.config.startModes||WED.DEFAULT_MODES,this,WED.combineSelectors(this.config.wedRootModelSelector,WED_ROOT_SELECTOR))
this.rootWedlet=docModel?docModel.createRootWedlet(this.wedEditor.rootNode,this.config.insertRootWedletBefore,this):null
let promise
if(xaRoot){const rootNode=jml[0]
if(!rootNode){this.wedEditor.dispatchEvent(new CustomEvent("wed-editor-root-deleted"))
this.detachDocHolder()
return false}if(this.rootWedlet)promise=this.rootWedlet.bindRoot(jml[1]||[],rootNode,xaRoot)}else{if(this.rootWedlet)promise=this.rootWedlet.bindRoot(jml)}if(execInSyncAfterRedraw)execInSyncAfterRedraw.call(this)
if(this._doAfterBatch){for(let i=0;i<this._doAfterBatch.length;i++)this._doAfterBatch[i]()
this._doAfterBatch=null}const annots=cmds[1].result
if(annots&&annots.length>0)this.dispatchSkAnnots(null,annots)
if(promise)await promise
this.listeners.emit("redrawAtEnd",this,cmds)
this.drawn=true
return this.rootWedlet!=null})}doAfterBatch(cb){if(this.currentMsgsStack.length>0||!this.drawn){if(!this._doAfterBatch)this._doAfterBatch=[cb]
else this._doAfterBatch.push(cb)}else{cb()}}get currentMsg(){return this.currentMsgsStack[this.currentMsgsStack.length-1]}isUndoRedoPending(m){if(m.metas&&(m.metas.undo||m.metas.redo))return true
if(m instanceof ListMsgOt){for(let i=0;i<m.msgs.length;i++){if(this.isUndoRedoPending(m.msgs[i]))return true}}return false}executeMsg(msg){this.currentMsgsStack.push(msg)
try{this.listeners.emit("hookMsgBefore",this,msg)
if(isXmlMsg(msg)){this.txStamp++
WEDLET.applyUpdate(this.rootWedlet,msg)}else if(msg instanceof ListMsgOt){for(let i=0;i<msg.msgs.length;i++)this.executeMsg(msg.msgs[i])}else if(msg.type===ResetStatesMsg.type||msg.type===InitSlaveRep.type){this.redrawEditor((function(){this.listeners.emit("hookMsgAfter",this,msg)}))
return}else if(msg instanceof ErrorMsg){switch(this.wedEditor.onMsgError(msg)){case"redraw":this.redrawEditor((function(){this.listeners.emit("hookMsgAfter",this,msg)}))
break}return}if(!this.rootWedlet)return
this.listeners.emit("hookMsgAfter",this,msg)
if(isSkAnnotated(msg))this.dispatchSkAnnots(msg.skAnnotsToRemove,msg.skAnnotsToAdd)
else if(containsDeleteMsg(msg)){this.dispatchSkAnnots(null,null)}if(this.currentMsgsStack.length===1){if(this._doAfterBatch){for(let i=0;i<this._doAfterBatch.length;i++){this._doAfterBatch[i]()}this._doAfterBatch=null}if(!this.freezeFocus){try{this.listeners.emitUntil("hookMsgForNextSel",this,msg,this.findAndAdjustMsgForNextSel(msg))}catch(e){ERROR.log("hookMsgForNextSel failed",e,{reg:this.reg,msg:msg})}this.onSelectionChange()}}this.listeners.emit("hookEndTransac",this,msg)}finally{this.currentMsgsStack.pop()}}findAndAdjustMsgForNextSel(msg){if(msg instanceof XmlBatch&&msg.selAfter!=null){return msg}else if(isXmlMsg(msg)){return msg}else if(msg instanceof ListMsgOt){if(msg.getMeta("autoCorrect"))return null
for(let i=msg.msgs.length-1;i>=0;i--){const m=msg.msgs[i]
if(!m.getMeta("autoCorrect")){let res=this.findAndAdjustMsgForNextSel(m)
if(res&&res instanceof MsgOt&&i<msg.msgs.length-1){res=res.clone()
for(let j=i+1;j<msg.msgs.length;j++){const n=msg.msgs[j]
if(n instanceof MsgOt)n.adjust(res)}}return res}}}}onSkAnnots(removed,added){if(this.currentMsgsStack.length===0)this.dispatchSkAnnots(removed,added)}dispatchSkAnnots(removed,added){if(this.config.noAnnots)return
const root=this.rootWedlet
if(root&&removed){for(let i=0,s=removed.length;i<s;i++){const annot=removed[i]
const xa=annot.anchor||annot.start
let k=i+1
while(k<s&&removed[k].anchorNode===annot.anchorNode)k++
WEDLET.findWedlets(root,xa,WEDLET.FINDOPTIONS_lastAncestorIfNone).forEach(wedlet=>{if(isSkAnnotListener(wedlet)){wedlet.onRemovedSkAnnot(annot,xa)
if(i<k)for(let m=i+1;m<k;m++)wedlet.onRemovedSkAnnot(removed[m],xa)}})
i=k-1}}if(root&&added)this.dispatchAddedSkAnnots(added)
this._lastSkAnnots=null
if(this.listeners.hasListeners("asyncSkAnnots")){if(!this.asyncSkAnnotsTask){if(this.asyncSkAnnotsRecallTask)window.cancelIdleCallback(this.asyncSkAnnotsRecallTask)
this.asyncSkAnnotsTask=window.requestIdleCallback(this._asyncSkAnnots||(this._asyncSkAnnots=this.asyncSkAnnots.bind(this)))}}}dispatchAddedSkAnnots(added){for(let i=0,s=added.length;i<s;i++){const annot=added[i]
const xa=annot.anchor||annot.start
let k=i+1
while(k<s&&added[k].anchorNode===annot.anchorNode)k++
WEDLET.findWedlets(this.rootWedlet,xa,WEDLET.FINDOPTIONS_lastAncestorIfNone).forEach(wedlet=>{if(isSkAnnotListener(wedlet)){wedlet.onAddedSkAnnot(annot,xa)
if(i<k)for(let m=i+1;m<k;m++)wedlet.onAddedSkAnnot(added[m],xa)}})
i=k-1}}get lastSkAnnots(){if(!this._lastSkAnnots)this._lastSkAnnots=this.docHolder.getAnnots(this.rootWedlet.wedAnchor)
return this._lastSkAnnots}asyncSkAnnots(deadline){this.asyncSkAnnotsTask=0
const toRecall=this.listeners.emitUntil("asyncSkAnnots",this,this.lastSkAnnots,deadline)
if(toRecall)this.asyncSkAnnotsRecall(toRecall)}asyncSkAnnotsRecall(lstnToRecall){this.asyncSkAnnotsRecallTask=window.requestIdleCallback(deadline=>{this.asyncSkAnnotsRecallTask=0
const toRecall=this.listeners.emitUntilAfter("asyncSkAnnots",lstnToRecall,true,this,this.lastSkAnnots,deadline)
if(toRecall)this.asyncSkAnnotsRecall(toRecall)})}writeRangeToClipboard(range,dataTrsf){if(!XA.isCollapsed(range)||XA.isAttribute(range.start)){const doc=this.docHolder
if(doc){const frag=doc.exportRange(range,"multi",{"application/xml":null,"text/plain":null,"text/html":null})
if(dataTrsf){dataTrsf.setData("application/xml",frag["application/xml"])
dataTrsf.setData("text/plain",frag["text/plain"])
dataTrsf.setData("text/html",frag["text/html"])}else if(navigator.clipboard){return navigator.clipboard.write([new ClipboardItem({"text/plain":new Blob([frag["text/plain"]],{type:"text/plain"}),"text/html":new Blob([frag["text/html"]],{type:"text/html"}),"application/xml":new Blob([frag["application/xml"]],{type:"application/xml"})})])}}}return Promise.resolve()}writeRangeToClipboardAsXml(range){if(!XA.isCollapsed(range)&&navigator.clipboard){const doc=this.docHolder
if(doc){return navigator.clipboard.writeText(doc.exportRange(range,"application/xml"))}}return Promise.resolve()}writeNodesToClipboard(xaNodes,filters,dataTrsf){const doc=this.docHolder
if(doc){const frag=doc.exportNodes(xaNodes,filters,"multi",{"application/xml":null,"text/plain":null,"text/html":null})
if(dataTrsf){dataTrsf.setData("text/plain",frag["text/plain"])
dataTrsf.setData("text/html",frag["text/html"])
dataTrsf.setData("application/xml",frag["application/xml"])}else if(navigator.clipboard){return navigator.clipboard.write([new ClipboardItem({"text/plain":new Blob([frag["text/plain"]],{type:"text/plain"}),"text/html":new Blob([frag["text/html"]],{type:"text/html"}),"application/xml":new Blob([frag["application/xml"]],{type:"application/xml"})})])}}return Promise.resolve()}writeNodesToClipboardAsXml(xaNodes,filters){const doc=this.docHolder
if(doc&&navigator.clipboard){return navigator.clipboard.writeText(doc.exportNodes(xaNodes,filters,"application/xml"))}return Promise.resolve()}async tryPaste(context,cache,dataTrsf){const doc=this.docHolder
if(doc&&!this.readOnly){if(!dataTrsf){dataTrsf=new DataTransfer
const text=await navigator.clipboard.readText()
dataTrsf.setData("text/plain",text)}if(this.config.dataTransferAnalyzer){const r=await this.config.dataTransferAnalyzer.tryPaste(dataTrsf,context,cache,this)
if(r)return r}return this.tryPasteDefault(context,cache,dataTrsf)}return null}async tryPasteDefault(context,cache,dataTrsf){const doc=this.docHolder
if(dataTrsf.types.indexOf("application/xml")>=0){const content=DOM.parseDom(dataTrsf.getData("application/xml"))
DOM.cleanupDom(content,true,false,true)
cache.originalDom=content.documentElement
const htmlFallback=dataTrsf.types.indexOf("text/html")>=0?dataTrsf.getData("text/html"):null
const imp=await doc.house.schemaDom.tryPasteNodes(context,content.documentElement,cache)
if(htmlFallback&&(imp===null||imp===void 0?void 0:imp.reduce((acc,imp)=>Math.min(acc,imp.malus),Infinity))>0){const docFrag=DOM.parseDomValid(htmlFallback,null,"text/html")
if(docFrag){cache.originalHtml=docFrag.body
const imp2=await doc.house.schemaDom.tryPasteNodes(context,docFrag.body,cache)
if(imp2)imp.push(...SKMETA.replaceLabelOnImports(imp2,"➲ Collage approximatif"))}}return imp}if(dataTrsf.types.indexOf("text/html")>=0){try{const datas=dataTrsf.getData("text/html")
const docFrag=DOM.parseDomValid(datas,null,"text/html")
if(docFrag){cache.originalHtml=docFrag.body
const imp=await doc.house.schemaDom.tryPasteNodes(context,docFrag.body,cache)
if(imp)return SKMETA.replaceLabelOnImports(imp,"➲ Import HTML")}return null}catch(e){}}if(dataTrsf.types.indexOf("text/plain")>=0){const text=dataTrsf.getData("text/plain")
if(text){cache.originalText=text
if(context.targetHint!=="string"){await this.tryParseAsNodeAsync(text,cache,context.targetHint)
if(cache.originalDom||cache.originalHtml)return doc.house.schemaDom.tryPasteNodes(context,cache.originalDom||cache.originalHtml,cache)}return doc.house.schemaDom.tryPasteText(context,text,cache)}}}extractDatasFromDragSession(dataTrsf){const doc=this.docHolder
if(doc&&!this.readOnly){if(this.config.dataTransferAnalyzer){const r=this.config.dataTransferAnalyzer.extractDatasFromDragSession(dataTrsf,this)
if(r)return r.originalLinks||r.originalDom||r.originalHtml||r.originalText?r:null}const result={}
if(dataTrsf.types.indexOf("application/xml")>=0){const content=DOM.parseDom(dataTrsf.getData("application/xml"))
DOM.cleanupDom(content,true,false,true)
result.originalDom=content.documentElement}if(dataTrsf.types.indexOf("text/html")>=0){try{const docFrag=DOM.parseDomValid(dataTrsf.getData("text/html"),null,"text/html")
if(docFrag)result.originalHtml=docFrag.body}catch(e){}}if(dataTrsf.types.indexOf("text/plain")>=0){const text=dataTrsf.getData("text/plain")
if(text){result.originalText=text
if(!result.originalDom&&!result.originalHtml)this.tryParseAsNode(text,result)}}if(result.originalDom||result.originalHtml||result.originalText)return result}return null}tryParseAsNode(txt,result,srcFormat){if(!srcFormat&&txt.startsWith("<")){let doc=DOM.parseDomValid(txt,null,"application/xml")
if(doc){DOM.cleanupDom(doc,true,false,true)
result.originalDom=doc.documentElement
return}doc=DOM.parseDomValid(txt,null,"text/html")
if(doc&&doc.body.querySelector("*")){result.originalHtml=doc.body
return}}try{if(srcFormat==="text"){const lines=txt.split("\n")
if(lines.length>1){const r=JSX.createElement("section",null)
for(let l of lines)if(l)r.appendChild(JSX.createElement("p",null,l))
result.originalHtml=r}else{result.originalHtml=JSX.createElement("span",null,txt)}}else{const doc=DOM.parseDomValid(markdownParse(txt),null,"text/html")
if(doc)result.originalHtml=doc.body}}catch(e){}}async tryParseAsNodeAsync(txt,result,srcFormat){this.tryParseAsNode(txt,result,srcFormat)}buildLastDatas(lastDatas){const scrollCtn=this.wedEditor.scrollContainer
if(scrollCtn)lastDatas.scrollPos=scrollCtn.scrollTop
this.listeners.emit("buildLastDatas",this,lastDatas)}initLastDatas(lastDatas){if("scrollPos"in lastDatas){const scrollCtn=this.wedEditor.scrollContainer
if(this.rootWedlet){if(scrollCtn)scrollCtn.scrollTop=lastDatas.scrollPos
this.listeners.emit("initLastDatas",this,lastDatas)}else{this.listeners.once("redrawAtEnd",()=>{if(scrollCtn)scrollCtn.scrollTo({top:lastDatas.scrollPos,behavior:"auto"})
this.listeners.emit("initLastDatas",this,lastDatas)})}}}}function containsDeleteMsg(msg){if(msg instanceof XmlDeleteMsg)return true
if(msg instanceof ListMsgOt&&msg.msgs.findIndex(containsDeleteMsg)>0)return true
return false}export function isWedMgrPointer(obj){return obj&&"wedMgr"in obj}export function isWedEditor(elt){return elt&&"initFromDocHolder"in elt}export class WedEditorBase extends HTMLElement{constructor(){super()
this.wedMgr=new WedMgr(this)}get initialized(){return this.initialize==null}initialize(init){this.initialize=null
this.config=init
this.reg=REG.findReg(this,init)
this.initUi(init)
if(init.lastDatasKey)this.setAttribute("last-datas",init.lastDatasKey)
if(init.lastDatas){if(this.initLastDatasHooks)for(const hook of this.initLastDatasHooks)hook.call(this,init.lastDatas)
this.wedMgr.initLastDatas(init.lastDatas)}return this}buildInitFromAtts(init){if(!init)init={}
init.lastDatas=LASTDATAS.getLastDatas(this,this.getAttribute("last-datas"))
return init}initUi(init){this.rootNode=this
if(!init.withoutScrolls){this.scrollContainer=this.rootNode
this.scrollContainer.style.overflow="auto"}this.rootNode.addEventListener("delegate-host",ev=>{ev.stopPropagation()})}connectedCallback(){if(this.initialize)this.initialize(this.buildInitFromAtts())
this.wedMgr.trackWindowChanges()}disconnectedCallback(){this.wedMgr.untrackWindowChanges()}setWedModel(wedModel){this.wedModel=wedModel
return this}initFromDocHolder(docHolder,config){if(!this.wedModel)throw Error("No wedModel declared")
return this.wedMgr.initWedMgr(this.wedModel,docHolder,config)}onMsgError(errMsg){}buildLastDatas(parentLastDatas){const k=this.getAttribute("last-datas")
if(k){const lastDatas=parentLastDatas[k]={}
if(this.buildLastDatasHooks)for(const hook of this.buildLastDatasHooks)hook.call(this,lastDatas)
this.wedMgr.buildLastDatas(lastDatas)}}onViewShown(){this.wedMgr.listeners.emit("shown",this.wedMgr)}onViewBeforeHide(close){return this.wedMgr.listeners.emitUntil("beforeHide",this.wedMgr,close)!==false}async onViewWaitForHide(close){return await this.wedMgr.listeners.emitAsyncUntil("beforeHideAsync",this.wedMgr,close)!==false}onViewHidden(close){this.wedMgr.listeners.emit("hidden",this.wedMgr,close)}}export class WedEditorMiniview extends WedEditorBase{constructor(){super()
this.wedMgr.setReadOnly("WedEditorMiniview",true)}}customElements.define("wed-miniview",WedEditorMiniview)
export class WedPanelBar extends BaseElement{_initialize(init){const reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
const head=sr.appendChild(JSX.createElement("div",{class:"header"},JSX.createElement("span",{id:"ti"},VIEWS.getLabel(init.barBody))))
if(init.barActions){}sr.appendChild(init.barBody)}}REG.reg.registerSkin("wed-panel-bar",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 1.5em;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t.header {\n\t\tdisplay: none;\n\t\t/*display: flex;*/\n\t\t/*min-height: min-content;*/\n\t\t/*min-width: 0;*/\n\t\t/*background-color: var(--dialog-bgcolor);*/\n\t\t/*padding: 0.1em 0.3em;*/\n\t}\n\n\t#ti {\n\t\tflex: 1;\n\t\tuser-select: none;\n\t\tcolor: var(--dialog-color);\n\t}\n\n\t#outlineBar {\n\t\tborder-top: 1px solid var(--border-color);\n\t}\n\n\t#previewBar {\n\t\tflex: 1;\n\t\tbackground-color: var(--edit-bgcolor);\n\t\tcolor: var(--edit-color);\n\t}\n`)
customElements.define("wed-panel-bar",WedPanelBar)
export class WedEditAction extends Action{isEnabled(ctx){if(ctx.wedMgr.readOnly)return false
return super.isEnabled(ctx)}}export class WedUndoAction extends WedEditAction{constructor(){super(...arguments)
this._label="Annuler"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/undo.svg"
this._group="undo"}isVisible(ctx){if(ctx.wedMgr.readOnly)return false
return super.isVisible(ctx)}execute(ctx,ev){const wedMgr=ctx.wedMgr
wedMgr.docHolder.willUndo(wedMgr.config.undoRedoFilter).then(found=>{if(!found)POPUP.showNotifInfo("Aucune action à annuler",ctx.wedMgr.wedEditor)})}}export class WedRedoAction extends WedUndoAction{constructor(){super(...arguments)
this._label="Refaire"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/redo.svg"
this._group="undo"}execute(ctx,ev){const wedMgr=ctx.wedMgr
wedMgr.docHolder.willRedo(wedMgr.config.undoRedoFilter).then(found=>{if(!found)POPUP.showNotifInfo("Aucune action à refaire",ctx.wedMgr.wedEditor)})}}REG.reg.registerSvc("wedEditorUndoAction",1,new WedUndoAction)
REG.reg.registerSvc("wedEditorRedoAction",1,new WedRedoAction)
REG.reg.addSvcToList("accelKeys:wed:global","Z-accel",1,"wedEditorUndoAction")
REG.reg.addSvcToList("accelKeys:wed:global","Y-accel",1,"wedEditorRedoAction")
function onFocus(ev){const wedMgr=this.wedMgr
if(wedMgr._lastFocusEvent===ev)return
wedMgr._lastFocusEvent=ev
const composedPath=ev.composedPath()
let focusElt
for(let i=0;i<composedPath.length;i++){const o=composedPath[i]
if(o instanceof Element){focusElt=o
break}}wedMgr.lastFocus=focusElt
if(focusElt)wedMgr.listeners.emitCatched("getFocus",wedMgr,focusElt)}function onBlur(ev){const wedMgr=this.wedMgr
if(wedMgr._lastFocusEvent===ev)return
wedMgr._lastFocusEvent=ev
wedMgr.listeners.emitCatched("looseFocus",wedMgr,ev)}Desk.compatTable.set("edit",()=>{if(!ShadowRoot.prototype.getSelection)return false
return Desk.navVersions["Chrome"]>=67})

//# sourceMappingURL=wedEditor.js.map