var values = [];
values["father"] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
values["mother"] = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
const appearanceIndex = {
    "blemishes": 0,
    "facial_hair": 1,
    "eyebrows": 2,
    "ageing": 3,
    "makeup": 4,
    "blush": 5,
    "complexion": 6,
    "sundamage": 7,
    "lipstick": 8,
    "freckles": 9,
    "chesthair": 10
}
var CEFInterface = require("./browser.js").interface;
var CEFNotification = require("./browser.js").notification;
mp.events.add("Character:Update", (data) => {
    let cModel = mp.players.local.model == mp.game.joaat('mp_m_freemode_01') ? "Male" : "Female"
    data = JSON.parse(data);
    if (data.gender != cModel) {
        if (data.gender == "Male") {
            mp.players.local.model = mp.game.joaat('mp_m_freemode_01');
          //  mp.players.local.setComponentVariation(2, 52, 0, 2);
            mp.players.local.setComponentVariation(3, 15, 0, 2);
            mp.players.local.setComponentVariation(4, 102, 0, 2);
            mp.players.local.setComponentVariation(6, 34, 0, 2);
            mp.players.local.setComponentVariation(8, 15, 0, 2);
            mp.players.local.setComponentVariation(11, 69, 0, 5);
            // mp.players.local.setComponentVariation(5, 40, 0, 2);
        } else {
            mp.players.local.model = mp.game.joaat('mp_f_freemode_01');
            mp.players.local.setComponentVariation(3, 14, 0, 2);
            mp.players.local.setComponentVariation(4, 110, 0, 2);
            mp.players.local.setComponentVariation(6, 35, 0, 2);
            mp.players.local.setComponentVariation(8, 15, 0, 2);
            mp.players.local.setComponentVariation(11, 63, 0, 2);
            //mp.players.local.setComponentVariation(5, 40, 0, 2);
        }
    }
    /*appearanceIndex*/
    if (data.makeup) {
        let index = appearanceIndex["makeup"];
        let overlayID = (data.makeup == 0) ? 255 : data.makeup - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.makeup_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.ageing) {
        let index = appearanceIndex["ageing"];
        let overlayID = (data.ageing == 0) ? 255 : data.ageing - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.ageing_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.blemishes) {
        let index = appearanceIndex["blemishes"];
        let overlayID = (data.blemishes == 0) ? 255 : data.blemishes - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.blemishes_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.facial_hair) {
        let index = appearanceIndex["facial_hair"];
        let overlayID = (data.facial_hair == 0) ? 255 : data.facial_hair - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.facial_hair_opacity * 0.01, data.facial_hair_color /*ColorOverlay*/ , 0);
    }
    if (data.eyebrows) {
        let index = appearanceIndex["eyebrows"];
        let overlayID = (data.eyebrows == 0) ? 255 : data.eyebrows - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.eyebrows_opacity * 0.01, data.eyebrows_color /*ColorOverlay*/ , 0);
    }
    if (data.blush) {
        let index = appearanceIndex["blush"];
        let overlayID = (data.blush == 0) ? 255 : data.blush - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.blush_opacity * 0.01, data.blush_color /*ColorOverlay*/ , 0);
    }
    if (data.complexion) {
        let index = appearanceIndex["complexion"];
        let overlayID = (data.complexion == 0) ? 255 : data.complexion - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.complexion_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.lipstick) {
        let index = appearanceIndex["lipstick"];
        let overlayID = (data.lipstick == 0) ? 255 : data.lipstick - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.lipstick_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.freckles) {
        let index = appearanceIndex["freckles"];
        let overlayID = (data.freckles == 0) ? 255 : data.freckles - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.freckles_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    if (data.chesthair) {
        let index = appearanceIndex["chesthair"];
        let overlayID = (data.chesthair == 0) ? 255 : data.chesthair - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.chesthair_opacity * 0.01, data.chesthair_color /*ColorOverlay*/ , 0);
    }
    if (data.sundamage) {
        let index = appearanceIndex["sundamage"];
        let overlayID = (data.sundamage == 0) ? 255 : data.sundamage - 1;
        mp.players.local.setHeadOverlay(index, overlayID, /*Opacity*/ data.sundamage_opacity * 0.01, 0 /*ColorOverlay*/ , 0);
    }
    data.facial.forEach(function(feature, i) {
        mp.players.local.setFaceFeature(parseInt(feature.index), parseFloat(feature.val) * 0.01);
    })
    if (data.hair != undefined) {
        mp.players.local.setComponentVariation(2, data.hair, 0, 2);
        mp.players.local.setHairColor(data.hair_color, data.hair_highlight_color);
        mp.players.local.setEyeColor(data.eyeColor);
        mp.players.local.setHeadOverlayColor(1, 1, data.facial_hair_color, 0);
        mp.players.local.setHeadOverlayColor(2, 1, data.eyebrows_color, 0);
        mp.players.local.setHeadOverlayColor(5, 2, data.blush_color, 0);
        mp.players.local.setHeadOverlayColor(8, 2, data.lipstick, 0);
        mp.players.local.setHeadOverlayColor(10, 1, data.chesthair_color, 0);
    }
    if ((data.fatherIndex != undefined) && (data.motherIndex != undefined) && (data.tone != undefined) && (data.resemblance != undefined)) {
        mp.players.local.setHeadBlendData(
            // shape
            values["mother"][data.motherIndex], values["father"][data.fatherIndex], 0,
            // skin
            values["mother"][data.motherIndex], values["father"][data.fatherIndex], 0,
            // mixes
            data.resemblance * 0.01, data.tone * 0.01, 0.0, false);
    }
});
mp.events.add("Character:Save", (data) => {
    console.log("SAVE CHAR");
    CEFInterface.clear();
    CEFInterface.cursor(false);
    CEFInterface.active(false);
    clearTasksRender = false;
    mp.defaultCam.setActive(false);
    mp.players.local.freezePosition(false);
    //mp.game.cam.doScreenFadeOut(500);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    setTimeout(function() {
        mp.events.callRemote("client:appearance:save", data);
    }, 1)
});
var clearTasksRender = false;
mp.events.add("render", function() {
    if (clearTasksRender == true) {
        let camp = mp.defaultCam.getCoord();
        mp.players.local.taskLookAt(camp.x, camp.y, camp.z);
        let hpos = mp.players.local.getBoneCoords(12844, 0, 0, 0)
        mp.defaultCam.pointAtCoord(hpos.x, hpos.y, hpos.z);
        mp.defaultCam.setActive(true);
    }
});
mp.events.add("Character:Edit", (setClothing = false) => {
    // Set To Male ( Male : mp_m_freemode_01, female : mp_f_freemode_01)
    if (setClothing) {
        mp.players.local.model = mp.game.joaat('mp_m_freemode_01');
        mp.players.local.setDefaultComponentVariation();
        mp.players.local.setComponentVariation(4, 21, 0, 0);
        mp.players.local.setComponentVariation(11, 15, 0, 0);
        mp.players.local.setComponentVariation(3, 15, 0,0);
       // mp.players.local.setComponentVariation(6, 34, 0, 2);
       // mp.players.local.setComponentVariation(8, 15, 2, 2);
        //mp.players.local.setComponentVariation(11, 69, 0, 5);
        // mp.players.local.setComponentVariation(5, 40, 0, 2);
        mp.players.local.setHeadBlendData(
            // shape
            values["mother"][0], values["father"][0], 0,
            // skin
            values["mother"][0], values["father"][0], 0,
            // mixes
            0.5, 0.5, 0.0, false);
    }
    clearTasksRender = true;
});