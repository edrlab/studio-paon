import{BoxModel,BoxWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{WED,WedletModelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{InfoBrokerBasic}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/infos.js"
import{IS_EltWedlet,isParentWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{OffscreenEltLeafWedlet,OffscreenEltWedlet,OffscreenModel,OffscreenStrWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/offscreen/offscreen.js"
import{REMOTE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/remote.js"
var SCCORE_NS=DOM.SCCORE_NS
class BoxSpTeRootModel extends BoxModel{initModel(cnf){super.initModel(cnf)
this.wedletClass=BoxSpTeRootWedlet}}WED.registerWedletModel("BoxSpTeRoot",BoxSpTeRootModel)
class SpTeSourceModel extends WedletModelBase{createWedlet(parent){return new SpTeSourceUrlWedlet(this,parent)}}WED.registerWedletModel("SpTeSourceUrl",SpTeSourceModel)
class SpTeSegmentModel extends OffscreenModel{createWedlet(parent){return new SpTeSegmentWedlet(this,parent)}}WED.registerWedletModel("SpTeSegment",SpTeSegmentModel)
export class SpTeSpatialModel extends WedletModelBase{createWedlet(parent){return new SpTeSpatialWedlet(this,parent)}}WED.registerWedletModel("SpTeSpatial",SpTeSpatialModel)
export class SpTeTemporalModel extends WedletModelBase{createWedlet(parent){return new SpTeTemporalWedlet(this,parent)}}WED.registerWedletModel("SpTeTemporal",SpTeTemporalModel)
export class BoxSpTeRootWedlet extends BoxWedlet{constructor(){super(...arguments)
this.spteInfoBroker=new InfoBrokerBasic}visitWedletForks(visitor,options){if(this.spteSource&&visitor(this.spteSource.forkedWedlet)==="stop")return"stop"
if(this.spteViews)for(const v of this.spteViews)if(visitor(v.forkedWedlet)==="stop")return"stop"}setSpTeSource(spteSource){this.spteSource=spteSource}addSpTeView(spteView){if(!this.spteViews)this.spteViews=[]
this.spteViews.push(spteView)}createElement(root){super.createElement(root)
this.element.addEventListener("focusin",this.onFocusin)
this.spteInfoBroker.addConsumer(this)}onFocusin(ev){if(ev.target!==this){const eltWedlet=DOM.findParentOrSelf(ev.target,this,IS_EltWedlet)
if(eltWedlet)this.wedlet.spteInfoBroker.dispatchInfo(new InfoSpTeFocus(eltWedlet.wedlet.wedAnchor),this.wedlet)}}onInfo(info){if(info instanceof InfoSpTeFocus){const boxSelMgr=this.wedMgr.wedEditor.boxSelMgr
boxSelMgr.markWedlet(boxSelMgr.findAroundXAddr(info.focusXa),info.ensureVisible)}}}export class SpTeSourceUrlWedlet extends OffscreenStrWedlet{setText(txt){super.setText(txt)
this.initUrl(txt)}initUrl(txt){SPTE.findSpTeForkedWedlet(this).spTeViews[0].wedlet.spteSource.setUrl(REMOTE.urlRemoteContent(txt,this.wedMgr.reg)||txt)}}export class SpTeSegmentWedlet extends OffscreenEltWedlet{getSpatial(){let sp=null
const visitor=w=>{if(w instanceof SpTeSpatialWedlet){sp=w
return"stop"}else if(isParentWedlet(w)){if(w.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)==="stop")return"stop"}}
this.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)
return sp}getTemporal(){let te=null
const visitor=w=>{if(w instanceof SpTeTemporalWedlet){te=w
return"stop"}else if(isParentWedlet(w)){if(w.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)==="stop")return"stop"}}
this.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,visitor)
return te}getTitle(){return null}bindWithNode(xaOffset,node,children){const res=super.bindWithNode(xaOffset,node,children)
if(res)return res.then(()=>{this._redrawSpTeViews()})
this._redrawSpTeViews()}onDelete(){super.onDelete()
this._redrawSpTeViews()}_redrawSpTeViews(){for(const v of SPTE.findSpTeForkedWedlet(this).spTeViews)v.redrawSpTeView()}getParentSegmentWedlet(){let parentW=this.wedParent
while(parentW){if(parentW instanceof SpTeSegmentWedlet)return parentW
parentW=parentW.wedParent}return null}}export class SpTeSpatialWedlet extends OffscreenEltLeafWedlet{get shapeTag(){return this.model.config.getAttribute("shapeTag")||"sc:shape"}get coordsTag(){return this.model.config.getAttribute("coordsTag")||"sc:coords"}getShape(){if(!this.content)return null
const elt=this.content.querySelector("shape")
if(!elt)return null
return elt.textContent}getCoords(){if(!this.content)return null
const elt=this.content.querySelector("coords")
if(!elt)return null
return elt.textContent}updateSpatial(batch,coords,shape){if(!this.content)return
const xaRoot=XA.freeze(this.wedAnchor)
let rootAppend
if(shape){const shapeElt=this.content.querySelector("shape")
if(shapeElt){const xa=XA.append(xaRoot,DOM.computeOffset(shapeElt),0)
if(shapeElt.hasChildNodes())batch.deleteSequence(xa,shapeElt.childNodes.length)
batch.insertJml(xa,[shape])}else{rootAppend=[{"":this.shapeTag},[shape]]}}const coordsElt=this.content.querySelector("coords")
if(coordsElt){const xa=XA.append(xaRoot,DOM.computeOffset(coordsElt),0)
if(coordsElt.hasChildNodes())batch.deleteSequence(xa,coordsElt.childNodes.length)
batch.insertJml(xa,[coords])}else{if(!rootAppend)rootAppend=[]
rootAppend.push({"":this.coordsTag},[coords])}if(rootAppend)batch.insertJml(xaRoot,rootAppend)
return batch}setContent(content){this.content=content
for(const v of SPTE.findSpTeForkedWedlet(this).spTeViews)v.redrawSpTeView()}}export class SpTeTemporalWedlet extends OffscreenEltLeafWedlet{getStart(){if(!this.content)return null
const startElt=this.content.getElementsByTagNameNS(SCCORE_NS,"start").item(0)
return startElt.textContent}getEnd(){if(!this.content)return null
const endElt=this.content.getElementsByTagNameNS(SCCORE_NS,"end").item(0)
return endElt.textContent}getLevel(){const level=this.model.config.getAttribute("level")
return level!=null?parseInt(level):0}getHandleable(){const handleable=this.model.config.getAttribute("handleable")
return handleable?handleable:"always"}updateTemporal(batch,start,end){if(!this.content)return
const xaRoot=XA.freeze(this.wedAnchor)
let rootAppend
const startElt=this.content.getElementsByTagNameNS(SCCORE_NS,"start").item(0)
if(startElt){const xa=XA.append(xaRoot,DOM.computeOffset(startElt),0)
if(startElt.hasChildNodes())batch.deleteSequence(xa,startElt.childNodes.length)
batch.insertJml(xa,[start])}else rootAppend=[{"":"sc:start"},[start]]
const endElt=this.content.getElementsByTagNameNS(SCCORE_NS,"end").item(0)
if(endElt){const xa=XA.append(xaRoot,DOM.computeOffset(endElt),0)
if(endElt.hasChildNodes())batch.deleteSequence(xa,endElt.childNodes.length)
batch.insertJml(xa,[end])}else{if(!rootAppend)rootAppend=[]
rootAppend.push([{"":"sc:end"},[end]])}if(rootAppend)batch.insertJml(xaRoot,rootAppend)
return batch}setContent(content){this.content=content
for(const v of SPTE.findSpTeForkedWedlet(this).spTeViews)v.redrawSpTeView()}}export class InfoSpTeFocus{constructor(focusXa,ensureVisible=false){this.focusXa=focusXa
this.ensureVisible=ensureVisible}}export var SPTE;(function(SPTE){function findSpTeForkedWedlet(from){while(from){if("spTeViews"in from)return from
from=from.wedParent}return null}SPTE.findSpTeForkedWedlet=findSpTeForkedWedlet
function findSpTeSegmentWedlet(from){while(from){if(from instanceof SpTeSegmentWedlet)return from
from=from.wedParent}return null}SPTE.findSpTeSegmentWedlet=findSpTeSegmentWedlet})(SPTE||(SPTE={}))

//# sourceMappingURL=spte.js.map