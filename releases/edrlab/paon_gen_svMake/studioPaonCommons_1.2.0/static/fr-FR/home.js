
					
					(async()=>{
					try{
						
							let appUidCode = 'studioPaonCommons1-home';
						

					const [REGISTRY, DESK, IO, UNIVERSE, APP, options] = await Promise.all([
							"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js",
							"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js",
							"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js",
							"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/universe.js",
							"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/appFrame.js",
					"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/optionsPlg.js",
					].map((src) => import(src)));
						REGISTRY.REG.reg.setPref("lang", 21, "fr-FR");
						if (!DESK.Desk.checkCompat('commons'))
							badNavigator();
						else {
							// # Création de l'univers ROOT : porteur des services communs lié à l'authentification unique et des resolvers d'url du front
							new UNIVERSE.BasicUniverse(
								{
									reg:REGISTRY.REG.reg,
									id:"_shared",
									srvCode:"chain",
									universeUrl:new IO.AuthEndPoint("https://studio-paon.edrlab.org/~~chain/"),
									libUrl:new IO.PublicEndPoint(IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/")),
									skinUrl:new IO.PublicEndPoint(IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/")),
									backUrl:new IO.PublicEndPoint(IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/")),
									frontUrl:new IO.PublicEndPoint(IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/fr-FR/")),
									userSelf:{
										
									},
									
										wsFrames:{
												ws:{
													keepAlive:"userActive",
												},
										},
									
									auth:{
										
										
										
										
										
										
											rootUrl:"/",
										

										
									},
								},
							)

						// # Load des modules des linkers et des plugins
						let TO_LOAD_MODULES_URL = {};
						let LOADED_MODULES = {};
						// - QA
						
						TO_LOAD_MODULES_URL["show"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/showPlg.js");
						
							TO_LOAD_MODULES_URL["usersPlg"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/usersPlg.js");
						
						TO_LOAD_MODULES_URL["jobsPlg"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/jobsPlg.js");
						TO_LOAD_MODULES_URL["logsPlg"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/plugins/logsPlg.js");

						// - Auth
						TO_LOAD_MODULES_URL["prl-chain-confAuth"] = "https://studio-paon.edrlab.org/~~static/chain/fr-FR/confAuth.js?202401191504";
						// - linkers
						
							TO_LOAD_MODULES_URL["prl-import-conf"] = "https://studio-paon.edrlab.org/~~static/import/fr-FR/conf.js?202401191504";
						
							TO_LOAD_MODULES_URL["prl-chain-conf"] = "https://studio-paon.edrlab.org/~~static/chain/fr-FR/conf.js?202401191504";
						
							TO_LOAD_MODULES_URL["prl-depot-conf"] = "https://studio-paon.edrlab.org/~~static/depot/fr-FR/conf.js?202401191504";
						
						// - Plugins
						
						
							
								
					TO_LOAD_MODULES_URL["packs"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/packsPlg.js");
				
							
						
							
								
							
						
							
								
							TO_LOAD_MODULES_URL["ACTIONS"] = "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js";
						
							
						
							
								
					TO_LOAD_MODULES_URL["wsps"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/wspsPlg.js");
				
							
						
							
								
					TO_LOAD_MODULES_URL["itemEd"] = "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/itemEdPlg.js";
				
							
						
							
								
					TO_LOAD_MODULES_URL["dynGen"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/plugins/dynGenPlg.js");
				
							
						
							
								
					TO_LOAD_MODULES_URL["depot"] = IO.IO.absoluteUrl("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/store/plugins/depotPlg.js");
				
							
						
						

						await Promise.all(Object.values(TO_LOAD_MODULES_URL).map((url) => import(url))).then((modules) => {
							const keys = Object.keys(TO_LOAD_MODULES_URL);
							for (let i = 0; i < modules.length; i++) LOADED_MODULES[keys[i]] = modules[i];
						});

						// # Création des sub reg pour chaque linker
						let PORTLETS_REGS = {import : REGISTRY.REG.createSubReg(REGISTRY.REG.reg), chain : REGISTRY.REG.createSubReg(REGISTRY.REG.reg), depot : REGISTRY.REG.createSubReg(REGISTRY.REG.reg), };
						PORTLETS_REGS._authCtx = REGISTRY.REG.createSubReg(REGISTRY.REG.reg);

						// # Création des sub reg pour linkers exploités dans smp:freeMjs (free ou pas)
						
						
							
							
							
						
							
							
							
						
							
							
							
						
							
							
							
						
							
							
							
						
							
							
							
						

						// # Init de l'auth
						LOADED_MODULES["prl-chain-confAuth"].init(PORTLETS_REGS._authCtx, PORTLETS_REGS, {wsFrames:REGISTRY.REG.reg.env.universe.wsFrames,userDatas:REGISTRY.REG.reg.env.universe.userDatas,});

						// # Init des linkers
						
							
							
							
							
							
							LOADED_MODULES["prl-import-conf"].init(PORTLETS_REGS["import"], PORTLETS_REGS._authCtx, PORTLETS_REGS, {wsFrames:{ws: {proxyTo: PORTLETS_REGS._authCtx.env.universe.wsFrames.ws}},});
						
							
							
							
							
							
							LOADED_MODULES["prl-chain-conf"].init(PORTLETS_REGS["chain"], PORTLETS_REGS._authCtx, PORTLETS_REGS, {wsFrames:PORTLETS_REGS._authCtx.parentReg.env.universe.wsFrames,userDatas:REGISTRY.REG.reg.env.universe.userDatas,});
						
							
							
							
							
							
							LOADED_MODULES["prl-depot-conf"].init(PORTLETS_REGS["depot"], PORTLETS_REGS._authCtx, PORTLETS_REGS, {wsFrames:{ws: {proxyTo: PORTLETS_REGS._authCtx.env.universe.wsFrames.ws}},});
						

						// # Init de l'appFrame
						let appFrameOptions = {
							noFooter: true,
							authReg : PORTLETS_REGS._authCtx
						};

						

						
						

						
							appFrameOptions.iconUrl = "res/logo-avh.png";
							appFrameOptions.appName = "Studio Paon";
						

						
						
						

						let themes = null;
						

						window.desk = options.FontSizeDeskFeat.add(
							options.UiThemeDeskFeat.add(
								APP.AppFrameDeskFeat.add(
									DESK.UrlHashObjDeskFeat.add(
										DESK.CanCloseDeskFeat.add(
											new DESK.Desk(
												appUidCode,
											),
										),
									),
									appFrameOptions,
								),
								themes,
							),
						)

						// # QA
						

						// # Sécurité : secFetch
						

						LOADED_MODULES["show"].initApp(PORTLETS_REGS._authCtx);
						
							LOADED_MODULES["usersPlg"].initApp(PORTLETS_REGS._authCtx);
						
						LOADED_MODULES["jobsPlg"].initApp(PORTLETS_REGS._authCtx);
						LOADED_MODULES["logsPlg"].initApp(PORTLETS_REGS._authCtx);

						
						
							window.serverBuildId="202401191504";
						

						
							window.scenariDev=true;
						

						
						

						DESK.UserActiveDeskFeat.add(window.desk, 1800000, 60000);
						options.initApp(PORTLETS_REGS._authCtx,

						{
							about:{
								
								
									appLogo:"res/logo-avh.png",
								
								appName:appFrameOptions.appName,
								appVersion:"1.2.0",
								appBuildId:"202401191504",
								appDevelopmentStage:"final",
								
								
								
									appReleaseEnvironment:"",
								
								
									appDetails:"Studio PAON est une chaîne de production semi automatisée pour la production de livres adaptés aux formats Full DAISY et BRF aux normes du Pôle d\'adaptation des Ouvrages Numériques (PAON) de l\' Association Valentin Haüy (AVH). Financé par l\'AVH et subventionné par le ministère de la Culture, le projet est coordonné par Éditadapt Gautier Chomel et réalisé en partenariat avec Luc Audrain, Kelis, Scopyleft et Thomas Parisot. Studio PAON est réalisé avec les logiciels SCENARI, une suite de solutions logicielles libres et gratuites éditées par Kelis.",
								
								scVersion:"6.1.10",
								scBuildId:"202401191026",
							},
						});

						// # Rights
						

						// # Init des plugins
						
							
								
					LOADED_MODULES["packs"].initApp(PORTLETS_REGS._authCtx);
				
							
						
							
								
							
							window.desk.setDefaultAppBuilder({
								isAppDefMatch(data) {return false},
								buildBody(ctx, lastDatas) {
									ctx.url = "https:\/\/studio-paon.docs-kelis.fr\/common\/help";
									ctx.anonymousAllowed = true;
									return document.createElement("c-frame-app").initialize(ctx);
								},
								async loadBody(ctx, lastDatas) {
									await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/apps/frameApp.js");
									
										const {registerWspProtocolsActions} = await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/wsp/actions/scProtocolActions.js");
										const appReg = REGISTRY.REG.createSubReg(ctx.reg);
										registerWspProtocolsActions(appReg);
										ctx.reg = appReg;
                  
									return this.buildBody(ctx, lastDatas);
								}
							});
							
						
							
						
							
								
				
								REGISTRY.REG.reg.addToList("plg:show:alias:url", "https://studio-paon.edrlab.org/~~import\/", 21, "https://studio-paon.edrlab.org/~~import\/");
							
							REGISTRY.REG.reg.addToList("appframe:header:toolbar", "bd-maintb-KwN2VgRxPAd1J0WlxInRuf", 21,
								new LOADED_MODULES["ACTIONS"].ActionWrapEltReg(new LOADED_MODULES["ACTIONS"].Action()
									.setLabel("Tableau de bord").requireVisiblePerm("use")
									.override("execute", async (ctx, evt) => {
										
												window.desk.findAndOpenApp({show:{alias:"https://studio-paon.edrlab.org/~~import/",},}, evt);
											
									})
									
								, PORTLETS_REGS._authCtx), 0
							);
						
			
							
						
							
								
						PORTLETS_REGS["chain"].setPref("plg.universe",21, "chain");
						
						PORTLETS_REGS["chain"].setPref("plg.checkUniverse",21, false);
						
					LOADED_MODULES["wsps"].initApp(PORTLETS_REGS["chain"]);
				
							
						
							
								
					LOADED_MODULES["itemEd"].initApp(PORTLETS_REGS["chain"]);
				
							
						
							
								
					LOADED_MODULES["dynGen"].initApp(PORTLETS_REGS["chain"]);
				
							
						
							
								
						PORTLETS_REGS["import"].setPref("plg.name",21, "Import");
						PORTLETS_REGS["import"].setPref("plg.universe",21, "import");
						LOADED_MODULES["depot"].initApp(PORTLETS_REGS["import"],
						{desk:{label:"",},}
						);
					
						PORTLETS_REGS["depot"].setPref("plg.name",21, "Export");
						PORTLETS_REGS["depot"].setPref("plg.universe",21, "depot");
						LOADED_MODULES["depot"].initApp(PORTLETS_REGS["depot"],
						{desk:{label:"",},}
						);
					
							
						

						// # Load/execution des freeConf
						
							const [...freeConf] = await Promise.all([
								"https://studio-paon.edrlab.org/~~static/fr-FR/mjs/qVdr52G3OAko9kpZlpNBhj/chain.free.ui.conf.js?202401191504",
							
							].map((url) => import(url)));
							
							
								await freeConf[0].default(PORTLETS_REGS._authCtx
									
										
										
											, PORTLETS_REGS["chain"]
										
									
								);
							
						

						

						
						
						
						

						// # Launch desk
						desk.launch();
						}
					} catch (e) {
						try{showError(e)}catch(ee){}
						throw e;
					}
					})()
					
				