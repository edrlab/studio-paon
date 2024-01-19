import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
import{VIEWS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SRC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/src.js"
import{WSP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wsp.js"
import{ITEM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/item.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/widgets/ribbon/ribbon.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{EWspChangesEvts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/wsp/wspsLive.js"
import{newSrcView}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/itemMain.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js"
export class ItemIsolated extends BaseElementAsync{constructor(){super(...arguments)
this.shortDescs=[]}async _initialize(init){this.wsp=init.reg.env.wsp
this.infoBroker=init.reg.env.infoBroker
if(this.infoBroker)this.infoBroker.addConsumer(this)
const longDesc=await this.wsp.fetchLongDesc(init.srcRef)
const itemType=this.wsp.wspMetaUi.getItemType(longDesc.itModel)
this.reg=REG.createSubRegMixed(init.reg,itemType.reg)
this.reg.env.place=this.wsp.newPlaceWsp()
this.reg.env.longDesc=longDesc
this.shortDescs[0]=longDesc
this.reg.env.srcView=this
this.reg.env.longDescChange=new EventMgr
this.reg.env.securityCtx=SEC.createSub(init.reg.env.securityCtx,longDesc.srcRoles,longDesc.srcRi,longDesc)
this.reg.env.place.eventsMgr.on("wspUriChange",this.onWspUriChange.bind(this))
if(ITEM.isExtItem(longDesc.srcUri)){this.reg.env.place.getWsp(WSP.extractWspCdFromWspRef(longDesc.itFullUriInOwnerWsp))}return this._buildContent(init)}async _buildContent(init){this.attachShadow(DOMSH.SHADOWDOM_INIT)
this.reg.installSkin("webzone:page",this.shadowRoot)
this.reg.installSkin("wsp-itemisolated",this.shadowRoot)
this._initAndInstallSkin(this.localName,init)
const view=await newSrcView(this.reg.env.itemType.getIsolatedView(this.reg.env.longDesc),this.reg)
if(view)this.shadowRoot.appendChild(view)}onViewShown(){this.viewShown=true
if(this.view)VIEWS.onViewShown(this.view)}onViewHidden(closed){this.viewShown=false
if(closed){if(this.reg){this.reg.env.place.closePlace()
this.reg.close()}if(this.infoBroker)this.infoBroker.removeConsumer(this)}if(this.view)VIEWS.onViewHidden(this.view,closed)}visitViews(visitor,options){if(this.view){const r=visitor(this.view)
if(r!==undefined)return r}}async visitViewsAsync(visitor,options){if(this.view){const r=await visitor(this.view)
if(r!==undefined)return r}}onInfo(info){}async onWspUriChange(msg,from){if(msg.wspCd!==this.reg.env.wsp.code)return
const longDesc=this.reg.env.longDesc
if(SRC.srcRef(longDesc)===SRC.srcRef(msg)||msg.type===EWspChangesEvts.perm&&SRC.isSubUriOrEqual(msg.srcUri,longDesc.srcUri)){const ldNew=await this.reg.env.wsp.fetchLongDesc(SRC.srcRef(longDesc),this)
if(!this.isConnected)return
if(!this.wsp.isAvailable)await this.wsp.waitForAvailable(this)
this.reg.env.longDesc=ldNew
this.shortDescs[0]=ldNew
this.reg.env.securityCtx=SEC.createSub(this.reg.env.securityCtx,ldNew.srcRoles,ldNew.srcRi,ldNew)
this.reg.env.longDescChange.emit(ldNew,longDesc)}}get emitter(){return this}}REG.reg.registerSkin("wsp-itemisolated",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n\n\t[hidden] {\n\t\tdisplay: none !important;\n\t}\n`)
customElements.define("wsp-itemisolated",ItemIsolated)

//# sourceMappingURL=itemIsolated.js.map