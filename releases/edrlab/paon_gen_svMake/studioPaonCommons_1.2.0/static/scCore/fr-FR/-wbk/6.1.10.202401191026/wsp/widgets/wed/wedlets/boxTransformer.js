import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{removeAnnots}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{MsgLabel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
class BoxTransformer extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
const wedMgr=wedlet.wedMgr
const reg=wedMgr.reg
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
this.msgArea=sr.appendChild(JSX.createElement(MsgLabel,{label:"Chargement en cours..."}))
this.transform=tpl.getAttribute("transform")
if(tpl.hasAttribute("refreshLatencyInMs"))this.refreshLatencyInMs=Number.parseInt(tpl.getAttribute("refreshLatencyInMs"))
if(!tpl.hasAttribute("tag")||tpl.getAttribute("tag")=="img"){this.previewElt=sr.appendChild(JSX.createElement("img",{class:"previewElt"}))}else if(tpl.getAttribute("tag")=="iframe"){this.previewElt=sr.appendChild(JSX.createElement("iframe",{class:"previewElt"}))}else throw"Unknown tag "+tpl.getAttribute("tag")
this.previewElt.onload=()=>{this.msgArea.setCustomMsg(null)}
this.previewElt.onerror=()=>{this.msgArea.setCustomMsg("Non disponible","error")
DOM.setHidden(this.previewElt,true)}}refreshBindValue(val){if(this.refreshLatencyInMs){if(this._timerRefresh){window.clearTimeout(this._timerRefresh)
this._timerRefresh=0}this._timerRefresh=window.setTimeout(()=>{this._timerRefresh=0
this.executeTransformation(val)},this.refreshLatencyInMs)}else this.executeTransformation(val)}executeTransformation(val){const valStr=val
if(this.wedlet.isVirtual())removeAnnots(this)
const wsp=this.wedlet.wedMgr.reg.env.wsp
let transform=this.transform
if(transform)transform=transform.replace("{{0}}",encodeURIComponent(valStr))
let url=null
if(valStr){this.msgArea.setStandardMsg("loading")
const longDesc=this.wedlet.wedMgr.reg.env.longDesc
url=WSP.getStreamStampedUrl(wsp,this.wedlet.wedMgr.reg.env.itemType.getMainStreamSrcUri(longDesc),longDesc.srcDt,transform)
DOM.setHidden(this.previewElt,false)
this.previewElt.setAttribute("src",url)}else{DOM.setHidden(this.previewElt,true)}}}REG.reg.registerSkin("box-transformer",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tflex-direction: column;\n\t\talign-items: center;\n\t\tmargin: .5em;\n\t}\n\n\t.previewElt {\n\t\toverflow: visible;\n\t  /*width: 100%;\n\t  height: 100%;\n\t  max-width: fit-content;\n\t  max-height: fit-content;\n\t  object-fit: contain;\n\t  align-self: center;*/\n\t}\n\n`)
window.customElements.define("box-transformer",BoxTransformer)

//# sourceMappingURL=boxTransformer.js.map