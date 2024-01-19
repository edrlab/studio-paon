export class EventsMgr{on(event,listener,order){if(!this._listeners)this._listeners=Object.create(null)
let lstns=this._listeners[event]
if(!lstns)lstns=this._listeners[event]=new EventMgr
lstns.add(listener,order)
return this}once(event,listener,order){const onceLstn=(...args)=>{this.removeListener(event,onceLstn)
return listener(...args)}
return this.on(event,onceLstn,order)}onMany(events,listeners,order){if(Array.isArray(events)){for(const e of events)this.onMany(e,listeners,order)}else{if(Array.isArray(listeners)){for(const listener of listeners){this.on(events,listener,order)}}else{this.on(events,listeners,order)}}return this}removeListener(event,listener){const lstns=this._listeners[event]
if(lstns)lstns.delete(listener)
return this}removeAllListeners(event){if(event!=null){this._listeners[event]=null}else{this._listeners=null}return this}getListeners(event){if(!this._listeners)return[]
const lstns=this._listeners[event]
if(!lstns)return[]
return lstns.getListeners()}hasListeners(event){if(!this._listeners)return false
const lstns=this._listeners[event]
return lstns&&lstns.size>0}hasAnyListeners(){if(!this._listeners)return false
for(let k in this._listeners){if(this._listeners[k].size>0)return true}return false}emit(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
lstns.emit(...args)}emitCatched(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
lstns.emitCatched(...args)}async emitAsync(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
return lstns.emitAsync(...args)}async emitAsyncCatched(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
return lstns.emitAsyncCatched(...args)}emitUntil(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
return lstns.emitUntil(...args)}emitUntilAfter(event,lstn,callIt,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
return lstns.emitUntilAfter(lstn,callIt,...args)}async emitAsyncUntil(event,...args){if(!this._listeners)return
const lstns=this._listeners[event]
if(!lstns)return
return lstns.emitAsyncUntil(...args)}}export class EventMgr extends Set{add(lstn,order){if(!order){if(this._order){const ord=lstn[this._order]
if(ord>0)this._remAfter(lstn)
else if(ord<0)this._remBefore(lstn)}super.add(lstn)}else{if(!this._order)this._order=Symbol("_order")
if(order>0){if(!this.after)this.after=new Set
const oldOrd=lstn[this._order]
if(!oldOrd)this.delete(lstn)
else if(oldOrd<0)this._remBefore(lstn)
lstn[this._order]=order
this.after.add(lstn)
this._afterList=null}else{if(!this.before)this.before=new Set
const oldOrd=lstn[this._order]
if(!oldOrd)this.delete(lstn)
else if(oldOrd>0)this._remAfter(lstn)
lstn[this._order]=order
this.before.add(lstn)
this._beforeList=null}}return this}delete(lstn){const ord=this._order?lstn[this._order]:undefined
if(!ord){return super.delete(lstn)}else if(ord>0){return this._remAfter(lstn)}return this._remBefore(lstn)}clear(){super.clear()
if(this.after){this.after.clear()
this._afterList=null}if(this.before){this.before.clear()
this._beforeList=null}}forEach(callbackfn,thisArg){if(this.before)this.beforeList.forEach((value,idx,arr)=>{callbackfn.call(thisArg,value,value,this)},thisArg)
super.forEach(callbackfn,thisArg)
if(this.after)this.afterList.forEach((value,idx,arr)=>{callbackfn.call(thisArg,value,value,this)},thisArg)}has(lstn){const ord=this._order?lstn[this._order]:undefined
if(!ord){return super.has(lstn)}else if(ord>0){return this.after?this.after.has(lstn):false}return this.before?this.before.has(lstn):false}get size(){let s=super.size
if(this.after)s+=this.after.size
if(this.before)s+=this.before.size
return s}[Symbol.iterator](){return this.getListeners()[Symbol.iterator]()}getListeners(){const result=[]
if(this.before)result.push(...this.before)
result.push(...super.keys())
if(this.after)result.push(...this.after)
return result}emit(...args){if(this.before)for(const l of this.beforeList)l(...args)
for(const l of super.keys())l(...args)
if(this.after)for(const l of this.afterList)l(...args)}emitCatched(...args){if(this.before)for(const l of this.beforeList)try{l(...args)}catch(e){console.error(e)}for(const l of super.keys())try{l(...args)}catch(e){console.error(e)}if(this.after)for(const l of this.afterList)try{l(...args)}catch(e){console.error(e)}}async emitAsync(...args){if(this.before)for(const l of this.beforeList){const r=l(...args)
if(r instanceof Promise)await r}for(const l of super.keys()){const r=l(...args)
if(r instanceof Promise)await r}if(this.after)for(const l of this.afterList){const r=l(...args)
if(r instanceof Promise)await r}}async emitAsyncCatched(...args){if(this.before)for(const l of this.beforeList){try{const r=l(...args)
if(r instanceof Promise)await r}catch(e){console.error(e)}}for(const l of super.keys()){try{const r=l(...args)
if(r instanceof Promise)await r}catch(e){console.error(e)}}if(this.after)for(const l of this.afterList){try{const r=l(...args)
if(r instanceof Promise)await r}catch(e){console.error(e)}}}emitUntil(...args){if(this.before)for(const l of this.beforeList){const r=l(...args)
if(r!==undefined)return r}for(const l of super.keys()){const r=l(...args)
if(r!==undefined)return r}if(this.after)for(const l of this.afterList){const r=l(...args)
if(r!==undefined)return r}}emitUntilAfter(lstn,callIt,...args){let found=false
if(this.before)for(const l of this.beforeList){if(found){const r=l(...args)
if(r!==undefined)return r}else if(l===lstn){if(callIt){const r=l(...args)
if(r!==undefined)return r}found=true}}for(const l of super.keys()){if(found){const r=l(...args)
if(r!==undefined)return r}else if(l===lstn){if(callIt){const r=l(...args)
if(r!==undefined)return r}found=true}}if(this.after)for(const l of this.afterList){if(found){const r=l(...args)
if(r!==undefined)return r}else if(l===lstn){if(callIt){const r=l(...args)
if(r!==undefined)return r}found=true}}}async emitAsyncUntil(...args){if(this.before)for(const l of this.beforeList){let r=l(...args)
if(r instanceof Promise)r=await r
if(r!==undefined)return r}for(const l of super.keys()){let r=l(...args)
if(r instanceof Promise)r=await r
if(r!==undefined)return r}if(this.after)for(const l of this.afterList){let r=l(...args)
if(r instanceof Promise)r=await r
if(r!==undefined)return r}}get beforeList(){if(!this._beforeList){this._beforeList=[...this.before].sort((l1,l2)=>l1[this._order]-l2[this._order])}return this._beforeList}get afterList(){if(!this._afterList){this._afterList=[...this.after].sort((l1,l2)=>l1[this._order]-l2[this._order])}return this._afterList}_remBefore(listener){if(this.before){delete listener[this._order]
if(this.before.delete(listener)){this._beforeList=null
return true}}return false}_remAfter(listener){if(this.after){delete listener[this._order]
if(this.after.delete(listener)){this._afterList=null
return true}}return false}}export class EventsMgrProxy extends EventsMgr{constructor(target){super()
this.target=target}on(event,listener,order){this.target.on(event,listener,order)
super.on(event,listener,order)
return this}removeListener(event,listener){this.target.removeListener(event,listener)
super.removeListener(event,listener)
return this}removeAllListeners(event){if(event==null){for(const ev in this._listeners){const set=this._listeners[ev]
for(const lstn of set){this.target.removeListener(ev,lstn)}}this._listeners=null}else{const set=this._listeners[event]
if(set){for(const lstn of set){this.target.removeListener(event,lstn)}delete this._listeners[event]}}return this}switchTarget(newTarget,removeLstnOnOld){for(const event in this._listeners){const lstns=this._listeners[event]
for(const l of lstns){if(removeLstnOnOld)this.target.removeListener(event,l)
newTarget.on(event,l)}}this.target=newTarget}}export class EventsMgrCb extends EventsMgr{constructor(cb){super()
this.cb=cb}on(event,listener,order){super.on(event,listener,order)
this.cb()
return this}removeListener(event,listener){super.removeListener(event,listener)
this.cb()
return this}removeAllListeners(event){super.removeAllListeners(event)
this.cb()
return this}}
//# sourceMappingURL=events.js.map