export class DomToDomUpdater{constructor(root,buildRoot){this.root=root
this.buildRoot=buildRoot}refresh(from){this.startRefresh()
this.buildRoot(from)
this.endRefresh()}addText(txt){var _a
if(!txt)return
if(((_a=this.curNextSib)===null||_a===void 0?void 0:_a.nodeType)===Node.TEXT_NODE){if(txt!==this.curNextSib.nodeValue)this.curNextSib.nodeValue=txt
this.curNextSib=this.curNextSib.nextSibling}else{this.curParent.insertBefore(document.createTextNode(txt),this.curNextSib)}}addElt(name,atts,subFrom,subBuild){this.enterElt(name,atts)
if(subFrom)(subBuild||this.buildRoot).call(this,subFrom)
this.exitElt()}enterElt(name,atts){const current=this.curNextSib
if(current instanceof Element&&current.nodeName===name){const addedAtts=new Set
if(atts){for(const k in atts){const v=atts[k]
if(v!=null){current.setAttribute(k,v)
addedAtts.add(k)}}}for(const att of current.attributes){if(!addedAtts.has(att.nodeName))current.removeAttributeNode(att)}this.curParent=current
this.curNextSib=current.firstChild}else{const elt=document.createElement(name)
if(atts)for(const k in atts){const v=atts[k]
if(v!=null)elt.setAttribute(k,v)}this.curParent=this.curParent.insertBefore(elt,current)
this.curNextSib=null}}exitElt(){if(this.curNextSib){let node=this.curNextSib
while(node){let next=node.nextSibling
node.parentNode.removeChild(node)
node=next}}this.curNextSib=this.curParent.nextSibling
this.curParent=this.curParent.parentNode}startRefresh(){this.curParent=this.root
this.curNextSib=this.root.firstChild
return this}endRefresh(){if(this.curNextSib){let node=this.curNextSib
while(node){let next=node.nextSibling
node.parentNode.removeChild(node)
node=next}}this.curNextSib=null
this.curParent=null}}
//# sourceMappingURL=domToDomUpdater.js.map