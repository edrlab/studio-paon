import{findWedEditor,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{isWedletSingleElt,OffView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{EAnnotLevel,SkAnnotAttrUnknown,SkAnnotEltUnknown,SkAnnotTextForbidden}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{BoxHiddenWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
export function AgBoxErrBarEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){if(config.hideErrBar){superInit.call(this,config)}else{superInit.call(this,config)
this.errBar=(new BoxErrBar).init(this,config)
this.barLayout.showBar(this.errBar)}return this}
return cls}export class BoxErrBar extends HTMLElement{constructor(){super()
this.id="errorBar"}init(wedEditor,config){this.wedEditor=wedEditor
if(!config.hideUnknownBar)this.unknownBarShown=null
const style=this.style
style.width=".8em"
style.display="flex"
style.flexDirection="column"
this.container=this.appendChild(JSX.createElement("div",null))
const ctnStyle=this.container.style
ctnStyle.flexShrink="1"
ctnStyle.position="relative"
this.clear()
wedEditor.wedMgr.listeners.on("asyncSkAnnots",onSkAnnots)
this.wedEditor.rootNode.addEventListener("wed-resized",()=>{const wedMgr=this.wedEditor.wedMgr
Promise.resolve().then(()=>{onSkAnnots(wedMgr,wedMgr.lastSkAnnots)})})
return this}clear(){this.container.textContent=null}buildUnknownBar(){this.unknownBarShown=JSX.createElement("div",{id:"unknownBar"},JSX.createElement(ShadowJsx,{skin:"box-errbar/unknownBar",reg:this.wedEditor.wedMgr.reg},JSX.createElement("span",null,"Des éléments inconnus sont présents..."),JSX.createElement("c-button",{label:"Supprimer",onclick:this.delUnknowns,title:"Supprime tous les éléments inconnus.","ui-context":"dialog"})))}delUnknowns(){const editor=findWedEditor(this)
const wedMgr=editor.wedMgr
if(wedMgr.readOnly){POPUP.showNotifForbidden("Modification interdite",this)
return}const batch=wedMgr.docHolder.newBatch()
const annots=wedMgr.docHolder.getAnnots(wedMgr.rootWedlet.wedAnchor)
for(const annot of annots){if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotTextForbidden.TYPE){batch.deleteSequence(annot.start,1).needAdjustForNextAdds()}else if(annot.type===SkAnnotAttrUnknown.TYPE){batch.setAttr(annot.start,null).needAdjustForNextAdds()}}batch.doBatch()}}REG.reg.registerSkin("box-errbar/unknownBar",1,`\n\t:host {\n\t\tcolor: var(--error-color);\n\t\ttext-align: center;\n\t}\n\n\tc-button {\n\t\tdisplay: inline-flex;\n\t}\n`)
window.customElements.define("box-errbar",BoxErrBar)
function onSkAnnots(wedMgr,annots,deadline){if((deadline===null||deadline===void 0?void 0:deadline.timeRemaining())<5)return onSkAnnots
const errBar=wedMgr.wedEditor.errBar
const docHolder=wedMgr.docHolder
if(!docHolder||!docHolder.isAvailable)return
const rootWedlet=wedMgr.rootWedlet
let rootTop
let rootHeight
let totalPercent
if(isWedletSingleElt(rootWedlet)){const rootRect=rootWedlet.element.getBoundingClientRect()
rootTop=rootRect.top
rootHeight=rootWedlet.element.scrollHeight
totalPercent=rootHeight/100}else{errBar.clear()
return}const map=new Map
const marks=[]
let countUnknown=0
for(let i=0;i<annots.length;i++){const annot=annots[i]
if(annot.level.weight<0||annot.result===null)continue
let wedlet
if("anchor"in annot){let start=annot.start
wedlet=WEDLET.findWedlet(rootWedlet,start)
if(!wedlet&&annot.offset>0){start=XA.incrAtDepth(start,-1,-1)
wedlet=WEDLET.findWedlet(rootWedlet,start)
if(isWedletSingleElt(wedlet)){const rect=GFX.getContextBoundingRect(wedlet.element)
if(rect)marks.push((new ErrBarMark).init([annot],Math.trunc((rect.top+rect.height-rootTop)/totalPercent)))
continue}}if(!wedlet)wedlet=WEDLET.findWedlet(rootWedlet,XA.up(start),WEDLET.FINDOPTIONS_lastAncestorIfNone)}else{wedlet=WEDLET.findWedlet(rootWedlet,annot.anchor||annot.start,WEDLET.FINDOPTIONS_lastAncestorIfNone)}if(wedlet instanceof BoxHiddenWedlet)continue
while(wedlet&&!isWedletSingleElt(wedlet))wedlet=wedlet.wedParent
if(!wedlet)continue
const prevAnnot=map.get(wedlet)
if(!prevAnnot){map.set(wedlet,[annot])}else{prevAnnot.push(annot)}if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotAttrUnknown.TYPE||annot.type===SkAnnotTextForbidden.TYPE){countUnknown++}}let prevTopPercent=-1
let prevMark
map.forEach((annots,wedlet)=>{const rect=GFX.getContextBoundingRect(wedlet.element)
if(!rect)return
const topPercent=Math.trunc((rect.top-rootTop)/totalPercent)
if(annots.length>1&&wedlet.element instanceof OffView){const ctn=(new ErrBarCtn).init(topPercent,Math.trunc(rect.height/totalPercent))
for(let i=0;i<annots.length;i++){const annot=annots[i]
if(!annot||annot.result===null)continue
const grp=[annot]
for(let k=i+1;k<annots.length;k++){const other=annots[k]
if(other&&other.anchorNode===annot.anchorNode){grp.push(other)
annots[k]=null}}ctn.appendChild((new ErrBarMark).init(grp))}marks.push(ctn)}else{if(prevTopPercent===topPercent){prevMark.addAnnots(annots)}else{prevTopPercent=topPercent
prevMark=(new ErrBarMark).init(annots,topPercent)
marks.push(prevMark)}}})
errBar.clear()
errBar.container.style.height=rootHeight+"px"
for(let i=0;i<marks.length;i++){errBar.container.appendChild(marks[i])}if("unknownBarShown"in errBar){if(countUnknown>0){if(!errBar.unknownBarShown){errBar.buildUnknownBar()
errBar.wedEditor.barLayout.showBar(errBar.unknownBarShown)}}else{if(errBar.unknownBarShown){errBar.wedEditor.barLayout.removeBar(errBar.unknownBarShown)
errBar.unknownBarShown=null}}}}class ErrBarMark extends HTMLElement{init(annots,topPercent){this.annots=annots
if(topPercent!=null){this.topPercent=topPercent
this.style.position="absolute"
this.style.top=topPercent+"%"}this.style.height="3px"
this.style.left="0"
this.style.right="0"
this.style.cursor="pointer"
this.addEventListener("click",this._onClick)
this.computeAnnots(annots)
this.redraw()
return this}addAnnots(annots){this.annots.push(...annots)
this.computeAnnots(annots)
this.redraw()}computeAnnots(annots){let callRedraw
for(const a of annots){if(a.future)a.future.then(callRedraw||(callRedraw=this.redraw.bind(this)))}}redraw(){var _a
let level=EAnnotLevel.info
let ti
let count=0
let countMore=0
const maxLabels=5
this.annots.sort((a1,a2)=>!a1&&!a2?a1?-1:a2?1:0:a2.level.weight-a1.level.weight)
for(let i=0;i<this.annots.length;i++){const a=this.annots[i]
if(a&&a.result!==null){level=level.max(a.level)
if(++count<maxLabels){if(ti)ti+="\n"+a.getLabel()
else ti=a.getLabel()}else{countMore++}}}if(count===0){if(((_a=this.parentNode)===null||_a===void 0?void 0:_a.parentNode)&&this.parentNode.localName==="errbar-ctn"&&!this.nextSibling&&!this.previousSibling){this.parentElement.remove()}else{this.remove()}}else{if(countMore>0)ti+=`\n(et ${countMore} autres)`
this.style.backgroundColor=levelColors[level.weight]
this.setAttribute("title",ti)}}async _onClick(ev){const annot=this.annots.find(a=>a&&!a.future&&!a.result!==null)||this.annots.find(a=>a!=null)
WEDLET.focusAnnot(findWedEditor(this).wedMgr,annot)}}const levelColors=["white","var(--fade-color)","var(--warning-color)","var(--error-color)","var(--edit-diff-color)","var(--edit-diffrem-color)","var(--edit-diffadd-color)","var(--edit-search-bgcolor)"]
window.customElements.define("errbar-mark",ErrBarMark)
class ErrBarCtn extends HTMLElement{init(topPercent,heightPercent){this.topPercent=topPercent
this.heightPercent=heightPercent
this.style.position="absolute"
this.style.top=topPercent+"%"
this.style.height=heightPercent>0?heightPercent+"%":"3px"
this.style.left="0"
this.style.right="0"
this.style.display="flex"
this.style.flexDirection="column"
this.style.justifyContent="space-around"
return this}}window.customElements.define("errbar-ctn",ErrBarCtn)

//# sourceMappingURL=boxErrBar.js.map