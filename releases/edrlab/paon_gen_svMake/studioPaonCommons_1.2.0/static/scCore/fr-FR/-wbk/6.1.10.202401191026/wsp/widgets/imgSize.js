import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{EWspWorkingSt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
const STDCHARSIZE_TXTREF="Ceci est un texte de référence qui vous permet d\'adapter la taille de l\'image en fonction de la taille des caractères et d\'une largeur standard de paragraphe."
const LIMITCHARSIZE_TXTREF="Ceci est un texte de référence qui vous permet d\'adapter la taille de l\'image. Réglez le curseur d\'échelle ci-contre de telle sorte que l\'image demeure intelligible."
const TXTREF_HELP="Si votre image comporte des caractères (schéma, tableau, copie d\'écran...), réglez le curseur d\'échelle ci-contre pour que les caractères de l\'image de taille « normale » correspondent à la taille des caractères de ce texte. Si votre image ne contient pas de caractères (photo, illustration), réglez le curseur d\'échelle pour donner l\'importance qui convient à l\'image en rapport avec ce paragraphe et particulièrement avec sa largeur."
export class ImgSize extends BaseElement{constructor(){super(...arguments)
this._locked=false
this._savePropsReq=0
this._updateStdCharReq=0
this._updateLimitCharReq=0
this._history=[]
this._currentStateIdx=-1
this._isDirty=false
this._notifAnchor={posFrom:this,fromY:"bottom",targetY:"bottom",fromX:"middle",targetX:"middle"}}_initialize(init){this.reg=this.findReg(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("scroll/small",sr)
this._initAndInstallSkin(this.localName,init)
if(init.dimsTransform)this._dimsTransform=init.dimsTransform
else console.warn("No dimsTransform specified")
this._txtRefElem=JSX.createElement("div",{id:"txtRef"})
this._sizeBox=JSX.createElement("div",{id:"sizeBox"},JSX.createElement("slot",null))
this._writePerms=init.writePerms||"action.itemMainView#edit.content"
if(init.stdCharSize){this._stdCharSize={area:null,rangeInput:JSX.createElement("input",{type:"range",min:"1",max:"300",step:"any",orient:"vertical"}),percentInput:JSX.createElement("input",{type:"number",min:"1",max:"300",step:"any"}),valueInput:JSX.createElement("input",{type:"number"}),defaultValue:init.stdCharSize.defaultValue||10,value:NaN}
this._stdCharSize.rangeInput.oninput=this._stdCharSize.percentInput.oninput=ev=>{this._stdCharSize.value=parseFloat(ev.target.value)
this._onStdCharSizeUpdate(ev.currentTarget)
this._setDirty(true)
this._requestSaveProps()}
this._stdCharSize.valueInput.oninput=ev=>{this._stdCharSize.value=parseFloat(ev.target.value)*600/this._dims[0]
this._onStdCharSizeUpdate(ev.currentTarget)
this._setDirty(true)
this._requestSaveProps()}
this._stdCharSize.rangeInput.onchange=this._stdCharSize.percentInput.onchange=this._stdCharSize.valueInput.onchange=()=>{this._pushStateToHistory()}
this._stdCharSize.area=JSX.createElement("div",{class:"sizeArea",id:"stdCharSizeArea"},JSX.createElement("div",{class:"areaTitle"},"Taille de l\'image"),JSX.createElement("label",{title:"Taille de l\'image en pourcentage de sa taille d\'origine"},this._stdCharSize.percentInput,JSX.createElement("span",null,"%")),this._stdCharSize.rangeInput,JSX.createElement("label",{title:"Taille limite de l\'image en nombre de caractères"},this._stdCharSize.valueInput,JSX.createElement("span",null,"car.")))}if(init.limitCharSize){const defaultVal="defaultValue"in init.limitCharSize?1e3/init.limitCharSize.defaultValue:80
this._limitCharSize={area:null,rangeInput:JSX.createElement("input",{type:"range",min:"1",max:"100",step:"any",orient:"vertical"}),percentInput:JSX.createElement("input",{type:"number",min:"1",max:"100",step:"any"}),valueInput:JSX.createElement("input",{type:"number"}),defaultValue:defaultVal,value:defaultVal}
this._limitCharSize.rangeInput.oninput=this._limitCharSize.percentInput.oninput=ev=>{this._limitCharSize.value=parseFloat(ev.target.value)
this._onLimitCharSizeUpdate(this)
this._setDirty(true)
this._requestSaveProps()}
this._limitCharSize.valueInput.oninput=ev=>{const stdCharWidth=this._stdCharSize?this._dims[0]*this._stdCharSize.value/100:this._dims[0]
this._limitCharSize.value=parseFloat(ev.target.value)*600/stdCharWidth
this._onLimitCharSizeUpdate(this)
this._setDirty(true)
this._requestSaveProps()}
this._limitCharSize.rangeInput.onchange=this._limitCharSize.percentInput.onchange=this._limitCharSize.valueInput.onchange=()=>{this._pushStateToHistory()}
this._limitCharSize.area=JSX.createElement("div",{class:"sizeArea",id:"limitCharSizeArea"},JSX.createElement("div",{class:"areaTitle"},"Limite de lisibilité"),JSX.createElement("label",{title:"Taille limite de l\'image en pourcentage de sa taille d\'origine"},this._limitCharSize.percentInput,JSX.createElement("span",null,"%")),this._limitCharSize.rangeInput,JSX.createElement("label",{title:"Taille limite de l\'image en nombre de caractères"},this._limitCharSize.valueInput,JSX.createElement("span",null,"car.")))
if(init.stdCharSize){this._limitCharSize.area.addEventListener("focusin",()=>{this._txtRefElem.textContent=init.limitCharSize.textRef||LIMITCHARSIZE_TXTREF
this._onLimitCharSizeUpdate()})
this._limitCharSize.area.addEventListener("focusout",()=>{this._txtRefElem.textContent=init.stdCharSize.textRef||STDCHARSIZE_TXTREF
this._onStdCharSizeUpdate()})}}if(init.rotateForbidden){const defaultVal="defaultValue"in init.rotateForbidden?init.rotateForbidden.defaultValue:false
this._rotateForbid={area:null,input:JSX.createElement("input",{type:"checkbox",checked:!defaultVal?"":undefined}),defaultValue:defaultVal,value:defaultVal}
this._rotateForbid.input.oninput=ev=>{this._rotateForbid.value=!ev.target.checked
this._setDirty(true)
this._requestSaveProps()}
this._rotateForbid.input.onchange=()=>{this._pushStateToHistory()}
this._rotateForbid.area=JSX.createElement("div",{id:"rotateForbidArea"},JSX.createElement("span",{class:"areaTitle"},"Rotation autorisée"),JSX.createElement("div",{class:"checkValue"},this._rotateForbid.input))}if(this._stdCharSize||this._limitCharSize||this._rotateForbid){let sizeAreas=null
if(this._stdCharSize||this._limitCharSize){sizeAreas=JSX.createElement("div",{id:"sizeAreas"},this._stdCharSize&&this._stdCharSize.area,this._limitCharSize&&this._limitCharSize.area)}const saveAction=new Action("save").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/save.svg").setLabel("Enregistrer").setEnabled(ctx=>ctx._isDirty).setExecute(async ctx=>{await ctx._saveProps()})
const undoAction=new Action("undo").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/undo.svg").setLabel("Annuler").setExecute(async ctx=>{if(ctx._currentStateIdx>0){ctx._currentStateIdx--
ctx._restoreStateFromHistory()}else{POPUP.showNotifInfo("Aucune action à annuler",ctx,null,ctx._notifAnchor)}})
const redoAction=new Action("redo").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/redo.svg").setLabel("Refaire").setExecute(async ctx=>{if(ctx._currentStateIdx<ctx._history.length-1){ctx._currentStateIdx++
ctx._restoreStateFromHistory()}else{POPUP.showNotifInfo("Aucune action à refaire",ctx,null,ctx._notifAnchor)}})
this._toolbar=(new BarActions).initialize({actions:[saveAction,undoAction,redoAction],actionContext:this})
sr.appendChild(JSX.createElement("aside",null,this._toolbar,sizeAreas,this._rotateForbid&&this._rotateForbid.area))
const{env:env}=this.reg
this._propsWspRef=WSP.buildWspRef(env.wsp.code,SRC.addLeafToUri(env.longDesc.srcUri,"props.xml"))
this._setDirty(false)
env.place.eventsMgr.on("newWspWorkingState",(wspRef,wspCd,srcRef,st)=>{if(wspRef===this._propsWspRef){this._locked=st===EWspWorkingSt.w
this._refresh()}})
env.place.eventsMgr.on("wspUriChange",msg=>{if(SRC.srcRef(env.longDesc)===SRC.srcRef(msg))this._refresh()})}if(init&&(this._stdCharSize||this._limitCharSize)){this._rulerElem=JSX.createElement("div",{id:"sizeRuler"})
if(init.stdCharSize)this._txtRefElem.textContent=init.stdCharSize.textRef||STDCHARSIZE_TXTREF
else if(init.limitCharSize)this._txtRefElem.textContent=init.limitCharSize.textRef||LIMITCHARSIZE_TXTREF
POPUP.promiseTooltip(this._txtRefElem,()=>JSX.createElement("div",null,TXTREF_HELP),{skinOver:"wsp-imgsize/txtref-tooltip",anchor:{posFrom:this._txtRefElem,initWidth:"640px",fromY:"bottom",marginY:3}})
this._sizeRefElem=JSX.createElement("div",{id:"sizeRef"},this._rulerElem,this._txtRefElem)}sr.appendChild(JSX.createElement("div",{id:"mainArea"},JSX.createElement("div",{id:"scrollBox"},this._sizeBox,this._sizeRefElem)))}async _refresh(){await Promise.all([this._loadDims(),this._loadProps()])
if(this._dims)this._updateProps()
const readOnly=this._locked||!this.reg.hasPerm(this._writePerms)||!this._dimsTransform||!this._dims
if(this._stdCharSize){this._onStdCharSizeUpdate()
const{rangeInput:rangeInput,percentInput:percentInput,valueInput:valueInput}=this._stdCharSize
rangeInput.disabled=percentInput.disabled=valueInput.disabled=readOnly}if(this._limitCharSize){this._onLimitCharSizeUpdate()
const{rangeInput:rangeInput,percentInput:percentInput,valueInput:valueInput}=this._limitCharSize
rangeInput.disabled=percentInput.disabled=valueInput.disabled=readOnly}if(this._rotateForbid){this._rotateForbid.input.checked=!this._rotateForbid.value
this._rotateForbid.input.disabled=readOnly}}async _loadDims(){const{env:env}=this.reg
try{if(!this._dimsTransform)return
const dimsText=await WSP.fetchStreamText(env.wsp,this,env.itemType.getMainStreamSrcUri(env.longDesc),this._dimsTransform)
const dims=dimsText.split(";",3)
this._dims=[parseFloat(dims[0]),parseFloat(dims[1])]
if(this._dims[0]==-1||this._dims[1]==-1)throw"Invalid dimensions"
this._dpi=dims[2]?parseFloat(dims[2]):undefined}catch(e){this._dims=undefined
this._dpi=undefined
console.warn("Unable to retrieve the resource dimensions")}}async _loadProps(){const{env:env}=this.reg
try{const propsDoc=await ITEM.fetchDom(env.wsp,this,`${env.longDesc.srcUri}/props.xml`,true)
this._propsElt=propsDoc?propsDoc.documentElement:null}catch(_a){}}_updateProps(){var _a,_b,_c
if(this._stdCharSize){const stdCharSizeAttr=(_a=this._propsElt)===null||_a===void 0?void 0:_a.getAttribute("standardCharSize")
let invValue=NaN
if(stdCharSizeAttr)invValue=parseFloat(stdCharSizeAttr)
if(isNaN(invValue)){const{defaultValue:defaultValue}=this._stdCharSize
if(typeof defaultValue==="number")invValue=defaultValue
else invValue=defaultValue(this._dims[0],this._dpi)}this._stdCharSize.value=1e3/invValue}if(this._limitCharSize){this._limitCharSize.value=this._limitCharSize.defaultValue
const limitCharSizeAttr=(_b=this._propsElt)===null||_b===void 0?void 0:_b.getAttribute("limitCharSize")
if(limitCharSizeAttr){const limitCharSize=parseFloat(limitCharSizeAttr)
if(!isNaN(limitCharSize)){const stdCharSize=this._stdCharSize?this._stdCharSize.value:100
this._limitCharSize.value=1e3/stdCharSize*100/limitCharSize}}}if(this._rotateForbid){if((_c=this._propsElt)===null||_c===void 0?void 0:_c.hasAttribute("rotateForbidden")){this._rotateForbid.value=this._propsElt.getAttribute("rotateForbidden")==="true"}else{this._rotateForbid.value=this._rotateForbid.defaultValue}}this._pushStateToHistory()}_pushStateToHistory(){const currentState={stdCharSize:this._stdCharSize?this._stdCharSize.value:undefined,limitCharSize:this._limitCharSize?this._limitCharSize.value:undefined,rotateForbid:this._rotateForbid?this._rotateForbid.value:undefined}
const lastState=this._history[this._currentStateIdx]
if(!lastState||JSON.stringify(lastState)!=JSON.stringify(currentState)){this._history.push(currentState)
this._currentStateIdx=this._history.length-1}}_restoreStateFromHistory(){const currentState=this._history[this._currentStateIdx]
if(this._stdCharSize){this._stdCharSize.value=currentState.stdCharSize
this._onStdCharSizeUpdate()}if(this._limitCharSize){this._limitCharSize.value=currentState.limitCharSize
this._onLimitCharSizeUpdate()}if(this._rotateForbid){this._rotateForbid.value=currentState.rotateForbid
this._rotateForbid.input.checked=!this._rotateForbid.value}this._setDirty(true,true)
this._requestSaveProps()}_requestSaveProps(){if(this._savePropsReq)clearTimeout(this._savePropsReq)
this._savePropsReq=setTimeout(()=>{this._saveProps()},2e3)}async _saveProps(){clearTimeout(this._savePropsReq)
const{env:env}=this.reg
const propsDoc=DOM.newDomDoc()
const propsElt=propsDoc.appendChild(document.createElement("imgProps"))
const stdCharSize=this._stdCharSize?this._stdCharSize.value:100
if(this._stdCharSize)propsElt.setAttribute("standardCharSize",(1e3/stdCharSize).toString())
if(this._limitCharSize)propsElt.setAttribute("limitCharSize",(1e3/stdCharSize*100/this._limitCharSize.value).toString())
if(this._rotateForbid)propsElt.setAttribute("rotateForbidden",this._rotateForbid.value.toString())
await ITEM.update(env.wsp,this,`${env.longDesc.srcUri}/props.xml`,DOM.ser(propsDoc))
this._setDirty(false)}_onStdCharSizeUpdate(from){if(!this._dims||this._updateStdCharReq)return
this._updateStdCharReq=requestAnimationFrame(()=>{this._updateStdCharReq=0
const{value:value,rangeInput:rangeInput,percentInput:percentInput,valueInput:valueInput}=this._stdCharSize
const stdCharDims=this._dims.map(dim=>dim*value/100)
if(!this._limitCharSize||!this._limitCharSize.area.matches(":focus-within"))this._updateImgDims(stdCharDims)
const fixedValue=value.toFixed(1).toString()
if(rangeInput!=from)rangeInput.value=fixedValue
if(percentInput!=from)percentInput.value=fixedValue
if(valueInput!=from)valueInput.value=(stdCharDims[0]/6).toFixed(1).toString()})}_onLimitCharSizeUpdate(from){if(!this._dims||this._updateLimitCharReq)return
this._updateLimitCharReq=requestAnimationFrame(()=>{this._updateLimitCharReq=0
const{value:value,rangeInput:rangeInput,percentInput:percentInput,valueInput:valueInput}=this._limitCharSize
const stdCharDims=this._stdCharSize?this._dims.map(dim=>dim*this._stdCharSize.value/100):this._dims
const limitCharDims=stdCharDims.map(dim=>dim*value/100)
if(this._limitCharSize.area.matches(":focus-within"))this._updateImgDims(limitCharDims)
const fixedValue=value.toFixed(1).toString()
if(rangeInput!=from)rangeInput.value=fixedValue
if(percentInput!=from)percentInput.value=fixedValue
if(valueInput!=from)valueInput.value=(limitCharDims[0]/6).toFixed(1).toString()})}_setDirty(dirty,fromHistory=false){this._isDirty=dirty
this.reg.env.place.setState(this._propsWspRef,dirty?EWspWorkingSt.w:EWspWorkingSt.r)
this._toolbar.refreshContent()
if(dirty&&!fromHistory){this._history.length=this._currentStateIdx+1}}_updateImgDims(dims){this._sizeBox.style.width=dims[0]+"px"
this._sizeBox.style.height=dims[1]+"px"
this._rulerElem.style.width=dims[0]+"px"}}customElements.define("wsp-imgsize",ImgSize)
REG.reg.registerSkin("wsp-imgsize",1,`\n\t:host {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n  }\n\n  aside {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n\t  flex-direction: column;\n\t  margin-inline-end: 0.5em;\n\t  overflow-y: auto;\n  }\n\n  #sizeAreas {\n\t  display: flex;\n\t  min-height: auto;\n\t  min-width: 0;\n\t  flex: 1;\n  }\n\n  .sizeArea {\n\t\tdisplay: flex;\n\t\tmin-height: auto;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tflex: 1;\n\t\talign-items: center;\n\t\tmargin: 0.2em 0.3em;\n\t\twidth: 6.1em;\n\t}\n\n\t#rotateForbidArea {\n\t\tdisplay: flex;\n\t\tmin-height: auto;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\talign-items: center;\n\t\tmargin: 0.2em;\n\t}\n\n\t.areaTitle {\n\t\tcolor: var(--alt1-color);\n\t\ttext-align: center;\n\t\tfont-weight: bold;\n\t\tmargin: 0.2em 0;\n\t}\n\n\tlabel {\n\t\tdisplay: block;\n\t}\n\n\tlabel > span {\n\t\tmargin-inline-start: 0.1em;\n\t}\n\n\tinput[type=range] {\n\t\tmargin: 0;\n\t\t-webkit-appearance: slider-vertical;\n\t\tflex: 1;\n\t\twidth: 3em;\n\t\tmin-height: 8em;\n\t}\n\n\tinput[type=number] {\n\t\twidth: 4em;\n\t\ttext-align: center;\n\t\tmargin: 0.2em 0;\n\t}\n\n\t.numberValue {\n\t\tcolor: var(--alt2-color);\n\t}\n\n\t.checkValue {\n\t\tpadding: 2px;\n\t\tmargin: 2px;\n\t}\n\n\tinput[type=checkbox] {\n\t\tdisplay: block;\n\t\tmargin: 0;\n\t}\n\n\t#mainArea {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tflex-direction: column;\n\t}\n\n\t#scrollBox {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\toverflow: auto;\n\t\tflex: 1;\n\t}\n\n\t#sizeBox {\n\t\tdisplay: block;\n\t\tmargin: auto;\n\t\tflex: 0 0 auto;\n\t}\n\n\t::slotted(*) {\n\t\tdisplay: block;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tobject-fit: contain;\n\t}\n\n\t#sizeRuler {\n\t\tmargin: 0.5em auto;\n\t\tbackground-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/wsp/widgets/imgSize/ruler.png);\n\t\tbackground-repeat: repeat-x;\n\t\theight: 10px;\n\t}\n\n\t#sizeRef {\n\t  position: sticky;\n\t  bottom: 0;\n  }\n\n\n  #txtRef {\n\t  width: 640px;\n\t  box-sizing: border-box;\n\t  margin: 0.5em auto;\n\t  border-color: var(--border-color);\n\t  border-inline-start: dotted 1px;\n\t  border-inline-end: dotted 1px;\n\t  padding: 3px;\n\t  font-size: 10pt;\n\t  background-color: #FFFFFFBB;\n\t  color: #000c18;\n\t  cursor: help;\n  }\n`)
REG.reg.registerSkin("wsp-imgsize/txtref-tooltip",1,`\n\t::slotted(div) {\n\t\tpadding: 0.5em;\n\t}\n`)

//# sourceMappingURL=imgSize.js.map