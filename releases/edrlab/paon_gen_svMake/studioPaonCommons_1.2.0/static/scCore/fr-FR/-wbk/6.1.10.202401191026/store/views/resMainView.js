import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{DownloadRes,EditMetasRes,EditPermsRes,ImportRes,MoveRes,OpenViewRes,RemoveRes,RenameRes,VisStateRes}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/actions/resActions.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/widgets/resGrid.js"
function addEditAction(action){REG.reg.addToList("actions:depot:resMainView:edit",action.getId(),1,action)}addEditAction(new ImportRes)
addEditAction(new EditMetasRes)
addEditAction(new EditPermsRes)
addEditAction(new MoveRes)
addEditAction(new RenameRes)
addEditAction(new VisStateRes)
addEditAction(new RemoveRes)
function addInfoAction(action){REG.reg.addToList("actions:depot:resMainView:infos",action.getId(),1,action)}addInfoAction(new OpenViewRes)
addInfoAction(new Action("infoDetails").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/views/resViews/info.svg").setLabel("Informations détaillées").setExecute(async(ctx,ev)=>{const infoArea=ctx.reg.env.resType.resView("infos")
const from=ev.target
const ct=await infoArea.loadBody(ctx)
if(ct.shadowRoot)ctx.reg.installSkin("webzone:page",ct.shadowRoot)
if(!from.isConnected)return
POPUP.showFloating(popup=>ct,from,from,{closeOnBlur:true})}))
addInfoAction(new DownloadRes(null,null).setVisible(ctx=>{if(ctx.reg.env.resType.prcIsFolder)return false}))
REG.reg.registerSkin("store-res-main",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t}\n\n\t[hidden] {\n\t\tdisplay: none;\n\t}\n\n\theader {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\tpadding: .7em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tstore-res-anc {\n\t\tflex: 1;\n\t}\n\n\t#resEdit {\n\t\tflex-wrap: wrap;\n\t\tjustify-content: flex-end;\n\t}\n\n\tmain {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tmax-width: 60em;\n\t\tbox-sizing: border-box;\n\t\twidth: 100%;\n\t\tpadding: 1em 1em 0;\n\t\talign-self: center;\n\t}\n\n\tstore-res-infos {\n\t\tmargin-bottom: 1em;\n\t}\n\n\tstore-res-infos:last-child {\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n`)
REG.reg.registerSkin("store-res-titlebar",1,`\n\t:host {\n\t\tflex-shrink: 0;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tpadding: 0 .5em;\n\t}\n\n\t#title, #version {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t\tmargin-bottom: 1em;\n\t}\n\n\t.label {\n\t\tfont-variant: all-small-caps;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t.icon {\n\t\tfilter: var(--filter);\n\t\theight: 2em;\n\t}\n\n\n\t#nameCtn {\n\t\tflex: 1;\n\t\tmargin: 0 .5em;\n\t  font-size: 1.6em;\n\t}\n\n\t.name {\n\t\tfont-weight: bold;\n\t}\n\n\t.unlisted {\n\t\tbackground: no-repeat right .2em top .2em / .5em url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/limited.svg);\n\t\tpadding-inline-end: 1em;\n\t}\n\n\t.trashed {\n\t\tbackground: no-repeat right .2em top .2em / .5em url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/store/states/invisible.svg);\n\t\tpadding-inline-end: 1em;\n\t}\n\n\n  #version > store-res-versions {\n\t  flex: 1;\n\t  background-color: var(--alt1-bgcolor);\n\t  background-position: right .3em center;\n\t  border-radius: .4em;\n\t  font-weight: bold;\n\t  margin-inline-end: .5em;\n\t  justify-content: start;\n\t  opacity: 1 !important;\n\t  padding: .3em .5em;\n  }\n\n  #versionInTi {\n\t  padding-inline-start: .3em;\n\t  color: var(--alt1-color);\n  }\n  \n  #versionInTi > store-res-versions {\n\t  display: inline;\n\t  font-size: 1em;\n\t  padding-inline-start: 1.1em;\n\t  padding-inline-end: 0;\n\t  background: var(--dropdown-url) no-repeat left / 1em;\n  }\n`)

//# sourceMappingURL=resMainView.js.map