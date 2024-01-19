
			
				import {REG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js";
				import {Desk, UserActiveDeskFeat} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js";
				import {AuthEndPoint, IO, PublicEndPoint} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import {BasicUniverse} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js";
				import "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/zones/webZones.js";
				import {UploadRes} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/dialogs/uploadRes.js";
				import {URLTREE} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/urlTree.js";
				import * as depotConf from "https://studio-paon.edrlab.org/~~static/import/fr-FR/conf.js?202401191504";
			

			if (!Desk.checkCompat('commons')) badNavigator();
			else {
				REG.reg.setPref("lang", 21, "fr-FR");

				//Auth universe
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
				depotConf.init(depotReg, depotReg, depotReg);

				// Paramètres d'entrée
				const qs = new URLSearchParams(location.search);
				const targetPath = qs.get("permaPath") || qs.get("path") || depotReg.env.universe.urlTree.extractResPathFromUrl(qs.get("publicUrl"));
				let processing, initialFileName, fixedFolderPath, defaultFolderPath, otherProps;
				qs.forEach((v, k)=>{
					if(k==="processing") {
						processing = v;
					} else if(k==="fileName") {
						initialFileName = v;
					} else if(k==="fixedFolderPath") {
						fixedFolderPath = v;
					} else if(k==="defaultFolderPath") {
						defaultFolderPath = v;
					} else if(k!=="path" && k!=="permaPath" && k!=="publicUrl" && k!=="scCidSessId") {
						if(k==="defaultProcessing")
							k = "processing";
						(otherProps || (otherProps = {}))[k] = v;
					}
				});
				const uploadFolder = qs.get("uploadFolder") != null;

				window.desk = new Desk('import-cid-uploadRes');

				UserActiveDeskFeat.add(window.desk, 1800000, 60000);

				REG.reg.addToList(Desk.LC_init, 'loadUser', 1, () => {
					return REG.reg.env.universe.auth.fetchUser();
				}, -1000);

				REG.reg.addToList(Desk.LC_load, 'buildUi', 1, () => {
					if (window.frameElement?.injectTheme) window.frameElement.injectTheme();
					else desk.initDefaultTheme();
					document.body.textContent = null;
					document.body.appendChild(new UploadRes().initialize({
						reg: depotReg.env.universe.newDepotUiReg(document.body),
						targetPath,
						processing,
						initialFileName,
						fixedFolderPath,
						defaultFolderPath,
						otherProps,
						uploadFolder,
						holder : {
							close(result) {
								if(result) {
									result.permaUrl = depotReg.env.universe.urlTree.urlFromPath(result.path);
									result.publicUrl = depotReg.env.universe.urlTree.urlFromPath(URLTREE.extractUnversionedLeafPath(result.path));
									window.parent.postMessage(Object.assign({cidInteraction: "ended"}, result), '*');
								} else {
									const scCidSessId = qs.get("scCidSessId");
									if (scCidSessId) depotReg.env.universe.cid.sendRequestToSession(scCidSessId, {cidMetas: {abortSession: true}, returnProps: ""});
                	window.parent.postMessage({cidInteraction: "aborted"}, '*');
								}
							}
						}
					}));
				});

				
				
				

				
				
					window.serverBuildId="202401191504";
				

				
				

				

				desk.launch();
		}
		