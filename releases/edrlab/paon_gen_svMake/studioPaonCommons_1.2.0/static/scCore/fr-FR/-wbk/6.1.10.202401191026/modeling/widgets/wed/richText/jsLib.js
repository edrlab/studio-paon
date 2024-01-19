import{METAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/metaBar.js"
import{InlLinkModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{TxtElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{DocHolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{SkRuleDoc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{ItemCreator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/itemCreator.js"
import{SearchItemSgnRegexp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
var IS_element=DOM.IS_element
export const spanMgr={refreshSpan(cell){DOM.setAttr(cell,"rowspan",cell.wedAttributes?cell.wedAttributes.rowSpan:null)
DOM.setAttr(cell,"colspan",cell.wedAttributes?cell.wedAttributes.colSpan:null)},isRowSpanAvailable(cell){return true},isColSpanAvailable(cell){return true},updateRowSpan(cell,span,batch){batch.add((new XmlStrMsg).init(XA.append(cell.wedAnchor,"rowSpan"),span>1?span.toString(10):null))},updateColSpan(cell,span,batch){batch.add((new XmlStrMsg).init(XA.append(cell.wedAnchor,"colSpan"),span>1?span.toString(10):null))},splitCell(cell,rowSpan,colSpan){const c=cell.exportWrap(null)
if(rowSpan>1)c[0]["rowSpan"]=rowSpan.toString()
if(colSpan>1)c[0]["colSpan"]=colSpan.toString()
return c}}
export const widthColMgr={refreshW(col){const w=col.wedAttributes&&col.wedAttributes.width?col.wedAttributes.width+"ch":"2ch"
DOM.setStyle(col,"width",w)},getLogicW(col){return parseInt(col.wedAttributes.width,10)||2},getLogicBounds(col){return COL_BOUNDS},updateLogicW(col,width,batch){batch.add((new XmlStrMsg).init(XA.append(col.wedAnchor,"width"),width.toString(10)))},fillDefault(colMode,jml){jml.width="10"}}
const COL_BOUNDS={min:2}
export const openPanel=async function(parent,newJml,postInject){const wedlet=parent instanceof TxtElement?parent:parent.wedlet
const wedMgr=wedlet.wedMgr
const skParentRule=wedMgr.docHolder.getStruct(parent.wedAnchor,WEDLET.buildVirtualPath(wedlet))
let skRule
if(!newJml){skRule=skParentRule.contentRule.findRuleNodeFor(this.newJml())
if(!skRule)return
newJml=[]
skRule.createContent(newJml)}else if(!skRule){skRule=skParentRule.contentRule.findRuleNodeFor(newJml[0])
if(!skRule)return}const wsp=wedMgr.reg.env.wsp
const house=await wsp.wspServer.wspsLive.newLocalHouse({initialJml:newJml,schema:wedMgr.docHolder.house.schemaDom.schema,schemaDomConfig:{rootRule:(new SkRuleDoc).init(skRule)},buildOptions:{autoComplete:true}},wsp)
try{const docHolder=new DocHolder(house)
await METAS.openMetaNew(wedMgr,docHolder,this.panelModel,`Insertion de : ${this.nodeLabel}`,parent.wedlet)
if(postInject){postInject(docHolder)}return docHolder.getContent()}finally{wsp.wspServer.wspsLive.removeLocalHouse(house)}}
export function onCreateUrlLink(parent){const newJml=[this.newJml()]
const selMgr=parent.txtRoot.selMgr
if(selMgr.type==="Range"&&selMgr.anchorNode instanceof Text&&selMgr.anchorNode===selMgr.focusNode){const txt=selMgr.anchorNode.nodeValue.substring(selMgr.range.startOffset,selMgr.range.endOffset)
if(!/\s/.test(txt)&&/\./.test(txt)){const parentRule=parent.wedlet.wedMgr.docHolder.getStruct(parent.wedAnchor)
if(parentRule){const tagRule=parentRule.contentRule.findRuleNodeFor(newJml[0])
if(tagRule){const metaRule=tagRule.contentRule.findRuleNodeFor({"":this.metasName})
if(metaRule){const urlProp=metaRule.contentRule.findRule(r=>r.skFamily==="property/url")
if(urlProp){const propElt=urlProp.createNode(DOM.sharedXmlDoc())
propElt.textContent=txt
const metaElt=metaRule.createNode(propElt)
metaElt.appendChild(propElt)
newJml.push(JML.dom2jml(metaElt))}}}}}}return openPanel.call(this,parent,newJml,docHolder=>{selMgr.restoreSel()
if(selMgr.type==="Caret"){let url
const schemaDom=docHolder.house.schemaDom
const doc=docHolder.getDocument()
let elt=doc.documentElement.firstElementChild
while(elt){if(schemaDom.getSkNode(elt).rule.skFamily==="property/url"){url=elt.textContent
break}elt=DOM.findNext(elt,null,IS_element)}if(url)doc.documentElement.appendChild(doc.createTextNode(url))}})}export const selectItem=async function(parent){const wedlet=parent instanceof TxtElement?parent:parent.wedlet
const wedMgr=wedlet.wedMgr
const skParentRule=wedMgr.docHolder.getStruct(parent.wedAnchor,WEDLET.buildVirtualPath(wedlet))
const newObj=this.newJml()
const skTagRule=skParentRule.contentRule.findRuleNodeFor(newObj)
const skLinkRule=skTagRule.contentRule.findRuleAttrFor("sc:refUri")
const willAddTitle=this instanceof InlLinkModel&&parent.txtRoot.selMgr.type==="Caret"
const{FastFindItem:FastFindItem}=await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/dialogs/fastFindItem.js")
const sd=await FastFindItem.openFastFind({reg:wedMgr.reg,restrictions:skLinkRule.itSgnPattern?new SearchItemSgnRegexp(skLinkRule.itSgnPattern.source):null,itemCreator:wedMgr.reg.getPref("wsp.createItem",true)?ItemCreator.setDefaultConfigFromReg(wedMgr.reg,{spaceUri:ITEM.extractSpaceUri(wedMgr.reg.env.longDesc.srcUri),itemTypesTree:{itemTypeReducer:skLinkRule.itSgnPattern?(acc,cur)=>{if(skLinkRule.itSgnPattern.test(cur.getSgn()))acc.push(cur)
return acc}:null}}):undefined,subItemsFind:skLinkRule.subItSgnPattern?{subItemSgnPattern:skLinkRule.subItSgnPattern}:undefined},wedMgr.wedEditor).onNextClose()
if(!sd)return null
newObj["sc:refUri"]=ITEM.srcRefSub(sd)
if(willAddTitle){return[newObj,[sd.itTi||SRC.extractLeafFromUri(sd.srcUri)]]}return[newObj]}
export const selectItemAndOpenPanel=async function(parent){const jmlSet=await selectItem.call(this,parent)
if(!jmlSet)return null
return openPanel.call(this,parent,jmlSet)}

//# sourceMappingURL=jsLib.js.map