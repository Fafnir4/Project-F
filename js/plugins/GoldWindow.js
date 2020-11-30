//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

function Window_Gold() {
    this.initialize.apply(this, arguments);
}

Window_Gold.prototype = Object.create(Window_Base.prototype);
Window_Gold.prototype.constructor = Window_Gold;

Window_Gold.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

Window_Gold.prototype.windowWidth = function() {
    return 240;
};

Window_Gold.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_Gold.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
};

Window_Gold.prototype.value = function() {
    return $gameParty.gold();
};

Window_Gold.prototype.currencyUnit = function() {
    return TextManager.currencyUnit;
};

Window_Gold.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

Window_Message.prototype.subWindows = function() {
    return [this._goldWindow, this._choiceWindow,
            this._numberWindow, this._itemWindow];
};

Window_Message.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};

Window_Message.prototype.updatePlacement = function() {
    this._positionType = $gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};