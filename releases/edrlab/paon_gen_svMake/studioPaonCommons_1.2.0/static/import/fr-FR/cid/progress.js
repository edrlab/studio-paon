
			
				import {REG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js";
				import {Desk} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/desk.js";
				import {AuthEndPoint, IO, PublicEndPoint} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js";
				import {DepotUniverse} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/store/depot.js";
				import {LANG} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js";
				import {MsgLabel} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js";
				import {Button} from "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js";
			

			const reg = REG.reg;

			reg.setPref("lang", 21, "fr-FR");

			const universe = new DepotUniverse(
				{
					reg:REG.reg,
					id:"depot",
					urlTree:new AuthEndPoint("https://studio-paon.edrlab.org/~~import/"),
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

			window.desk = new Desk('import-cid-progress');

			const qs = new URLSearchParams(location.search);
			const scCidSessId = qs.get("scCidSessId");
			const retProps = qs.get("returnProps");
			const returnProps = retProps ? "scCidSessId*scCidSessStatus*scCidSessDetails*" + retProps : "scCidSessId*scCidSessStatus*scCidSessDetails";

			reg.addToList(Desk.LC_load, 'buildUi', 1, () => {
				if (window.frameElement?.injectTheme) window.frameElement.injectTheme();
				else desk.initDefaultTheme();
				document.body.textContent = null;
				const root = document.body.appendChild(document.createElement("main"));
				const sr = root.attachShadow({mode: 'open'});

				const mainMsg = sr.appendChild(new MsgLabel().initialize({reg}));
				const details = sr.appendChild(document.createElement("div"));
				const closeBtn = sr.appendChild(new Button().initialize({
					reg,
					label: "Fermer",
					uiContext: "dialog",
					hidden: true
				}));
				closeBtn.onclick = () => {
					window.parent.postMessage({'cidInteraction': 'aborted'}, '*');
				}

				let elapse = 300;

				async function refresh() {
					let st;
					let resp;
					try {
						resp = await universe.cid.sendRequestToSession(scCidSessId, {returnProps: returnProps});
						st = resp?.scCidSessStatus;
						switch (st) {
							case "commited" :
								mainMsg.setCustomMsg("Réalisé avec succès", "valid");
								break;
							case "waitingUserInput" :
							case "working" :
							case "commiting" :
							case "waitingForCommit" :
							case "rollbacking":
								mainMsg.setCustomMsg("En cours...", "info");
								break;
							case "rollbacked" :
							case "failed" :
								if (resp == null) {
									mainMsg.setCustomMsg("L\'information sur l\'état du traitement n\'est plus disponible.", "warning");
								} else {
									mainMsg.setCustomMsg("En échec.", "error");
									console.log("Cid details error", resp);
								}
								break;
							default :
								console.log("Unknown status : " + st);
								st = "rollbacked";
						}

						details.textContent = null;
						if(resp?.scCidSessDetails) for(let detail of resp.scCidSessDetails) {
							switch(detail.type) {
								case "stepDone":
								case "stepPending":
								case "stepForthcoming":
									//TODO localize detail.msg
									details.appendChild(new MsgLabel().initialize({
										label: ( detail.type==="stepDone" ? "[ok] " : detail.type==="stepPending" ? "[en cours] " : "[à venir] " ) + LANG.formatStr(detail.msg, detail.vars),
										level: detail.type==="stepDone" ? 'valid' : 'info',
										title: detail.details
									}));
								break;
								default:
									details.appendChild(new MsgLabel().initialize({
										label: universe.cid.extractCidLocalizedErrorMsg(detail),
										level: detail.type,
										title: JSON.stringify(detail.details)
									}));
							}
						}

					} catch (e) {
						console.log(e);
						//Requete en erreur
						mainMsg.setCustomMsg("Information sur l\'état du traitement inaccessible.", "warning");
						//details.textContent = null;
						closeBtn.hidden = false; //on permet de clore la fenêtre.
					}

					if (st === "commited") {
						resp.cidInteraction = 'ended';
						window.parent.postMessage(resp, '*');
					} else if (st === "rollbacked" || st === "failed") {
						closeBtn.hidden = false; //On laisse le temps de consulter l'erreur.
					} else {
						if (elapse < 3000) elapse += 200;
						window.setTimeout(refresh, elapse);
					}
				}

				window.setTimeout(refresh, elapse);
			});

			
			
			

			
			
				window.serverBuildId="202401191504";
			

			
			

			

			desk.launch();
		