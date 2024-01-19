import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{IO}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import{SrcAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/srcActions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class CreateVersion extends SrcAction{constructor(id){super(id||"createVersion")
this._label="Créer une version..."
this._group="versions"
this._enableSrcPerms=["action.vers#create.version"]
this.isBackendDb=true
this.exactOne=true}isVisible(ctx){const item=ctx.shortDescs[0]
if(item.srcLiveUri)return false
return super.isVisible(ctx)}async execute(ctx,ev){const comment=await POPUP.prompt("Entrez un commentaire pour cette version :",ctx.emitter)
if(comment!==undefined){const{wsp:wsp,universe:universe}=ctx.reg.env
const item=ctx.shortDescs[0]
try{await universe.wspServer.config.versionUrl.fetchVoid(IO.qs("cdaction","Create","param",wsp.code,"refUri",item.srcUri,"comment",comment))
const versions=await universe.wspServer.config.versionUrl.fetchJson(IO.qs("cdaction","List","param",wsp.code,"refUri",item.srcUri,"fields","srcVersLabel"))
const lastVersLabel=versions.vers[0].srcVersLabel
POPUP.showNotifInfo(`La version ${lastVersLabel} a été crée.`,ctx.emitter)}catch(e){await ERROR.report("Une erreur est survenue lors de la création de la version.",e,ctx)}}}}CreateVersion.SINGLETON=new CreateVersion
REG.reg.registerSvc("vers/createVersionAction",1,CreateVersion.SINGLETON)

//# sourceMappingURL=versActions.js.map