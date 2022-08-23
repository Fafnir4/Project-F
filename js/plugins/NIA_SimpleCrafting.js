/*:
@plugindesc Simple crafting system.
@author armornick

----------------------------------------------------

@help

Adds a simple crafting system with a simple crafting menu.

===   Plugin Commands      ===

The crafting system plugin adds two new plugin commands.

The first plugin command opens the crafting menu, and takes
no arguments:

    show_crafting_menu

The second command adds a new recipe. The first argument should
be the resulting item, and every subsequent argument is added
as an ingredient, with an optional amount. A recipe should have 
at least one ingredient or it is ignored.

Items in the recipe take a prefix to denote what type of item
it is; 'i' for normal items, 'w' for weapons, or 'a' for armors.
If not prefix is used, normal items are assumed.

As an example, to add a recipe to craft weapon 6 using weapon 1
and item 1 use the following command:

    add_crafting_recipe w6 = w1 + i1

Note that every invalid argument after the first is ignored so
you can add things like equals signs and pluses to make the
recipe more understandable.


===   Scripting Commands   ===

To open the crafting menu, use the following script command:

    SceneManager.push(Scene_Crafting);

To add new recipes, use the following script commands:

    let recipe = new Game_Recipe();
    // set the item you can craft
    recipe.setResult( $dataItems[7] );
    // ingredient: item id 1, amount 2
    recipe.addIngredient( $dataItems[1], 2);
    $gameParty.addRecipe(recipe);

Note that while recipes added with plugin commands are cached,
this is not true for recipes added directly.

*/

var Imported = Imported || {};
Imported.NIA_SimpleCrafting = 1;


//-----------------------------------------------------------------------------
// Global Constructors

function Scene_Crafting() {
    this.initialize.apply(this, arguments);
}

function Game_Recipe() {
    this.initialize.apply(this, arguments);
}

//=============================================================================

(function () {

    // compatibility function for old versions
    function convertOldCraftingResult (item) {
        if (item.atypeId) {
            return { id: item.id, type: RecipeResultType.ARMOR };
        }
        if (item.wtypeId) {
            return { id: item.id, type: RecipeResultType.WEAPON };
        }
        return { id: item.id, type: RecipeResultType.ITEM };
    }


//-----------------------------------------------------------------------------
// DataManager
//
// Quick patch to fix the crafting system breaking on load.


    var NIA_SimpleCrafting_DataManager_extractSaveContents = DataManager.extractSaveContents;    
    DataManager.extractSaveContents = function (contents) {
        NIA_SimpleCrafting_DataManager_extractSaveContents.call(this, contents);
        var recipes = $gameParty._recipes;

        if (recipes.length > 0 && typeof(recipes[0]._result) == 'object') {
         var numRecipes = recipes.length;
         for (var i = 0; i < numRecipes; i++) {
            var recipe = recipes[i], recipeItem = recipe._result;
            var recipeResultNew = convertOldCraftingResult(recipeItem);
            recipe._result = recipeResultNew.id;
            recipe._resultType = recipeResultNew.type;
         }
     }
 }

//-----------------------------------------------------------------------------
// Game_Recipe
//
// The game object class for the recipes. Contains a list of ingredients.

    var RecipeResultType = {};
    RecipeResultType.ITEM = 0;
    RecipeResultType.WEAPON = 1;
    RecipeResultType.ARMOR = 2;

    Game_Recipe.prototype.initialize = function() {
        this._result = null;
        this._resultType = 0;
        // ingredients
        this._items = {};
        this._weapons = {};
        this._armors = {};
    }

    Game_Recipe.prototype.result = function() {
        if (this._resultType == RecipeResultType.ITEM) {
            return $dataItems[this._result];
        } else if (this._resultType == RecipeResultType.WEAPON) {
            return $dataWeapons[this._result];
        } else if (this._resultType == RecipeResultType.ARMOR) {
            return $dataArmors[this._result];
        }
    };

    Game_Recipe.prototype.setResult = function(item, itemType) {
        // compatibility hack for old versions
        if (typeof(item) == 'object') {
            var recipeResultNew = convertOldCraftingResult(item);
            this._result = recipeResultNew.id;
            this._resultType = recipeResultNew.type;
        } else {
            this._result = item;
            this._resultType = itemType || RecipeResultType.ITEM;
        }
    };

    Game_Recipe.prototype.ingredients = function() {
        var list = [];
        for (var id in this._items) {
            list.push($dataItems[id]);
        }
        for (var id in this._weapons) {
            list.push($dataWeapons[id]);
        }
        for (var id in this._armors) {
            list.push($dataArmors[id]);
        }
        return list;
    };

    Game_Recipe.prototype.itemContainer = function(item) {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    };

    Game_Recipe.prototype.addIngredient = function(item, amount) {
        var container = this.itemContainer(item);
        container[item.id] = amount;
    };

    Game_Recipe.prototype.numIngredients = function(item) {
        var container = this.itemContainer(item);
        return container[item.id];
    };

    Game_Recipe.prototype.canMake = function() {
        let ingredients = this.ingredients();
        for (let ingredient of ingredients) {
            if (this.numIngredients(ingredient) 
                > $gameParty.numItems(ingredient)) {
                return false;
        }
    }
    return true;
};

Game_Recipe.prototype.craft = function() {
    if (this.canMake()) {
        for (let ingredient of this.ingredients()) {
            $gameParty.loseItem(ingredient, this.numIngredients(ingredient));
        }
        $gameParty.gainItem( this.result(), 1);
    }
};

//-----------------------------------------------------------------------------
// Game_Party

var NIA_SimpleCrafting_GameParty_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    NIA_SimpleCrafting_GameParty_initialize.call(this);
    this._recipes = [];
}

    // fixup function for old saves
    function checkRecipeList() {
        if (this._recipes === undefined) {
            this._recipes = [];
        }
    }

    Game_Party.prototype.recipes = function() {
        checkRecipeList.call(this);
        return this._recipes;
    }

    Game_Party.prototype.addRecipe = function(recipe) {
        checkRecipeList.call(this);
        this._recipes.push(recipe);
    };

//-----------------------------------------------------------------------------
// Window_RecipeList
//
// The window for showing and selecting the list of recipes.

function Window_RecipeList() {
    this.initialize.apply(this, arguments);
}

Window_RecipeList.prototype = Object.create(Window_ItemList.prototype);
Window_RecipeList.prototype.constructor = Window_RecipeList;

Window_RecipeList.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};

Window_RecipeList.prototype.maxCols = function() {
    return 1;
};

Window_RecipeList.prototype.isEnabled = function(item) {
    return item.canMake();
};

Window_RecipeList.prototype.needsNumber = function() {
    return false;
};

Window_RecipeList.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    this.updateIngredientWindow();
};

Window_RecipeList.prototype.updateHelp = function() {
    var item = null;
    if (this.item()) {
        item = this.item().result();
    }
    this.setHelpWindowItem(item);
};

Window_RecipeList.prototype.updateIngredientWindow = function() {
    if (this._ingredientWindow) {
        this._ingredientWindow.setRecipe(this.item());
    }
}

Window_RecipeList.prototype.setIngredientWindow = function(ingredientWindow) {
    this._ingredientWindow = ingredientWindow;
    this.updateIngredientWindow();
};

Window_RecipeList.prototype.makeItemList = function() {
        // TODO: get recipes
        this._data = $gameParty.recipes();
    };

    Window_RecipeList.prototype.drawItem = function(index) {
        var recipe = this._data[index];
        var item = recipe.result();
        if (item) {
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(recipe));
            this.drawItemName(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

//-----------------------------------------------------------------------------
// Window_IngredientList
//
// The window for showing the list of ingredients for the selected recipe.

function Window_IngredientList() {
    this.initialize.apply(this, arguments);
}

Window_IngredientList.prototype = Object.create(Window_ItemList.prototype);
Window_IngredientList.prototype.constructor = Window_IngredientList;

Window_IngredientList.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this._recipe = null;
};

Window_IngredientList.prototype.maxCols = function() {
    return 1;
};

Window_IngredientList.prototype.isEnabled = function(item) {
    return this._recipe.numIngredients(item)
    <= $gameParty.numItems(item);
};

Window_IngredientList.prototype.needsNumber = function() {
    return true;
};

Window_IngredientList.prototype.setRecipe = function(recipe) {
    if (this._recipe !== recipe) {
        this._recipe = recipe;
        this.refresh();
        this.resetScroll();
    }
};

Window_IngredientList.prototype.makeItemList = function() {
        // TODO: get recipes
        this._data = []
        if (this._recipe) {
            var ingredients = this._recipe.ingredients();
            for (let ingredient of ingredients) {
                this._data.push( ingredient );
            }
        }
    };

    Window_IngredientList.prototype.numberWidth = function() {
        return this.textWidth('00 / 00');
    };

    Window_IngredientList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText($gameParty.numItems(item), x, y, width, 'right');
            this.drawText('/', x, y, width - this.textWidth('00 '), 'right');
            this.drawText(this._recipe.numIngredients(item), x, y, 
                width - this.textWidth('00 / '), 'right');
        }
    };

    Window_IngredientList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

//-----------------------------------------------------------------------------
// Scene_Crafting
//
// The scene class of the crafting system.

Scene_Crafting.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Crafting.prototype.constructor = Scene_Crafting;

Scene_Crafting.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Crafting.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createRecipeWindow();
    this.createIngredientWindow();
};

Scene_Crafting.prototype.createRecipeWindow = function() {
    	// TODO: calculate recipe window rect
    	var x = 0;
    	var y = this._helpWindow.height;
    	var wx = Graphics.boxWidth / 2;
    	var wy = Graphics.boxHeight - this._helpWindow.height;
    	this._recipeWindow = new Window_RecipeList(x, y, wx, wy);
    	this._recipeWindow.setHelpWindow(this._helpWindow);
        this._recipeWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._recipeWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._recipeWindow);
    };

    Scene_Crafting.prototype.createIngredientWindow = function () {
        // TODO: calculate ingredient window rect
        var x = this._recipeWindow.width;
        var y = this._helpWindow.height;
        var wx = Graphics.boxWidth -this._recipeWindow.width;
        var wy = Graphics.boxHeight - this._helpWindow.height;
        this._ingredientWindow = new Window_IngredientList(x, y, wx, wy);
        this._recipeWindow.setIngredientWindow(this._ingredientWindow);
        this.addWindow(this._ingredientWindow);
    };

    Scene_Crafting.prototype.start = function() {
        Scene_ItemBase.prototype.start.call(this);
        this._ingredientWindow.refresh();
        this._recipeWindow.refresh();
        this._recipeWindow.activate();
        this._recipeWindow.selectLast();
    };

    Scene_Crafting.prototype.onItemOk = function() {
        var recipe = this._recipeWindow.item();
        recipe.craft();
        this._ingredientWindow.refresh();
        this._recipeWindow.refresh();
        this._recipeWindow.activate();
    };

//-----------------------------------------------------------------------------
// Game_System

var NIA_SimpleCrafting_GameSystem_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    NIA_SimpleCrafting_GameSystem_initialize.call(this);
        // for caching added recipes via plugin command
        this._craftingCommandCache = [];
    }

    Game_System.prototype.addCraftingCommand = function (recipeStr) {
        this._craftingCommandCache.push(recipeStr);
    }

    Game_System.prototype.hasCraftingCommand = function (recipeStr) {
        return this._craftingCommandCache.contains(recipeStr);
    }

//-----------------------------------------------------------------------------
// Game_Interpreter

var RE_CRAFTING_ITEM = /^(i|w|a)?(\d+)(x(\d+))?$/i;

function parseCraftingItem(arg) {
        // execute regular expression
        var captures = RE_CRAFTING_ITEM.exec(arg);
        if (captures === null) return null;
        // parse regular expression captures
        var result = {};
        result.category = captures[1] || 'i';
        result.id = captures[2];
        result.amount = parseInt(captures[4], 10) || 1;
        // get the item's data object
        if (result.category === 'i') {
            result.dataObj = $dataItems[result.id];
        } else if (result.category === 'w') {
            result.dataObj = $dataWeapons[result.id];
        } else if (result.category === 'a') {
            result.dataObj = $dataArmors[result.id];
        }
        return result;
    }

    function addCraftingRecipe(args) {
        // check the cache for the recipe
        let recipeStr = args.join(" ");
        if ($gameSystem.hasCraftingCommand(recipeStr)) {
            return;
        }
        // check if we have a valid result item
        var result = parseCraftingItem(args.shift());
        if (result === null) return;
        // parse the rest of the arguments as ingredients
        var ingredients = [];
        for (let arg of args) {
            var item = parseCraftingItem(arg);
            if (item !== null) {
                ingredients.push(item);
            }
        }
        // if there is at least one ingredient,
        // make the recipe object and add it to party
        if (ingredients.length > 0) {
            var recipe = new Game_Recipe();
            recipe.setResult(result.dataObj);
            for (let ingredient of ingredients) {
                recipe.addIngredient(ingredient.dataObj, ingredient.amount);
            }
            $gameParty.addRecipe(recipe);
        }
        // add the current command to the cache
        $gameSystem.addCraftingCommand(recipeStr);
    }

    var NIA_SimpleCrafting_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        NIA_SimpleCrafting_GameInterpreter_pluginCommand.call(this, command, args);
        command = command.toLowerCase();

        if (command === "show_crafting_menu") {
            SceneManager.push(Scene_Crafting);
        }
        else if (command === "add_crafting_recipe") {
            addCraftingRecipe(args);
        }
    };

}())