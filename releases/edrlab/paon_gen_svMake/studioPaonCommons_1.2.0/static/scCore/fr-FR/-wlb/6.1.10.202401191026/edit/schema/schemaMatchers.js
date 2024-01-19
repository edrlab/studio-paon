import{FactoryRegistry,Serializable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/serial.js"
import{ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class SkMatcherNode extends Serializable{isFuzzy(){return false}get startName(){return null}}SkMatcherNode.registry=new FactoryRegistry("SkMatcherNode")
export class SkMatcherEltName extends SkMatcherNode{constructor(name){super()
this.techName=name}matchNode(nodeType,nodeName){return nodeType==ENodeType.element&&(nodeName==null||nodeName===this.techName)}get startName(){return this.techName}writeTo(o,mode){o.n=this.techName}readFrom(o,mode){this.techName=o.n
return this}}SkMatcherEltName.type="n"
SkMatcherNode.registry.register(SkMatcherEltName)
export class SkMatcherAnyElt extends SkMatcherNode{matchNode(nodeType,nodeName){return nodeType===Node.ELEMENT_NODE}get techName(){return"*"}get startName(){return""}isFuzzy(){return true}writeTo(o,mode){}readFrom(o,mode){return SkMatcherAnyElt.SINGLETON}}SkMatcherAnyElt.type="*"
SkMatcherAnyElt.SINGLETON=Object.freeze(new SkMatcherAnyElt)
SkMatcherNode.registry.register(SkMatcherAnyElt)
export class SkMatcherEltNs extends SkMatcherNode{constructor(ns,prefix){super()
this.prefix=prefix
this.ns=ns}matchNode(nodeType,nodeName){return nodeType==ENodeType.element&&(nodeName==null||this.prefix?nodeName.startsWith(this.prefix)&&nodeName.charAt(this.prefix.length)===":":nodeName.indexOf(":")<0)}get startName(){return this.prefix?this.prefix+":":""}get techName(){return this.prefix?this.prefix+":*":"*"}isFuzzy(){return true}writeTo(o,mode){o.prefix=this.prefix
o.ns=this.ns}readFrom(o,mode){this.prefix=o.prefix
this.ns=o.ns
return this}}SkMatcherEltNs.type="ns"
SkMatcherNode.registry.register(SkMatcherEltNs)
export class SkMatcherEltChoice extends SkMatcherNode{constructor(){super(...arguments)
this.subMatchers=[]}matchNode(nodeType,nodeName){return this.subMatchers.some(s=>s.matchNode(nodeType,nodeName))}get startName(){return this.subMatchers[0].startName}get techName(){return this.subMatchers.map(s=>s.techName).join("|")}isFuzzy(){return true}writeTo(o,mode){o.sub=Serializable.serialArraySerializables(this.subMatchers,mode)}readFrom(o,mode){this.subMatchers=Serializable.deserialArraySerializables(o.sub,mode,SkMatcherNode.registry)
return this}}SkMatcherEltChoice.type="choice"
SkMatcherNode.registry.register(SkMatcherEltChoice)
export class SkMatcherDoc extends SkMatcherNode{matchNode(nodeType,nodeName){return nodeType===Node.DOCUMENT_NODE||nodeType===Node.DOCUMENT_FRAGMENT_NODE}get techName(){return"/"}writeTo(o,mode){}readFrom(o,mode){return SkMatcherDoc.SINGLETON}}SkMatcherDoc.type="/"
SkMatcherDoc.SINGLETON=Object.freeze(new SkMatcherDoc)
SkMatcherNode.registry.register(SkMatcherDoc)
export class SkMatcherText extends SkMatcherNode{matchNode(nodeType,nodeName){return nodeType===Node.TEXT_NODE}get techName(){return"text()"}writeTo(o,mode){}readFrom(o,mode){return SkMatcherText.SINGLETON}}SkMatcherText.type="#"
SkMatcherText.SINGLETON=Object.freeze(new SkMatcherText)
SkMatcherNode.registry.register(SkMatcherText)
export class SkMatcherComment extends SkMatcherNode{matchNode(nodeType,nodeName){return nodeType===Node.COMMENT_NODE}get techName(){return"comment()"}writeTo(o,mode){}readFrom(o,mode){return SkMatcherComment.SINGLETON}}SkMatcherComment.type="!"
SkMatcherComment.SINGLETON=Object.freeze(new SkMatcherComment)
SkMatcherNode.registry.register(SkMatcherComment)
export class SkMatcherAttr extends Serializable{}SkMatcherAttr.registry=new FactoryRegistry("SkMatcherAttr")
export class SkMatcherAttrName extends SkMatcherAttr{constructor(nodeName){super()
this.startName=nodeName
this.techName="@"+nodeName}isFuzzy(){return false}matchAttr(attrName){return attrName===this.startName}writeTo(o,mode){o.n=this.techName}readFrom(o,mode){this.techName=o.n
return this}}SkMatcherAttrName.type="n"
SkMatcherAttr.registry.register(SkMatcherAttrName)
export class SkMatcherAnyAttr extends SkMatcherAttr{get techName(){return"@*"}get startName(){return""}isFuzzy(){return true}matchAttr(attr){return true}writeTo(o,mode){}readFrom(o,mode){return SkMatcherAnyAttr.SINGLETON}}SkMatcherAnyAttr.type="*"
SkMatcherAnyAttr.SINGLETON=Object.freeze(new SkMatcherAnyAttr)
SkMatcherAttr.registry.register(SkMatcherAnyAttr)

//# sourceMappingURL=schemaMatchers.js.map