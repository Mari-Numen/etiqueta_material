sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageBox, BusyIndicator) {
		"use strict";

		return Controller.extend("br.com.dohler.zui5etqmaterial.zui5mmetqmaterial.controller.main", {
			onInit: function () {
				var that = this;
				this.getOwnerComponent().getModel().read("/ZCDS_MM_IMPRESSORAS", {
					method: "GET",
					success: function (data) {
						if (data.results.length > 0) {
							that.getView().byId("idPrinter").setValue(data.results[0].Padest);
							that.getView().byId("idPrinter").setSelectedKey(data.results[0].Padest);
						}
					}
				});
			},
			onImpChange: function (oEvent) {
				if (oEvent.getSource().getSelectedKey() === '') {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				} else {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				}
			},
			_onBusyScreen: function (tipo) {
				if (tipo === "show") {
					BusyIndicator.show(0);
				}
				if (tipo === "hide") {
					BusyIndicator.hide(0);
				}
			},
			onPrint: function (oEvent, table) {
				var sMsg, sCont = 0;
				var sMatnr = "", sMatkl = "", sLgort = "", sWerks = "";
				var sPrinter = this.getView().byId("idPrinter").getSelectedKey();
				if (sPrinter === '') {
					this.getView().byId("idPrinter").setValueState(sap.ui.core.ValueState.Error);
					sMsg = this.getView().getModel("i18n").getResourceBundle().getText("InformarImpressora");
					MessageBox.error(sMsg, {
						title: this.getView().getModel("i18n").getResourceBundle().getText("Erro"),
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					return;
				}
				var items = this.getView().byId(table).getTable().getSelectedItems();
				if (items.length === 0) {
					sMsg = this.getView().getModel("i18n").getResourceBundle().getText("SelecionarItem");
					MessageBox.error(sMsg, {
						title: this.getView().getModel("i18n").getResourceBundle().getText("Erro"),
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				} else {
					this._onBusyScreen("show");
					items.forEach(element => {
						sCont = sCont + 1;
						if (sCont === items.length) {
							sMatnr += element.getBindingContext().getObject("matnr");
							sMatkl += element.getBindingContext().getObject("matkl");
							sLgort += element.getBindingContext().getObject("lgort");
							sWerks += element.getBindingContext().getObject("werks");
						} else {
							sMatnr += element.getBindingContext().getObject("matnr") + ",";
							sMatkl += element.getBindingContext().getObject("matkl") + ",";
							sLgort += element.getBindingContext().getObject("lgort") + ",";
							sWerks += element.getBindingContext().getObject("werks") + ",";
						}
					});
					var that = this;
					var oUrlParams = {
						matnr: sMatnr,
						matkl: sMatkl,
						lgort: sLgort,
						werks: sWerks,
						printer: sPrinter
					};

					this.getView().getModel().callFunction("/imprimirEtiqueta", {
						method: "POST",
						urlParameters: oUrlParams,
						success: function (oData, sResponse) {
							that._onBusyScreen("hide");
							sMsg = that.getView().getModel("i18n").getResourceBundle().getText("ImpressaoRealizada");

							MessageBox.show(sMsg, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: that.getView().getModel("i18n").getResourceBundle().getText("Impressao"),
								actions: [MessageBox.Action.OK]
							});

						},
						error: function (oError, sResponse) {
							that._onBusyScreen("hide");
							var error = JSON.parse(oError.responseText);
							var errorDetails = error.error.innererror.errordetails;
							var aErrorDetails = [];
							if (errorDetails) {
								aErrorDetails = errorDetails.reduce(function (a, b) {
									function indexOfProperty(a, b) {
										for (var i = 0; i < a.length; i++) {
											if (a[i].message == b.message) {
												return i;
											}
										}
										return - 1
									}
									if (indexOfProperty(a, b) < 0) a.push(b);
									return a;
								}, []);
								for (var i = 0, len = aErrorDetails.length; i < len; i++) {
									var message = aErrorDetails[i].message + "\n\n";
									sMsgErro += message;
								}
							}

							MessageBox.error(sMsgErro, {
								title: that.getView().getModel("i18n").getResourceBundle().getText("Erro"),
								onClose: null,
								styleClass: "",
								initialFocus: null,
								textDirection: sap.ui.core.TextDirection.Inherit
							});

						}
					});
				}

			}
		});
	});
