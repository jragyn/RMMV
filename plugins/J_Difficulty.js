/* -------------------------------------------------------------------------- */
// J_Difficulty
// V: 1.0
//

/*:@plugindesc Provides difficulty options for the the player that modify enemy stats.
@author J

@help In short, this adds a command to the main menu that sends the player to
        another scene that lets them change the difficulty to one of a few preset
        difficulties that modify enemy parameters making enemies either
        tougher or wimpier. This can affect literally any of the default
        parameters, s-parameters, and x-parameters, and also their XP/GP rates,
        and also item drop rates. I included three difficulties by default, but
        if you can see the pattern, you are free to add/subtract/change the
        difficulties as you see fit. I did not create any plugin parameters
        because lets be real, that would just be a pain for something like this.
*/

var Imported = Imported || {};
Imported.J_Difficulty = true;

J.AddOns = J.AddOns || {};
J.AddOns.Difficulty =   J.AddOns.Difficulty || {};
J.AddOns.Difficulty.Modes = [];

(function() { // wrap the variables in this so they aren't global.
// the various functions can stay out and free, though since they are attached
// to the base "module" of J.AddOns.Difficulty.*
// These difficulties can be seen as "sample" difficulties. Feel free to modify
// them, add more difficulties, remove them, whatever. It is yours to play with.
// just make sure you do three things:
//   1.) create the difficulty variable (as seen below)
//   2.) add it to the J.AddOns.Difficulty.Modes array ()
//   3.) decide an icon for it! (in J_Base, if you are using that.)
/* -------------------------------------------------------------------------- */
  var easy = {
    name: "Easy",
    exp: 50,  gold: 25, drop: 25,

    mhp: 50,  mmp: 100,  agi: 75,
    atk: 50,  def: 75,   luk: 100,
    mat: 50,  mdf: 75,

    hit: 100,  eva: 0,   cnt: 50,
    cri: 50,   cev: 0,
    mev: 0,    mrf: 50,
    hrg: 50,   mrg: 50,  trg: 50,
  // note1: PDR and MDR want to be lower.
  // note2: TGR, PHA, TCR, FDR, and EXR aren't usually used for enemies.
  // tgr: 200, mcr: 200, pha: 100, tcr: 200, exr: 200, fdr: 200,
    grd: 0,  rec: 100,  pdr: 100,  mdr: 100,
  };

  // normal is assumed to be default, aka what you write in the database.
var normal  = {
  name: "Normal",
  exp: 100,  gold: 100, drop: 100,

  mhp: 100,  mmp: 100,  agi: 100,
  atk: 100,  def: 100,  luk: 100,
  mat: 100,  mdf: 100,

  hit: 100,  eva: 100,  cnt: 100,
  cri: 100,  cev: 100,
  mev: 100,  mrf: 100,
  hrg: 100,  mrg: 100,  trg: 100,
// note1: PDR and MDR want to be lower.
// note2: TGR, TCR, FDR, and EXR aren't usually used for enemies.
// tgr: 200, mcr: 200, pha: 100, tcr: 200, exr: 200, fdr: 200,
  grd: 100,  rec: 100,  pdr: 100,  mdr: 100,
};

  var hard    = {
    name: "Hard",
    exp: 150,  gold: 200, drop: 200,

    mhp: 150,  mmp: 100,  agi: 125,
    atk: 150,  def: 125,  luk: 150,
    mat: 150,  mdf: 125,

    hit: 150,  eva: 100,  cnt: 150,
    cri: 150,  cev: 150,
    mev: 100,  mrf: 150,
    hrg: 150,  mrg: 150,  trg: 150,
  // note1: PDR and MDR want to be lower.
  // note2: TGR, TCR, FDR, and EXR aren't usually used for enemies.
  // tgr: 200, mcr: 200, pha: 100, tcr: 200, exr: 200, fdr: 200,
    grd: 200,  rec: 150,  pdr: 150,  mdr: 150,
};
  J.AddOns.Difficulty.Modes.push(easy);   //0 adds "easy" difficulty to the list.
  J.AddOns.Difficulty.Modes.push(normal); //1 adds "normal" to the list.
  J.AddOns.Difficulty.Modes.push(hard);   //2 adds "hard" to the list.
  J.AddOns.Difficulty.defaultMode = 1;    // defines the starting difficulty.
  J.AddOns.Difficulty.currentMode = J.AddOns.Difficulty.defaultMode;
/* -------------------------------------------------------------------------- */
})(); // end variable stuff

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertBparams = function(pId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (pId) {
      case 0: m = d.mhp; break;
      case 1: m = d.mmp; break;
      case 2: m = d.atk; break;
      case 3: m = d.def; break;
      case 4: m = d.mat; break;
      case 5: m = d.mdf; break;
      case 6: m = d.agi; break;
      case 7: m = d.luk; break;
      case 8: m = d.exp; break; // not actual param, but assigned for re-use.
      case 9: m = d.gold; break; // not actual param, but assigned for re-use.
      case 10: m = d.drop; break;
    }
    return m;
  }
  finally { if (m === null) m = 100; };
};

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertXparams = function(sId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (sId) {
      case 0: m = d.hit; break;
      case 1: m = d.eva; break;
      case 2: m = d.cri; break;
      case 3: m = d.cev; break;
      case 4: m = d.mev; break;
      case 5: m = d.mrf; break;
      case 6: m = d.cnt; break;
      case 7: m = d.hrg; break;
      case 8: m = d.mrg; break;
      case 9: m = d.trg; break;
    }
    return m; // note: returns 100-base multiplier, not 1-base.
  }
  finally { if (m === null) m = 100; };
};

// grabs the rate from the difficulty, and returns the multiplier.
J.AddOns.Difficulty.convertSparams = function(sId) {
  var d = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode];
  var m = null; // multiplier
  try {
    switch (sId) {
      case 0: m = d.tgr; break;
      case 1: m = d.grd; break;
      case 2: m = d.rec; break;
      case 3: m = d.pha; break;
      case 4: m = d.mcr; break;
      case 5: m = d.tcr; break;
      case 6: m = d.pdr; break;
      case 7: m = d.mdr; break;
      case 8: m = d.fdr; break;
      case 9: m = d.exr; break;
    }
    return m; // note: returns 100-base multiplier, not 1-base.
  }
  finally { if (m === undefined) m = 100; };
};

// gets the name of the current difficulty.
J.AddOns.Difficulty.getDifficultyName = function(diffMode) {
  if (diffMode === undefined)
    diffMode == J.AddOns.Difficulty.currentMode;
  return J.AddOns.Difficulty.Modes[diffMode].name;
};

// sets the difficulty to a fixed difficulty.
J.AddOns.Difficulty.changeDifficulty = function(newDifficulty) {
  J.AddOns.Difficulty.currentMode = newDifficulty;
};

/* -------------------------------------------------------------------------- */
// based on difficulty, modifies and returns a parameter
// when calling enemy parameters.
/* -------------------------------------------------------------------------- */

// handles base parameters like HP/ATK/DEF/etc.
var _Game_Enemy_jdf_paramBase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function(paramId) {
  var base = _Game_Enemy_jdf_paramBase.call(this, paramId);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(paramId))))
    base *= (J.AddOns.Difficulty.convertBparams(paramId) / 100);
  return base;
};

// handles s-parameters like GRD/MCR/EXR/etc.
var _Game_Enemy_jdf_sparam = Game_BattlerBase.prototype.sparam;
Game_Enemy.prototype.sparam = function(sparamId) {
  var base = _Game_Enemy_jdf_sparam.call(this, sparamId);
  if (!(isNaN(J.AddOns.Difficulty.convertSparams(sparamId))))
    base *= (J.AddOns.Difficulty.convertSparams(sparamId) / 100);
  return base;
};

// handles x-parameters like HIT/EVA/CRI/etc.
var _Game_Enemy_jdf_xparam = Game_BattlerBase.prototype.xparam;
Game_Enemy.prototype.xparam = function(xparamId) {
  var base = _Game_Enemy_jdf_xparam.call(this, xparamId);
  if (!(isNaN(J.AddOns.Difficulty.convertXparams(xparamId))))
    base *= (J.AddOns.Difficulty.convertXparams(xparamId) / 100);
  return base;
};

// based on difficulty, modifies and returns experience
var _Game_Enemy_jdf_exp = Game_Enemy.prototype.exp;
Game_Enemy.prototype.exp = function() {
  var baseExp = _Game_Enemy_jdf_exp.call(this);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(8))))
    baseExp *= (J.AddOns.Difficulty.convertBparams(8) / 100);
  return Math.round(baseExp);
};

// based on difficulty, modifies and returns Gold
var _Game_Enemy_jdf_gold = Game_Enemy.prototype.gold;
Game_Enemy.prototype.gold = function() {
  var baseGold = _Game_Enemy_jdf_gold.call(this);
  if (!(isNaN(J.AddOns.Difficulty.convertBparams(9))))
    baseGold *= (J.AddOns.Difficulty.convertBparams(9) / 100);
  return Math.round(baseGold);
};

/* -------------------------------------------------------------------------- */
// Modifications required for adding the new Difficulty functionality
// right into the main menu.
/* -------------------------------------------------------------------------- */

// adds in a new handler for Scene_Difficulty.
var _Scene_Menu_jde_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  _Scene_Menu_jde_createCommandWindow.call(this);
  this._commandWindow.setHandler('difficulty', this.commandDifficulty.bind(this));
};

// when command selected, pulls up the new scene.
Scene_Menu.prototype.commandDifficulty = function() {
    SceneManager.push(Scene_Difficulty);
};

// adds the commands into the menu
var _Menu_jdf_addDifficulties = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function() {
  _Menu_jdf_addDifficulties.call(this);
  this.addDifficulties();
};

// the command for adding difficulties to the main menu
Window_MenuCommand.prototype.addDifficulties = function() {
    var enabled = this.areMainCommandsEnabled();
    var name = J.AddOns.Difficulty.getDifficultyName(J.AddOns.Difficulty.currentMode);
    this.insertCommand(name, 'difficulty', enabled);
};

// this is a simple new function that splices a command at a given index
// instead of just throwing it in at the end.
Window_Command.prototype.insertCommand = function(name, symbol, enabled, ext, index) {
    if (enabled === undefined) { enabled = true; }
    if (ext === undefined) { ext = null; }
    if (index === undefined) { index = this._list.length - 1; }
    var obj = { name: name, symbol: symbol, enabled: enabled, ext: ext};
    this._list.splice(index, 0, obj);
};

/* -------------------------------------------------------------------------- */
//    Scene_Difficulty [NEW!]
// This is the Scene for handling the Difficulty changing functionality
// when dealt with via menu commands in Scene_Menu.
/* -------------------------------------------------------------------------- */

function Scene_Difficulty() { this.initialize.apply(this, arguments); }
Scene_Difficulty.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Difficulty.prototype.constructor = Scene_Menu;

Scene_Difficulty.prototype.initialize = function() {
  var lastIndex = null;
    Scene_MenuBase.prototype.initialize.call(this);
};

// core creation function of the Difficulty scene.
Scene_Difficulty.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createDetailsWindow();
};

// creates the left-side window with the list of difficulties.
Scene_Difficulty.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_DifficultyChoice();
    for (var d = 0; d < J.AddOns.Difficulty.Modes.length; d++) {
      var name = J.AddOns.Difficulty.getDifficultyName(d);
      this._commandWindow.setHandler(name,  this.commandChangeDifficulty.bind(this));
    }
    this._commandWindow.setHandler('cancel',  this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

// creates the right-side window with all the details.
Scene_Difficulty.prototype.createDetailsWindow = function() {
  this._detailsWindow = new Window_DifficultyDetails();
  this._detailsWindow.refresh();
  this.addWindow(this._detailsWindow);
};

// changes the difficulty to the selected difficulty.
// automatically returns to the previous menu.
Scene_Difficulty.prototype.commandChangeDifficulty = function() {
  var index = this._commandWindow.index();
  var name = J.AddOns.Difficulty.getDifficultyName(index);
  J.AddOns.Difficulty.changeDifficulty(index);
  this.popScene();
};

// updates the contents of the right-side window accordingly to the index
// of the left-side window.
Scene_Difficulty.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
  if (this.lastIndex != this._commandWindow.index()) {
    this.lastIndex = this._commandWindow.index();
    window.console.log(this._commandWindow.index());
    this._detailsWindow.refresh(this.lastIndex);
  }
};

/* -------------------------------------------------------------------------- */
//    Window_DifficultyChoice [NEW!]
// DifficultyChoice is the window on the left that contains the array
// of all the different difficulties available to be selected from.
/* -------------------------------------------------------------------------- */

function Window_DifficultyChoice() { this.initialize.apply(this, arguments); }

Window_DifficultyChoice.prototype = Object.create(Window_Command.prototype);
Window_DifficultyChoice.prototype.constructor = Window_MenuCommand;

// creation of the difficulty selection window.
Window_DifficultyChoice.prototype.initialize = function() {
  Window_Command.prototype.initialize.call(this, 0, 0);
  this.updatePlacement();
  this.openness = 0;
  this.open();
};

// modified width of the left window.
Window_DifficultyChoice.prototype.windowWidth = function() {
  return 350;
};

// confirms the starting location of this window to be 0,0.
Window_DifficultyChoice.prototype.updatePlacement = function() {
  this.x = 0;
  this.y = 0;
};

// generates the list of difficulties available to choose from.
// list is generated based on the "name" property in the difficulty.
// note: both the displayed text and symbol are the same.
Window_DifficultyChoice.prototype.makeCommandList = function() {
  for (var d = 0; d < J.AddOns.Difficulty.Modes.length; d++) {
    var name = J.AddOns.Difficulty.getDifficultyName(d);
    if (name === undefined)
      name = "Needs to be defined in *.js file.";
    this.addCommand(name, name);  // (text, symbol)
  }
};

/* -------------------------------------------------------------------------- */
//    Window_DifficultyDetails [NEW!]
// DifficultyDetails is the larger window on the right that displays the
// changes of parameter multipliers to the player based on the current
// difficulty versus the item selected in the DifficultyChoice window.
/* -------------------------------------------------------------------------- */
function Window_DifficultyDetails() {this.initialize.apply(this, arguments); }

Window_DifficultyDetails.prototype = Object.create(Window_Base.prototype);
Window_DifficultyDetails.prototype.constructor = Window_Base;

// creation of the difficulty details window.
Window_DifficultyDetails.prototype.initialize = function() {
  var width = Graphics.boxWidth - 350;
  var height = Graphics.boxHeight;
  var x = 350;
  var y = 0;
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
};

// does all the drawing based on the current index in DifficultyChoice.
Window_DifficultyDetails.prototype.refresh = function(ind) {
  var lh = this.lineHeight();
  if (ind === undefined)
    ind = 0;
  this.contents.clear();
  this.drawDiffNames(ind);
  this.drawBparams(ind);
  this.drawSparams(ind);
  this.drawXparams(ind);
};

// the draw function for the difficulty names at the top.
Window_DifficultyDetails.prototype.drawDiffNames = function(ind) {
  var cName = J.AddOns.Difficulty.getDifficultyName(J.AddOns.Difficulty.currentMode);
  var nName = J.AddOns.Difficulty.getDifficultyName(ind);
  this.drawIcon(IconManager.textForIcon(cName), 0, 0);
  this.drawText(cName, 36, 0, 255);
  this.drawText(">>", 160, 0, 32)
  this.drawIcon(IconManager.textForIcon(nName), 200, 0);
  this.drawText(nName, 236, 0, 255);
};

// the draw function for each of the base parameters (hp/mp/atk/def/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawBparams = function(ind) {
  this.drawDiffParam('mhp', 0, 2, ind, 0);
  this.drawDiffParam('mmp', 1, 3, ind, 0);
  this.drawDiffParam('atk', 2, 4, ind, 0);
  this.drawDiffParam('def', 3, 5, ind, 0);
  this.drawDiffParam('mat', 4, 6, ind, 0);
  this.drawDiffParam('mdf', 5, 7, ind, 0);
  this.drawDiffParam('agi', 6, 8, ind, 0);
  this.drawDiffParam('luk', 7, 9, ind, 0);
  this.drawDiffParam('exp', 8, 10, ind, 0);
  this.drawDiffParam('gold', 9, 11, ind, 0);
  this.drawDiffParam('drop', 10, 12, ind, 0);
};

// the draw function for each of the secondary parameters (tgr/grd/pha/pdr/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawSparams = function(ind) {
  this.drawDiffParam('tgr', 0, 2, ind, 1);
  this.drawDiffParam('grd', 1, 3, ind, 1);
  this.drawDiffParam('rec', 2, 4, ind, 1);
  this.drawDiffParam('pha', 3, 5, ind, 1);
  this.drawDiffParam('mcr', 4, 6, ind, 1);
  this.drawDiffParam('tcr', 5, 7, ind, 1);
  this.drawDiffParam('pdr', 6, 8, ind, 1);
  this.drawDiffParam('mdr', 7, 9, ind, 1);
  this.drawDiffParam('fdr', 8, 10, ind, 1);
  this.drawDiffParam('exr', 9, 11, ind, 1);
};

// the draw function for each of the xtra parameters (hit/cri/mev/hrg/etc)
// these are hard-coded, probably could be optimized.
Window_DifficultyDetails.prototype.drawXparams = function(ind) {
  this.drawDiffParam('hit', 0, 2, ind, 2);
  this.drawDiffParam('eva', 1, 3, ind, 2);
  this.drawDiffParam('cri', 2, 4, ind, 2);
  this.drawDiffParam('cev', 3, 5, ind, 2);
  this.drawDiffParam('mev', 4, 6, ind, 2);
  this.drawDiffParam('mrf', 5, 7, ind, 2);
  this.drawDiffParam('cnt', 6, 8, ind, 2);
  this.drawDiffParam('hrg', 7, 9, ind, 2);
  this.drawDiffParam('mrg', 8, 10, ind, 2);
  this.drawDiffParam('trg', 9, 11, ind, 2);
};

// the draw function for drawing a parameter of any kind, and it's
// corresponding icon from J_Base aka IconManager.
Window_DifficultyDetails.prototype.drawDiffParam = function(type, pId, yMod, ind, fam) {
  var nMode = J.AddOns.Difficulty.Modes[ind]; // passed from selection window
  var cMode = J.AddOns.Difficulty.Modes[J.AddOns.Difficulty.currentMode]; // current mode
  var xMod = 0;
  switch (fam) {
    case 0:
      this.drawIcon(IconManager.bParams(pId), 0, 0 + lh*yMod);
      break;
    case 1:
      var xMod = 250;
      this.drawIcon(IconManager.sParams(pId), 0+xMod, 0 + lh*yMod);
      break;
    case 2:
      var xMod = 500;
      this.drawIcon(IconManager.xParams(pId), 0+xMod, 0 + lh*yMod);
      break;
  }
  if (cMode[type] === undefined)
    cMode[type] = 100;
  if (nMode[type] === undefined)
    nMode[type] = 100;
  this.drawText(cMode[type] + "%", 36 + xMod, 0 + lh*yMod, 80);
  this.drawText(">>", 100 + xMod, lh*yMod, 32);
  this.getColorDiff(cMode[type], nMode[type]);
  this.drawText(nMode[type] + "%", 140+xMod, 0 + lh*yMod, 255);
  this.resetTextColor();
};

// a simple method for gauging whether the stat will be easier/harder/same
// and changes the text color accordingly.
Window_DifficultyDetails.prototype.getColorDiff = function(a, b) {
  if (a > b) { // if the change makes a stat lower, green
    this.changeTextColor(this.textColor(3));
  }
  else if (b > a) { // if the change makes a stat higher, red
    this.changeTextColor(this.deathColor());
  }
  else { // if no change, then no color change either
    this.changeTextColor(this.normalColor());
  }
};