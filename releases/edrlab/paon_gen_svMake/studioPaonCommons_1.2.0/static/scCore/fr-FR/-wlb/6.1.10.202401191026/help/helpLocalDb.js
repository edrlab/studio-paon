import{HELP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/help/helpApi.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
const helpDbs=new Map
export function getHelpLocalDb(source,parent,prefix){let db=helpDbs.get(source.url)
if(!db){db=new HelpLocalDb(source,parent,prefix)
helpDbs.set(source.url,db)}return db}export class HelpLocalDb{constructor(source,parent,prefix){this.indexes=new Map
this.source=source
if(parent){this.parent=parent
this.prefix=prefix+HELP.UNIONDB_SEP_ID
this.foreignFragIndexes=new Map}}initIfNeeded(){if(this.fragments===undefined)return this.fetchBase()
return this}async fetchBase(){if(this.fragments===undefined){const d=await this.source.fetchJson()
if(d==null){this.fragments=[]
ERROR.log("HelpDb notFound"+this.source)}else{if(d.freeLibs){for(const module of await Promise.all(d.freeLibs.map(p=>this.source.importJs(p)))){if(typeof module.initFreeLib==="function")await module.initFreeLib(this.source)}}this.fragments=d.fragments.map((d,index)=>new HelpFrag(d,index,this))
for(const index of d.indexes){const i=new HelpIndex(index,this)
this.indexes.set(i.indexKey,i)}}}return this}async getFragment(id){return this.getFragmentSync(id)}getFragmentSync(id){var _a
if(!id)return undefined
const sep=id.indexOf(HELP.UNIONDB_SEP_ID)
if(sep>=0){if(id.startsWith(this.prefix))return this.fragments[parseInt(id.substring(sep+1))]
return(_a=this.parent)===null||_a===void 0?void 0:_a.getFragmentSync(id)}return this.fragments[parseInt(id)]}addIndexToForeignFrag(index,id){const frag=this.getFragmentSync(id)
if(frag){let indexes=(this.foreignFragIndexes||(this.foreignFragIndexes=new Map)).get(id)
if(indexes==null)this.foreignFragIndexes.set(id,indexes=[])
indexes.push(index)}return frag}async search(crit){const result=[]
if(crit.text){const re=new RegExp(LANG.escape4RegexpFuzzy(crit.text),"gi")
for(const frag of this.fragments){let score=0
if(frag.title)score=this.searchInContent(frag.title,re,null)*10
if(frag.body)score+=this.searchInContent(frag.body,re,null)
if(score>0){result.push({found:frag,score:score})
if(result.length===crit.max)break}}}result.sort((r1,r2)=>r2.score-r1.score)
return result}async getIndex(key){return this.indexes.get(key)}async getKeyIndexes(role){const r=new Set
for(const index of this.indexes.values()){if(index.indexRole===role)r.add(index.indexKey)}return r}async getIndexesFor(frag){return this.getIndexesForSync(frag)}async getIndexesWithRoleFor(frag,indexRole){return this.getIndexesForSync(frag).filter(i=>i.indexRole===indexRole)}getIndexesForSync(frag){if(!this.prefix)return frag.indexes
if(frag.fragId.startsWith(this.prefix))return frag.indexes
return this.foreignFragIndexes.get(frag.fragId)||[]}searchInContent(ct,re,extractRoot){let score=0
if(typeof ct==="string"){const matches=ct.match(re)
if(matches){score=matches.length
if(extractRoot){}}}else{if(ct.c)for(let i=0,s=ct.c.length;i<s;i++){score+=this.searchInContent(ct.c[i],re,extractRoot)}}return score}}class HelpFrag{constructor(data,index,helpDb){this.indexes=[]
this.fragId=data.id||helpDb.prefix?helpDb.prefix+index:index.toString()
this.cls=data.cls||"tag"
if(data.ti)this.title=this.resolvePaths(data.ti,helpDb.source)
if(data.body)this.body=this.resolvePaths(data.body,helpDb.source)}get titleString(){if(this._titleStr===undefined){if(this.title){this._titleStr=extractTextContent(this.title)}else{this._titleStr=""}}return this._titleStr}isTopic(){return this.title!=null}hasBody(){return this.body!=null}makeBody(options){return this.body?Promise.resolve(this.makeElt(this.body,options)):null}makeTitle(options){return this.makeElt(this.title,options)}makeElt(ct,options){if(ct==null)return JSX.createElement("span",null)
const r=this.makeNode(ct,options)
return r instanceof HTMLElement?r:JSX.createElement("span",null,r)}makeNode(ct,options){if(typeof ct==="string")return document.createTextNode(ct)
const elt=document.createElement(ct[""])
if(ct.a)for(const att in ct.a){elt.setAttribute(att,ct.a[att])
if(att==="open-help")elt.onclick=function(ev){return options.openFragId(this.getAttribute("open-help"),ev)}}if(ct.i){ct.i.reg=options.reg
elt.initialize(ct.i)
ct.i.reg=null}if(ct.c)for(const ch of ct.c)elt.appendChild(this.makeNode(ch,options))
return elt}resolvePaths(ct,source){if(typeof ct==="object")this.resolvePathsElt(ct,source)
return ct}resolvePathsElt(ct,source){var _a
if((_a=ct.a)===null||_a===void 0?void 0:_a.src)ct.a.src=source.resolve(ct.a.src).url
if(ct.c)for(let i=0,s=ct.c.length;i<s;i++){const elt=ct.c[i]
if(typeof elt==="object")this.resolvePathsElt(elt,source)}}addIndex(index){this.indexes.push(index)
return this}}class HelpIndex{constructor(d,thisDb){this.indexKey=d.indexKey
this.indexRole=d.indexRole
this.members=d.members.map(n=>typeof n==="number"?thisDb.fragments[n].addIndex(this):typeof n==="string"?thisDb.addIndexToForeignFrag(this,n):new HelpIndexNode(n,this,thisDb))}async getMembers(deepFetch){return this.members}isTreeNode(){return false}}class HelpIndexNode{constructor(d,parent,thisDb){const f=d.f
this.frag=typeof f==="number"?thisDb.fragments[f].addIndex(parent):thisDb.addIndexToForeignFrag(parent,f)
this._parent=parent
this.members=d.c.map(n=>typeof n==="number"?thisDb.fragments[n].addIndex(this):typeof n==="string"?thisDb.addIndexToForeignFrag(this,n):new HelpIndexNode(n,this,thisDb))}get parent(){return this._parent&&"frag"in this._parent?this._parent:null}async getMembers(){return this.members}isTreeNode(){return true}get indexKey(){let root=this._parent
while(root instanceof HelpIndexNode)root=root._parent
return root.indexKey}get indexRole(){let root=this._parent
while(root instanceof HelpIndexNode)root=root._parent
return root.indexRole}}function extractTextContent(ct){if(typeof ct==="string")return ct
let r=[]
if(ct.c)for(const ch of ct.c){r.push(extractTextContent(ch))}return r.join("")}
//# sourceMappingURL=helpLocalDb.js.map