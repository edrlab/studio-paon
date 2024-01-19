import{AttributeCommitter,BooleanAttributePart,DefaultTemplateProcessor,directive,EventPart,NodePart,parts,PropertyCommitter,render,reparentNodes,templateFactory,TemplateResult}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/lit-html.js"
import{until}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/directives/until.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
const range=document.createRange()
range.setStart(document.documentElement,0)
class ContextualTemplateResult extends TemplateResult{getTemplateElement(){try{const template=document.createElement("template")
template.content.appendChild(range.createContextualFragment(this.getHTML()))
return template}catch(e){throw Error("Invalid lit template : "+this.getHTML())}}}class AttrPrefixTemplateProcessor extends DefaultTemplateProcessor{handleAttributeExpressions(element,name,strings,options){if(name[1]==="."){switch(name[0]){case"p":return new PropertyCommitter(element,name.slice(2),strings).parts
case"e":return[new EventPart(element,name.slice(2),options.eventContext)]
case"b":return[new BooleanAttributePart(element,name.slice(2),strings)]
case"i":return[new InitPart(element)]
case"c":return[new ConstructorPart(element)]}}return new AttributeCommitter(element,name,strings).parts}}class InitPart{constructor(element){this.element=element}setValue(value){this.value=value}commit(){if(this.element instanceof BaseElement){this.element.initialize(this.value)
this.element=null
this.value=null}}}class ConstructorPart{constructor(element){this.element=element}setValue(value){this.value=value}commit(){this.value(this.element)}}const attrPrefixTemplateProcessor=new AttrPrefixTemplateProcessor
export const xhtml=(strings,...values)=>new ContextualTemplateResult(strings,values,"xhtml",attrPrefixTemplateProcessor)
class SVGTemplateResult extends TemplateResult{getHTML(){return`<svg xmlns="${DOM.SVG_NS}">${super.getHTML()}</svg>`}getTemplateElement(){const template=super.getTemplateElement()
const content=template.content
const svgElement=content.firstChild
content.removeChild(svgElement)
reparentNodes(content,svgElement.firstChild)
return template}}export const svg=(strings,...values)=>new SVGTemplateResult(strings,values,"svg",attrPrefixTemplateProcessor)
export const renderAppend=(result,container,options)=>{let part=parts.get(container)
if(part===undefined){parts.set(container,part=new NodePart(Object.assign({templateFactory:templateFactory},options)))
part.appendInto(container)}part.setValue(result)
part.commit()}
export{TemplateResult,render,directive,until}

//# sourceMappingURL=htmlLit.js.map