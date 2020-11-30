/*:
*@author ApocalympseGaming1992
*@plugindesc This plugin allows you to have a gold and token window(GAMBLING) displayed on map.
*
*@param goldcurIcon
*@type number
*@min 1
*@max 319
*@desc Icon Number for your Gold
*@default 313
* 
*@param window_Width
*@type number
*@min 0 
*@max 816
*@desc Width of Your Window
*@default 400
*
*@param window_Height
*@type number
*@min 0 
*@max 625
*@desc Width of Your Window
*@default 300
*
*@help
*/

(function(){
	/*=======PLUGINVARIABLES:*/
		var param = PluginManager.parameters('AG1992_currency_Gold_Window');
	/*====================================================================*/
		var gIcon = param['goldcurIcon'];
		var myW = param['window_Width'];
		var myH = param['window_Height'];
	/*=======ALIASES:*/
		var cur_Scene_Map = Scene_Map.prototype.start;
		var cur_Scene_Map_Update = Scene_Map.prototype.update;
		var cur_Scene_Menu_Update = Scene_Menu.prototype.start;
		var cur_Scene_Menu_Update = Scene_Menu.prototype.update;
		
	/*=======SCENES:*/
		Scene_Map.prototype.start = function() {
	   		cur_Scene_Map.call(this);
	   		this._myWindow = new window_Currency(760,110);
	   		this.addWindow(this._myWindow);
		};
		Scene_Map.prototype.update = function(){
			cur_Scene_Map_Update.call(this);
			this._myWindow.refresh();
		};
		
	/*=======WINDOWS:*/
		function window_Currency(){
			this.initialize.apply(this, arguments);
		}
		window_Currency.prototype = Object.create(Window_Base.prototype);
		window_Currency.prototype.constructor=window_Currency;
		window_Currency.prototype.initialize = function(x, y){
			Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(200), this.windowHeight(50));
				this.refresh();
				this.opacity = this.windowOpacity();
		}
		window_Currency.prototype.refresh = function(){
			this._value1 = $gameParty.gold();
			this.contents.clear();
			this.drawIcon(gIcon, 0, 0);
			this.drawText(this._value1, 50, 0);
		};

		window_Currency.prototype.windowWidth = function(){
			if (myW >= 0 && myW < 816){
				return myW;	
			}else if (myW == 816){
				return Graphics.boxWidth;	
			}
		};
		window_Currency.prototype.windowHeight = function(){
			if (myH >= 0 && myH < 624){
				return myH;
			}else if (myH == 624){
				return Graphics.boxHeight;	
			}else if (myH == 625){
				return this.fittingHeight(2.5);
			}	
		};
		window_Currency.prototype.windowOpacity = function(){
			return 255; /*This number controls window transparency(0=Invisible, 255 = Fully Visible)*/
		};
})();