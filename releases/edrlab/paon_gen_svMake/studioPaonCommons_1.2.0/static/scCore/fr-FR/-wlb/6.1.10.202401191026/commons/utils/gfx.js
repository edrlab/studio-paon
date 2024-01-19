import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export var GFX;(function(GFX){function getLogicalRect(rect,inverseInline,swapBlockAndInline){if(swapBlockAndInline){return{blockStart:rect.left,blockEnd:rect.right,blockSize:rect.width,inlineStart:inverseInline?rect.bottom:rect.top,inlineEnd:inverseInline?rect.top:rect.bottom,inlineSize:rect.height}}else{return{blockStart:rect.top,blockEnd:rect.bottom,blockSize:rect.height,inlineStart:inverseInline?rect.right:rect.left,inlineEnd:inverseInline?rect.left:rect.right,inlineSize:rect.width}}}GFX.getLogicalRect=getLogicalRect
function getContextBoundingRect(elt){let r=elt.getBoundingClientRect()
while(r.top===0&&r.left===0&&r.height===0&&r.width===0){elt=DOMSH.getFlatParentElt(elt)
if(!elt)return null
r=elt.getBoundingClientRect()}return r}GFX.getContextBoundingRect=getContextBoundingRect
function getOffsetRect(elt){return{top:elt.offsetTop,height:elt.offsetHeight,bottom:elt.offsetTop+elt.offsetHeight,left:elt.offsetLeft,width:elt.offsetWidth,right:elt.offsetLeft+elt.offsetWidth}}GFX.getOffsetRect=getOffsetRect
function getScrollRect(elt){return{top:elt.scrollTop,height:elt.scrollHeight,bottom:elt.scrollTop+elt.scrollHeight,left:elt.scrollLeft,width:elt.scrollWidth,right:elt.scrollLeft+elt.scrollWidth}}GFX.getScrollRect=getScrollRect
function isPointIn(rect,x,y){return rect.left<=x&&rect.right>=x&&rect.top<=y&&rect.bottom>=y}GFX.isPointIn=isPointIn
function bound(min,val,max){return Math.max(min,Math.min(val,max))}GFX.bound=bound
function intersect(r1,r2){const x1=Math.max(r1.left,r2.left)
const x2=Math.min(r1.right,r2.right)
if(x1>x2)return null
const y1=Math.max(r1.top,r2.top)
const y2=Math.min(r1.bottom,r2.bottom)
return y1>y2?null:new DOMRect(x1,y1,x2-x1,y2-y1)}GFX.intersect=intersect
function vecLength(point1,point2){return Math.hypot(point2.x-point1.x,point2.y-point1.y)}GFX.vecLength=vecLength
function getContainerOrient(from){let st=window.getComputedStyle(from)
while(st.display==="contents"){from=DOMSH.getFlatParentElt(from)
st=window.getComputedStyle(from)}if(st.display==="block"||st.display==="table-cell"||st.display==="list-item"||st.flexDirection==="column"||st.flexDirection==="column-reverse")return"v"
return"h"}GFX.getContainerOrient=getContainerOrient})(GFX||(GFX={}))
export var SVG;(function(SVG){function assignRectLengths(svgElem,lengths){for(const key in lengths){svgElem[key].baseVal.value=lengths[key]}}SVG.assignRectLengths=assignRectLengths})(SVG||(SVG={}))

//# sourceMappingURL=gfx.js.map