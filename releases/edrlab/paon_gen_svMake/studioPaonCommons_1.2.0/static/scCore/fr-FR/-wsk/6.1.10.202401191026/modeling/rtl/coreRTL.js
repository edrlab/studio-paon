import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export function ovrReg(reg){reg.overlaySkin("usersmgr-users",REG.LEVELAUTH_RTL_OVR,`\n\t  .ctrlLbl[area-id=isHidden] > .lbl::before,\n\t  .ctrlLbl[area-id=isDisabled] > .lbl::before {\n\t\t  background-position: right;\n\t  }\n\t`)
reg.overlaySkin("c-userref",REG.LEVELAUTH_RTL_OVR,`\n\t  :host([data-withIcon]) span {\n\t\t  background-position: right;\n\t  }\n\t`)
reg.overlaySkin("c-workbench",REG.LEVELAUTH_RTL_OVR,`\n\t  #tabsLT > button,\n\t  #tabsLB > button,\n\t  #tabsBL > button.sibling {\n\t\t  background-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolR.svg');\n\t\t  min-width: var(--icon-size);\n\t\t  min-height: var(--icon-size);\n\t  }\n\n\t  #tabsRT > button,\n\t  #tabsRB > button,\n\t  #tabsBR > button.sibling {\n\t\t  background-image: url('https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/core/widgets/workbench/closeToolL.svg');\n\t\t  min-width: var(--icon-size);\n\t\t  min-height: var(--icon-size);\n\t  }\n\t`)}
//# sourceMappingURL=coreRTL.js.map