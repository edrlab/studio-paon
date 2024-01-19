import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{BaseAreaViewAsync,VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{isArea}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
export class ResLayoutView extends BaseAreaViewAsync{static loadLibs(views,ctx,promises){for(let v of views){if(v==null)continue
if(isArea(v)){if(v.needAsync(ctx))promises.push(v.loadLibs(ctx))}else if(typeof v==="object"){if(v.children)ResLayoutView.loadLibs(v.children,ctx,promises)
if(v.lib)promises.push(ctx.reg.env.resolver.importJs(v.lib))}}}static buildSrcView(v,parent,ctx,lastDatas){if(!v)return
if(typeof v==="string")parent.appendChild(document.createTextNode(v))
else if(isArea(v)){parent.appendChild(v.buildBody(ctx,lastDatas))}else{const tag=document.createElement(v.tag)
const atts=v.atts
if(atts)for(const att in atts)tag.setAttribute(att,atts[att])
if(tag instanceof BaseElement){tag.initialize(typeof v.init==="function"?v.init(ctx):BASIS.newInit(v.init,ctx.reg))}parent.appendChild(tag)
if(v.children)for(const subV of v.children){ResLayoutView.buildSrcView(subV,tag,ctx,lastDatas)}}}_initialize(init){super._initialize(init)
if(!init.noShadow){this._attach(this.localName,init)
if(init.scroll){this.reg.installSkin(init.scroll=="large"?"scroll/large":"scroll/small",this.shadowRoot)
this.style.overflow="auto"}}this.body=init.body
this._lastDatas=init.lastDatas||null
const loading=[]
ResLayoutView.loadLibs(this.body,this.reg,loading)
return Promise.all(loading)}visitViews(visitor,options){return VIEWS.visitDescendants(this.shadowRoot||this,visitor)}async visitViewsAsync(visitor,options){return VIEWS.visitDescendantsAsync(this.shadowRoot||this,visitor)}_refresh(){const lastDatas=this._lastDatas
if(lastDatas!==undefined){this._lastDatas=undefined
if(this.reg.isClosed)return
const root=this.shadowRoot||this
for(const v of this.body){ResLayoutView.buildSrcView(v,root,this.reg,lastDatas)}}else{if(this.shadowRoot){BASIS.refreshTree(this.shadowRoot)}else{BASIS.refreshTree(this,true)}}}}REG.reg.registerSkin("store-res-layout",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n`)
customElements.define("store-res-layout",ResLayoutView)

//# sourceMappingURL=resLayoutView.js.map