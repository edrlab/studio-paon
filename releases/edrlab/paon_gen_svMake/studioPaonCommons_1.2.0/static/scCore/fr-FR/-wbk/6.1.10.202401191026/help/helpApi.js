import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{LOCALE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export var HELP;(function(HELP){HELP.UNIONDB_SEP_ID="_"
HELP.simpleHelpPageTpl=async(frag,helpCtx)=>JSX.createElement("div",{class:frag.cls?"page "+frag.cls:"page tag"},buildTitle(frag,helpCtx),await buildBody(frag,helpCtx))
HELP.withCallersHelpPageTpl=async(frag,helpCtx)=>JSX.createElement("div",{class:frag.cls?"page "+frag.cls:"page tag"},buildHead(frag,helpCtx),await buildCallers(frag,helpCtx),buildTitle(frag,helpCtx),await buildBody(frag,helpCtx))
HELP.helpClsLabels={tag:"Balise",it:"Item type",concept:"Concept",chapter:"Chapitre"}
function buildHead(frag,helpCtx){return JSX.createElement("div",{class:frag.cls?"head "+frag.cls:"head tag"},JSX.createElement("span",{class:"headTi"},HELP.helpClsLabels[frag.cls||"tag"]))}HELP.buildHead=buildHead
function buildTitle(frag,helpCtx){if(frag.isTopic())return JSX.createElement("h2",null,frag.makeTitle(helpCtx))}HELP.buildTitle=buildTitle
function buildBody(frag,helpCtx){if(frag.hasBody())return frag.makeBody(helpCtx)}HELP.buildBody=buildBody
async function buildCallers(frag,helpCtx){if(frag.cls==="tag"){const parents=await helpCtx.helpDb.getIndexesWithRoleFor(frag,"structXml")
if(!parents||parents.length===0)return null
if(parents.length>12){const countContexts=parents.length
return JSX.createElement("div",{class:"xmlHier"},JSX.createElement("c-msg",{level:"info"},"Balise exploitée dans \",countContexts,\" contextes (non affichés)"))}const stacks=[]
for(const idxNode of parents){if(idxNode.isTreeNode()){const stack=[]
stacks.push(stack)
for(let n=idxNode;n;n=n.parent){stack.push(n.frag)}stack.reverse()}}stacks.sort((f1,f2)=>LOCALE.SORT_CMP.compare(f1[0].titleString,f2[0].titleString))
const r=JSX.createElement("div",{class:"xmlHier"})
_buildXmlEntry(stacks,r,helpCtx)
return r}else{const parents=await helpCtx.helpDb.getIndexesWithRoleFor(frag,"outline")
if(!parents||parents.length===0)return null
const r=JSX.createElement("div",{class:"stack"})
for(const parent of parents){if(parent.isTreeNode()){let p=parent
let ctn
while(p){const frag=p.frag
ctn=JSX.createElement("div",{class:"stackEntry"},JSX.createElement("a",{onclick:ev=>helpCtx.openFrag(frag,ev)},frag.makeTitle(helpCtx)),ctn)
p=p.parent}r.appendChild(JSX.createElement("div",{class:"stackLine"},ctn))}}return r}}HELP.buildCallers=buildCallers
function _buildXmlEntry(stacks,out,helpCtx){for(let i=0;i<stacks.length;i++){const line=out.appendChild(JSX.createElement("div",{class:"xmlLine"}))
const stack=stacks[i]
for(const frag of stack){if(line.hasChildNodes())line.appendChild(JSX.createElement("span",null," / "))
line.appendChild(JSX.createElement("a",{onclick:ev=>helpCtx.openFrag(frag,ev)},frag.makeTitle(helpCtx)))}}}})(HELP||(HELP={}))

//# sourceMappingURL=helpApi.js.map