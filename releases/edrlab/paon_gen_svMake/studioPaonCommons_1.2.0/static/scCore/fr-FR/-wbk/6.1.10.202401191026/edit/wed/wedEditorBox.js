import{AgBoxErrBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxErrBar.js"
import{AgBoxSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgCommonBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/commonBar.js"
import{AgInsSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{AgMetaBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/metaBar.js"
import{AgOutlineBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/outlineBar.js"
import{AgPreviewBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/previewBar.js"
import{AgTxtSelEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/txtSel.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{WedEditorBase,WedPanelBar}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{WED_SELECTOR_BOX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{RelaxNgSchemaBuilder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js"
import{Resizer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/resizer.js"
import{AgSearchBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/searchBar.js"
import{AgDiffBarEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/diffBar.js"
export class WedEditorBox extends WedEditorBase{get scrollContainer(){return this.shadowRoot.getElementById("scrollBox")}initUi(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.barLayout=init.barLayout||new FullLayout
this.barLayout.initLayout(this,this.reg)
if(!init.disableDefaultAccelKeys){if(init.customAccelKeysList){this.wedMgr.accelKeyMgr.initFromMapActions(this.reg.mergeListsAsMap(init.customAccelKeysList,"accelKeys:wed:global"))}else{this.wedMgr.accelKeyMgr.initFromMapActions(this.reg.getListAsMap("accelKeys:wed:global"))}}else if(init.customAccelKeysList){this.wedMgr.accelKeyMgr.initFromMapActions(this.reg.getListAsMap(init.customAccelKeysList))}}addAsyncLib(lib){if(this._loadings==null){this._loadings=[]
this._inSync=null}this._loadings.push(lib)
return lib}get inSync(){if(!this._inSync){this._inSync=this._loadings?Promise.all(this._loadings):Promise.resolve()}return this._inSync}setWedModelEndPoint(endPoint,resolver){return this.addAsyncLib(WED.loadWedModel(endPoint,resolver).then(wedModel=>{this.wedModel=wedModel}))}setRelaxNG(endPoint,init,skMetaLib){return this.addAsyncLib(new RelaxNgSchemaBuilder(skMetaLib).buildRelaxNgFromUrl(endPoint,init).then(rngSchema=>{this.schema=rngSchema}))}initFromDocHolder(docHolder,config={}){this.rootNode.innerHTML=null
return this.inSync.then(()=>{if(!this.wedModel)throw Error("No wedModel declared")
if(!config.wedRootModelSelector)config.wedRootModelSelector=WED_SELECTOR_BOX
return this.wedMgr.initWedMgr(this.wedModel,docHolder,config)})}onMsgError(errMsg){if(errMsg.error==="masterDoorClosed"){alert("Connexion avec le serveur intérrompue")
location.reload()}else{return"redraw"}}}AgBoxSelEditor(AgTxtSelEditor(AgCommonBarEditor(AgMetaBarEditor(AgOutlineBarEditor(AgPreviewBarEditor(AgBoxErrBarEditor(AgDiffBarEditor(AgSearchBarEditor(WedEditorBox)))))))))
AgInsSelEditor(WedEditorBox,{mainBranch:true,includeVirtuals:true})
REG.reg.registerSkin("box-editor/full",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n\n\t.v {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t.h {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t  min-width: 0;\n\t  flex-direction: row;\n  }\n\n  c-resizer[c-orient=row] {\n\t  width: 1px;\n  }\n\n  c-resizer[c-orient=column] {\n\t  height: 1px;\n  }\n\n  .ctn {\n\t  background-color: var(--edit-bgcolor);\n\t  color: var(--edit-color);\n  }\n\n  #endBox {\n\t  flex: 1 1 30%;\n\t  min-width: 10%;\n  }\n\n  #metaBox {\n\t  flex: 1 1 70%;\n\t  min-width: 10%;\n  }\n\n  #previewPanel,\n  #outlinePanel {\n\t  flex: 1 1 50%;\n\t  overflow: auto;\n  }\n\n  #scrollBox {\n\t  flex: 1 1 80%;\n\t  min-width: 10%;\n\t  overflow-y: auto;\n\t  scrollbar-gutter: stable;\n\t  min-height: 3em;\n\t  scroll-behavior: smooth;\n  }\n\n  #metaPanel {\n\t  flex: 1 1 20%;\n\t  min-width: 10%;\n  }\n\n  #commonBar,\n  #diffBar {\n\t  border-bottom: 1px solid var(--border-color);\n\t  min-height: 1.8em;\n  }\n\n  #txtStackBar,\n  #searchBar,\n  #unknownBar {\n\t  border-top: 1px solid var(--border-color);\n  }\n\n  #errorBar {\n\t  border-inline-start: 1px solid var(--border-color);\n  }\n`)
customElements.define("box-editor",WedEditorBox)
export class WedEditorFrag extends WedEditorBase{initialize(init){if(init.crossNav===undefined)init.crossNav=true
super.initialize(init)
return this}}AgBoxSelEditor(AgTxtSelEditor(AgCommonBarEditor(WedEditorFrag)))
customElements.define("box-editor-frag",WedEditorFrag)
class FullLayout{initLayout(editor,reg){this.editor=editor
const sr=editor.shadowRoot
reg.installSkin("box-editor/full",sr)
reg.installSkin("scroll/large",sr)
editor.rootNode=JSX.createElement("div",{id:editor.config.withoutScrolls?"rootBox":"scrollBox",class:"ctn","c-resizable":""})
sr.appendChild(JSX.createElement("div",{id:"colBox",class:"v"},JSX.createElement("div",{id:"rowBox",class:"h"},JSX.createElement("div",{id:"metaBox",class:"v","c-resizable":""},editor.rootNode),JSX.createElement("div",{id:"endBox",class:"v",hidden:true,"c-resizable":""}))))
editor.wedMgr.listeners.on("buildLastDatas",(function(wedMgr,lastDatas){const sr=wedMgr.wedEditor.shadowRoot
const endBox=sr.getElementById("endBox")
if(!endBox.hidden){lastDatas.lytEndBox=endBox.style.flexBasis
lastDatas.lytMetaBox=sr.getElementById("metaBox").style.flexBasis
const otl=sr.getElementById("outlinePanel")
if(otl&&!otl.hidden)lastDatas.lytOtl=otl.style.flexBasis
const prv=sr.getElementById("previewPanel")
if(prv&&!prv.hidden)lastDatas.lytPrv=prv.style.flexBasis}}))
editor.wedMgr.listeners.on("initLastDatas",(function(wedMgr,lastDatas){const sr=wedMgr.wedEditor.shadowRoot
if(lastDatas.lytEndBox){sr.getElementById("endBox").style.flexBasis=lastDatas.lytEndBox
if(lastDatas.lytMetaBox)sr.getElementById("metaBox").style.flexBasis=lastDatas.lytMetaBox
if(lastDatas.lytOtl){const panel=sr.getElementById("outlinePanel")
if(panel)panel.style.flexBasis=lastDatas.lytOtl}if(lastDatas.lytPrv){const panel=sr.getElementById("previewPanel")
if(panel)panel.style.flexBasis=lastDatas.lytPrv}}}))}getBar(id){return this.editor.shadowRoot.getElementById(id)}showBar(bar){let ctn
switch(bar.id){case"commonBar":ctn=this.editor.shadowRoot.getElementById("colBox")
if(bar.parentNode!==ctn)ctn.insertBefore(bar,ctn.firstChild)
break
case"errorBar":ctn=this.editor.shadowRoot.getElementById("rowBox")
if(bar.parentNode!==ctn)ctn.appendChild(bar)
break
case"outlineBar":ctn=this.editor.shadowRoot.getElementById("endBox")
let outlinePanel=DOMSH.findHost(bar)
if(!outlinePanel)outlinePanel=ctn.insertBefore(JSX.createElement(WedPanelBar,{"î":{barBody:bar},id:"outlinePanel","c-resizable":""}),ctn.firstChild)
else DOM.setHidden(outlinePanel,false)
this.refreshEndBox(ctn)
break
case"previewBar":ctn=this.editor.shadowRoot.getElementById("endBox")
let previewPanel=DOMSH.findHost(bar)
if(!previewPanel)previewPanel=ctn.appendChild(JSX.createElement(WedPanelBar,{"î":{barBody:bar},id:"previewPanel","c-resizable":""}))
else DOM.setHidden(previewPanel,false)
this.refreshEndBox(ctn)
break
case"metaBar":ctn=this.editor.shadowRoot.getElementById("metaBox")
let metaPanel=DOMSH.findHost(bar)
if(!metaPanel){ctn.appendChild(JSX.createElement("c-resizer",{"c-orient":"column"}))
metaPanel=ctn.appendChild(JSX.createElement(WedPanelBar,{"î":{barBody:bar},id:"metaPanel","c-resizable":""}))}else{DOM.setHidden(metaPanel,false)
DOM.setHidden(metaPanel.previousElementSibling,false)}this.refreshEndBox(ctn)
break
case"txtStackBar":const prev=this.editor.shadowRoot.getElementById("rowBox")
ctn=prev.parentElement
if(bar.parentNode!==ctn)ctn.insertBefore(bar,prev?prev.nextSibling:null)
break
case"searchBar":const unknownBar=this.editor.shadowRoot.getElementById("unknownBar")
ctn=this.editor.shadowRoot.getElementById("colBox")
if(bar.parentNode!==ctn)ctn.insertBefore(bar,unknownBar&&unknownBar.parentNode===ctn?unknownBar:null)
break
case"diffBar":const rowBox=this.editor.shadowRoot.getElementById("rowBox")
ctn=rowBox.parentElement
if(bar.parentNode!==ctn)ctn.insertBefore(bar,rowBox)
break
case"unknownBar":ctn=this.editor.shadowRoot.getElementById("colBox")
if(bar.parentNode!==ctn)ctn.appendChild(bar)
break
case"helpBar":ctn=this.editor.shadowRoot.getElementById("rowBox")
if(bar.parentNode!==ctn){ctn.appendChild(JSX.createElement("c-resizer",{"c-orient":"row"}))
bar.setAttribute("c-resizable","")
ctn.appendChild(bar)}else{DOM.setHidden(bar.previousElementSibling,false)}break
default:console.warn("Bar unknown by this FullLayout!",this,bar)
return false}VIEWS.onViewShown(bar)
this.editor.wedMgr.listeners.emit("layoutBarChange",this.editor.wedMgr,bar)
return true}onHideBar(bar){const panel=DOMSH.findHost(bar)
if(panel instanceof WedPanelBar&&DOM.setHidden(panel,true)){const ctn=panel.parentElement
if(!ctn)return
if(ctn.id==="endBox")this.refreshEndBox(ctn)
else if(bar.id==="metaBar")DOM.setHidden(panel.previousElementSibling,true)
VIEWS.onViewHidden(bar)}else if(bar.id==="helpBar"){DOM.setHidden(bar.previousElementSibling,true)}this.editor.wedMgr.listeners.emit("layoutBarChange",this.editor.wedMgr,bar)}removeBar(bar){if(bar.id==="unknownBar"){if(bar.parentNode)bar.remove()
return}else if(bar.id==="helpBar"){if(bar.parentNode){bar.previousElementSibling.remove()
bar.remove()}return}const panel=DOMSH.findHost(bar)
if(panel instanceof WedPanelBar){const ctn=panel.parentElement
if(ctn){if(bar.id==="metaBar")panel.previousElementSibling.remove()
panel.remove()
if(ctn.id==="endBox")this.refreshEndBox(ctn)
VIEWS.onViewHidden(bar,true)
this.editor.wedMgr.listeners.emit("layoutBarChange",this.editor.wedMgr,bar)}}}refreshEndBox(endBox){let hidden=true
for(let ch=endBox.firstElementChild;ch;ch=ch.nextElementSibling){if(!ch.hidden){hidden=false
break}}if(DOM.setHidden(endBox,hidden)){const prev=endBox.previousElementSibling
if(prev){let resizer=prev
if(!(resizer instanceof Resizer))resizer=endBox.parentElement.insertBefore(JSX.createElement("c-resizer",{"c-orient":"row"}),endBox)
DOM.setHidden(resizer,hidden)}}if(!hidden){let ch=endBox.firstElementChild
let prevVisible=false
while(ch){if(!ch.hidden)prevVisible=true
const next=ch.nextElementSibling
if(next instanceof Resizer){ch=next.nextElementSibling
DOM.setHidden(next,!prevVisible||ch.hidden)
prevVisible=false
continue}else if(next){const resizer=endBox.insertBefore(JSX.createElement("c-resizer",{"c-orient":"column"}),next)
if(!prevVisible||next.hidden)resizer.hidden=true}prevVisible=false
ch=next}}}}export const editorBoxDefined=Promise.resolve()

//# sourceMappingURL=wedEditorBox.js.map