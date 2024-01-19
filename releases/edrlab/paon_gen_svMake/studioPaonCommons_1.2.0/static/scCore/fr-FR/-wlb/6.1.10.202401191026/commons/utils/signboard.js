import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export class Signboard{constructor(id){this._id=id!=null?id:"?"}getId(){return this._id}getLabel(ctx){return typeof this._label==="function"?this._label(ctx,this):this._label!==undefined?this._label:this._id}setLabel(label){this._label=label
return this}getDescription(ctx){return typeof this._description==="function"?this._description(ctx,this):this._description}setDescription(description){this._description=description
return this}getIcon(ctx){return typeof this._icon==="function"?this._icon(ctx,this):this._icon}setIcon(icon){this._icon=icon
return this}getGroup(ctx){return typeof this._group==="function"?this._group(ctx,this):this._group}setGroup(group){this._group=group
return this}getSkin(ctx){return typeof this._skin==="function"?this._skin(ctx,this):this._skin}setSkin(skin){this._skin=skin
return this}getSkinOver(ctx){return typeof this._skinOver==="function"?this._skinOver(ctx,this):this._skinOver}setSkinOver(skinOver){this._skinOver=skinOver
return this}getLastDatasKey(ctx){return typeof this._lastDatasKey==="function"?this._lastDatasKey(ctx,this):this._lastDatasKey}setLastDatasKey(lastDatasKey){this._lastDatasKey=lastDatasKey
return this}initLastDatas(ctx,lastDatas,init){const k=this.getLastDatasKey(ctx)
if(k){init.lastDatasKey=k
if(lastDatas)init.lastDatas=lastDatas[k]}else if(lastDatas){init.lastDatas=lastDatas}return init}requireVisiblePerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireVisiblePerm(perms[i])}else{if(!this._visPerms)this._visPerms=perms
else{if(typeof this._visPerms==="string")this._visPerms=[this._visPerms]
if(this._visPerms.indexOf(perms)==-1)this._visPerms.push(perms)}}}return this}requireEnabledPerm(perms){if(perms){if(Array.isArray(perms)){for(let i=0;i<perms.length;i++)this.requireEnabledPerm(perms[i])}else{if(!this._enablePerms)this._enablePerms=perms
else{if(typeof this._enablePerms==="string")this._enablePerms=[this._enablePerms]
if(this._enablePerms.indexOf(perms)==-1)this._enablePerms.push(perms)}}}return this}isVisible(ctx){if(typeof this._visible==="function"&&this._visible(ctx,this)===false)return false
if(this._visible===false)return false
return this.checkObjectRootVisiblePerm(ctx)}setVisible(visible){this._visible=visible
return this}isEnabled(ctx){if(typeof this._enabled==="function"&&this._enabled(ctx,this)===false)return false
if(this._enabled===false)return false
return this.checkObjectRootPerm(ctx)}setEnabled(enabled){this._enabled=enabled
return this}isAvailable(ctx){return this.isVisible(ctx)&&this.isEnabled(ctx)}setInstantiable(instantiable){this._instantiable=instantiable
return this}isInstantiable(ctx){return true}checkObjectRootVisiblePerm(ctx,perms,and){if(!perms)perms=this._visPerms
return perms?REG.getReg(ctx).hasPerm(perms,ctx.securityCtx,and):true}checkObjectRootPerm(ctx,perms,and){if(!perms)perms=this._enablePerms
return perms?REG.getReg(ctx).hasPerm(perms,ctx.securityCtx,and):true}getEnablePerms(){return this._enablePerms}getVisiblePerms(){return this._visPerms}toString(){return this._id}}export function isRefreshHook(c){return c&&"onRefreshCycle"in c}
//# sourceMappingURL=signboard.js.map