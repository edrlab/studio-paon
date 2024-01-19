import{UiCritArea,UiCritBase}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/search/uiCrit.js"
import{SearchItemLinks,SearchItemPropsDate,SearchItemPropsNumber,SearchItemPropsRegexp}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/search.js"
import{JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{InputPeriod}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputPeriod.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SrcPointerFastSelect,SrcPointerInline}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/srcDrawer.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
class ItemPropsCritBase extends UiCritBase{_initialize(init){super._initialize(init)}getUiCritXmlAtt(){return this.critArea.getId()}}export class UiPropsCritStringArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("string").setReplacePattern(/\bstring\b/)}buildAbstract(xml,ctx,options){const txt=xml.getAttribute("uiTextSearch")||""
const opts=xml.getAttribute("uiOptions")||""
return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx))," contient '",JSX.createElement("span",{class:"critVal"},txt),"'",opts.indexOf(";w;")>=0?", mot entier":undefined,opts.indexOf(";c;")>=0?", casse respectée":undefined)}buildBody(ctx){let elt=new ItemPropsCritString(this.params)
elt.critArea=this
return elt}}export class ItemPropsCritString extends ItemPropsCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),JSX.createElement("input",{type:"search",oninput:this.onChange,placeholder:init.placeholder}),this.insertAlternativesBtn(init)))
this._text=head.querySelector("input")
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)
const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
this._ignoreCase=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Respect de la casse")).firstElementChild
this._wholeWord=optsRoot.appendChild(JSX.createElement("label",{class:"opt"},JSX.createElement("input",{type:"checkbox",onclick:this.onChange}),"Mot entier")).firstElementChild}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit){crit.setAttribute("uiTextSearch",this._text.value)
let opts
if(this._ignoreCase.checked){opts=this._wholeWord.checked?";c;w;":";c;"}else if(this._wholeWord.checked){opts=";w;"}if(this._ignoreCase.checked)opts+=opts
crit.setAttribute("uiOptions",opts)}return crit}async initFromXmlCrit(xml){this._text.value=xml.getAttribute("uiTextSearch")||""
const opts=xml.getAttribute("uiOptions")||""
this._ignoreCase.checked=opts.indexOf(";c;")>=0
this._wholeWord.checked=opts.indexOf(";w;")>=0
return this}buildCrit(){const v=this._text.value
let regExp
if(this.param.buildRegExp)regExp=this.param.buildRegExp(v,{ignoreCase:this._ignoreCase.checked,wholeWord:this._wholeWord.checked})
else if(v){let strPattern=this.param.fuzzy===false?LANG.escape4Regexp(v):LANG.escape4RegexpFuzzy(v)
regExp=new RegExp(this._wholeWord.checked?strPattern:".*"+strPattern+".*",this._ignoreCase.checked?"i":"")}return regExp?new SearchItemPropsRegexp(this.param.propName||this.critArea.getId(),regExp,this.param.multivalued):undefined}}customElements.define("wsp-itemcrit-props-string",ItemPropsCritString)
export class UiPropsCritFixedRegExpArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("fixedRegexp").setReplacePattern(/\bfixed\b/)}buildAbstract(xml,ctx,options){return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx)))}buildBody(ctx){let elt=new ItemPropsCritFixedRegExp(this.params)
elt.critArea=this
return elt}}export class ItemPropsCritFixedRegExp extends ItemPropsCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),this.insertAlternativesBtn(init)))
const optsRoot=sr.appendChild(JSX.createElement("div",{class:"h"}))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)}async initFromXmlCrit(xml){return this}buildCrit(){return new SearchItemPropsRegexp(this.param.propName||this.critArea.getId(),this.param.regExp,this.param.multivalued)}}customElements.define("wsp-itemcrit-props-fixed-regexp",ItemPropsCritFixedRegExp)
export class UiPropsCritEnumArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("enum").setReplacePattern(/\benum\b/)}buildAbstract(xml,ctx,options){const keys=xml?(xml.getAttribute("uiTextSearch")||"").split("|"):[]
const opts=xml.getAttribute("uiOptions")||""
const labels=[]
keys.forEach(key=>{const dataEntry=this.params.enums&&this.params.enums[key]?this.params.enums[key]:null
labels.push(dataEntry?dataEntry.label:key)})
let valTag=JSX.createElement("span",{class:"critVal"},labels.join(", "))
return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx))," contient '",valTag,"'")}buildBody(ctx){let elt=new ItemPropsCritEnum(this.params)
elt.critArea=this
return elt}}export class ItemPropsCritEnum extends ItemPropsCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._selectElt=JSX.createElement("select",{name:name,onchange:this.onChange})
this._selectElt.multiple=this.param.multiple?true:false
function appendSubs(parent,enums){for(const key in enums){const data=enums[key]
const option=data.type==="sub"?parent.appendChild(JSX.createElement("optgroup",{label:data.label})):parent.appendChild(JSX.createElement("option",{value:key},data.label))
if(data.description)option.title=data.description
if(data.type==="sub")appendSubs(option,data.enums)}}appendSubs(this._selectElt,this.param.enums)
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),this._selectElt,this.insertAlternativesBtn(init)))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit){let v=[]
if(this._selectElt.selectedOptions){for(const o of this._selectElt.selectedOptions)v.push(o.value)}crit.setAttribute("uiTextSearch",v.join("|"))}return crit}async initFromXmlCrit(xml){let currentValue=xml?(xml.getAttribute("uiTextSearch")||"").split("|"):[]
for(const opt of this._selectElt.options){opt.selected=currentValue.includes(opt.value)?true:false}return this}buildCrit(){const v=[]
if(this._selectElt.selectedOptions){for(const o of this._selectElt.selectedOptions)v.push(o.value)}let regExp
if(this.param.buildRegExp)regExp=this.param.buildRegExp(v,{ignoreCase:false,wholeWord:true})
else if(v.length>0){v.forEach((entry,pos,array)=>array[pos]=this.param.fuzzy===false?LANG.escape4Regexp(entry):LANG.escape4RegexpFuzzy(entry))
regExp=new RegExp(v.join("|"))}return regExp?new SearchItemPropsRegexp(this.param.propName||this.critArea.getId(),regExp,this.param.multivalued):undefined}}customElements.define("wsp-itemcrit-props-enum",ItemPropsCritEnum)
REG.reg.registerSkin("wsp-itemcrit-props-enum",1,`\n\toption {\n\t\tmargin-inline-start: 1em;\n\t}\n\n\tselect {\n\t\tmin-width: 1.5em;\n\t\tflex: 1;\n\t\tdisplay: inline-block;\n\t\ttext-overflow: ellipsis;\n\t\tfont-size: inherit;\n\t}\n`)
export class UiPropsCritNumberArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("number").setReplacePattern(/\bnumber\b/)}buildAbstract(xml,ctx,options){const operator=JSX.createElement("span",{class:"critVal"},UiPropsCritNumberArea.OP[xml.getAttribute("op")][1])
const value=JSX.createElement("span",{class:"critVal"},xml.getAttribute("value"))
return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx))," ",operator," ",value)}buildBody(ctx){let elt=new ItemPropsCritNumber(this.params)
elt.critArea=this
return elt}}UiPropsCritNumberArea.OP={gt:["Valeur supérieure à",">"],"gt=":["Valeur supérieure ou égale à",">="],lt:["Valeur inférieure à","<"],"lt=":["Valeur inférieure ou égale à","<="],"=":["Valeur égale à","="]}
export class ItemPropsCritNumber extends ItemPropsCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
this._opElt=JSX.createElement("select",{onchange:this.onChange},JSX.createElement("option",{value:"gt",selected:true},UiPropsCritNumberArea.OP["gt"][0]),JSX.createElement("option",{value:"gt="},UiPropsCritNumberArea.OP["gt="][0]),JSX.createElement("option",{value:"lt"},UiPropsCritNumberArea.OP["lt"][0]),JSX.createElement("option",{value:"lt="},UiPropsCritNumberArea.OP["lt="][0]),JSX.createElement("option",{value:"="},UiPropsCritNumberArea.OP["="][0]))
this._opValueElt=JSX.createElement("input",{value:"0",type:"number",min:"0",step:"1",oninput:this.onChange,onchange:this.onChange})
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),JSX.createElement("div",{class:"h"},this._opElt,this._opValueElt),this.insertAlternativesBtn(init)))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)}async initFromXmlCrit(xml){if(xml&&xml.hasAttribute("op"))this._opElt.value=xml.getAttribute("op")
if(xml&&xml.hasAttribute("value"))this._opValueElt.value=xml.getAttribute("value")
return this}buildCrit(){const v=Number.parseInt(this._opValueElt.value)
if(Number.isInteger(v))return new SearchItemPropsNumber(this.param.propName||this.critArea.getId(),this._opElt.value,v,this.param.multivalued)
return undefined}}customElements.define("wsp-itemcrit-props-number",ItemPropsCritNumber)
REG.reg.registerSkin("wsp-itemcrit-props-number",1,`\n\toption {\n\t\tmargin-inline-start: 1em;\n\t}\n\n\tselect {\n\t\tmin-width: 1.5em;\n\t\tflex: 1;\n\t\tdisplay: inline-block;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\tinput {\n\t\tdisplay: inline-block;\n\t\tmin-width: 1.5em;\n\t\tflex: 1;\n\t}\n`)
export class UiPropsCritDateArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("date").setReplacePattern(/\bdate\b/)}buildAbstract(xml,ctx,options){return JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx)))}buildBody(ctx){let elt=new ItemPropsCritDate(this.params)
elt.critArea=this
return elt}}export class ItemPropsCritDate extends ItemPropsCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
let modes
switch(this.param.format){case"future,past":modes=InputPeriod.buildDefaultModes_futurAndPast()
break
case"future":modes=InputPeriod.buildDefaultModes_futur()
break}this._dateElt=(new InputPeriod).initialize({defaultLabel:"Choisir une valeur...",modes:modes})
this._dateElt.addEventListener("change",this.onChange)
this._dateElt.addEventListener("input",this.onChange)
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),this._dateElt,this.insertAlternativesBtn(init)))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)}buildUiXmlCrit(){const crit=super.buildUiXmlCrit()
if(crit){if(crit&&this._dateElt.isSpecified()){crit.setAttribute("uiCurrentMode",this._dateElt.currentMode.getId())
if(this._dateElt.date1.valueAsNumber)crit.setAttribute("uiCurrentLess",this._dateElt.date1.valueAsNumber.toString())
if(this._dateElt.date2.valueAsNumber)crit.setAttribute("uiCurrentMore",this._dateElt.date2.valueAsNumber.toString())}}return crit}async initFromXmlCrit(xml){this._dateElt.reset(xml.getAttribute("uiCurrentMode"),xml.hasAttribute("uiCurrentLess")?Number.parseInt(xml.getAttribute("uiCurrentLess")):null,xml.hasAttribute("uiCurrentMore")?Number.parseInt(xml.getAttribute("uiCurrentMore")):null)
return this}buildCrit(){if(this._dateElt.isSpecified())return SearchItemPropsDate.buildFromInputPeriod(this._dateElt,this.param.propName||this.critArea.getId(),this.param.multivalued)
return undefined}}customElements.define("wsp-itemcrit-props-date",ItemPropsCritDate)
export class UiPropsCritRefArea extends UiCritArea{constructor(id,params,libs){super(id,libs)
this.params=params
this.setCritSgn("ref")}buildAbstract(xml,ctx,options){const path=xml.getAttribute("path")||""
const val=JSX.createElement("span",{class:"critVal"},path?path:"indéfini")
const result=JSX.createElement("span",{class:"crit"},JSX.createElement("span",{class:"critTitle"},this.getLabel(ctx))," contient '",val,"'")
if(path){let srcPointer=JSX.createElement(SrcPointerInline,{"î":{reg:ctx.reg}})
Promise.resolve(srcPointer.setSrcRef(path)).then(()=>{val.innerText=""
val.appendChild(srcPointer)})}return result}buildWedSearch(xml,criterions){return{searchId:"item",findRef:xml.getAttribute("path")}}buildBody(ctx){let elt=new ItemPropsCritRef(this.params)
elt.critArea=this
return elt}}export class ItemPropsCritRef extends UiCritBase{constructor(param){super()
this.param=param}_initialize(init){super._initialize(init)
const sr=this.shadowRoot
const sngs=[]
if(this.reg.env.wsp.wspMetaUi){this.param.whiteList.forEach(entry=>{const it=this.reg.env.wsp.wspMetaUi.getItemType(entry.itModel)
if(it)sngs.push(LANG.escape4Regexp(it.getSgn()))})}this.itemPtr=JSX.createElement(SrcPointerInline,{"î":{reg:this.reg,defaultAction:SrcPointerFastSelect.SINGLETON,sgnPattern:new RegExp("("+sngs.join("|")+")")}})
const icon=this.critArea?this.critArea.getIcon({reg:this.reg}):null
const img=icon?JSX.createElement("img",{src:icon}):null
const head=sr.appendChild(JSX.createElement("div",{class:"critHead"},img,JSX.createElement("span",{class:"critTitle"},this.critArea?this.critArea.getLabel({reg:this.reg}):""),this.itemPtr,this.insertAlternativesBtn(init)))
UiCritBase.initHeadFromArea(this.critArea,{reg:this.reg},head)
this.itemPtr.onSrcRefChange.add(this.onChange)}async initFromXmlCrit(xml){const path=xml.getAttribute("path")
if(path){await this.itemPtr.setSrcRef(path)
if(!this.itemPtr.shortDesc||ITEM.getSrcUriType(this.itemPtr.shortDesc.srcUri)!="item")this.itemPtr.setSrcRef(null)}return this}async initFromInsAction(xml){const path=xml?xml.getAttribute("path"):null
if(path){await this.itemPtr.setSrcRef(path)
if(!this.itemPtr.shortDesc||ITEM.getSrcUriType(this.itemPtr.shortDesc.srcUri)!="item"){this.itemPtr.setSrcRef(null)
await this.itemPtr.openFastSelect()}}else if(!this.itemPtr.srcRef){await this.itemPtr.openFastSelect()}return this}buildCrit(){if(this.itemPtr.shortDesc){const whiteElt=this.param.whiteList.find(entry=>entry.itModel===this.itemPtr.shortDesc.itModel)
const exp=new SearchItemLinks("LinkParents").setPath(this.itemPtr.srcRef)
if(whiteElt&&whiteElt.lnkTraits)exp.setLinkTraitFilter(whiteElt.lnkTraits.join("|"))
return exp}}getUiCritXmlAtt(){return this.critArea.getId()}}customElements.define("wsp-itemcrit-props-ref",ItemPropsCritRef)

//# sourceMappingURL=itemPropsCrit.js.map