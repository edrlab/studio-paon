import{GramCell,GramCol,GramFragment,GramInline,GramList,GramListEntry,GramPara,GramRow,GramSection,GramString,GramTable,GramTitle,GramUrl}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/gram.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{EGramLevelType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
export function html2gram(from){if(DEBUG)console.log("html2gram:::HTML::",DOM.debug(from))
const result=new GramFragment
const tw=(from.ownerDocument||from).createTreeWalker(from,HTML_SHOW,HTML_FILTER)
const postTasks=[]
buildGram(tw,result,postTasks)
for(const task of postTasks)task()
if(DEBUG)console.log("html2gram:::BEFORE NORM::",result.asHtml())
result.normalize()
if(DEBUG)console.log("html2gram:::GRAM::",result.asHtml())
return result}const HTML_SHOW=NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT|NodeFilter.SHOW_DOCUMENT|NodeFilter.SHOW_DOCUMENT_FRAGMENT
const HTML_FILTER={acceptNode(n){if(n.nodeType===ENodeType.text)return NodeFilter.FILTER_ACCEPT
else if(DOM.IS_element(n))switch(n.localName){case"div":return NodeFilter.FILTER_SKIP
case"head":case"template":case"style":case"script":case"meta":case"title":return NodeFilter.FILTER_REJECT}return NodeFilter.FILTER_ACCEPT}}
function buildGram(tw,parent,postTasks){if(tw.currentNode instanceof Element){switch(tw.currentNode.localName){case"section":case"article":buildCh(tw,(new GramSection).addAsChild(parent),postTasks)
return
case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":if(parent instanceof GramSection&&!parent.hasTitle()){buildCh(tw,(new GramTitle).addAsChild(parent),postTasks)
return}const sections=[parent,(new GramSection).addAsChild(parent)]
const levels=[0,tw.currentNode.localName.charAt(1)]
let currDepth=1
buildCh(tw,(new GramTitle).addAsChild(sections[currDepth]),postTasks)
if(!tw.nextSibling())return
do{let nm=tw.currentNode.nodeName
while(nm.length!==2||nm.charAt(0)!=="H"){buildGram(tw,sections[currDepth],postTasks)
if(!tw.nextSibling())return
nm=tw.currentNode.nodeName}const lev=tw.currentNode.localName.charAt(1)
let currLev=levels[currDepth]
if(lev>currLev){sections[currDepth+1]=(new GramSection).addAsChild(sections[currDepth])
levels[++currDepth]=lev
buildCh(tw,(new GramTitle).addAsChild(sections[currDepth]),postTasks)
if(!tw.nextSibling())return}else{while(lev<currLev&&currDepth>1){currDepth--
currLev=levels[currDepth]}sections[currDepth]=(new GramSection).addAsChild(sections[currDepth-1])
buildCh(tw,(new GramTitle).addAsChild(sections[currDepth]),postTasks)
if(!tw.nextSibling())return}}while(true)
case"p":buildCh(tw,(new GramPara).addAsChild(parent),postTasks)
return
case"ol":buildCh(tw,new GramList(true).addAsChild(parent),postTasks)
return
case"ul":buildCh(tw,new GramList(false).addAsChild(parent),postTasks)
return
case"li":buildCh(tw,(new GramListEntry).addAsChild(parent),postTasks)
return
case"br":if(parent.lastSub&&parent.lastSub.gramLevelType===EGramLevelType.inline){postTasks.push(splitPara.bind(null,parent.lastSub))}return
case"table":buildCh(tw,(new GramTable).addAsChild(parent),postTasks)
return
case"col":{const spanC=tw.currentNode.getAttribute("span")
const wC=tw.currentNode.getAttribute("width");(new GramCol).addAsChild(parent).setWidthInPx(wC)
if(spanC)for(let i=parseInt(spanC);i>1;i--)(new GramCol).addAsChild(parent).setWidthInPx(wC)
return}case"colgroup":{let span=parseInt(tw.currentNode.getAttribute("span"))
if(!(span>=1))span=1
for(let i=0;i<span;i++){}const w=tw.currentNode.getAttribute("width")
const from=tw.currentNode
let count=0
if(tw.firstChild()){do{if(tw.currentNode instanceof Element&&tw.currentNode.localName==="col"){count++
const spanC=tw.currentNode.getAttribute("span")
const wC=tw.currentNode.getAttribute("width")||w;(new GramCol).addAsChild(parent).setWidthInPx(wC)
if(spanC)for(let i=parseInt(spanC);i>1;i--)(new GramCol).addAsChild(parent).setWidthInPx(wC)}}while(tw.nextSibling())}tw.currentNode=from
while(count++<span){(new GramCol).addAsChild(parent).setWidthInPx(w)}return}case"tr":buildCh(tw,(new GramRow).addAsChild(parent),postTasks)
return
case"td":case"th":const elt=tw.currentNode
buildCh(tw,(new GramCell).setSpans(elt.getAttribute("rowspan"),elt.getAttribute("colspan")).addAsChild(parent),postTasks)
return
case"caption":buildCh(tw,(new GramTitle).addAsChild(parent),postTasks)
return
case"a":buildCh(tw,new GramInline("a").addAsChild(parent).append((new GramUrl).append(new GramString(tw.currentNode.href))),postTasks)
return
case"b":case"cite":case"code":case"em":case"i":case"kbd":case"q":case"samp":case"small":case"strong":case"sub":case"sup":buildCh(tw,new GramInline(tw.currentNode.localName).addAsChild(parent),postTasks)
return
case"footer":case"nav":case"aside":return
case"address":return
case"figure":case"area":case"audio":case"img":case"map":case"track":case"video":return
default:buildCh(tw,parent,postTasks)
return}}else if(tw.currentNode instanceof Text){parent.append(new GramString(tw.currentNode.nodeValue))}else{buildCh(tw,parent,postTasks)}}function buildCh(tw,parent,postTasks){const from=tw.currentNode
if(tw.firstChild()){do{buildGram(tw,parent,postTasks)}while(tw.nextSibling())}tw.currentNode=from}function splitPara(from){if(from.nextSib&&from.nextSib.gramLevelType!==EGramLevelType.inline)return
const parent=from.parent
if(!parent)return
if(parent instanceof GramPara){const paraParent=parent.parent
if(paraParent){const newPara=(new GramPara).addAfter(parent)
let next=from.nextSib
while(next&&next.gramLevelType===EGramLevelType.inline){newPara.append(next)
next=from.nextSib}}}else if(parent.allowParaSibling){const para1=(new GramPara).addBefore(from)
const para2=(new GramPara).addBefore(from)
let next=from.nextSib
while(next&&next.gramLevelType===EGramLevelType.inline){para2.append(next)
next=from.nextSib}let prev=from.prevSib
while(from&&from.gramLevelType===EGramLevelType.inline){para1.prepend(from)
from=prev
prev=from.prevSib}}}const DEBUG=false

//# sourceMappingURL=html2gram.js.map