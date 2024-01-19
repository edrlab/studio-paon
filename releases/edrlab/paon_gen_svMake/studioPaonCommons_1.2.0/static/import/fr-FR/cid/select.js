
			
				import {REG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js";
				import {Desk, UserActiveDeskFeat} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js";
				import {AuthEndPoint, IO, PublicEndPoint} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import {BasicUniverse} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js";
				import {VIEWS} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
				import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js";
				import {SelectRes, SelectResBrowseArea} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/selectRes.js";
        import * as depotConf from "https://studio-paon.edrlab.org/~~static/import/fr-FR/conf.js?202401191504";
			

			if (!Desk.checkCompat('commons')) badNavigator();
			else {
				const qs = new URLSearchParams(location.search);

				REG.reg.setPref("lang", 21, "fr-FR");

				new BasicUniverse(
					{
						reg:REG.reg,
						id:"_auth",
						srvCode:"import",
						universeUrl:new AuthEndPoint("https://studio-paon.edrlab.org/~~import/~~write/"),
						libUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/")),
						skinUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/")),
						backUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/")),
						frontUrl:new PublicEndPoint(IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/fr-FR/")),
						userSelf:{},
						wsFrames:{
								ws:{
									keepAlive:"userActive",
								},
						},
					},
				)

				const depotReg = REG.reg;
				depotConf.init(depotReg, REG.reg, REG.reg);

				window.desk = new Desk('import-cid-selectRes');

				UserActiveDeskFeat.add(window.desk, 1800000, 60000);

				const initialPath = qs.get("permaPath") || qs.get("path") || depotReg.env.universe.urlTree.extractSubPathFromUrl(qs.get("publicUrl")) || "";
				const prcRegExp = qs.get("prcRegExp");
				const prcRe = prcRegExp ? new RegExp(prcRegExp) : null;
				const selectFilters = qs.getAll("selectFilter");

				depotReg.setPref("depot.showVersions", 101, false);
				let utFilter = prcRegExp ? `usable & (isFolder | regexpPrc(${prcRegExp.replace(/[\^\)]/g, '^$&')}))` : "usable";
				if(selectFilters && selectFilters.length){
					selectFilters.forEach((filter)=>{
						if(filter) utFilter += "&(" + filter + ")";
					});
				}
				depotReg.setPref("utBrowser.filter", 101, utFilter);

				REG.reg.addToList(Desk.LC_init, 'loadUser', 1, () => {
					return REG.reg.env.universe.auth.fetchUser();
				}, -1000);

				REG.reg.addToList(Desk.LC_load, 'buildUi', 1, () => {
					if (window.frameElement?.injectTheme) window.frameElement.injectTheme();
					else desk.initDefaultTheme();
					document.body.textContent = null;
					const selRes = document.body.appendChild(new SelectRes().initialize({
						reg: depotReg,
						initialPath: initialPath,
						boards: [new SelectResBrowseArea()],
						checkSel: (selectRes) => {
							const resProps = selectRes.currentSel;
							if (!resProps) return "Sélectionnez une ressource";
							if (prcRegExp) {
								if (!resProps.prc || !prcRe.test(resProps.prc)) return "Cette ressource n\'est pas autorisée";
							} else {
								if (resProps.t !== "repos") return "Sélectionnez une ressource";
							}
							return true;
						},
						holder: {
							close(resProps) {
								if (!resProps) {
									window.parent.postMessage({cidInteraction: "aborted"}, '*');
								} else {
									window.parent.postMessage(Object.assign({cidInteraction: "ended"}, resProps), '*');
								}
							}
						}
					}));
					VIEWS.onViewShown(selRes);
				});

				
				
				

				
				
					window.serverBuildId="202401191504";
				

				
				

				

				desk.launch();
		}
		