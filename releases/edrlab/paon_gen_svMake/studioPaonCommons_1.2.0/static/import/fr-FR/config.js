
	extPoints.initAsRoot();
//

		extPoints.addToList("store:navigateViews", "browser", 1, new areas.Area("browser")
			.setPermissions(security.getGPerm("ui.depotBrowseView"))
			.setLibs({"sc-browseview": "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wbk/6.1.10.202401191026/store/views/browseView.html"})
			.setBuildBody(function(pBd, pCtx, pOpts) {
				return pBd.elt("sc-browseview").att("labelTitle", "Parcourir" ).att("flex", "1").att("icon", "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/store/img/browseTree.png").currentUp();
			})
		, 10);
	



	extPoints.addSvcToList("dptbrowser:global:actions", "actionCreateFolder", 11, "actionCreateCustomFolder", 30);

////
		extPoints.registerSvc("prc_undefined", 1, new store.Processing("undefined").setFolder(null)
		.setLabel("Inconnu")
		.setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wsk/6.1.10.202401191026/commons/fileIcon/default.png"));
		
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "infos", 1, "showResInfosTab", 100);
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "edit", 1, "showResEditTab", 200);
			
			extPoints.addSvcToList("store:showRes:tabs:prc:undefined", "import", 1, "showResImportTab", 300);
		
		extPoints.addToList("store:fields:prc:undefined", "download", 1, js.create(new areas.Area("download").setLabel("Téléchargement").setBuildBody(function(pBd, pContext, pOptions){
			areas.buildLabelFrame(this, pBd, pContext, pOptions);
			return pBd.elt("a", "download").att("href", pContext.nodeInfos.publicUrl + "?download").text("Fichier original").currentUp();
		}), store.mixinShowFieldForArea), 1000);
		//
		
					extPoints.registerSvc("prc_folder", 21, new store.Processing("folder")
						.setLabel("Dossier sans accueil")
						
						.setFolder(true)
						.setNoContent(true)
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "folder", 21, "prc_folder", 1);
					
						extPoints.addToList("searchRes:prcs", "folder", 21, null);
					
	
		
					extPoints.registerSvc("prc_home", 21, new store.Processing("home")
						.setLabel("Dossier avec accueil personnalisé")
						
						.setFolder(true)
						
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "home", 21, "prc_home", 2);
					
						extPoints.addToList("uploadRes:prcs", "home", 21, null);
					
						extPoints.addToList("searchRes:prcs", "home", 21, null);
					
	
		
					extPoints.registerSvc("prc_xml", 21, new store.Processing("xml")
						.setLabel("XML")
						
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "xml", 21, "prc_xml", 3);
					
	
		
					extPoints.registerSvc("prc_epub3", 21, new store.Processing("epub3")
						.setLabel("EPUB 3")
						
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "epub3", 21, "prc_epub3", 4);
					
	
		
					extPoints.registerSvc("prc_data", 21, new store.Processing("data")
						.setLabel("Data")
						.setNoContent(true)
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "data", 21, "prc_data", 5);
					
	
		
					extPoints.registerSvc("prc_archived", 21, new store.Processing("archived")
						.setLabel("Archivé")
						.setNoContent(true)
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "archived", 21, "prc_archived", 6);
					
						extPoints.addToList("uploadRes:prcs", "archived", 21, null);
					
	
		
					extPoints.registerSvc("prc_reopened", 21, new store.Processing("reopened")
						.setLabel("Archivé - réouvert")
						.setNoContent(true)
						.setVersionning("none")
						
					);
					extPoints.addSvcToList("store:prcs", "reopened", 21, "prc_reopened", 7);
					
						extPoints.addToList("uploadRes:prcs", "reopened", 21, null);
					
	
		
		extPoints.addToList("store:showRes:tabs:prc:folder", "infosTabsnS9Yl7CrpbG7gGRQGRJ0d", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:home", "infosTabohjCqajx06j0kdPGpHt5Bf", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:xml", "infosTabTJSaT4CpwUe15N2wVP4meh", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:epub3", "infosTabiWzvEqENxNeGguVFkKZODi", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:data", "infosTabA8s7Us1xQCeDVoBU3uRnRf", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:archived", "infosTabrhJiy4cn9Rcn5HWwJiyIA", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
		
		extPoints.addToList("store:showRes:tabs:prc:reopened", "infosTabTv6OQtVqtMeVIMjruJkbBc", 1, new areas.SvcAreaWrapper("showResInfosTab_prc")
			.setWrappedSvcCd("showResInfosTab")
			.setLabel("Informations")
		, 1);
	
	
	
	
	
	
	
	
	
	
	

		
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:folder", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_folder")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Importer un accueil de dossier personnalisé")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_home");
					pCtx.defaultProps = {
						processing:"home",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:home", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_home")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Supprimer l\'accueil de ce dossier")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_folder");
					pCtx.defaultProps = {
						processing:"folder",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
		extPoints.addToList("store:fields:prc:xml", "isbn__info",
			1,
			new store.Field("isbn")
				.setLabel("ISBN")
				
				.setShowArea(
		new areas.InputArea("isbn").setTag("input", "input-text", {class:"fieldValue",pattern:".+"})
	.setReadOnly(true)
					.setRequired(true)
				, true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:xml", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1002);
	
		extPoints.addToList("store:fields:prc:xml", "sourceXMLDoctype__info",
			1,
			new store.Field("sourceXMLDoctype")
				.setLabel("Source")
				
				.setShowArea(
		new areas.InputArea("sourceXMLDoctype").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1003);
	
		extPoints.addToList("store:fields:prc:xml", "title__info",
			1,
			new store.Field("title")
				.setLabel("Titre")
				
				.setShowArea(
		new areas.InputArea("title").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1004);
	
		extPoints.addToList("store:fields:prc:xml", "author__info",
			1,
			new store.Field("author")
				.setLabel("Auteur")
				
				.setShowArea(
		new areas.InputArea("author").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1005);
	
		extPoints.addToList("store:fields:prc:xml", "publisher__info",
			1,
			new store.Field("publisher")
				.setLabel("Éditeur")
				
				.setShowArea(
		new areas.InputArea("publisher").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1006);
	
		extPoints.addToList("store:fields:prc:xml", "comment__info",
			1,
			new store.Field("comment")
				.setLabel("Commentaire")
				
				.setShowArea(
		new areas.InputArea("comment").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1007);
	
		extPoints.addToList("store:fields:prc:xml", "pages__info",
			1,
			new store.Field("pages")
				.setLabel("Nombre de pages")
				
				.setShowArea(
		new areas.InputArea("pages").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1008);
	
		extPoints.addToList("store:fields:prc:xml", "source__info",
			1,
			new store.Field("source")
				.setLabel("Format d\'origine")
				
				.setShowArea(
		new areas.InputArea("source").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1009);
	
		extPoints.addToList("store:fields:prc:xml", "statut__info",
			1,
			new store.Field("statut")
				.setLabel("Statut de production")
				
				.setShowArea(
		function(){
			
			extPoints.registerSvc("statut-\portal\import\metas\statut.meta;35", 
									1,
									new enums.StaticEnum("statut").setSimpleMap({
				"PLATON_PENDING":"A demander à Platon","PLATON_AWAITING":"En attente de Platon","TO_CONVERT":"A convertir","PROCESSING":"En cours","EXPORTED":"Exporté","DONE":"OK Médiathèque","STAND_BY":"En attente","ARCHIVED":"Archivé","REOPENED":"Réouvert"
			})
								);
			return new areas.InputArea("statut").setTag("select", "input-select", {svcEnum:"statut-\portal\import\metas\statut.meta;35", class:"fieldValue"})
		}.call(this)
	.setReadOnly(true), true, '')
				,
		1010);
	
		extPoints.addToList("store:fields:prc:xml", "statutAud__info",
			1,
			new store.Field("statutAud")
				.setLabel("Statut Audio")
				
				.setShowArea(
		new areas.InputArea("statutAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1011);
	
		extPoints.addToList("store:fields:prc:xml", "statutBrl__info",
			1,
			new store.Field("statutBrl")
				.setLabel("Statut Braille")
				
				.setShowArea(
		new areas.InputArea("statutBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1012);
	
		extPoints.addToList("store:fields:prc:xml", "illustrations__info",
			1,
			new store.Field("illustrations")
				.setLabel("Illustration")
				
				.setShowArea(
		new areas.InputArea("illustrations").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1013);
	
		extPoints.addToList("store:fields:prc:xml", "collection__info",
			1,
			new store.Field("collection")
				.setLabel("Collection")
				
				.setShowArea(
		new areas.InputArea("collection").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1014);
	
		extPoints.addToList("store:fields:prc:xml", "originalFilename__info",
			1,
			new store.Field("originalFilename")
				.setLabel("Nom du fichier source")
				
				.setShowArea(
		new areas.InputArea("originalFilename").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1015);
	
		extPoints.addToList("store:fields:prc:xml", "originalLanguage__info",
			1,
			new store.Field("originalLanguage")
				.setLabel("Langue d\'origine")
				
				.setShowArea(
		new areas.InputArea("originalLanguage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1016);
	
		extPoints.addToList("store:fields:prc:xml", "typeOuvrage__info",
			1,
			new store.Field("typeOuvrage")
				.setLabel("Type d\'ouvrage")
				
				.setShowArea(
		new areas.InputArea("typeOuvrage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1017);
	
		extPoints.addToList("store:fields:prc:xml", "authorAud__info",
			1,
			new store.Field("authorAud")
				.setLabel("Auteur Audio")
				
				.setShowArea(
		new areas.InputArea("authorAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1018);
	
		extPoints.addToList("store:fields:prc:xml", "authorBrl__info",
			1,
			new store.Field("authorBrl")
				.setLabel("Auteur Braille")
				
				.setShowArea(
		new areas.InputArea("authorBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1019);
	
		extPoints.addToList("store:fields:prc:xml", "authorPivot__info",
			1,
			new store.Field("authorPivot")
				.setLabel("Auteur Pivot")
				
				.setShowArea(
		new areas.InputArea("authorPivot").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1020);
	
		extPoints.addToList("store:fields:prc:xml", "statutEmb__info",
			1,
			new store.Field("statutEmb")
				.setLabel("Statut Embossage")
				
				.setShowArea(
		new areas.InputArea("statutEmb").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1021);
	
		extPoints.addToList("store:fields:prc:xml", "fileName__info",
			1,
			new store.Field("fileName")
				.setLabel("Nom de fichier")
				
				.setShowArea(
		new areas.InputArea("fileName").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1022);
	
		extPoints.addToList("store:fields:prc:xml", "dtdDetail__info",
			1,
			new store.Field("dtdDetail")
				.setLabel("Détail DTD (Doctype)")
				
				.setShowArea(
		new areas.InputArea("dtdDetail").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1023);
	
		extPoints.addToList("store:fields:prc:xml", "dateEnd__info",
			1,
			new store.Field("dateEnd")
				.setLabel("Date de publication en médiathèque")
				
				.setShowArea(
		new areas.InputArea("dateEnd").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "time")
	.setReadOnly(true), true, '')
				,
		1024);
	
		extPoints.addToList("store:fields:prc:xml", "dateParution__info",
			1,
			new store.Field("dateParution")
				.setLabel("Date de parution")
				
				.setShowArea(
		new areas.InputArea("dateParution").setTag("input", "input-text", {class:"fieldValue",pattern:"(\\d\\d\\d\\d(-\\d\\d)?)?"})
	.setReadOnly(true), true, '')
				,
		1025);
	
		extPoints.addToList("store:fields:prc:xml", "nbPagesBrailleAbrege__info",
			1,
			new store.Field("nbPagesBrailleAbrege")
				.setLabel("Nombre de pages - Braille abrégé")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleAbrege").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1026);
	
		extPoints.addToList("store:fields:prc:xml", "nbPagesBrailleIntegral__info",
			1,
			new store.Field("nbPagesBrailleIntegral")
				.setLabel("Nombre de pages - Braille intégral")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleIntegral").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1027);
	
		extPoints.addToList("store:fields:prc:xml", "timestampStatut__info",
			1,
			new store.Field("timestampStatut")
				.setLabel("Horodatage de statut")
				
				.setShowArea(
		new areas.InputArea("timestampStatut").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1028);
	
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:xml", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_xml")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Archiver")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_archived");
					pCtx.defaultProps = {
						processing:"archived",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
		extPoints.addToList("store:fields:prc:epub3", "isbn__info",
			1,
			new store.Field("isbn")
				.setLabel("ISBN")
				
				.setShowArea(
		new areas.InputArea("isbn").setTag("input", "input-text", {class:"fieldValue",pattern:".+"})
	.setReadOnly(true)
					.setRequired(true)
				, true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:epub3", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1002);
	
		extPoints.addToList("store:fields:prc:epub3", "title__info",
			1,
			new store.Field("title")
				.setLabel("Titre")
				
				.setShowArea(
		new areas.InputArea("title").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1003);
	
		extPoints.addToList("store:fields:prc:epub3", "author__info",
			1,
			new store.Field("author")
				.setLabel("Auteur")
				
				.setShowArea(
		new areas.InputArea("author").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1004);
	
		extPoints.addToList("store:fields:prc:epub3", "publisher__info",
			1,
			new store.Field("publisher")
				.setLabel("Éditeur")
				
				.setShowArea(
		new areas.InputArea("publisher").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1005);
	
		extPoints.addToList("store:fields:prc:epub3", "comment__info",
			1,
			new store.Field("comment")
				.setLabel("Commentaire")
				
				.setShowArea(
		new areas.InputArea("comment").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1006);
	
		extPoints.addToList("store:fields:prc:epub3", "pages__info",
			1,
			new store.Field("pages")
				.setLabel("Nombre de pages")
				
				.setShowArea(
		new areas.InputArea("pages").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1007);
	
		extPoints.addToList("store:fields:prc:epub3", "source__info",
			1,
			new store.Field("source")
				.setLabel("Format d\'origine")
				
				.setShowArea(
		new areas.InputArea("source").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1008);
	
		extPoints.addToList("store:fields:prc:epub3", "statut__info",
			1,
			new store.Field("statut")
				.setLabel("Statut de production")
				
				.setShowArea(
		function(){
			
			extPoints.registerSvc("statut-\portal\import\metas\statut.meta;35", 
									1,
									new enums.StaticEnum("statut").setSimpleMap({
				"PLATON_PENDING":"A demander à Platon","PLATON_AWAITING":"En attente de Platon","TO_CONVERT":"A convertir","PROCESSING":"En cours","EXPORTED":"Exporté","DONE":"OK Médiathèque","STAND_BY":"En attente","ARCHIVED":"Archivé","REOPENED":"Réouvert"
			})
								);
			return new areas.InputArea("statut").setTag("select", "input-select", {svcEnum:"statut-\portal\import\metas\statut.meta;35", class:"fieldValue"})
		}.call(this)
	.setReadOnly(true), true, '')
				,
		1009);
	
		extPoints.addToList("store:fields:prc:epub3", "statutAud__info",
			1,
			new store.Field("statutAud")
				.setLabel("Statut Audio")
				
				.setShowArea(
		new areas.InputArea("statutAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1010);
	
		extPoints.addToList("store:fields:prc:epub3", "statutBrl__info",
			1,
			new store.Field("statutBrl")
				.setLabel("Statut Braille")
				
				.setShowArea(
		new areas.InputArea("statutBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1011);
	
		extPoints.addToList("store:fields:prc:epub3", "illustrations__info",
			1,
			new store.Field("illustrations")
				.setLabel("Illustration")
				
				.setShowArea(
		new areas.InputArea("illustrations").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1012);
	
		extPoints.addToList("store:fields:prc:epub3", "collection__info",
			1,
			new store.Field("collection")
				.setLabel("Collection")
				
				.setShowArea(
		new areas.InputArea("collection").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1013);
	
		extPoints.addToList("store:fields:prc:epub3", "originalFilename__info",
			1,
			new store.Field("originalFilename")
				.setLabel("Nom du fichier source")
				
				.setShowArea(
		new areas.InputArea("originalFilename").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1014);
	
		extPoints.addToList("store:fields:prc:epub3", "originalLanguage__info",
			1,
			new store.Field("originalLanguage")
				.setLabel("Langue d\'origine")
				
				.setShowArea(
		new areas.InputArea("originalLanguage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1015);
	
		extPoints.addToList("store:fields:prc:epub3", "typeOuvrage__info",
			1,
			new store.Field("typeOuvrage")
				.setLabel("Type d\'ouvrage")
				
				.setShowArea(
		new areas.InputArea("typeOuvrage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1016);
	
		extPoints.addToList("store:fields:prc:epub3", "authorAud__info",
			1,
			new store.Field("authorAud")
				.setLabel("Auteur Audio")
				
				.setShowArea(
		new areas.InputArea("authorAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1017);
	
		extPoints.addToList("store:fields:prc:epub3", "authorBrl__info",
			1,
			new store.Field("authorBrl")
				.setLabel("Auteur Braille")
				
				.setShowArea(
		new areas.InputArea("authorBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1018);
	
		extPoints.addToList("store:fields:prc:epub3", "authorPivot__info",
			1,
			new store.Field("authorPivot")
				.setLabel("Auteur Pivot")
				
				.setShowArea(
		new areas.InputArea("authorPivot").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1019);
	
		extPoints.addToList("store:fields:prc:epub3", "statutEmb__info",
			1,
			new store.Field("statutEmb")
				.setLabel("Statut Embossage")
				
				.setShowArea(
		new areas.InputArea("statutEmb").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1020);
	
		extPoints.addToList("store:fields:prc:epub3", "fileName__info",
			1,
			new store.Field("fileName")
				.setLabel("Nom de fichier")
				
				.setShowArea(
		new areas.InputArea("fileName").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1021);
	
		extPoints.addToList("store:fields:prc:epub3", "dtdDetail__info",
			1,
			new store.Field("dtdDetail")
				.setLabel("Détail DTD (Doctype)")
				
				.setShowArea(
		new areas.InputArea("dtdDetail").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1022);
	
		extPoints.addToList("store:fields:prc:epub3", "dateEnd__info",
			1,
			new store.Field("dateEnd")
				.setLabel("Date de publication en médiathèque")
				
				.setShowArea(
		new areas.InputArea("dateEnd").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "time")
	.setReadOnly(true), true, '')
				,
		1023);
	
		extPoints.addToList("store:fields:prc:epub3", "dateParution__info",
			1,
			new store.Field("dateParution")
				.setLabel("Date de parution")
				
				.setShowArea(
		new areas.InputArea("dateParution").setTag("input", "input-text", {class:"fieldValue",pattern:"(\\d\\d\\d\\d(-\\d\\d)?)?"})
	.setReadOnly(true), true, '')
				,
		1024);
	
		extPoints.addToList("store:fields:prc:epub3", "nbPagesBrailleAbrege__info",
			1,
			new store.Field("nbPagesBrailleAbrege")
				.setLabel("Nombre de pages - Braille abrégé")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleAbrege").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1025);
	
		extPoints.addToList("store:fields:prc:epub3", "nbPagesBrailleIntegral__info",
			1,
			new store.Field("nbPagesBrailleIntegral")
				.setLabel("Nombre de pages - Braille intégral")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleIntegral").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1026);
	
		extPoints.addToList("store:fields:prc:epub3", "timestampStatut__info",
			1,
			new store.Field("timestampStatut")
				.setLabel("Horodatage de statut")
				
				.setShowArea(
		new areas.InputArea("timestampStatut").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1027);
	
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:epub3", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_epub3")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Archiver")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_archived");
					pCtx.defaultProps = {
						processing:"archived",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
		extPoints.addToList("store:fields:prc:data", "isbn__info",
			1,
			new store.Field("isbn")
				.setLabel("ISBN")
				
				.setShowArea(
		new areas.InputArea("isbn").setTag("input", "input-text", {class:"fieldValue",pattern:".+"})
	.setReadOnly(true), true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:data", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1002);
	
		extPoints.addToList("store:fields:prc:data", "title__info",
			1,
			new store.Field("title")
				.setLabel("Titre")
				
				.setShowArea(
		new areas.InputArea("title").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1003);
	
		extPoints.addToList("store:fields:prc:data", "author__info",
			1,
			new store.Field("author")
				.setLabel("Auteur")
				
				.setShowArea(
		new areas.InputArea("author").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1004);
	
		extPoints.addToList("store:fields:prc:data", "publisher__info",
			1,
			new store.Field("publisher")
				.setLabel("Éditeur")
				
				.setShowArea(
		new areas.InputArea("publisher").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1005);
	
		extPoints.addToList("store:fields:prc:data", "comment__info",
			1,
			new store.Field("comment")
				.setLabel("Commentaire")
				
				.setShowArea(
		new areas.InputArea("comment").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1006);
	
		extPoints.addToList("store:fields:prc:data", "pages__info",
			1,
			new store.Field("pages")
				.setLabel("Nombre de pages")
				
				.setShowArea(
		new areas.InputArea("pages").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1007);
	
		extPoints.addToList("store:fields:prc:data", "source__info",
			1,
			new store.Field("source")
				.setLabel("Format d\'origine")
				
				.setShowArea(
		new areas.InputArea("source").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1008);
	
		extPoints.addToList("store:fields:prc:data", "collection__info",
			1,
			new store.Field("collection")
				.setLabel("Collection")
				
				.setShowArea(
		new areas.InputArea("collection").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1009);
	
		extPoints.addToList("store:fields:prc:data", "illustrations__info",
			1,
			new store.Field("illustrations")
				.setLabel("Illustration")
				
				.setShowArea(
		new areas.InputArea("illustrations").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1010);
	
		extPoints.addToList("store:fields:prc:data", "statut__info",
			1,
			new store.Field("statut")
				.setLabel("Statut de production")
				
				.setShowArea(
		function(){
			
			extPoints.registerSvc("statut-\portal\import\metas\statut.meta;35", 
									1,
									new enums.StaticEnum("statut").setSimpleMap({
				"PLATON_PENDING":"A demander à Platon","PLATON_AWAITING":"En attente de Platon","TO_CONVERT":"A convertir","PROCESSING":"En cours","EXPORTED":"Exporté","DONE":"OK Médiathèque","STAND_BY":"En attente","ARCHIVED":"Archivé","REOPENED":"Réouvert"
			})
								);
			return new areas.InputArea("statut").setTag("select", "input-select", {svcEnum:"statut-\portal\import\metas\statut.meta;35", class:"fieldValue"})
		}.call(this)
	.setReadOnly(true), true, '')
				,
		1011);
	
		extPoints.addToList("store:fields:prc:data", "statutAud__info",
			1,
			new store.Field("statutAud")
				.setLabel("Statut Audio")
				
				.setShowArea(
		new areas.InputArea("statutAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1012);
	
		extPoints.addToList("store:fields:prc:data", "statutBrl__info",
			1,
			new store.Field("statutBrl")
				.setLabel("Statut Braille")
				
				.setShowArea(
		new areas.InputArea("statutBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1013);
	
		extPoints.addToList("store:fields:prc:data", "statutEmb__info",
			1,
			new store.Field("statutEmb")
				.setLabel("Statut Embossage")
				
				.setShowArea(
		new areas.InputArea("statutEmb").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1014);
	
		extPoints.addToList("store:fields:prc:data", "originalFilename__info",
			1,
			new store.Field("originalFilename")
				.setLabel("Nom du fichier source")
				
				.setShowArea(
		new areas.InputArea("originalFilename").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1015);
	
		extPoints.addToList("store:fields:prc:data", "originalLanguage__info",
			1,
			new store.Field("originalLanguage")
				.setLabel("Langue d\'origine")
				
				.setShowArea(
		new areas.InputArea("originalLanguage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1016);
	
		extPoints.addToList("store:fields:prc:data", "typeOuvrage__info",
			1,
			new store.Field("typeOuvrage")
				.setLabel("Type d\'ouvrage")
				
				.setShowArea(
		new areas.InputArea("typeOuvrage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1017);
	
		extPoints.addToList("store:fields:prc:data", "authorAud__info",
			1,
			new store.Field("authorAud")
				.setLabel("Auteur Audio")
				
				.setShowArea(
		new areas.InputArea("authorAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1018);
	
		extPoints.addToList("store:fields:prc:data", "authorBrl__info",
			1,
			new store.Field("authorBrl")
				.setLabel("Auteur Braille")
				
				.setShowArea(
		new areas.InputArea("authorBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1019);
	
		extPoints.addToList("store:fields:prc:data", "authorPivot__info",
			1,
			new store.Field("authorPivot")
				.setLabel("Auteur Pivot")
				
				.setShowArea(
		new areas.InputArea("authorPivot").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1020);
	
		extPoints.addToList("store:fields:prc:data", "fileName__info",
			1,
			new store.Field("fileName")
				.setLabel("Nom de fichier")
				
				.setShowArea(
		new areas.InputArea("fileName").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1021);
	
		extPoints.addToList("store:fields:prc:data", "dtdDetail__info",
			1,
			new store.Field("dtdDetail")
				.setLabel("Détail DTD (Doctype)")
				
				.setShowArea(
		new areas.InputArea("dtdDetail").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1022);
	
		extPoints.addToList("store:fields:prc:data", "dateEnd__info",
			1,
			new store.Field("dateEnd")
				.setLabel("Date de publication en médiathèque")
				
				.setShowArea(
		new areas.InputArea("dateEnd").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "time")
	.setReadOnly(true), true, '')
				,
		1023);
	
		extPoints.addToList("store:fields:prc:data", "dateParution__info",
			1,
			new store.Field("dateParution")
				.setLabel("Date de parution")
				
				.setShowArea(
		new areas.InputArea("dateParution").setTag("input", "input-text", {class:"fieldValue",pattern:"(\\d\\d\\d\\d(-\\d\\d)?)?"})
	.setReadOnly(true), true, '')
				,
		1024);
	
		extPoints.addToList("store:fields:prc:data", "nbPagesBrailleAbrege__info",
			1,
			new store.Field("nbPagesBrailleAbrege")
				.setLabel("Nombre de pages - Braille abrégé")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleAbrege").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1025);
	
		extPoints.addToList("store:fields:prc:data", "nbPagesBrailleIntegral__info",
			1,
			new store.Field("nbPagesBrailleIntegral")
				.setLabel("Nombre de pages - Braille intégral")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleIntegral").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1026);
	
		extPoints.addToList("store:fields:prc:data", "timestampStatut__info",
			1,
			new store.Field("timestampStatut")
				.setLabel("Horodatage de statut")
				
				.setShowArea(
		new areas.InputArea("timestampStatut").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1027);
	
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:data", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_data")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Importer un fichier XML")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_xml");
					pCtx.defaultProps = {
						processing:"xml",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
		extPoints.addToList("store:fields:prc:archived", "isbn__info",
			1,
			new store.Field("isbn")
				.setLabel("ISBN")
				
				.setShowArea(
		new areas.InputArea("isbn").setTag("input", "input-text", {class:"fieldValue",pattern:".+"})
	.setReadOnly(true), true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:archived", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1002);
	
		extPoints.addToList("store:fields:prc:archived", "title__info",
			1,
			new store.Field("title")
				.setLabel("Titre")
				
				.setShowArea(
		new areas.InputArea("title").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1003);
	
		extPoints.addToList("store:fields:prc:archived", "author__info",
			1,
			new store.Field("author")
				.setLabel("Auteur")
				
				.setShowArea(
		new areas.InputArea("author").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1004);
	
		extPoints.addToList("store:fields:prc:archived", "publisher__info",
			1,
			new store.Field("publisher")
				.setLabel("Éditeur")
				
				.setShowArea(
		new areas.InputArea("publisher").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1005);
	
		extPoints.addToList("store:fields:prc:archived", "comment__info",
			1,
			new store.Field("comment")
				.setLabel("Commentaire")
				
				.setShowArea(
		new areas.InputArea("comment").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1006);
	
		extPoints.addToList("store:fields:prc:archived", "pages__info",
			1,
			new store.Field("pages")
				.setLabel("Nombre de pages")
				
				.setShowArea(
		new areas.InputArea("pages").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1007);
	
		extPoints.addToList("store:fields:prc:archived", "source__info",
			1,
			new store.Field("source")
				.setLabel("Format d\'origine")
				
				.setShowArea(
		new areas.InputArea("source").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1008);
	
		extPoints.addToList("store:fields:prc:archived", "collection__info",
			1,
			new store.Field("collection")
				.setLabel("Collection")
				
				.setShowArea(
		new areas.InputArea("collection").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1009);
	
		extPoints.addToList("store:fields:prc:archived", "illustrations__info",
			1,
			new store.Field("illustrations")
				.setLabel("Illustration")
				
				.setShowArea(
		new areas.InputArea("illustrations").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1010);
	
		extPoints.addToList("store:fields:prc:archived", "statut__info",
			1,
			new store.Field("statut")
				.setLabel("Statut de production")
				
				.setShowArea(
		function(){
			
			extPoints.registerSvc("statut-\portal\import\metas\statut.meta;35", 
									1,
									new enums.StaticEnum("statut").setSimpleMap({
				"PLATON_PENDING":"A demander à Platon","PLATON_AWAITING":"En attente de Platon","TO_CONVERT":"A convertir","PROCESSING":"En cours","EXPORTED":"Exporté","DONE":"OK Médiathèque","STAND_BY":"En attente","ARCHIVED":"Archivé","REOPENED":"Réouvert"
			})
								);
			return new areas.InputArea("statut").setTag("select", "input-select", {svcEnum:"statut-\portal\import\metas\statut.meta;35", class:"fieldValue"})
		}.call(this)
	.setReadOnly(true), true, '')
				,
		1011);
	
		extPoints.addToList("store:fields:prc:archived", "statutAud__info",
			1,
			new store.Field("statutAud")
				.setLabel("Statut Audio")
				
				.setShowArea(
		new areas.InputArea("statutAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1012);
	
		extPoints.addToList("store:fields:prc:archived", "statutBrl__info",
			1,
			new store.Field("statutBrl")
				.setLabel("Statut Braille")
				
				.setShowArea(
		new areas.InputArea("statutBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1013);
	
		extPoints.addToList("store:fields:prc:archived", "statutEmb__info",
			1,
			new store.Field("statutEmb")
				.setLabel("Statut Embossage")
				
				.setShowArea(
		new areas.InputArea("statutEmb").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1014);
	
		extPoints.addToList("store:fields:prc:archived", "originalFilename__info",
			1,
			new store.Field("originalFilename")
				.setLabel("Nom du fichier source")
				
				.setShowArea(
		new areas.InputArea("originalFilename").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1015);
	
		extPoints.addToList("store:fields:prc:archived", "originalLanguage__info",
			1,
			new store.Field("originalLanguage")
				.setLabel("Langue d\'origine")
				
				.setShowArea(
		new areas.InputArea("originalLanguage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1016);
	
		extPoints.addToList("store:fields:prc:archived", "typeOuvrage__info",
			1,
			new store.Field("typeOuvrage")
				.setLabel("Type d\'ouvrage")
				
				.setShowArea(
		new areas.InputArea("typeOuvrage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1017);
	
		extPoints.addToList("store:fields:prc:archived", "authorAud__info",
			1,
			new store.Field("authorAud")
				.setLabel("Auteur Audio")
				
				.setShowArea(
		new areas.InputArea("authorAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1018);
	
		extPoints.addToList("store:fields:prc:archived", "authorBrl__info",
			1,
			new store.Field("authorBrl")
				.setLabel("Auteur Braille")
				
				.setShowArea(
		new areas.InputArea("authorBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1019);
	
		extPoints.addToList("store:fields:prc:archived", "authorPivot__info",
			1,
			new store.Field("authorPivot")
				.setLabel("Auteur Pivot")
				
				.setShowArea(
		new areas.InputArea("authorPivot").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1020);
	
		extPoints.addToList("store:fields:prc:archived", "fileName__info",
			1,
			new store.Field("fileName")
				.setLabel("Nom de fichier")
				
				.setShowArea(
		new areas.InputArea("fileName").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1021);
	
		extPoints.addToList("store:fields:prc:archived", "dtdDetail__info",
			1,
			new store.Field("dtdDetail")
				.setLabel("Détail DTD (Doctype)")
				
				.setShowArea(
		new areas.InputArea("dtdDetail").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1022);
	
		extPoints.addToList("store:fields:prc:archived", "dateEnd__info",
			1,
			new store.Field("dateEnd")
				.setLabel("Date de publication en médiathèque")
				
				.setShowArea(
		new areas.InputArea("dateEnd").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "time")
	.setReadOnly(true), true, '')
				,
		1023);
	
		extPoints.addToList("store:fields:prc:archived", "dateParution__info",
			1,
			new store.Field("dateParution")
				.setLabel("Date de parution")
				
				.setShowArea(
		new areas.InputArea("dateParution").setTag("input", "input-text", {class:"fieldValue",pattern:"(\\d\\d\\d\\d(-\\d\\d)?)?"})
	.setReadOnly(true), true, '')
				,
		1024);
	
		extPoints.addToList("store:fields:prc:archived", "nbPagesBrailleAbrege__info",
			1,
			new store.Field("nbPagesBrailleAbrege")
				.setLabel("Nombre de pages - Braille abrégé")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleAbrege").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1025);
	
		extPoints.addToList("store:fields:prc:archived", "nbPagesBrailleIntegral__info",
			1,
			new store.Field("nbPagesBrailleIntegral")
				.setLabel("Nombre de pages - Braille intégral")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleIntegral").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1026);
	
		extPoints.addToList("store:fields:prc:archived", "timestampStatut__info",
			1,
			new store.Field("timestampStatut")
				.setLabel("Horodatage de statut")
				
				.setShowArea(
		new areas.InputArea("timestampStatut").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1027);
	
		extPoints.addToList("store:fields:prc:archived", "dureeAud__info",
			1,
			new store.Field("dureeAud")
				.setLabel("Durée Audio")
				
				.setShowArea(
		new areas.InputArea("dureeAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1028);
	
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:archived", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_archived")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Ré-ouvrir l\'ouvrage archivé")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_reopened");
					pCtx.defaultProps = {
						processing:"reopened",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	
		
		extPoints.addToList("store:fields:prc:reopened", "isbn__info",
			1,
			new store.Field("isbn")
				.setLabel("ISBN")
				
				.setShowArea(
		new areas.InputArea("isbn").setTag("input", "input-text", {class:"fieldValue",pattern:".+"})
	.setReadOnly(true), true, '')
				,
		1001);
	
		extPoints.addToList("store:fields:prc:reopened", "uid__info",
			1,
			new store.Field("uid")
				.setLabel("UID")
				
				.setShowArea(
		new areas.InputArea("uid").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1002);
	
		extPoints.addToList("store:fields:prc:reopened", "title__info",
			1,
			new store.Field("title")
				.setLabel("Titre")
				
				.setShowArea(
		new areas.InputArea("title").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1003);
	
		extPoints.addToList("store:fields:prc:reopened", "author__info",
			1,
			new store.Field("author")
				.setLabel("Auteur")
				
				.setShowArea(
		new areas.InputArea("author").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1004);
	
		extPoints.addToList("store:fields:prc:reopened", "publisher__info",
			1,
			new store.Field("publisher")
				.setLabel("Éditeur")
				
				.setShowArea(
		new areas.InputArea("publisher").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1005);
	
		extPoints.addToList("store:fields:prc:reopened", "comment__info",
			1,
			new store.Field("comment")
				.setLabel("Commentaire")
				
				.setShowArea(
		new areas.InputArea("comment").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1006);
	
		extPoints.addToList("store:fields:prc:reopened", "pages__info",
			1,
			new store.Field("pages")
				.setLabel("Nombre de pages")
				
				.setShowArea(
		new areas.InputArea("pages").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1007);
	
		extPoints.addToList("store:fields:prc:reopened", "source__info",
			1,
			new store.Field("source")
				.setLabel("Format d\'origine")
				
				.setShowArea(
		new areas.InputArea("source").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1008);
	
		extPoints.addToList("store:fields:prc:reopened", "collection__info",
			1,
			new store.Field("collection")
				.setLabel("Collection")
				
				.setShowArea(
		new areas.InputArea("collection").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1009);
	
		extPoints.addToList("store:fields:prc:reopened", "illustrations__info",
			1,
			new store.Field("illustrations")
				.setLabel("Illustration")
				
				.setShowArea(
		new areas.InputArea("illustrations").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1010);
	
		extPoints.addToList("store:fields:prc:reopened", "statut__info",
			1,
			new store.Field("statut")
				.setLabel("Statut de production")
				
				.setShowArea(
		function(){
			
			extPoints.registerSvc("statut-\portal\import\metas\statut.meta;35", 
									1,
									new enums.StaticEnum("statut").setSimpleMap({
				"PLATON_PENDING":"A demander à Platon","PLATON_AWAITING":"En attente de Platon","TO_CONVERT":"A convertir","PROCESSING":"En cours","EXPORTED":"Exporté","DONE":"OK Médiathèque","STAND_BY":"En attente","ARCHIVED":"Archivé","REOPENED":"Réouvert"
			})
								);
			return new areas.InputArea("statut").setTag("select", "input-select", {svcEnum:"statut-\portal\import\metas\statut.meta;35", class:"fieldValue"})
		}.call(this)
	.setReadOnly(true), true, '')
				,
		1011);
	
		extPoints.addToList("store:fields:prc:reopened", "statutAud__info",
			1,
			new store.Field("statutAud")
				.setLabel("Statut Audio")
				
				.setShowArea(
		new areas.InputArea("statutAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1012);
	
		extPoints.addToList("store:fields:prc:reopened", "statutBrl__info",
			1,
			new store.Field("statutBrl")
				.setLabel("Statut Braille")
				
				.setShowArea(
		new areas.InputArea("statutBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1013);
	
		extPoints.addToList("store:fields:prc:reopened", "statutEmb__info",
			1,
			new store.Field("statutEmb")
				.setLabel("Statut Embossage")
				
				.setShowArea(
		new areas.InputArea("statutEmb").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1014);
	
		extPoints.addToList("store:fields:prc:reopened", "originalFilename__info",
			1,
			new store.Field("originalFilename")
				.setLabel("Nom du fichier source")
				
				.setShowArea(
		new areas.InputArea("originalFilename").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1015);
	
		extPoints.addToList("store:fields:prc:reopened", "originalLanguage__info",
			1,
			new store.Field("originalLanguage")
				.setLabel("Langue d\'origine")
				
				.setShowArea(
		new areas.InputArea("originalLanguage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1016);
	
		extPoints.addToList("store:fields:prc:reopened", "typeOuvrage__info",
			1,
			new store.Field("typeOuvrage")
				.setLabel("Type d\'ouvrage")
				
				.setShowArea(
		new areas.InputArea("typeOuvrage").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1017);
	
		extPoints.addToList("store:fields:prc:reopened", "authorAud__info",
			1,
			new store.Field("authorAud")
				.setLabel("Auteur Audio")
				
				.setShowArea(
		new areas.InputArea("authorAud").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1018);
	
		extPoints.addToList("store:fields:prc:reopened", "authorBrl__info",
			1,
			new store.Field("authorBrl")
				.setLabel("Auteur Braille")
				
				.setShowArea(
		new areas.InputArea("authorBrl").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1019);
	
		extPoints.addToList("store:fields:prc:reopened", "authorPivot__info",
			1,
			new store.Field("authorPivot")
				.setLabel("Auteur Pivot")
				
				.setShowArea(
		new areas.InputArea("authorPivot").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1020);
	
		extPoints.addToList("store:fields:prc:reopened", "fileName__info",
			1,
			new store.Field("fileName")
				.setLabel("Nom de fichier")
				
				.setShowArea(
		new areas.InputArea("fileName").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1021);
	
		extPoints.addToList("store:fields:prc:reopened", "dtdDetail__info",
			1,
			new store.Field("dtdDetail")
				.setLabel("Détail DTD (Doctype)")
				
				.setShowArea(
		new areas.InputArea("dtdDetail").setTag("input", "input-text", {class:"fieldValue"})
	.setReadOnly(true), true, '')
				,
		1022);
	
		extPoints.addToList("store:fields:prc:reopened", "dateEnd__info",
			1,
			new store.Field("dateEnd")
				.setLabel("Date de publication en médiathèque")
				
				.setShowArea(
		new areas.InputArea("dateEnd").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "time")
	.setReadOnly(true), true, '')
				,
		1023);
	
		extPoints.addToList("store:fields:prc:reopened", "dateParution__info",
			1,
			new store.Field("dateParution")
				.setLabel("Date de parution")
				
				.setShowArea(
		new areas.InputArea("dateParution").setTag("input", "input-text", {class:"fieldValue",pattern:"(\\d\\d\\d\\d(-\\d\\d)?)?"})
	.setReadOnly(true), true, '')
				,
		1024);
	
		extPoints.addToList("store:fields:prc:reopened", "nbPagesBrailleAbrege__info",
			1,
			new store.Field("nbPagesBrailleAbrege")
				.setLabel("Nombre de pages - Braille abrégé")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleAbrege").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1025);
	
		extPoints.addToList("store:fields:prc:reopened", "nbPagesBrailleIntegral__info",
			1,
			new store.Field("nbPagesBrailleIntegral")
				.setLabel("Nombre de pages - Braille intégral")
				
				.setShowArea(
		new areas.InputArea("nbPagesBrailleIntegral").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1026);
	
		extPoints.addToList("store:fields:prc:reopened", "timestampStatut__info",
			1,
			new store.Field("timestampStatut")
				.setLabel("Horodatage de statut")
				
				.setShowArea(
		new areas.InputArea("timestampStatut").setTag("input", "input-text", {class:"fieldValue"}).overrideTagInput("type", "number")
	.setReadOnly(true), true, '')
				,
		1027);
	
			extPoints.addToList("store:showRes:importTb:areas:transform:prc:reopened", "transformRes_1", 11, new actions.SvcActionWrapper("showResImportAction_reopened")
				.setWrappedSvcCd("showResImportAction")
				.setLabel("Archiver")
				.setVisible(true)
				.override("execute", function(pEvt, pCtx){
					pCtx.processing =  extPoints.getSvc("prc_archived");
					pCtx.defaultProps = {
						processing:"archived",
					};
					pCtx.defaultProps.path = pCtx.nodeInfos.path;
					return this.getWrappedAction(pCtx).execute(pEvt, pCtx);
				})
			, "k");
		
	//
(function(){
var vPathField = new store.DepotPathField()
	.setLabels("Nom", "Dossier parent")
	.setDescriptions(function(pCtx){return pCtx.processing.isFolder() ? "Nom du dossier" : "Nom du document"},
					function(pCtx){return pCtx.processing.isFolder() ? "Dossier parent contenant ce dossier" : "Dossier contenant le document"})
	.setShowArea(new areas.InputArea("path")
					.setLabel("Chemin")
					.setDescription(function(pCtx){return pCtx.processing.isFolder() ? "Chemin du dossier": "Chemin du document"})
					.setReadOnly(true)
					.setTag("input", "input-text", {"class":"fieldValue"})
	);
vPathField.getInputArea().setReadOnlyOnFolder(true);

extPoints.registerSvc("field_path", 1, vPathField);
extPoints.addSvcToList("store:fields:system", "path", 1, "field_path", 10);

extPoints.addToList("store:fields:system", "publicLink", 1, js.create(new areas.Area("publicLink").setLabel("URL").setBuildBody(function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	return pBd.elt("a", "fieldValue").att("href", pContext.nodeInfos.publicUrl).att("title", this.getLabel(pContext)).att("target", "_blank").text(pContext.nodeInfos.publicUrl).currentUp();
}), store.mixinShowFieldForArea), 20);

extPoints.addToList("store:fields:system", "permaLink", 1, js.create(new areas.Area("permaLink").setLabel("Lien permanent").setBuildBody(function(pBd, pContext, pOptions){
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	return pBd.elt("a", "fieldValue").att("href", pContext.nodeInfos.permaLink).att("title", this.getLabel(pContext)).att("target", "_blank").text(pContext.nodeInfos.permaLink).currentUp();
}).setVisible(function(pContext){
	if(pContext.nodeInfos.permaLink==pContext.nodeInfos.publicUrl) return false;
	return this.checkPermissions(pContext);
}), store.mixinShowFieldForArea), 30);

extPoints.addToList("store:fields:system", "dates", 1, new store.ModifDatesField().setLabel("Modification").setDescription("Date de dernière modification"), 40);

extPoints.addToList("store:fields:system", "trashed", 1, js.create(new areas.Area("trashed").setLabel("État").setVisible(function(pContext){
	var vPrc = store.getProcessing(pContext.nodeInfos.prc);
	if(!extPoints.getPref("store.field.forceShowResActions", false) && vPrc.getVersionning()!==store.Versionning.VCB && !pContext.nodeInfos.trashed) {
		return false;
	}
	return areas.Area.prototype.isVisible(pContext);
}).setBuildBody(function(pBd, pContext, pOptions){
	var vPrc = store.getProcessing(pContext.nodeInfos.prc);
	areas.buildLabelFrame(this, pBd, pContext, pOptions);
	var vBd = pBd.elt("sc-hbox", "align-center");
	vBd.elt("span", "fieldValue").text(pContext.nodeInfos.trashed ? "En corbeille" : "Visible").up();
	//pContext.browser.openFolder(pContext.browser.fCurrentPath);
	if(extPoints.getPref("store.field.forceShowResActions", false) || vPrc.getVersionning()===store.Versionning.VCB){
		var vContext = {};
		Object.assign(vContext, pContext);
		vContext.actionCb = function(pSuccess){
			pContext.showResView.showResPath(pContext.nodeInfos.path, vPrc.getVersionning()!==store.Versionning.none, true);
		}
		vContext.actionCbThis = this;
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreMoveToTrash").style("margin", "3px").up();
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreRestoreFromTrash").style("margin", "3px").up();	
		vBd.elt("sc-btn").prop("actionContext", vContext).att("svcAction", "actionStoreRemoveRes").style("margin", "3px").up();
	}				
	return vBd.currentUp();
}), store.mixinShowFieldForArea), 1);

extPoints.addToList("store:fields:system", "showPrc", 1, new store.ShowProcessingField()	.setLabel("Traitement"), 50);
})();
//

// # Déclaration des rôles
// - Rôles imposés par le portlet
extPoints.addRolePermList([
			{ "role": "webUser", "priority":1, "superRole": "~default", "allow":["read.UTNode.webView"], "deny":["DO"]}
		], 1);
	
// -  Rôles spécifiés
	extPoints.addRolePermList([{"role":"~default","priority":0,"allow":["DATA","dialog.adminUser#List"],"deny":["DO","role.main:admin.applyOn.group#show","role.hideWspApp.applyOn.wsp#show","role.hideWspDocApp.applyOn.wsp#show","role.main:admin.applyOn.wsp#show","role.hideWspApp.applyOn.space#show","role.hideWspDocApp.applyOn.space#show","role.main:admin.applyOn.space#show"]}], 21);extPoints.addRolePermList([{"role":"main:author","title":"Auteur","sortKey":"20","priority":1,"setPerm":"role.main:author#set","superRole":"main:reader","allow":["write"]}], 21);extPoints.addRolePermList([{"role":"main:manager","title":"Gestionnaire fonctionnel","sortKey":"30","priority":1,"setPerm":"role.main:manager#set","superRole":"main:author","allow":["admin"],"deny":["roles.adminSyst#set","admin.props.isHidden.user"]}], 21);extPoints.addRolePermList([{"role":"main:system","priority":1,"allow":["adminSyst","deploy","dialog.ping#Ping","admin.liaise","install.skinPack","admin.Container"],"deny":["DO"]}], 21);extPoints.addRolePermList([{"role":"main:admin","title":"Administrateur technique","sortKey":"40","priority":1,"setPerm":"role.main:admin#set","superRole":"~default","allow":["DO","~actionsSystem"]}], 21);extPoints.addRolePermList([{"role":"main:none","title":"Aucun","sortKey":"1","priority":1,"setPerm":"role.main:none#set","superRole":"main:~fallback"}], 21);extPoints.addRolePermList([{"role":"main:reader","title":"Lecteur","sortKey":"10","priority":1,"setPerm":"role.main:reader#set","superRole":"~default","allow":["read","use","server.storeChanges#Listen"],"deny":["ui.app.wspDoc.create.doc","ui.app.wspDoc.change.doc","ui.wspApp","ui.wspsPlg","view.depot"]}], 21);
	
//


	
extPoints.registerSvc("area.login", 11, new areas.Area("login").setBuildBody(function(pBd, pCtx, pOptions){
		return pBd.elt("sc-loginDialog").currentUp();
}).setLibs({"sc-loginDialog": "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wbk/6.1.10.202401191026/commons/dialogs/loginDialog.html"}));
extPoints.setPref("auth.serverUrl", 1, "https://studio-paon.edrlab.org/~~import/~~write");
authProv.initAuthProv({});

//
							//
							extPoints.setPref("password.lost.label", 1, "Mot de passe perdu ?");
							extPoints.setPref("auth.foreignPasswordLostUrl", 1, "https://studio-paon.edrlab.org/~~chain/public/u/pwdLost?cdaction=AskForUpdate");
							//
						//
	// # Déclaration des rôles UI
	extPoints.addToList(	"user:roles",	"main:author",	21, new areas.InputArea("main:author").setLabel("Auteur").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_20");extPoints.addToList(	"user:roles",	"main:manager",	21, new areas.InputArea("main:manager").setLabel("Gestionnaire fonctionnel").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_30");extPoints.addToList(	"user:roles",	"main:admin",	21, new areas.InputArea("main:admin").setLabel("Administrateur technique").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_40");extPoints.addToList(	"user:roles",	"main:none",	21, new areas.InputArea("main:none").setLabel("Aucun").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_1");extPoints.addToList(	"user:roles",	"main:reader",	21, new areas.InputArea("main:reader").setLabel("Lecteur").setTag("input", "input-radio", {class:"fieldValue -uu",group:"main"}),	"a_10");
//
//
	extPoints.getSvcLazy("jobs", function(pSvc) {
		// - Recalcul des vues
		
		
		// - Supprimer les documents en corbeille
		extPoints.addToList("adminView:jobs", "removeTrashed", 1, new pSvc.RelaunchCidTasksJob("removeTrashed")
			.setLabel("Supprimer les documents en corbeille")
			.setFilterTrashedRes(false)
			.setCreateJobBtnLabel("Supprimer")
			.setCreateJobConfirmMsg("Confirmez-vous la suppression définitive des documents en corbeille ?")
			.appendFreeJobData(function(pDataObj){
				if(!pDataObj.preconditions){
					pDataObj.preconditions = "persistMeta(trashed,true)";
				}else{
					pDataObj.preconditions += "&persistMeta(trashed,true)";
				}
				pDataObj.updatePersistMetas = [{action: "replace", key:"action", value:"remove"}];
			})
			.addChoiceCondPersistMeta("path", "Chemin du document")
			.setStopAfterFailures(50)
		, 20);
		
		
			// - Rebuild ES
			extPoints.addToList("adminView:jobs", "rebuildIndexES", 1, new pSvc.RelaunchCidTasksJob("rebuildIndexES")
				.setLabel("Indexation Elasticsearch")
				.setCreateJobBtnLabel("Réindexer")
				.setCreateJobConfirmMsg("Confirmez-vous la réindexation des documents ?")
				
				
					
					.addChoiceProcessing("folder", "Dossier sans accueil", false)
				
					
					.addChoiceProcessing("home", "Dossier avec accueil personnalisé", false)
				
					
					.addChoiceProcessing("xml", "XML", false)
				
					
					.addChoiceProcessing("epub3", "EPUB 3", false)
				
					
					.addChoiceProcessing("data", "Data", false)
				
					
					.addChoiceProcessing("archived", "Archivé", false)
				
					
					.addChoiceProcessing("reopened", "Archivé - réouvert", false)
				
				.setForceContentIndexValue(true)
				.setStopAfterFailures(50)
			, 20);
		
				
	}, this, "https://studio-paon.edrlab.org/~~static/scCore/fr-FR/webfrm/-wlb/6.1.10.202401191026/desk/svcs/jobs.js");	
////
window.urlTreeUrl = "https://studio-paon.edrlab.org/~~import";
window.writeServerUrl = "https://studio-paon.edrlab.org/~~import/~~write/web";
window.storeProv = new store.StoreProvider().initStore({
	urlTreeUrl :  "https://studio-paon.edrlab.org/~~import",
	writeUrl : "https://studio-paon.edrlab.org/~~import/~~write/web",
	adminUrlTreeUrl : "https://studio-paon.edrlab.org/~~import/~~write/adminTree",
	
	esIndexMap : {"depot" : "/import"},
	searchUrl : "https://studio-paon.edrlab.org/~~import/~~search",
	
	canTrashRes : false,
	canUnlistRes : false
});
//