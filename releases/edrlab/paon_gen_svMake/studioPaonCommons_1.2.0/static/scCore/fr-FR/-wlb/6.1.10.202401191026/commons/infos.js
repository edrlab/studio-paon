export class InfoReqObject{constructor(sgnObject){this.sgnObject=sgnObject}}export function isInfoBrokerPointer(ibp){return(ibp===null||ibp===void 0?void 0:ibp.infoBroker)!=null}export class InfoBrokerBasic{constructor(){this.consumers=new Set}addConsumer(consumer){this.consumers.add(consumer)}removeConsumer(consumer){this.consumers.delete(consumer)}dispatchInfo(info,from){if(info.infoHolders)info.infoHolders.push(from)
else info.infoHolders=[from]
for(const c of this.consumers){if(c!==from)try{c.onInfo(info)}catch(e){console.error(e)}}}removeAllConsumers(){this.consumers.clear()}dispatchInfoFiltered(info,from,filter){if(info.infoHolders)info.infoHolders.push(from)
else info.infoHolders=[from]
for(const c of this.consumers){if(c!==from&&filter(c))try{c.onInfo(info)}catch(e){console.error(e)}}}}
//# sourceMappingURL=infos.js.map