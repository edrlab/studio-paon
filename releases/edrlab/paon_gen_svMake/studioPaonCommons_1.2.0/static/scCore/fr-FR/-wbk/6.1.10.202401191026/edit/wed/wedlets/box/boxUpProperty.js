import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
export class BoxUpProperty extends HTMLElement{constructor(){super()
this.style.userSelect="none"}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.propertyName=tpl.getAttribute("name")
this.upSelector=tpl.getAttribute("upSelector")}refreshBindValue(val){this.textContent=findAttributeValue(this.wedlet,this.propertyName,this.upSelector)}}window.customElements.define("box-up-property",BoxUpProperty)
function findAttributeValue(wedlet,attributeName,upSelector){const axePos=upSelector.indexOf(":")
if(axePos!=-1){const axe=upSelector.substring(0,axePos)
let minLevel
let maxLevel
const bounds=upSelector.substring(axePos+1)
if(bounds.indexOf(":")>-1){minLevel=parseInt(bounds.substring(0,bounds.indexOf(":")),10)
maxLevel=parseInt(bounds.substring(bounds.indexOf(":")+1),10)}else{minLevel=0
maxLevel=parseInt(bounds,10)}switch(axe){case"down":for(let i=0;wedlet&&i<minLevel;i++)wedlet=wedlet.wedParent
let lastFindPlaceholder=""
for(let i=minLevel;wedlet&&i<maxLevel;i++){wedlet=wedlet.wedParent
if(wedlet&&isWedletSingleElt(wedlet)&&wedlet.element.getAttribute(attributeName))lastFindPlaceholder=wedlet.element.getAttribute(attributeName)}return lastFindPlaceholder
break
case"up":for(let i=0;wedlet&&i<minLevel;i++)wedlet=wedlet.wedParent
for(let i=minLevel;wedlet&&i<maxLevel;i++){if(wedlet&&isWedletSingleElt(wedlet)&&wedlet.element.getAttribute(attributeName)){return wedlet.element.getAttribute(attributeName)}wedlet=wedlet.wedParent}break
default:throw"axe unknown in : "+upSelector}}else{const up=parseInt(upSelector,10)
for(let i=0;wedlet&&i<up;i++)wedlet=wedlet.wedParent
if(wedlet&&isWedletSingleElt(wedlet))return wedlet.element.getAttribute(attributeName)}}
//# sourceMappingURL=boxUpProperty.js.map