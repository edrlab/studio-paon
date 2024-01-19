import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{BoxInput}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{PopupAutoComplete}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{CellBuilderLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
import{DEBUG_TOOLTIP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popupable.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
class BoxAutoComplete extends HTMLElement{get boxInput(){if(!this._input)this._input=DOM.findPreviousSibling(this,n=>n instanceof BoxInput)
return this._input}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.provider=findAutoCompProviderFromTpl(tpl,this)
const wedMgr=wedlet.wedMgr
const boxInput=this.boxInput
if(!boxInput||!this.provider)return
function onPopupClose(ev){const entry=ev.detail.returnValue
if(entry==null||!WEDLET.isWritableWedlet(wedlet))return
const exec=entry.autoCompExec
if(exec){if(wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(wedlet,null,exec.insertText)}else{wedMgr.docHolder.newBatch().spliceSequence(XA.append(wedlet.wedAnchor,exec.startReplace),exec.endReplace-exec.startReplace,exec.insertText).doBatch()}}else if(entry.customExec){entry.customExec(wedlet)}}boxInput.addEventListener("focusin",ev=>{const popupCreation=PopupAutoComplete.createFromInputEvent({input:boxInput,finder:this,autoSelOnShow:!boxInput.multiline},{reg:wedMgr.reg,cellBuilder:CELL_BUILDER})
popupCreation.then(popup=>{popup.addEventListener("c-beforeclose",onPopupClose)
boxInput.addEventListener("focusout",ev=>{popup.removeEventListener("c-beforeclose",onPopupClose)
if(!DEBUG_TOOLTIP)popup.close()},{once:true})})})
this.injectBtn=tpl.hasAttribute("inject-btn")
if(this.injectBtn){const btn=boxInput.shadowRoot.appendChild(JSX.createElement("span",{id:"replaceAll",style:"background: center center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/autoComplete.svg); width:.8em;"}))
btn.onpointerdown=function(ev){ev.stopImmediatePropagation()
ev.preventDefault()
const boxInput=DOMSH.findHost(this)
document.getSelection().empty()
boxInput.setCaretAt(0)
boxInput.focusableElement.focus()}}}async findAutoComplete(newSession=false,ev){const boxInput=this.boxInput
const fullText=boxInput.getXmlText()
const sel=boxInput.getSel()
try{const currentSearch=this._currentSearch=this.provider.findAutoComplete(this,fullText,sel[0],sel[1],newSession)
const entries=await currentSearch
if(currentSearch!==this._currentSearch)return null
this._currentSearch=null
if(!this.isConnected)return null
return entries}catch(e){return[]}}get autoCompleteAnchor(){if(!this.injectBtn&&this.boxInput.focusableElement.isContentEditable){const sel=this.boxInput.shadowRoot.getSelection()
if(sel.type==="None")return this.boxInput
const range=sel.getRangeAt(0)
return range.getBoundingClientRect()}return this.boxInput}refreshBindValue(val,children){}}window.customElements.define("box-autocomplete",BoxAutoComplete)
const CELL_BUILDER=new CellBuilderLabel("autoCompLabel").setDescriptionFunc(row=>row.getData("autoCompDetails"))
export function findAutoCompProviderFromTpl(tpl,widget){let provider=tpl.autoCompProvider
if(!provider){const svcCd=tpl.getAttribute("svc")
if(svcCd){const wedMgr=widget.wedlet.wedMgr
const dict=wedMgr.getDatasForModel(tpl)
provider=dict["acProv"]
if(provider==null){const svc=wedMgr.reg.getSvc(svcCd)
if(svc){provider=svc(tpl,wedMgr)}else{console.warn("BoxAutoComplete svc not found: "+svcCd)}dict["acProv"]=provider}return provider}if(!provider)provider=new WedAutoCompProvider(tpl)
tpl.autoCompProvider=provider}return provider}export class WedAutoCompProvider{constructor(rootEntries){if(rootEntries)this.buildMakersFromTpl(rootEntries)}buildMakersFromTpl(rootEntries){this.scopeMode=rootEntries.getAttribute("scopeMode")||"all"
this.matchMode=rootEntries.getAttribute("matchMode")||"start"
this.makers=[]
for(let ch=rootEntries.firstElementChild;ch;ch=ch.nextElementSibling){const text=ch.getAttribute("k")
if(text)this.makers.push(new WordAutoCompMk(text,ch.getAttribute("d")))}}async findAutoComplete(wigdet,text,startSel,endSel,newSession){const result=[]
const state=this.newState(text,startSel,endSel)
if(state){for(let mk of this.makers)mk.populateEntries(result,state,this)
if(this.scopeMode==="all"&&result.length===1&&startSel===text.length&&text===result[0].autoCompLabel)return[]}return result}newState(text,startSel,endSel){if(this.scopeMode==="all"){return{fullText:text,startSel:startSel,endSel:endSel,match:text.substring(0,startSel),startReplace:0,endReplace:text.length}}if(startSel!==endSel)return null
let start=startSel
while(start>0){if(!this.isWordChar(text.charCodeAt(--start))){start++
break}}if(start===startSel)return{fullText:text,startSel:startSel,endSel:endSel,match:"",startReplace:start,endReplace:start}
let end=startSel
while(end<text.length){if(!this.isWordChar(text.charCodeAt(end)))break
end++}return{fullText:text,startSel:startSel,endSel:endSel,match:text.substring(start,startSel),startReplace:start,endReplace:end}}isWordChar(c){return c>=48&&c<=57||c>=64&&c<=122||c>127&&c!==160}}export class WordAutoCompMk{constructor(label,desc){this.label=label
this.desc=desc}populateEntries(results,state,provider){if(this.isMatch(state,provider)){results.push({autoCompLabel:this.label,autoCompDetails:this.desc,autoCompExec:{insertText:this.buildInsertText(state,provider),startReplace:state.startReplace,endReplace:state.endReplace}})}}isMatch(state,provider){switch(provider.matchMode){case"start":return this.label.startsWith(state.match)
case"contains":return this.label.indexOf(state.match)>=0}return false}buildInsertText(state,provider){return this.label}}export class FullReplaceAutoCompMk extends WordAutoCompMk{populateEntries(results,state,provider){if(this.isMatch(state,provider)){results.push({autoCompLabel:this.label,autoCompDetails:this.desc,autoCompExec:{insertText:this.buildInsertText(state,provider),startReplace:0,endReplace:state.fullText.length}})}}}
//# sourceMappingURL=boxAutoComplete.js.map