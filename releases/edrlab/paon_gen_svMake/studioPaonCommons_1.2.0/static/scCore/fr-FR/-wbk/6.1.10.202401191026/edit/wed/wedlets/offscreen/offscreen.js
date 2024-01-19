import{WED,WedletModelBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{JML,JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{applyXmlMsgOnElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{FetchJml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class OffscreenModel extends WedletModelBase{initModel(cnf){this.config=cnf
this.childrenElts=WEDLET.extractChildrenNodes(cnf)
this.childrenElts.sort(WED.SORT_ChildrenElts)}createWedlet(parent,displayContext){if(this.nodeType===ENodeType.element)return new OffscreenEltWedlet(this,parent)
return new OffscreenStrWedlet(this,parent)}}WED.registerWedletModel("Offscreen",OffscreenModel)
export class OffscreenEltWedlet{constructor(model,wedParent){this.model=model
this.wedParent=wedParent
this.atts={}
this.children=[]}get wedAnchor(){return XA.append(this.wedParent.wedAnchor,this.xaPart)}get wedMgr(){return this.wedParent.wedMgr}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
if(typeof node==="string")throw Error("StandaloneEltWedlet not bindable on text node.")
const wedMgr=this.wedMgr
for(const k in node){const v=node[k]
if(v.length>0)this._setAtt(wedMgr,k,v)}const it=new JmlSubSetIterator(children)
let promises
while(it.next()){if(typeof it.currentNode==="number"){const xa=XA.append(this.wedAnchor,it.currentIdx)
if(wedMgr.docHolder){const ct=wedMgr.getContent(xa)
it.currentNode=ct[0]
it.currentChildren=ct[1]}else{if(!promises)promises=[]
promises.push(wedMgr.fetchContent(xa).then(jml=>this._setChild(wedMgr,XA.last(jml.xa),jml.result[0],jml.result[1])))
continue}}const p=this._setChild(wedMgr,it.currentIdx,it.currentNode,it.currentChildren)
if(p){if(!promises)promises=[]
else promises.push(p)}}if(promises)return Promise.all(promises)}_setAtt(wedMgr,name,val){const childrenElt=WEDLET.findChildrenEltForAttr(this.model.childrenElts,name)
if(childrenElt){const model=wedMgr.wedModel.findModelForAttr(name,val,childrenElt.wedModesAtts,childrenElt.wedVariants,this,childrenElt.wedSelector,childrenElt.wedPreferedModels,childrenElt.wedParams)
if(model){const w=this.atts[name]=model.createWedlet(this)
if(w)w.bindWithAttr(name,val)}}}_setChild(wedMgr,idx,node,children){const childrenElt=WEDLET.findChildrenEltForNodeStrict(this.model.childrenElts,node)
if(childrenElt){const model=wedMgr.wedModel.findModelForNode(node,childrenElt.wedModesNodes,childrenElt.wedVariants,this,childrenElt.wedSelector,childrenElt.wedPreferedModels,childrenElt.wedParams)
if(model){const w=this.children[idx]=model.createWedlet(this)
if(w)return w.bindWithNode(idx,node,children)}}}deleteAttrNode(nameAttr){if(this.atts[nameAttr]){const w=this.atts[nameAttr]
if(w&&"onDelete"in w)w.onDelete()
this.atts[nameAttr]=undefined}}deleteChildNodes(xaOffest,count){for(let i=xaOffest,m=i+count;i<m;i++){const w=this.children[i]
if(w&&"onDelete"in w)w.onDelete()}this.children.splice(xaOffest,count)
for(let i=xaOffest;i<this.children.length;i++){const w=this.children[i]
if(w)w.xaPart=w.xaPart-count}}findWedletChild(xaPart,options){if(typeof xaPart==="number"){return this.children[xaPart]}else{return this.atts[xaPart]}return null}insertAttrNode(nameAttr,value){this._setAtt(this.wedMgr,nameAttr,value)}insertChildNode(xaOffest,node,children){this.children.splice(xaOffest,0,null)
for(let i=xaOffest+1;i<this.children.length;i++){const w=this.children[i]
if(w)w.xaPart=w.xaPart+1}return this._setChild(this.wedMgr,xaOffest,node,children)}replaceChildBind(xaOffest,node,children){const curr=this.children[xaOffest]
if(curr&&"onDelete"in curr)curr.onDelete()
return this._setChild(this.wedMgr,xaOffest,node,children)}isEmpty(){return false}isVirtual(){return false}onChildNodesInserted(){}onDelete(){for(const w of Object.values(this.atts))if(w&&"onDelete"in w)w.onDelete()
for(const w of this.children)if(w&&"onDelete"in w)w.onDelete()}visitWedletChildren(from,len,visitor,options){if(from===-1)for(const w of Object.values(this.atts))if(w&&visitor(w)==="stop")return"stop"
for(let i=Math.max(0,from),s=Math.min(from+len,this.children.length);i<s;i++){const w=this.children[i]
if(w&&visitor(w)==="stop")return"stop"}}}export class OffscreenEltLeafWedlet{constructor(model,wedParent){this.model=model
this.wedParent=wedParent
this.wedMgr=wedParent.wedMgr}get wedAnchor(){return XA.append(this.wedParent.wedAnchor,this.xaPart)}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
this.wedMgr.doAfterBatch(()=>{if(this.wedMgr.docHolder){this.setContent(XA.findDomLast(this.wedAnchor,this.wedMgr.docHolder.getDocument()))}else if(JML.isWhole(children)){this.setContent(JML.jmlToElt(node,children))}else{this.fetchContent()}})}updateInDescendants(msg){if(!this.wedMgr.docHolder)applyXmlMsgOnElt(msg,WEDLET.getWedletDepth(this)+1,this.content)
this.setContent(this.content)}isEmpty(){return this.content!=null}isVirtual(){return false}onDelete(){this.setContent(null)}setContent(content){this.content=content}async fetchContent(){const[jmlFetch]=await this.wedMgr.docHolderAsync.fetchContent([new FetchJml(XA.append(this.wedAnchor,0))])
this.setContent(JML.jmlToElt(jmlFetch.result[0],jmlFetch.result[1]))}}export class OffscreenStrWedlet{constructor(model,wedParent){this.model=model
this.wedParent=wedParent}get wedMgr(){return this.wedParent.wedMgr}setText(txt){this.text=txt}bindWithAttr(nameAttr,value){this.xaPart=nameAttr
this.setText(value)}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
this.setText(node)}deleteChars(from,len,msg){this.setText(LANG.stringDelete(this.text,from,len))}insertChars(from,chars,msg){this.setText(LANG.stringInsert(this.text,from,chars))}isEmpty(){return false}isVirtual(){return false}replaceChars(chars,msg){this.setText(chars)}onDelete(){this.setText(null)}}
//# sourceMappingURL=offscreen.js.map