import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
export function isSkStructDef(s){return s&&typeof s.structType==="number"}export var EFuzzyType;(function(EFuzzyType){EFuzzyType[EFuzzyType["elements"]=41]="elements"
EFuzzyType[EFuzzyType["attributes"]=42]="attributes"})(EFuzzyType||(EFuzzyType={}))
export var EDirectiveType;(function(EDirectiveType){EDirectiveType[EDirectiveType["choice"]=51]="choice"
EDirectiveType[EDirectiveType["group"]=52]="group"
EDirectiveType[EDirectiveType["unorderedGroup"]=53]="unorderedGroup"
EDirectiveType[EDirectiveType["empty"]=54]="empty"})(EDirectiveType||(EDirectiveType={}))
export function isSkTextAnnot(sk){return sk&&typeof sk.offsetStart==="number"}export class EAnnotLevel{constructor(name,weight){this.name=name
this.weight=weight}max(other){return other&&other.weight>this.weight?other:this}}EAnnotLevel.search=new EAnnotLevel("search",7)
EAnnotLevel.diffadd=new EAnnotLevel("diffadd",6)
EAnnotLevel.diffrem=new EAnnotLevel("diffrem",5)
EAnnotLevel.diff=new EAnnotLevel("diff",4)
EAnnotLevel.error=new EAnnotLevel("error",3)
EAnnotLevel.warning=new EAnnotLevel("warning",2)
EAnnotLevel.info=new EAnnotLevel("info",1)
EAnnotLevel.diffaddHidden=new EAnnotLevel("diffadd",-1)
EAnnotLevel.diffremHidden=new EAnnotLevel("diffrem",-1)
EAnnotLevel.diffHidden=new EAnnotLevel("diff",-1)
export function isSkAnnotMissing(a){return a&&"structDef"in a}export function isSkAnnotDrawer(sk){return sk&&typeof sk.drawAnnot==="function"}export function isSkAnnotFocuser(focuser){return focuser&&"focusSkAnnot"in focuser}export class SkAnnotBase{get start(){return XA.from(this.anchorNode)}get len(){return 1}get level(){return EAnnotLevel.error}}export class SkAnnotElt extends SkAnnotBase{equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type}toJSON(){return{type:this.type,anchor:this.start}}}export class SkAnnotEltUnknown extends SkAnnotElt{get type(){return SkAnnotEltUnknown.TYPE}init(anchorNode,def){this.anchorNode=anchorNode
this.structDef=def
return this}getLabel(){const label=this.structDef?this.structDef.structLabel||this.structDef.structName||this.anchorNode.nodeName:this.anchorNode.nodeName
return`Élément \"${label}\" inconnu`}}SkAnnotEltUnknown.TYPE="eltUnknown"
export class SkAnnotEltFree extends SkAnnotElt{get level(){return this._level}get type(){return SkAnnotEltFree.TYPE}init(anchorNode,label,level){this.anchorNode=anchorNode
this.label=label
this._level=level||EAnnotLevel.error
return this}getLabel(){return this.label}equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type&&this.label===other.label}}SkAnnotEltFree.TYPE="elt"
export class SkAnnotStr extends SkAnnotBase{equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type}toJSON(){return{type:this.type,anchor:this.start}}}export class SkAnnotTextForbidden extends SkAnnotStr{constructor(){super(...arguments)
this.type=SkAnnotTextForbidden.TYPE}init(textNode){this.anchorNode=textNode
return this}getLabel(){return"Texte interdit"}}SkAnnotTextForbidden.TYPE="textForbidden"
export class SkAnnotWrongValue extends SkAnnotStr{constructor(){super(...arguments)
this.type=SkAnnotWrongValue.TYPE}get level(){return this._level}init(container,label,level){this.anchorNode=container
this.label=label
this._level=level||EAnnotLevel.error
return this}getLabel(){return this.label}equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type&&this.label===other.label}toJSON(){return{type:this.type,anchor:this.start,label:this.label}}}SkAnnotWrongValue.TYPE="wrongVal"
export class SkAnnotAttr extends SkAnnotBase{equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type}toJSON(){return{type:this.type,anchor:this.start}}}export class SkAnnotAttrUnknown extends SkAnnotAttr{get type(){return SkAnnotAttrUnknown.TYPE}init(anchorNode,def){this.anchorNode=anchorNode
this.structDef=def
return this}getLabel(){const label=this.structDef?this.structDef.structLabel||this.structDef.structName:null
return`Attribut \'${label||this.anchorNode.nodeName}\' inconnu`}}SkAnnotAttrUnknown.TYPE="attUnknown"
export class SkAnnotAttrMissing extends SkAnnotAttr{get type(){return SkAnnotAttrMissing.TYPE}init(anchorNode,def){this.anchorNode=anchorNode
this.structDef=def
this.attName=this.structDef.structName
return this}get start(){return XA.append(XA.fromNode(this.anchorNode),this.attName)}get anchor(){return XA.from(this.anchorNode)}get len(){return 0}getLabel(){const label=this.structDef.structLabel||this.structDef.structName
return`Attribut manquant : ${label}`}equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type&&this.attName===other.attName}toJSON(){return{type:this.type,anchor:this.anchor,name:this.attName}}}SkAnnotAttrMissing.TYPE="attrMissing"
export class SkAnnotMissing extends SkAnnotBase{init(type,anchorNode,offset,def,customLabel){this.type=type
this.anchorNode=anchorNode
this.offset=offset
this.structDef=def
this.customLabel=customLabel
return this}get anchor(){return XA.from(this.anchorNode)}get start(){return XA.append(XA.from(this.anchorNode),this.offset)}get len(){return 0}getLabel(){return this.customLabel||this.structDef.structLabel?`Contenu manquant: ${this.structDef.structLabel}`:`Contenu manquant`}equals(other){return this.anchorNode===other.anchorNode&&this.type===other.type&&this.offset===other.offset&&this.structDef.structName===other.structDef.structName}toJSON(){return{type:this.type,anchor:this.anchor,offset:this.offset,name:this.structDef.structName}}}SkAnnotMissing.TYPE_eltMissing="eltMissing"
SkAnnotMissing.TYPE_choiceMissing="choiceMissing"
SkAnnotMissing.TYPE_groupMissing="groupMissing"
SkAnnotMissing.TYPE_ugroupMissing="ugroupMissing"

//# sourceMappingURL=schemaAnnots.js.map