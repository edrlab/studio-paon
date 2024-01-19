import{EAnnotLevel,SkAnnotBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{CommentsState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
var IS_comment=DOM.IS_comment
var IS_text=DOM.IS_text
export function isSkSearchAnnot(a){return a&&a.type===SkSearchTextAnnot.TYPE}export class SkSearchTextAnnot extends SkAnnotBase{constructor(search,anchorNode,offsetStart,match,keyEquals){super()
this.search=search
this.offsetStart=offsetStart
this.match=match
this.keyEquals=keyEquals
this.anchorNode=anchorNode}get type(){return SkSearchTextAnnot.TYPE}get level(){return EAnnotLevel.search}get start(){return XA.append(XA.fromNode(this.anchorNode),this.offsetStart)}get len(){return this.match.length}getLabel(){return this.match}equals(other){return this.anchorNode===other.anchorNode&&this.search===other.search&&this.offsetStart===other.offsetStart&&this.keyEquals===other.keyEquals}toJSON(){return null}}SkSearchTextAnnot.TYPE="search"
export class SkSearchNodeAnnot extends SkAnnotBase{constructor(search,anchorNode,label){super()
this.search=search
this.label=label
this.anchorNode=anchorNode}get type(){return SkSearchTextAnnot.TYPE}get level(){return EAnnotLevel.search}getLabel(){return this.label}equals(other){return this.anchorNode===other.anchorNode&&this.search===other.search}toJSON(){return null}}export class SkSearchCommentAnnot extends SkSearchNodeAnnot{constructor(search,anchorNode,subAnnot){super(search,anchorNode,null)
this.subAnnot=subAnnot}getLabel(){return this.subAnnot.getLabel()}equals(other){return this.anchorNode===other.anchorNode&&this.search===other.search&&this.subAnnot.equals(other.subAnnot)}}export class SkTextSearch{constructor(pattern,maxResults){this.pattern=pattern
this.maxResults=maxResults
if(!pattern.global)throw Error("Pattern must be global")}buildSearchAnnots(skNode,annots){const meta=skNode.rule.skMeta
const isSeacrhInText=meta===null||meta===void 0?void 0:meta.isTextSearchable(skNode,skNode.node)
for(let ch=skNode.node.firstChild;ch;ch=ch.nextSibling){if(isSeacrhInText&&IS_text(ch)){let r=this.pattern.exec(ch.nodeValue)
while(r){annots.push(new SkSearchTextAnnot(this,ch,r.index,r[0],ch.nodeValue))
r=this.pattern.exec(ch.nodeValue)}}else if(IS_comment(ch)){const house=skNode.schemaDom.house
if(house){const cmtMgr=CommentsState.getCmtHouseFromNode(house,ch,skNode)
if(cmtMgr.house){const filter={search:this,schemaDom:skNode.schemaDom,annots:annots,cmt:ch,acceptNode(node){const skN=this.schemaDom.getSkNode(node)
if(skN){const l=this.annots.length
this.search.buildSearchAnnots(skN,this.annots)
for(let i=l;i<this.annots.length;i++){this.annots[i]=new SkSearchCommentAnnot(this.search,this.cmt,this.annots[i])}}else{console.trace("No skNode for",node)}return NodeFilter.FILTER_ACCEPT}}
const tw=cmtMgr.house.document.createTreeWalker(cmtMgr.house.root,NodeFilter.SHOW_ELEMENT,filter)
while(tw.nextNode()&&annots.length<=this.maxResults);}else if(cmtMgr.futureHouse){console.trace("TODO async CommentHouse fetching")}else{let r=this.pattern.exec(ch.nodeValue)
while(r){annots.push(new SkSearchTextAnnot(this,ch,r.index,r[0],ch.nodeValue))
r=this.pattern.exec(ch.nodeValue)}}}}}}}export class SkTextSearchInAtts extends SkTextSearch{buildSearchAnnots(skNode,annots){const elt=skNode.node
if(elt instanceof Element)for(let i=0;i<elt.attributes.length;i++){const att=elt.attributes.item(i)
const attRule=skNode.rule.contentRule.findRuleAttrFor(att.nodeName)
if(attRule===null||attRule===void 0?void 0:attRule.skMeta.isTextSearchable(skNode,att)){let r=this.pattern.exec(att.nodeValue)
while(r){annots.push(new SkSearchTextAnnot(this,att,r.index,r[0],att.nodeValue))
r=this.pattern.exec(att.nodeValue)}}}super.buildSearchAnnots(skNode,annots)}}export class SkXPathSearch{constructor(xpath,label,maxResults){this.xpath=xpath
this.label=label
this.maxResults=maxResults
this.lastSearch=new Set}beforeSearchAnnots(schemaDom){this.lastSearch.clear()
const r=this.xpath.evaluate(schemaDom.nodeRoot,XPathResult.UNORDERED_NODE_ITERATOR_TYPE)
for(let n=r.iterateNext();n!==null;n=r.iterateNext())this.lastSearch.add(n)}buildSearchAnnots(skNode,annots){if(this.lastSearch.has(skNode.node)){annots.push(new SkSearchNodeAnnot(this,skNode.node,this.label))}}}export class SkCssSelectorSearch{constructor(selector,label,maxResults){this.selector=selector
this.label=label
this.maxResults=maxResults}buildSearchAnnots(skNode,annots){if(skNode.node instanceof Element&&skNode.node.matches(this.selector)){annots.push(new SkSearchNodeAnnot(this,skNode.node,this.label))}}}
//# sourceMappingURL=schemaSearch.js.map