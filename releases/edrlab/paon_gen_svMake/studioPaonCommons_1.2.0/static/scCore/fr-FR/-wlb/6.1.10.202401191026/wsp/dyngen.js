export var DYNGEN;(function(DYNGEN){function getOriginFrom(elt){const origin={}
const oriPath=[]
do{const ori=elt.getAttribute("data-origin")
if(ori){if(ori.charAt(0)==="@"){const sep=ori.indexOf("?",1)
origin.srcRef=ori.substring(1,sep)
const sep2=ori.indexOf("#",sep)
origin.lastModif=parseInt(sep2>0?ori.substring(sep+1,sep2):ori.substring(sep+1))
if(sep2>0)oriPath.push(ori.substring(sep2+1))
origin.oriPath=oriPath.reverse().join("/")
return origin}else{oriPath.push(ori)}}}while(elt=elt.parentElement)
return origin}DYNGEN.getOriginFrom=getOriginFrom
function getSrcRefFrom(elt){do{const ori=elt.getAttribute("data-origin")
if(ori){if(ori.charAt(0)==="@"){return ori.substring(1,ori.indexOf("?",1))}}}while(elt=elt.parentElement)
return null}DYNGEN.getSrcRefFrom=getSrcRefFrom
function findSrcRefs(from,cb){const tw=from.ownerDocument.createTreeWalker(from,NodeFilter.SHOW_ELEMENT)
do{const ori=tw.currentNode.getAttribute("data-origin")
if(ori&&ori.charAt(0)==="@"){const sep=ori.indexOf("?",1)
const srcRef=ori.substring(1,sep)
const sep2=ori.indexOf("#",sep)
const lastModif=parseInt(sep2>0?ori.substring(sep+1,sep2):ori.substring(sep+1))
if(cb(tw.currentNode,srcRef,lastModif)==="stop")return}}while(tw.nextNode())}DYNGEN.findSrcRefs=findSrcRefs
function updateOrigin(from,srcRef,path,delta){const depthDelta=path.length-1
const fragDelta=path[depthDelta]
const depths=[]
let lastDepth=null
let elt=from
function findNewDepth(ori,offsetPath){const frags=ori.substring(offsetPath).split("/")
if(lastDepth<0){return lastDepth-frags.length}else{let currentDepth=lastDepth
for(let i=0;i<frags.length;i++){const frag=parseInt(frags[i],10)
if(currentDepth===depthDelta){if(frag>=fragDelta){frags[i]=(frag+delta).toString()
elt.setAttribute("data-origin",ori.substring(0,offsetPath)+frags.join("/"))}return-(lastDepth+frags.length)}if(frag!==path[currentDepth])return-(lastDepth+frags.length)
currentDepth++}return currentDepth}}while(elt){let newDepth=lastDepth
const ori=elt.getAttribute("data-origin")
if(ori){if(lastDepth===null){if(ori.charAt(0)==="@"){const sep=ori.indexOf("?",1)
if(srcRef===ori.substring(1,sep)){lastDepth=0
const sep2=ori.indexOf("#",sep)
newDepth=sep2>0?findNewDepth(ori,sep2+1):0}}}else{if(ori.charAt(0)==="@"){const sep=ori.indexOf("?",1)
if(srcRef===ori.substring(1,sep)){lastDepth=0
const sep2=ori.indexOf("#",sep)
newDepth=sep2>0?findNewDepth(ori,sep2+1):0}else{newDepth=null}}else{newDepth=findNewDepth(ori,0)}}}if(elt.firstElementChild){depths.push(newDepth)
lastDepth=newDepth
elt=elt.firstElementChild}else{if(elt===from)return
while(!elt.nextElementSibling){elt=elt.parentElement
if(elt===from)return
depths.splice(depths.length-1,1)
lastDepth=depths[depths.length-1]}elt=elt.nextElementSibling}}}DYNGEN.updateOrigin=updateOrigin
function encodeUrl2(val){return encodeURIComponent(val.replace(/[\/:@\!\(\)\'\*]/g,encodeUrl2Esc)).replace(/\%/g,"*")}DYNGEN.encodeUrl2=encodeUrl2
function encodeUrl2Esc(match){switch(match){case"/":return"!"
case":":return"("
case"@":return")"
case"!":return"'!"
case"(":return"'("
case")":return"')"
case"'":return"''"
case"*":return"'*"}}})(DYNGEN||(DYNGEN={}))

//# sourceMappingURL=dyngen.js.map