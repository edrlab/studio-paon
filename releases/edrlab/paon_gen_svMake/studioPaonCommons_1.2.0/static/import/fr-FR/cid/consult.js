
			
				import {REG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js";
				import {Desk, UserActiveDeskFeat} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js";
				import {AuthEndPoint, IO, PublicEndPoint} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import {BasicUniverse} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js";
				import {VIEWS} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/views.js"
				import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js";
				import {ResViewerSingle} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/views/resViewer.js";
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

				window.desk = new Desk('import-cid-consultRes');

				UserActiveDeskFeat.add(window.desk, 1800000, 60000);

				depotReg.setPref("depot.showVersions", 101, false);
				const initialPath = qs.get("permaPath") || qs.get("path") || depotReg.env.universe.urlTree.extractSubPathFromUrl(qs.get("publicUrl")) || "";

				REG.reg.addToList(Desk.LC_init, 'loadUser', 1, () => {
					return REG.reg.env.universe.auth.fetchUser();
				}, -1000);

				REG.reg.addToList(Desk.LC_load, 'buildUi', 1, () => {
					if (window.frameElement?.injectTheme) window.frameElement.injectTheme();
					else desk.initDefaultTheme();
					document.body.textContent = null;
					const root = document.body.appendChild(document.createElement("main"));
					const showRes = root.appendChild(new ResViewerSingle().initialize({
						reg: depotReg,
						keyView: 'consult',
						startWithResPath: initialPath
					}));
					depotReg.installSkin('webzone:page', showRes.shadowRoot);
					VIEWS.onViewShown(showRes);
				});

				
				
				

				
				
					window.serverBuildId="202401191504";
				

				
				

				

				desk.launch();
		}
		