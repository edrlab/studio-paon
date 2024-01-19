import{ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/views/views_Perms.js"
import{SCPRTC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/scenariProtocol.js"
import{findElementWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
export class WedFocusNodeScProtocolExec{async execute(params,reg,emitter,ev){var _a
const vEltWedlet=findElementWedlet(emitter,false)
if(vEltWedlet){const wedMgr=vEltWedlet.wedlet.wedMgr
const docHolder=wedMgr.docHolder
if(params.selectOnXmlRel){const node=XA.findDomLast(vEltWedlet.wedlet.wedAnchor,docHolder.getDocument())
if(node.nodeType===ENodeType.element){let selectedNode=node.querySelector(params.selectOnXmlRel)
if(selectedNode)WEDLET.focusWedlet(XA.fromNode(selectedNode),wedMgr)}}else if(params.selectOnXml){let selectedNode=docHolder.getDocument().querySelector(params.selectOnXml)
if(selectedNode)WEDLET.focusWedlet(XA.fromNode(selectedNode),wedMgr)}else if(params.selectOnWedRel){let wedlet=vEltWedlet.wedlet
while(wedlet&&!isWedletSingleElt(wedlet))wedlet=wedlet.wedParent
if(isWedletSingleElt(wedlet)){let selectedNode=(_a=wedlet.element)===null||_a===void 0?void 0:_a.querySelector(params.selectOnWedRel)
const vWdl=findElementWedlet(selectedNode,false)
vWdl.focus()}}else if(params.selectOnWed){const rootWedlet=wedMgr.rootWedlet
if(isWedletSingleElt(rootWedlet)){let selectedNode=rootWedlet.element.querySelector(params.selectOnWed)
if(selectedNode)WEDLET.focusWedlet(XA.fromNode(selectedNode),wedMgr)}}else WEDLET.focusWedlet(XA.fromNode(vEltWedlet),wedMgr)}}}export function registerEditProtocolsActions(reg){reg.addToList(SCPRTC.LIST_EXECUTORS,"wedFocusNode",1,new WedFocusNodeScProtocolExec)}
//# sourceMappingURL=scProtocolActions.js.map