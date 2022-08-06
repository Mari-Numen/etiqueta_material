/*global QUnit*/

sap.ui.define([
	"brcom.dohler.zui5_etq_material./zui5_mm_etq_material/controller/main.controller"
], function (Controller) {
	"use strict";

	QUnit.module("main Controller");

	QUnit.test("I should test the main controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
