import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class ConverterLib{constructor(){this._dict=new Map}registerConverterFromXml(key,factory){this._dict.set(key,factory)}getConverterFromXml(key,elt){const factory=this._dict.get(key)
return factory?factory(elt):null}}export const CONVERTERLIB=new ConverterLib
export class ConverterProv{addSwitch(...tagNames){if(!this.switchTagRoots)this.switchTagRoots=[]
this.switchTagRoots.push(new Set(tagNames))
return this}addCustomSwitch(cnv,...tagNames){if(!this.customSwitch)this.customSwitch=[]
this.customSwitch.push({cnv:cnv,tags:new Set(tagNames)})
return this}addConverter(srcNodeName,dstStructName,cnv){if(!this.converters)this.converters=new Map
let dstMap=this.converters.get(srcNodeName)
if(!dstMap){dstMap=new Map
this.converters.set(srcNodeName,dstMap)}dstMap.set(dstStructName,cnv)
return this}addConverters(srcNodeNames,dstStructNames,cnv){if(!this.converters)this.converters=new Map
for(const srcName of srcNodeNames){let dstMap=this.converters.get(srcName)
if(!dstMap){dstMap=new Map
this.converters.set(srcName,dstMap)}for(const dstName of dstStructNames)dstMap.set(dstName,cnv)}return this}findConverter(src){const name=CONVERT.getNameRoot(src)
if(this.converters){const targets=this.converters.get(name)
if(targets){const cnv=targets.get(src.outStruct.structName)
if(cnv)return cnv}}if(this.customSwitch)for(const conf of this.customSwitch){if(conf.tags.has(name)&&conf.tags.has(src.outStruct.structName))return conf.cnv}if(this.switchTagRoots)for(const tags of this.switchTagRoots){if(tags.has(name)&&tags.has(src.outStruct.structName))return SwitchTagRootConverter.SINGLETON}return null}}export class SetConverterProv extends Array{findConverter(src){for(const prov of this){const c=prov.findConverter(src)
if(c)return c}return null}}export class SwitchTagRootConverter{async convert(src){if(!src.jml){if(CONVERT.getSrcAsNode(src)instanceof Attr){throw Error("TODO SwitchTagRootConverter for attr")}src.jml=[]
JML.domNode2jml(src.node,src.jml)}const newC=[]
src.outStruct.createContent(newC)
const res=src.jml.concat()
res[0]=Object.assign({},res[0],newC[0])
return{jml:res}}}SwitchTagRootConverter.SINGLETON=new SwitchTagRootConverter
export class XslConverter{constructor(xslPath){this.xslPath=xslPath}addParam(name,value){if(!this.params)this.params=new Map
this.params.set(name,value)}async convert(src){if(!this.xslt){try{const xsl=await this.xslPath.fetchDom()
this.xslt=new XSLTProcessor
this.xslt.importStylesheet(xsl)}catch(e){ERROR.log("Fail to load xsl: "+this.xslPath.url,e)
this.xslt=null}}if(this.xslt){try{this.xslt.setParameter("","targetTagName",src.outStruct.structName)
if(this.params)for(const[k,v]of this.params){this.xslt.setParameter("",k,v)}const doc=this.xslt.transformToDocument(CONVERT.getSrcAsNode(src))
if(doc.documentElement.localName==="fragment"&&doc.documentElement.namespaceURI===DOM.SCCORE_NS){const frag=doc.createDocumentFragment()
const root=doc.documentElement
while(root.hasChildNodes())frag.appendChild(root.firstChild)
return{node:frag}}return{node:doc.documentElement}}catch(e){ERROR.log("Fail to execute xsl: "+this.xslPath.url,e)}finally{}}return{node:src.node,jml:src.jml}}}export var CONVERT;(function(CONVERT){function getNameRoot(src){if(src.jml)return JML.jmlNode2name(src.jml[0])
if(!src.node)src.node=XA.findDomLast(src.xa,src.doc)
return src.node instanceof Attr?"@"+src.node.nodeName:src.node.nodeName}CONVERT.getNameRoot=getNameRoot
function getSrcAsNode(src){if(src.node)return src.node
if(src.doc&&src.xa)src.node=XA.findDomLast(src.xa,src.doc)
else if(src.jml)src.node=JML.jmlToDom(src.jml).documentElement
return src.node}CONVERT.getSrcAsNode=getSrcAsNode
function getDstAsJml(dst){if(!dst)return null
if(dst.jml)return dst.jml
if(!dst.node)return null
dst.jml=[]
JML.domNode2jml(dst.node,dst.jml)
return dst.jml}CONVERT.getDstAsJml=getDstAsJml
function getDstAsNode(dst){if(!dst)return null
if(dst.node)return dst.node
return dst.jml?JML.jmlToDom(dst.jml).documentElement:null}CONVERT.getDstAsNode=getDstAsNode})(CONVERT||(CONVERT={}))
export class SwitchEltConverter{async convert(src){if(!src.jml){src.jml=[]
JML.domNode2jml(src.node,src.jml)}const newC=[]
src.outStruct.createContent(newC)
const res=src.jml.concat()
const tag=res[0]
const newTag=newC[0]
for(const[key,value]of Object.entries(newTag)){if(!value&&key in tag)newTag[key]=tag[key]}res[0]=Object.assign({},tag,newTag)
return{jml:res}}}CONVERTERLIB.registerConverterFromXml("eltWithAtts",()=>new SwitchEltConverter)

//# sourceMappingURL=convert.js.map