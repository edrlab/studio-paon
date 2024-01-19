import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{WEDLET,WedletFork}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
class AdjustLangTypeWedlet extends WedletFork{constructor(widget,eltWedlet){super(eltWedlet)
this.widget=widget
this.futureTask=0
if(!eltWedlet.isVirtual()){widget.setLangTypeDef(this.getMimeType())}}getMimeType(){const attr=XA.findDomLast(XA.append(this.mainWedlet.wedAnchor,"mimeType"),this.mainWedlet.wedMgr.docHolder.getDocument())
return attr instanceof Attr?attr.value:null}updateInDescendants(msg){if(XA.last(msg.xa)==="mimeType"||msg.xa[msg.xa.length-2]==="mimeType"){this.planSetLangTypeDef()}}planSetLangTypeDef(){if(this.futureTask===0){this.futureTask=window.requestIdleCallback(deadline=>{this.futureTask=0
this.widget.setLangTypeDef(this.getMimeType())})}}onAddedSkAnnot(annot,xaTarget){var _a
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){const v=annot.otherValue
if(v)this.widget.setDiffLangTypeDef(v)}}onRemovedSkAnnot(annot,xaTarget){var _a
if(((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot))&&annot.diffSession===this.wedMgr.docHolder.getDiffSession()){this.widget.setDiffLangTypeDef(null)}}}export function jslibAsyncInit(jsEndPoint,elt,wedReg){wedReg.registerSvc("codePrim.currentLangFinder",1,(function currentLang(widget,tpl){new AdjustLangTypeWedlet(widget,widget.wedlet.wedParent)}))}
//# sourceMappingURL=codePrim.js.map