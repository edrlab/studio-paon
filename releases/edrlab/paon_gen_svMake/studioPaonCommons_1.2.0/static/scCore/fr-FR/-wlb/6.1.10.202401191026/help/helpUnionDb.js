import{HELP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/help/helpApi.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export class HelpUnionDb{constructor(reg,baseDb,subDbs){this.reg=reg
this.baseDb=baseDb
this.subDbs=subDbs}initIfNeeded(){var _a
let dbInits=[]
LANG.pushIfDefined(dbInits,(_a=this.baseDb)===null||_a===void 0?void 0:_a.initIfNeeded())
this.subDbs.forEach(v=>LANG.pushIfDefined(dbInits,v.db.initIfNeeded()))
return dbInits.length>0?Promise.all(dbInits).then(()=>this):this}getFragment(id){var _a
if(!id)return undefined
const sep=id.indexOf(HELP.UNIONDB_SEP_ID)
if(sep<0){return this.baseDb.getFragment(id)}else{return(_a=this.subDbs.get(id.substring(0,sep)))===null||_a===void 0?void 0:_a.db.getFragment(id)}}async search(crit){let results=await this.baseDb.search(crit)
for(const dbHolder of this.subDbs.values()){results.push(...await dbHolder.db.search(crit))}results.sort((r1,r2)=>r2.score-r1.score)
return results}async getIndex(key){const found=[]
LANG.pushIfDefined(found,this.baseDb?await this.baseDb.getIndex(key):undefined)
for(const dbHolder of this.subDbs.values()){LANG.pushIfDefined(found,await dbHolder.db.getIndex(key))}if(found.length===0)return undefined
if(found.length===1)return found[0]
const members=[]
for(const index of found)members.push(...await index.getMembers())
return new UnionHelpIndex(key,found[0].indexRole,members)}async getKeyIndexes(role){let indexes=this.baseDb?await this.baseDb.getKeyIndexes(role):new Set
for(const dbHolder of this.subDbs.values()){for(const key of await dbHolder.db.getKeyIndexes(role))indexes.add(key)}return indexes}async getIndexesFor(frag){let indexes=await this.baseDb.getIndexesFor(frag)
for(const dbHolder of this.subDbs.values()){indexes.push(...await dbHolder.db.getIndexesFor(frag))}return indexes}async getIndexesWithRoleFor(frag,indexRole){let indexes=await this.baseDb.getIndexesWithRoleFor(frag,indexRole)
for(const dbHolder of this.subDbs.values()){indexes.push(...await dbHolder.db.getIndexesWithRoleFor(frag,indexRole))}return indexes}}class UnionHelpIndex{constructor(indexKey,indexRole,members){this.indexKey=indexKey
this.indexRole=indexRole
this.members=members}async getMembers(){return this.members}isTreeNode(){return false}}
//# sourceMappingURL=helpUnionDb.js.map