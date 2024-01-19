import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
export function ovrReg(reg){reg.overlaySkin("menu/c-button",REG.LEVELAUTH_RTL_OVR,`\n\t  :host([aria-haspopup]):after {\n\t\t  transform: rotate(90deg);\n\t  }\n\t`)
reg.overlaySkin("bar/c-button",REG.LEVELAUTH_RTL_OVR,`\n\t  :host([role=menu]:not([disabled])) {\n\t\t  background-position: left;\n\t  }\n\t`)
reg.overlaySkin("c-popup-notif",REG.LEVELAUTH_RTL_OVR,`\n\t  c-button {\n\t\t  right: unset;\n\t\t  left: -.5rem;\n\t  }\n\t`)
reg.overlaySkin("c-bar-actions",REG.LEVELAUTH_RTL_OVR,`\n\t  slot.show {\n\t\t  left: unset;\n\t\t  right: 0;\n\t  }\n\t`)
reg.overlaySkin("c-bar-shared",REG.LEVELAUTH_RTL_OVR,`\n\t  #start.show {\n\t\t  left: unset;\n\t\t  right: 0;\n\t  }\n\t`)
reg.overlaySkin("c-arrow-scroll-box",REG.LEVELAUTH_RTL_OVR,`\n\t  :host(:not([vertical])) > #startBtn {\n\t\t  left: unset;\n\t\t  right: 0;\n\t  }\n\n\t  :host(:not([vertical])) > #endBtn {\n\t\t  right: unset;\n\t\t  left: 0;\n\t  }\n\n\t  #startBtn {\n\t\t  transform: scaleX(-1);\n\t  }\n\n\t  #endBtn {\n\t\t  transform: scaleX(-1);\n\t  }\n\n\t`)
reg.overlaySkin("dialog/c-button",REG.LEVELAUTH_RTL_OVR,`\n\n\t  :host([role=menu]) {\n\t\t  background-position: left;\n\t  }\n\n\t  :host([role=menu]:hover) {\n\t\t  background: var(--pressed-bgcolor) var(--dropdown-url) no-repeat left / 1em;\n\t  }\n\t`)
reg.overlaySkin("c-grid",REG.LEVELAUTH_RTL_OVR,`\n\t  c-button[gridsort] {\n\t\t  background-position: left;\n\t  }\n\t`)
reg.overlaySkin("c-grid/tree",REG.LEVELAUTH_RTL_OVR,`\n\t  x-twisty.closed {\n\t\t  background-image: url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/grid/closed-rtl.svg);\n\t  }\n\t`)
reg.overlaySkin("c-tabs",REG.LEVELAUTH_RTL_OVR,`\n\t  :host([vertical]) #tabs > .selected {\n\t\t  background: linear-gradient(to left, var(--bgcolor), var(--pressed-bgcolor));\n\t  }\n\t`)}
//# sourceMappingURL=commonsRTL.js.map