export function isFolder(f){return f&&typeof f.name==="string"&&Array.isArray(f.entries)}export function getFilesOnDrop(data){return new Promise((resolve,reject)=>{const result=[]
const items=data.items
let tasksCount=0
const errCb=err=>{tasksCount=-99
reject(err)}
for(let i=0;i<items.length;i++){const item=items[i]
if(item.kind==="file"){const entry=item.webkitGetAsEntry()
if(entry){function scanEntry(entry,list){if(entry.isFile){tasksCount++
entry.file(file=>{if(tasksCount===-99)return
list.push(file)
if(--tasksCount===0)resolve(result)},errCb)}else if(entry.isDirectory){const folder={name:entry.name,entries:[]}
list.push(folder)
tasksCount++
const reader=entry.createReader()
const readerCb=entries=>{if(tasksCount===-99)return
if(entries.length===0){if(--tasksCount===0)resolve(result)}else{for(let entry of entries)scanEntry(entry,folder.entries)
reader.readEntries(readerCb,errCb)}}
reader.readEntries(readerCb,errCb)}}scanEntry(entry,result)}}}if(tasksCount===0)resolve(result)})}
//# sourceMappingURL=files.js.map