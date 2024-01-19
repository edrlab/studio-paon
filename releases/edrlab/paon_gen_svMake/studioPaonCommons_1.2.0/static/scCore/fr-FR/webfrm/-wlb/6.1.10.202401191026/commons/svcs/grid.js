/**
 * Architecture générale :
 * 
 * 	grid.ColumnDef : Définition des colonnes d'une grid. Objets JS de configuration 
 * 		à déclarer par exemple dans une liste d'extPoints.
 * 
 * 	grid.CellBuilderXxx : Constructeur du contenu des cellules d'une colonne et de manipulation
 * 		des données issues de grid.GridDataRow : tri, export... 
 * 		Les grid.CellBuilderXxx sont instanciés pour chaque grid via grid.ColumnDef.getCellBuilderFactory(pGridCol).call(pGridCol).
 * 		Api :
 * 			redrawCell(pGridDataRow, pRootNode) : dessine le contenu d'une cellule.
 * 
 * 	grid.GridDataHandler : Fournisseur des données via des grid.GridDataRow pour remplir une grille.
 * 			getGrid() : sc-grid
 * 			countRows() : int
 * 			getRow(pOffset) : grid.GridDataRow
 * 
 * 	grid.GridDataRow : Représente une ligne de la grille et contient les données associées
 * 			getGridDataHandler() : grid.GridDataHandler
 * 			getDatas() : Json contenant les données pour les grid.CellBuilder.
 * 			getData(pKey) : Donnée de clé pKey pour les grid.CellBuilder.
 * 
 * 	sc-grid : WebComponent coordonnant tous ces objets :
 * 			getGridDataHandler() : grid.GridDataHandler
 * 			getGridColList() : GridCol[]
 * 			getGridCol(pId) : GridCol
 * 
 * 	GridCol :
 * 			getGrid() : sc-grid
 * 			getColumnDef() : grid.ColumnDef
 * 			getCellBuider() : grid.CellBuilder
 * 
 * 
 * Processus d'init : 
 * 		vScGrid.initColumDefs(pColDefLists).initGridDataHandler(pDataHandler);
 * 	Quand la liste des colonnes et le dataHandlers sont définis : 
 * 	- les CellBuilders sont instanciés et associés aux GridCol via ColumnDef.getCellBuilderFactory(pGridCol).call(pGridCol)
 * 	- GridDataHandler.initGridDatas(pScGrid) est appelé.
 * 
 * 
 * (re)Dessinement de la grid (quand les données sont chargées / modifiées) :
 * 
 * 	vScGrid.invalidateRows([pOffset] [, pCount]) : modification des rows existantes
 * 	vScGrid.rowCountChanged(pOffset, pCount) : insertion / suppression de rows
 * 
 * 
 * ActiveRow et gestion du scroll
 * 	Api sur sc-grid :
 * 			getActiveRow() : Offset de ligne activée détenant le focus
 * 			setActiveRow(pOffset) : Change la ligne détenant le focus
 * 			ensureRowVisible(pOffset) : Scroll pour s'assurer que la ligne pOffset soit visible (ca 
 * 						pourrait ne pas etre l'activeRow).
 * 
 * 
 * Sélection :
 * 	Api sur sc-grid :
 * 			getSelType() : "mono" ou "multi".
 * 			isRowSelected(pOffset)
 * 			getSelectedRow() : Offset de la 1ère ligne sélectionnée ou undefined (pratique si selType="mono").
 * 			getSelectedRows() : tableau d'offsets sélectionnés : [0, 5] = 2 lignes sélectionnées : 0 et 5
 * 				Si nombre négatif, correspond à une série entière à partir du nombre précédent
 * 				[0, 3, -5] = 4 lignes sélectionnées: 0, 3, 4 et 5 
 * 			setSelectedRows(pSelEntries) : simple offset ou tableau d'offset tel que définit dans getSelection()
 * 			addSelectedRows(pStartOffset, pEndOffset) : ajoute des rows dans la sélection
 * 			removeSelectedRows(pStartOffset, pEndOffset) : élimine des rows de la sélection
 * 			toggleSelectedRow(pOffset) : sélectionne / déselectionne une row.
 * 			clearSel() : efface toute sélection et active node.
 *  Event dispatché à partir de sc-grid sur tout changement de sélection : "gridSelect"
 * 
 * 
 * Tri :
 * 	sc-grid :
 * 			isSortKeyAlterable() : ihm de gestion de tri activée (vérifie aussi que GridDataHandler.onSortFnChange existe)
 * 			getSortFn() : function finale de tri adméttant 2 grid.GridDataRow en paramètres.
 * 					Function utilisée par grid.GridDataHandler pour trier ses données. Retourne null si pas d'ordre explicite.
 * 			getMainSortCol() : colonne de la clé de tri principale ou null.
 * 			getMainSortColState() : ordre de tri de la colonne de la clé de tri principale ("ascendant" ou "descendant").
 * 			setMainSortCol(pCol, pState) : déclaration explicite d'un ordre de tri sur une colonne.
 * 			onClickHeader(pCol, pEvt) : exécution par défaut des règles de changement des clés de tri lors d'un clic sur une entête de colonne.
 * 	grid.CellBuilderXxx :
 * 			getColSortFn() : retourne une function de tri **ascendant** associé à cette colonne
 * 							adméttant en paramètres 2 objets grid.GridDataRow.
 * 	grid.GridDataHandler :
 * 			onSortFnChange() : appelé par sc-grid lorsque les règles de tri ont changées. Si fct indefinie, la fonction de tr est désactivée.
 * 			getNaturalSortFn() : retourne une function de tri redonnant l'ordre naturel des données.
 * 							Retourne null si ce GridDataHandler ne gère pas cette function de retour à l'ordre naturel.
 * 	grid.ColumnDef :
 * 			redrawColSortState(pRootNode, pNewState, pPriority) : appelé par sc-grid pour le refresh graphique des headers.
 * 					pNewState : "none", "ascendant", "descendant"
 * 					pPriority : égal à 1 pour la clé de tri principale, 2 pour la secondaire, etc.
 */

(function(window){

var grid = {};

grid.ColumnDef = function(pId){
	this.fId = pId;
}

grid.ColumnDef.prototype = {

	getId : function(){
		return this.fId;
	},
	
	getLabel : function(pGridCol){
		return (typeof this.fLabel === 'function') ? this.fLabel.apply(this, arguments): this.fLabel;
	},
	setLabel : function(pLabel){
		this.fLabel = pLabel;
		return this;
	},
	
	/** Description de la colonne: exploité en tooltip sur l'entête. */
	setDescription: function (pDescription) {
		this.fDescription = pDescription;
		return this;
	},
	getDescription: function (pGridCol) {
		return this.fDescription;
	},
	
	getFlexBase : function(pGridCol){
		return this.fFlexBase || "10em";
	},
	getFlexGrow : function(pGridCol){
		return this.fFlexGrow || 0;
	},
	getFlexShrink : function(pGridCol){
		return this.fFlexShrink || 0;
	},
	getMinWidth : function(pGridCol){
		return this.fMinWidth || "0";
	},
	getMaxWidth : function(pGridCol){
		return this.fMaxWidth;
	},
	setFlex : function(pFlexBase, pFlexGrow, pFlexShrink, pMinWidth, pMaxWidth){
		this.fFlexBase = pFlexBase;
		this.fFlexGrow = pFlexGrow;
		this.fFlexShrink = pFlexShrink;
		this.fMinWidth = pMinWidth;
		this.fMaxWidth = pMaxWidth;
		return this;
	},
	
	/** 
	 * Une colonne invisible est masquée mais affichable via le columnPicker.
	 */
	isHidden : function(pGridCol){
		return this.fHidden || false;
	},
	setHidden : function(pHidden){
		this.fHidden = pHidden;
		return this;
	},
	
	/** 
	 * Une colonne non disponible n'est ni visible ni accessible vias le columnPicker.
	 * Méthode appelée avant la construction de l'objet GridCol.
	 * Peut être surchargé pour ne créer cette colonne que sous certaines conditions. 
	 */
	isAvailable : function(pGrid){
		return true;
	},
	
	/** 
	 * Une colonne sera réellement triable :
	 * - si cette méthode retourne true (true par défaut)
	 * - si la méthode CellBuilder.getSortFn() est implémentée.
	 * - et si Grid.getAttribute("hideSortBtns")!="true"
	 */
	isSortable : function(pGridCol){
		return !this.fNotSortable;
	},
	setSortable : function(pSortable){
		this.fNotSortable = ! pSortable;
		return this;
	},
	
	/** 
	 * CellBuilderFactory : fonction qui retourne un objet CellBuilder.
	 * This à l'appel de cette fonction est pGridCol.
	 */
	getCellBuilderFactory : function(pGridCol){
		return this.fCellBuilderFactory;
	},
	setCellBuilderFactory : function(pCellBuilderFactory){
		this.fCellBuilderFactory = pCellBuilderFactory;
		return this;
	},
	
	/** Construit l'entête de la colonne à injecter dans pRootNode. */
	buildColHeader : function(pGridCol, pRootNode){
		var vContainer;
		if(this.isSortable(pGridCol) && pGridCol.getCellBuider().getColSortFn && pGridCol.getGrid().isSortKeyAlterable()) {
			vContainer = pRootNode.appendChild(document.createElement("button"));
			vContainer.addEventListener("click", function(pEvt){
				pGridCol.getGrid().onClickHeader(pGridCol, pEvt);
				pEvt.stopPropagation();
			});
			vContainer.setAttribute("gridsort", "none");
		} else {
			vContainer = pRootNode.appendChild(document.createElement("div"));
		}
		vContainer.textContent = this.getLabel(pGridCol);
        vContainer.setAttribute("data-column",this.fId);
		var vDesc = this.getDescription(pGridCol);
		if(vDesc) vContainer.setAttribute("title", vDesc);
	},
	
	redrawColSortState : function(pRootNode, pNewState, pPriority){
		var vBtn = pRootNode.querySelector("button");
		if(vBtn) vBtn.setAttribute("gridsort", pNewState);
	}
}


grid.GridDataHandlerBase = function(){
}

/** Impl de base de GridDataHandler*/
grid.GridDataHandlerBase.prototype = {
	initGridDatas : function(pGrid){
		this.fGrid = pGrid;
		this.xTryBuildDatas();
	},
	getGrid : function(){return this.fGrid}
	//countRows : function(){...}
	//getRow : function(pOffset){...}	
	//xTryBuildDatas : function(){...}
}
grid.naturalSort = function(pRD1, pRD2) {
	return pRD1.getNaturalOrder() - pRD2.getNaturalOrder();
}


/** 
 * Impl de base de GridDataRow.
 * this.fRowDatas à renseigner ou this.getDatas() à redéfinir.
 */
grid.GridDataRowBase = function(pDataHandler, pRowDatas){
	this.fDataHandler = pDataHandler;
	if(pRowDatas) this.fRowDatas = pRowDatas;
}
grid.GridDataRowBase.prototype ={
	getGridDataHandler : function() {return this.fDataHandler},
	getData : function(pKey) {return this.getDatas()[pKey]},
	getDatas : function(){return this.fRowDatas},
	getNaturalOrder : function(){return this.getDatas().__natOrder}
}


/** Impl d'un GridDataHandler avec en source un tableau d'objets JSON. */
grid.GridDataHandlerJsonArray = function(){
	this.fFakeRow = new grid.GridDataRowBase(this);
	this.fGridDatas = [];
}
grid.GridDataHandlerJsonArray.prototype = {
	__proto__ : grid.GridDataHandlerBase.prototype,
	
	getGridDatas : function(){return this.fGridDatas},
	setGridDatas : function (pGridDatas) {
		this.xClearDatas();
		this.fGridDatas = pGridDatas;
		this.xSetNaturalOrder();
		this.xTryBuildDatas();
		return this;
	},
	
	updateGridDatas : function (pOffset, pDeleteCount, pInsertEntries) {
		if(!this.fGridDatas) throw "Datas never initialized.";
		if(pOffset<0 || this.fGridDatas.length < pOffset-1) throw "Update insert "+pOffset+" out of bounds 0-"+this.fGridDatas.length;
		this.fGridDatas.splice.apply(this.fGridDatas, [pOffset, pDeleteCount].concat(pInsertEntries));
		this.xSetNaturalOrder();
		var vInsertCount = pInsertEntries ? pInsertEntries.length : 0;
		if(pDeleteCount>0 && vInsertCount>0) {
			var vCount = Math.min(pDeleteCount, vInsertCount);
			this.fGrid.invalidateRows(pOffset, vCount);
			pOffset += vCount;
			pDeleteCount -= vCount;
			vInsertCount -= vCount;
		}
		if(pDeleteCount>0) this.fGrid.rowCountChanged(pOffset, -pDeleteCount);
		if(vInsertCount>0) this.fGrid.rowCountChanged(pOffset, vInsertCount);
		//On force le re-tri si une fct de tri est spécifiée.
		this.onSortFnChange();
	},
	setSaveNaturalOrder : function (pEnabled) {
		this.fNaturalSortFn = pEnabled ? grid.naturalSort : null;
		if(pEnabled) this.xSetNaturalOrder();
		return this;
	},
	
	countRows : function(){return this.fGridDatas ? this.fGridDatas.length : 0;},
	getRow : function(pOffset){
		this.fFakeRow.fRowDatas = this.fGridDatas[pOffset];
		return this.fFakeRow;
	},
	
	onSortFnChange : function(){
		var sortFn = this.fGrid.getSortFn();
		if(!sortFn) return;
		var vDataRows = this.fGridDatas.map(function(pDatas, pIdx){
				var vRow = new grid.GridDataRowBase(this, pDatas);
				if(this.fGrid.isRowSelected(pIdx)) vRow._rowSelected = true;
				return vRow;
			}, this);
		var vActiveRow = vDataRows[this.fGrid.getActiveRow()];
		var vNewActiveOffset;
		vDataRows.sort(sortFn);
		var vNewSel = [];
		this.fGridDatas = vDataRows.map(function(pDatasRow, pIdx){
			if(pDatasRow._rowSelected) {
				if(vNewSel.length==0) vNewSel.push(pIdx);
				else {
					var vLastIdx = vNewSel[vNewSel.length-1];
					if(vLastIdx<0 && -vLastIdx == pIdx-1) {
						vNewSel[vNewSel.length-1] = -pIdx;
					} else if(vLastIdx == pIdx-1) {
						vNewSel.push(-pIdx);
					} else {
						vNewSel.push(pIdx);
					}
				}
			}
			if(vActiveRow === pDatasRow) vNewActiveOffset=pIdx;
			return pDatasRow.getDatas();
		}, this);
		this.fGrid.invalidateRows();
		this.fGrid.setSelectedRows(vNewSel);
		this.fGrid.setActiveRow(vNewActiveOffset);
		if(vNewActiveOffset!=null) this.fGrid.ensureRowVisible(vNewActiveOffset);
	},
	getNaturalSortFn : function(){
		return this.fNaturalSortFn;
	},
	
	xTryBuildDatas : function(){
		if(!this.fGridDatas || !this.fGrid) return;
		if(this.fGridDatas.length>0) {
			var sortFn = this.fGrid.getSortFn();
			if(sortFn) {
				var vDataRows = this.fGridDatas.map(function(pDatas){return new grid.GridDataRowBase(this, pDatas)}, this);
				vDataRows.sort(sortFn);
				vDataRows.forEach(function(pDatasRow, pIdx){this.fGridDatas[pIdx] = pDatasRow.getDatas()}, this);
			}
			this.fGrid.rowCountChanged(0, this.fGridDatas.length);
		}
	},
	
	xClearDatas : function(){
		if(!this.fGridDatas || !this.fGrid) return;
		if(this.fGridDatas.length>0) {
			var vOldLen = this.fGridDatas.length;
			this.fGridDatas = [];
			this.fGrid.rowCountChanged(0, -vOldLen);
		}
	},
	xSetNaturalOrder : function(){
		if(!this.fNaturalSortFn || !this.fGridDatas) return;
		for(var i=0,l=this.fGridDatas.length; i<l; i++) this.fGridDatas[i].__natOrder = i;
	}
}

grid.CellBuilderString = function(pGridCol, pDataKey){
	this.fDataKey = pDataKey;
}
grid.CellBuilderString.prototype = {
	redrawCell : function(pGridDataRow, pRootNode) {
		pRootNode.textContent = this.xGetValue(pGridDataRow);
	},
	getColSortFn : function(){
		var vBuilder = this;
		return (function(p1, p2) {
				var v1 = vBuilder.xGetValue(p1);
				var v2 = vBuilder.xGetValue(p2);
				if(v1==null) {
					if(v2==null) return 0;
					return 1;
				} else if(v2==null) {
					return -1;
				}
				return v1.toString().localeCompare(v2);
			});
	},
	xGetValue : function(pGridDataRow){
		return pGridDataRow.getData(this.fDataKey);
	},
	override : function(pKey, pVal) {
		this[pKey] = pVal;
		return this;
	}
}

/** Cell avec icone + label. xGetIcon() doit être surchargé. */
grid.CellBuilderIconLabel = function(pGridCol, pDataKey){
	if(pDataKey) this.fDataKey = pDataKey;
	this.fImgWidth = 20;
	this.fImgHeight = 20;
	this.fBd = dom.newBd(null);
}
grid.CellBuilderIconLabel.prototype = {
	__proto__ : grid.CellBuilderString.prototype,

	setIconSize : function(pWidth, pHeight){
		this.fImgWidth = pWidth;
		this.fImgHeight = pHeight;
		return this;
	},
	setPreserveIconSpace : function(pPreserve){
		this.fPreserveSpace = pPreserve;
		return this;
	},
	redrawCell : function(pGridDataRow, pRootNode) {
		var vIcon = this.xGetIcon(pGridDataRow);
		var vLabel = this.xGetValue(pGridDataRow);
		this.fBd.setCurrent(pRootNode).clear();
		if(vIcon) this.fBd.elt("img").att("width", this.fImgWidth).att("height", this.fImgHeight).style("vertical-align", "middle").att("src", vIcon).up();
		else if(this.fPreserveSpace) this.fBd.elt("span").style("padding-left", this.fImgWidth+"px").up();
		this.fBd.elt("span");
		if(vLabel) this.fBd.text(vLabel);
	},
	xGetIcon : function(pGridDataRow){
		return null;
	}
}

grid.CellBuilderNumber = function(pGridCol, pDataKey){
	this.fDataKey = pDataKey;
}
grid.CellBuilderNumber.prototype = {
	__proto__ : grid.CellBuilderString.prototype,
	
	getColSortFn : function(){
		var vBuilder = this;
		return (function(p1, p2) {
				var v1 = vBuilder.xGetValue(p1) || 0;
				var v2 = vBuilder.xGetValue(p2) || 0;
				return v1 - v2;
			});
	}
}

grid.CellBuilderDate = function(pGridCol, pDataKey, pToStrFunc){
	this.fDataKey = pDataKey;
	this.fToStrFunc = pToStrFunc || Date.prototype.toLocaleDateString;
}
grid.CellBuilderDate.prototype = {
	__proto__ : grid.CellBuilderNumber.prototype,

	redrawCell : function(pGridDataRow, pRootNode) {
		var vD = parseInt(this.xGetValue(pGridDataRow), 10);
		pRootNode.textContent = vD > 0 ? this.fToStrFunc.call(new Date(vD)) : "";
	}
}

grid.CellBuilderCustom = function(pGridCol, pDataKey, pToStrFunc){
	this.fDataKey = pDataKey;
	this.fToStrFunc = pToStrFunc;
}
grid.CellBuilderCustom.prototype = {
	__proto__ : grid.CellBuilderString.prototype,

	redrawCell : function(pGridDataRow, pRootNode) {
		dom.newBd(pRootNode).clear();
		this.fToStrFunc.call(pGridDataRow,pRootNode);
		if(!pGridDataRow.fRowDatas[this.fDataKey]) pGridDataRow.fRowDatas[this.fDataKey] = pRootNode.textContent;
	}
}


if(!window.extPoints || !extPoints.initSvcLazy("grid", grid)) window.grid = grid;
})(window);
