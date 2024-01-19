import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export class UserDatasSrv{constructor(config){this.config=config}connectToAuth(auth){this.auth=auth
this.auth.listeners.on("loggedUserChanged",()=>this.loadDatas(),-1)}connectToWs(ws){ws.msgListeners.on("userDatas",m=>{if(m.srcUri.substring(1)===this.getPath())this.loadDatas()})}async loadDatas(){if(!this.auth||this.auth.currentUser){try{if(this.config.useLocalStorage){const d=localStorage.getItem(this.getLocalStorageKey())
this.userDatas=d?JSON.parse(d):{}}else{this.userDatas=await this.config.userDatasUrl.fetchJson(this.getPath())||{}}}catch(e){ERROR.reportError(e)
this.userDatas={}}}else{this.userDatas={}}}getUserData(key,defaultVal){return this.userDatas[key]}async setUserDatas(datas){Object.assign(this.userDatas,datas)
if(!this.auth||this.auth.currentUser){if(this.config.useLocalStorage){localStorage.setItem(this.getLocalStorageKey(),JSON.stringify(this.userDatas))}else{await this.config.userDatasUrl.fetch(this.getPath(),"none",{method:"PUT",body:JSON.stringify(this.userDatas)})}}}}export class DeskUserDatasSrv extends UserDatasSrv{getCode(){var _a
if(!this._code)this._code=this.config.code||((_a=window.desk)===null||_a===void 0?void 0:_a.name)||"none"
return this._code}getLocalStorageKey(){var _a
return`userDatas:desk:${this.getCode()}:${((_a=this.auth)===null||_a===void 0?void 0:_a.currentAccount)||""}`}getPath(){return`front_${this.getCode()}.json`}}export function configUserDatasSrv(authenticatedExecFrameUrl,config){if(config===null)return null
if(config instanceof UserDatasSrv)return config
if(!config)config={}
if(!config.userDatasUrl)config.userDatasUrl=authenticatedExecFrameUrl.resolve("u/userDatas/")
return config}
//# sourceMappingURL=userDatas.js.map