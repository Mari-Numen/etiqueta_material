/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"brcom.dohler.zui5_etq_material./zui5_mm_etq_material/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
