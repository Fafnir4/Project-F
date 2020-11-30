//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Passages.js
//=============================================================================

var Imported = Imported || {};
Imported.OcRam_Passages = true;
var OcRam_Passages = OcRam_Passages || {};

/*:
 * @plugindesc v1.08 This plugin uses region ID to determine a player
 * 'floor level'. Even autotiles can be drawn ABOVE players.
 * @author OcRam
 *
 * @param Cover ID
 * @desc Region ID for "cover" such as bridges and other B-E tiles
 * @default 16
 *
 * @param Underpass Region ID
 * @desc Region ID for reducing player 'floor level' lower
 * @default 17
 *
 * @param Overpass Region ID
 * @desc Region ID for raising player 'floor level' higher
 * @default 18
 *
 * @param Cover AutoTile Region ID
 * @desc Region ID for "AutoTile cover" such as cliffs, roofs and other A-tiles
 * @default 19
 *
 * @param Block Region ID
 * @desc Region ID to block movement
 * @default 20
 *
 * @param Overhead Region ID
 * @desc Region ID to block movement AND show tiles ABOVE player (if lower)
 * @default 21
 *
 * @help
 * ----------------------------------------------------------------------------
 * Introduction
 * ============================================================================
 * This plugin uses region ID to determine a player 'floor level'. Even
 * autotiles can be drawn ABOVE players. Events are signed to higher 'floor
 * level' if they are in cover tile regions (16 & 19).
 * Autonomous event move routes on cover tiles is blocked (region Id 16 & 19).
 *
 * ----------------------------------------------------------------------------
 * Usage
 * ============================================================================
 * For example horizontal bridge paint following regions (with defaults)
 *
 * 16 = Passage, 17 = Underpassage point, 18 = Overpassage point
 *
 *      [17] [17] [17]
 * [18] [16] [16] [16] [18]
 *      [17] [17] [17]
 *
 * ----------------------------------------------------------------------------
 * Plugin commands
 * ============================================================================
 * "refresh_passages"   (This will refresh all cover tiles, no parameters)
 * "floor_level low"    (will force to draw cover tiles)
 * "floor_level high"   (will force to hide cover tiles)
 *
 * ----------------------------------------------------------------------------
 * Terms of use
 * ============================================================================
 * Non-commercial use:
 * Free to use with credits to 'OcRam' for using 'Passages' plugin.
 *
 * Commercial use: Contact: mmp_81(at)hotmail.com
 * Licenses are per project. License must be obtained BEFORE you start
 * selling your game. Edits are allowed as long as "Terms of use" is not
 * changed in any way.
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-passages-plugin.88047/
 *
 * DO NOT COPY, RESELL OR CLAIM THIS PIECE OF SOFTWARE AS YOUR OWN!
 * Copyright (c) 2017, Marko Paakkunainen
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2017/12/03 v1.00 - Initial release
 * 2017/12/04 v1.01 - Player can interact only with events with same floor lvl
 *                    Added support for event stepping animations
 * 2017/12/05 v1.02 - Support for ! and $ character images
 * 2017/12/06 v1.03 - Fixed issue where events passed impassable tiles
 *                    Fixed issue where cover tiles were shifted +-1px
 *                    Underpass region (17) always grants passage
 *                    Added new region Id (20) always BLOCK passage
 * 2017/12/10 v1.04 - Fixed issue where events didn't start properly if they
 *                    were on ANY other region Id than 16 - 20 or 0
 * 2017/12/12 v1.05 - New Region Id 21 'passage overhead tiles'
 *                    Blocks passage if on lower floor level + draw tiles ABOVE
 *                    Added new feature 'event trigger floor'. Override default
 *                    trigger floor for desired events. Possible comments:
 *                    <all_layers> || <higher> || <lower>
 * 2017/12/20 v1.06 - Fixed issue where ALL tiles were under the player if
 *                    player was on "higher ground" (ie. bridge railings).
 *                    Tile B-E Z-Order functions are now deprecated due new
 *                    methods to draw them.
 *                    Fixed issue where erased events may have caused errors.
 *                    Game_Map.checkPassage is now aliased (max compatibility).
 * 2017/12/24 v1.07 - Fixed issue where page index -1 may have caused errors.
 *                    Added event support (static/stepping) for region Id 16.
 *                    Added PARTIAL (not autonomous) move route support IF
 *                    player is on higher floor AND "refresh_covers" plugin
 *                    command is called after move is complete (through=on)
 *                    Added "refresh_covers" -plugin command
 *                    Fixed issue where party was drawn ABOVE covers even if
 *                    party was BEHIND cover tiles after menu scene.
 * 2018/01/02 v1.08 - Events on higher 'floor' level can be now moved even if
 *                    player would be on lower 'floor' level.
 *                    Optimized char update animations on cover tiles (a lot).
 *                    'refresh_covers' no longer required after event moving.
 *                    Fixed issue from prev patch where 'visiting' left edge
 *                    of map caused tiles 'fix pos to screen' in some cases.
 *                    Events may pass UNDER the cover regions (16 & 19) IF
 *                    player is also on LOWER 'floor' level (move + wait).
 *                    New plugin command: floor_level [low / high]
 *                    For scripting more complex events.
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 *     Game_Player.prototype.startMapEvent
 */

(function ($) {

    var _oc_covers_on = true; var _oc_is_cover = false;

    var parameters = PluginManager.parameters('OcRam_Passages');

    var coverRegionId = Number(parameters['Cover ID'] || 16);
    var underpassRegionId = Number(parameters['Underpass Region ID'] || 17);
    var overpassRegionId = Number(parameters['Overpass Region ID'] || 18);
    var atCoverRegionId = Number(parameters['Cover AutoTile Region ID'] || 19);
    var blockRegionId = Number(parameters['Block Region ID'] || 20);
    var overheadRegionId = Number(parameters['Overhead Region ID'] || 21);
    //var floorLevelSwId = Number(parameters['Floor Level Switch ID'] || 1);

    var lower_sprites = []; // Sprite array where LOWER tile bitmaps are located
    var char_sprites = []; // Sprite array where character bitmaps and (*) tiles are located
    var higher_sprites = []; // Sprite array where HIGHER tile bitmaps are located

    var scr_width_tiles = 27; // default HD (1280px) width in tiles
    var twh = [48, 48]; // default tile width, height
    var vis_r_edge = false; // add 1px to x pos, if visited right edge... don't ask why...
    var vis_l_edge = false; // subtract 1px to x pos, if visited left edge... don't ask why...
    var flags = null; // Game_Map flags needs to be loaded only once...

    // Simple test is Character a player
    // ===================================================================================
    Game_CharacterBase.prototype.isPlayer = function () { return false; };
    Game_Player.prototype.isPlayer = function () { return true; };

    // Plugin commands
    // ===================================================================================
    var OC_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        switch (command) {
            case "refresh_covers":
                reload_all_sprites(); break;
            case "floor_level":
                if (args[0] == "low") {
                    _oc_covers_on = true;
                    oc_show_all_tiles();
                } else if (args[0] == "high") {
                    _oc_covers_on = false;
                    oc_hide_all_tiles();
                } break;
            default:
                OC_Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };

    var OC_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        OC_Spriteset_Map_createLowerLayer.call(this); this.createCoverLayer();
    };

    Spriteset_Map.prototype.createCoverLayer = function () {
        this._OC_coverLayer = [new TilingSprite(), new TilingSprite(), new TilingSprite()];
        for (i = 0; i < 3; i++) {
            this._OC_coverLayer[i].move(0, 0, Graphics.width, Graphics.height);
        }
        // in order to display under the weather sprites:
        this._baseSprite.removeChild(this._weather);
        for (i = 0; i < 3; i++) { this._baseSprite.addChild(this._OC_coverLayer[i]); }
        this._baseSprite.addChild(this._weather);
    };

    // Refresh tiles on scene changes
    // ===================================================================================
    var OC_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        if (!vis_l_edge && ($gameMap._displayX < scr_width_tiles)) {
            vis_r_edge = false; vis_l_edge = true; // Player visited near left edge of map
        } else if (!vis_r_edge && ($gameMap._displayX > ($gameMap.width() - scr_width_tiles))) {
            vis_r_edge = true; vis_l_edge = false; // Player visited right edge of map
        } if ($gameMap.width() <= scr_width_tiles) { // Player visited both edges of map
            vis_r_edge = true; vis_l_edge = true;
        }
        reload_all_sprites(); OC_Scene_Map_start.call(this);
    };

    // Move sprites when scrolling map
    // ===================================================================================
    var _OC_Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function (distance) {
        var _oc_lastPos = this._displayY; _OC_Game_Map_scrollDown.call(this, distance);
        var _oc_disp = _oc_lastPos - this._displayY;
        if (_oc_disp !== 0) { sprites_xy(0, Math.ceil(_oc_disp * 48)); }
    };
    var _OC_Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function (distance) {
        var _oc_lastPos = this._displayY; _OC_Game_Map_scrollUp.call(this, distance);
        var _oc_disp = _oc_lastPos - this._displayY;
        if (_oc_disp !== 0) { sprites_xy(0, Math.floor(_oc_disp * 48)); }
    };
    var _OC_Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function (distance) {
        var _oc_lastPos = this._displayX; _OC_Game_Map_scrollLeft.call(this, distance);
        var _oc_disp = _oc_lastPos - this._displayX;
        if (_oc_disp !== 0) { sprites_xy(Math.floor(_oc_disp * 48), 0); } else {
            if (!vis_l_edge && (this._displayX == 0)) {
                // Player visited left edge of map
                vis_r_edge = false; vis_l_edge = true;
            }
        }
    };
    var _OC_Game_Map_scrollRight = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function (distance) {
        var _oc_lastPos = this._displayX; _OC_Game_Map_scrollRight.call(this, distance);
        var _oc_disp = _oc_lastPos - this._displayX;
        if (_oc_disp !== 0) { sprites_xy(Math.ceil(_oc_disp * 48), 0); } else {
            if (!vis_r_edge && (this._displayX > ($gameMap.width() - scr_width_tiles))) {
                // Player visited right edge of map
                vis_r_edge = true; vis_l_edge = false;
            }
        }
    };
    function sprites_xy(px, py) {
        var i = 0;
        if (lower_sprites !== null) {
            for (i = 0; i < lower_sprites.length; i++) {
                lower_sprites[i].x += px; lower_sprites[i].y += py;
            }
        }
        if (char_sprites !== null) {
            for (i = 0; i < char_sprites.length; i++) {
                char_sprites[i].x += px; char_sprites[i].y += py;
            }
        }
        if (higher_sprites !== null) {
            for (i = 0; i < higher_sprites.length; i++) {
                higher_sprites[i].x += px; higher_sprites[i].y += py;
            }
        }
    }

    // Create and destroy sprite functions
    // ===================================================================================
    function reload_all_sprites() {

        var ev = null; var evs = $gameMap.events();
        if (evs.length > 0) {
            for (var i = 0; i < evs.length; i++) {
                ev = evs[i]; // change through property to what it was
                if (ev._tmpThrough != null && ev._moveType == 0) { ev._through = ev._tmpThrough; }
                ev._tmpThrough = null;
            }
        }

        // Initialize bitmap arrays on autotile covers...
        char_sprites = []; lower_sprites = []; higher_sprites = [];
        twh = [$gameMap.tileWidth(), $gameMap.tileHeight()];
        scr_width_tiles = Math.ceil(Graphics.width / 48);
        oc_load_all_tiles();
        if (_oc_covers_on == true) {
            oc_show_all_tiles();
        } else {
            oc_hide_all_tiles();
        }

    }

    function oc_load_all_tiles() {
        var rid = 0; flags = $gameMap.tilesetFlags();
        for (var x = 0; x < $gameMap.width(); x++) {
            for (var y = 0; y < $gameMap.height(); y++) {
                rid = $gameMap.regionId(x, y);
                if (rid == atCoverRegionId || rid == overheadRegionId) {
                    OC_drawLowerLayers(x, y); // Autotiles covers WHOLE tile
                }
                if (rid == coverRegionId || rid == atCoverRegionId || rid == overpassRegionId) {
                     // Characters and B-E tiles may have transparent backgrounds
                    if (rid != overpassRegionId) OC_drawBELayers(x, y, false);
                    OC_drawEvents(x, y); OC_drawBELayers(x, y, true);
                }
                
            }
        }
    }

    function OC_drawLowerLayers(px, py) {

        var b_found = false; var tmp_x = px - $gameMap._displayX; var tmp_y = py - $gameMap._displayY; // Get position
        
        // Draw covered tiles to bitmap (not to PIXI container...)
        var tile_bitmap = new Bitmap(48, 48);
        tile_bitmap = oc_draw_tiles(px, py);
        add_tile_bitmap(tile_bitmap, tmp_x * 48, tmp_y * 48, 6, px, py, lower_sprites, SceneManager._scene._spriteset._tilemap);

    }

    function OC_drawEvents(px, py) {

        // Paint characters
        var tmp_x = px - $gameMap._displayX; var tmp_y = py - $gameMap._displayY; // Get position
        var char_bitmap = new Bitmap(48, 48);

        var evs = $gameMap.eventsXy(px, py);
        var fc = ""; var ev = null; var x_marg = 0; var y_marg = 0;

        if (px < scr_width_tiles) {
            x_marg = ((px < scr_width_tiles) && !vis_l_edge) ? 2 : 1; // Left edge
        } else {
            x_marg = ((px > ($gameMap.width() - scr_width_tiles)) && !vis_r_edge) ? 0 : 1; // Right edge
        }

        if (evs.length > 0) {
            ev = evs[0]; fc = ('' + ev._characterName);
            char_bitmap = oc_draw_chars(ev);
            if (char_bitmap.width > 48) {
                if (char_bitmap.width == 132) {
                    x_marg -= ((char_bitmap.width / 2) - (char_bitmap.width % 48) - 12);
                } else {
                    x_marg -= ((char_bitmap.width / 2) - (char_bitmap.width % 48) - 6);
                }
            }
            if (fc.indexOf("!") < 0) { y_marg -= 6; }
            if (fc.indexOf("$") > -1) { x_marg -= 6; }
            add_char_bitmap(char_bitmap, (tmp_x * 48) + x_marg, (tmp_y * 48) + y_marg, 7, px, py, ev._eventId);
        }
    }

    function OC_drawBELayers(px, py, pHigh) {

        var b_found = false; var tmp_x = px - $gameMap._displayX; var tmp_y = py - $gameMap._displayY; // Get position

        // Draw covered tiles to bitmap (not to PIXI container...)
        var tile_bitmap = new Bitmap(48, 48);
        tile_bitmap = oc_draw_higher_tiles(px, py, pHigh);

        if ($gameMap.regionId(px, py) == coverRegionId && $gameMap.regionId(px, py + 1) == coverRegionId && $gameMap.regionId(px, py - 1) != coverRegionId) {
            // For example: Bridge upper railing
            add_tile_bitmap(tile_bitmap, tmp_x * 48, tmp_y * 48, (pHigh) ? 10 : 6, px, py, (pHigh) ? higher_sprites : lower_sprites, SceneManager._scene._spriteset._tilemap);
        } else {
            if ($gameMap.regionId(px, py) == atCoverRegionId && $gameMap.regionId(px, py + 1) == overpassRegionId && $gameMap.regionId(px, py - 1) != atCoverRegionId) {
                // For example: Bridge upper railing
                add_tile_bitmap(tile_bitmap, tmp_x * 48, tmp_y * 48, (pHigh) ? 10 : 6, px, py, (pHigh) ? higher_sprites : lower_sprites, SceneManager._scene._spriteset._tilemap);
            } else {
                add_tile_bitmap(tile_bitmap, tmp_x * 48, tmp_y * 48, (pHigh) ? 10 : 6, px, py, (pHigh) ? higher_sprites : lower_sprites, (pHigh) ?
                    SceneManager._scene._spriteset._OC_coverLayer[2] : SceneManager._scene._spriteset._tilemap);
            }
            
        }

    }

    // Add drawed bitmap to higher or lower array
    function add_tile_bitmap(p_bitmap, x, y, z, tx, ty, tile_array, scene_layer) {
        var b_found = false;
        for (i = 0; i < tile_array.length; i++) {
            if (tile_array[i].x == x && tile_array[i].y == y && tile_array[i].z == z) { b_found = true; break; }
        } if (b_found == false) {
            // Add new sprite
            var sprite = new Sprite(); var x_marg = 0;
            if (tx < scr_width_tiles) {
                x_marg = ((tx < scr_width_tiles) && !vis_l_edge) ? 2 : (!vis_l_edge) ? 1 : 0; // Left edge
            } else {
                x_marg = ((tx > ($gameMap.width() - scr_width_tiles)) && !vis_r_edge) ? 0 : 1; // Right edge
            } sprite.bitmap = p_bitmap; sprite.x = x + x_marg; sprite.y = y; sprite.z = z; sprite.tileX = tx; sprite.tileY = ty;
            tile_array.push(sprite); scene_layer.addChild(sprite);
        } else {
            tile_array[i].visible = true; // Show existing sprite
        }
    }

    // Add drawed char bitmap to char array
    function add_char_bitmap(p_bitmap, x, y, z, tx, ty, eid) {
        var b_found = false;
        for (i = 0; i < char_sprites.length; i++) {
            if (char_sprites[i].x == x && char_sprites[i].y == y && char_sprites[i].z == z) { b_found = true; break; }
        } if (b_found == false) {
            // Add new sprite
            var sprite = new Sprite();
            sprite.bitmap = p_bitmap; sprite.x = x; sprite.y = y; sprite.z = z; sprite.tileX = tx; sprite.tileY = ty;
            sprite._eventId = eid;
            char_sprites.push(sprite); SceneManager._scene._spriteset._OC_coverLayer[1].addChild(sprite);
        } else {
            char_sprites[i].visible = true; // Show existing sprite
        }
    }

    function oc_show_all_tiles() {

        for (var i = 0; i < lower_sprites.length; i++) {
            lower_sprites[i].visible = true;
        }

        for (i = 0; i < char_sprites.length; i++) {
            // Save through flag on events
            char_sprites[i].visible = true;
            var ex = char_sprites[i].tileX;
            var ey = char_sprites[i].tileY;
            var evs = $gameMap.eventsXy(ex, ey);
            if (evs.length > 0) {
                for (var j = 0; j < evs.length; j++) {
                    var ev = evs[j];
                    if (ev._moveType == 0) {
                        ev._tmpThrough = ev._through;
                        ev._through = true;
                    }
                }
            }
        }

        for (var i = 0; i < higher_sprites.length; i++) {
            higher_sprites[i].visible = true;
        } //$gameSwitches.setValue(floorLevelSwId, true);

    }

    function oc_hide_all_tiles() {

        for (var i = 0; i < lower_sprites.length; i++) {
            lower_sprites[i].visible = false;
        }

        for (i = 0; i < char_sprites.length; i++) {
            // Reset through flag on events
            var ex = char_sprites[i].tileX;
            var ey = char_sprites[i].tileY;
            var evs = $gameMap.eventsXy(ex, ey);
            if (evs.length > 0) {
                for (var j = 0; j < evs.length; j++) {
                    var ev = evs[j];
                    if (ev._moveType == 0) {
                        ev._through = ev._tmpThrough;
                    }
                }
            }
            char_sprites[i].visible = false;
        }

        for (var i = 0; i < higher_sprites.length; i++) {
            higher_sprites[i].visible = false;
        } //$gameSwitches.setValue(floorLevelSwId, false);

    }

    function oc_update_tile(ev, rid, nxt_rid) {

        // Move and update event animations

        var bevf = false;

        for (var i = 0; i < char_sprites.length; i++) {

            if ((char_sprites[i]._eventId == ev._eventId) && (char_sprites[i]._eventId !== undefined && ev._eventId !== undefined)) {

                if (_oc_covers_on) {
                    if (rid == coverRegionId || rid == atCoverRegionId || rid == overpassRegionId) {
                        char_sprites[i].visible = true && _oc_covers_on;
                    } else {
                        if (rid == 0 || rid == underpassRegionId) {
                            char_sprites[i].visible = false;
                        }
                    }
                }

                var b1 = new Bitmap(twh[0], twh[1]); var b2 = new Bitmap(twh[0], twh[1]);
                b1 = oc_draw_chars(ev);

                if (ev._realX != ev.x || ev._realY != ev.y) {

                    var cx = ((ev._realX - $gameMap._displayX) * 48);
                    var cy = ((ev._realY - $gameMap._displayY) * 48);
                    cy -= 7; cx++;

                    char_sprites[i].x = cx; char_sprites[i].y = cy;
                    char_sprites[i].tileX = ev.x; char_sprites[i].tileY = ev.y;
                    char_sprites[i]._moving = 6;

                } else {
                    if (char_sprites[i]._moving > 0) {
                        char_sprites[i]._moving--;
                    }
                }

                char_sprites[i].bitmap = b1;

                bevf = true;

            }
        }

        if (!bevf && ev._eventId !== undefined) {
            // Event not created yet?
            if (rid == overpassRegionId) {
                var cbm = oc_draw_chars(ev);
                add_char_bitmap(cbm, ((ev._realX - $gameMap._displayX) * 48), ((ev._realY - $gameMap._displayY) * 48), 7, ev.x, ev.y, ev._eventId);
            }
        }
        

    }

    // Modified Game_Map.checkPassage
    // ===================================================================================
    var OC_Game_Map_checkPassage = Game_Map.prototype.checkPassage;
    Game_Map.prototype.checkPassage = function (x, y, bit) {

        var tiles = this.allTiles(x, y);

        var rid = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
        var d = $gamePlayer._direction; var this_rid = $gameMap.regionId(x, y);
        var nxt_rid = $gameMap.regionId($gameMap.roundXWithDirection($gamePlayer.x, d), $gameMap.roundYWithDirection($gamePlayer.y, d));

        switch (rid) {
            case coverRegionId:
                if (_oc_covers_on == true) {
                    _oc_is_cover = true;
                } break;
            case atCoverRegionId:
                if (_oc_covers_on == true) {
                    _oc_is_cover = true;
                } break;
            case underpassRegionId:
                _oc_is_cover = false; _oc_covers_on = true;
                if (this_rid == coverRegionId || this_rid == atCoverRegionId) {
                    _oc_is_cover = true;
                }
                if (lower_sprites.length > 0) { // Show cover tiles if not already shown
                    if (lower_sprites[0].visible == false) {
                        oc_show_all_tiles(); // Show tiles as lower ground
                    }
                } break;
            case overheadRegionId:
            case overpassRegionId:
                if ((_oc_is_cover == false && _oc_covers_on == true) || (rid == overheadRegionId && _oc_covers_on == false)) {
                    _oc_covers_on = false; oc_hide_all_tiles(); // Show tiles as higher ground
                } break;
            default:
                _oc_is_cover = false; //_oc_covers_on = true;
        }

        OC_Game_Map_checkPassage.call(this, x, y, bit); // Call this for maximum compatibility with other plugins...

        // Passages allowed depending on player 'floor' level
        for (var i = 0; i < tiles.length; i++) {
            var flag = flags[tiles[i]];
            if (((flag & 0x10) !== 0) || (_oc_is_cover == true && _oc_covers_on == true))  // [*] No effect on passage
                continue;
            if ((flag & bit) === 0 || this_rid == underpassRegionId)   // [o] Passable
                return true;
            if ((flag & bit) === bit || nxt_rid == blockRegionId || (nxt_rid == overheadRegionId && _oc_covers_on == true)) // [x] Impassable
                return false;
        } return true;
       
    };

    var OC_Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function (x, y, d) {
        if (OC_Game_CharacterBase_isMapPassable.call(this, x, y, d)) {

            var x2 = $gameMap.roundXWithDirection(x, d); var y2 = $gameMap.roundYWithDirection(y, d);
            var nxt_rid = $gameMap.regionId(x2, y2); var rid = $gameMap.regionId(x, y);

            if (nxt_rid == blockRegionId || (nxt_rid == overheadRegionId && _oc_covers_on == true)) {
                return false; // Block region here
            } else {
                if (this.isPlayer() == false) {
                    if (nxt_rid == coverRegionId || nxt_rid == atCoverRegionId) return false; // Block events on cover tiles
                    if ((flags[$gameMap.tileId(x, y, 0)] | flags[$gameMap.tileId(x, y, 1)]) & ((1 << (d * 0.5 - 1)) & 15)) return false;
                    if ((flags[$gameMap.tileId(x2, y2, 0)] | flags[$gameMap.tileId(x2, y2, 1)]) & (1 << (this.reverseDir(d) * 0.5 - 1)) & 15) return false;
                    return true;
                } else {
                    return !(((rid == atCoverRegionId || rid == coverRegionId) && nxt_rid == overpassRegionId) && _oc_covers_on == true);
                }
            }
        } else {
            return false;
        }
    };

    // Maybe some day events can underpass AND overpass despite of player floor level....
    var OC_Game_CharacterBase_refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
    Game_CharacterBase.prototype.refreshBushDepth = function () {
        OC_Game_CharacterBase_refreshBushDepth.call(this);
        var rid = this.regionId();
        if (rid === overpassRegionId) {
            this._higherLevel = true;
        } else if ((rid !== coverRegionId && rid !== atCoverRegionId && rid !== overpassRegionId) || rid == underpassRegionId) {
            this._higherLevel = false;
        }
    };

    var OC_Game_CharacterBase_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
    Game_CharacterBase.prototype.updateAnimation = function () {
        OC_Game_CharacterBase_updateAnimation.call(this);
        if (this._eventId !== undefined) {
            var nxt_rid = $gameMap.regionId($gameMap.roundXWithDirection(this.x, this._direction), $gameMap.roundYWithDirection(this.y, this._direction));
            oc_update_tile(this, this.regionId(), nxt_rid);
        }
    };

    // Override Game_Player.prototype.startMapEvent
    // ===================================================================================
    Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
        // Start events ONLY if they are on same 'floor'
        var ev_cmts = []; var trigger_lower = false; var trigger_higher = false;
        if (!$gameMap.isEventRunning()) {
            $gameMap.eventsXy(x, y).forEach(function (event) {
                ev_cmts = oc_get_event_comments(event); trigger_lower = false; trigger_higher = false;
                for (var i = 0; i < ev_cmts.length; i++) {
                    if (ev_cmts[i] == "<all_layers>") { trigger_lower = true; trigger_higher = true; }
                    if (ev_cmts[i] == "<lower>") { trigger_lower = true; trigger_higher = false; }
                    if (ev_cmts[i] == "<higher>") { trigger_lower = false; trigger_higher = true; }
                }
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    var rid = $gameMap.regionId(x, y);
                    if ((rid == coverRegionId || rid == atCoverRegionId) && _oc_covers_on == false) {
                        event.start(); oc_update_tile(event, rid, rid);
                    } else if ((rid == overpassRegionId || rid == overheadRegionId) && _oc_covers_on == false) {
                        event.start(); oc_update_tile(event, rid, rid);
                    } else if ((rid != underpassRegionId && rid != overpassRegionId && rid != coverRegionId &&
                        rid != atCoverRegionId && rid != blockRegionId && rid != overheadRegionId) ||
                        (rid == underpassRegionId && _oc_covers_on == true)) {
                        event.start(); oc_update_tile(event, rid, rid);
                    } else if ((trigger_lower && _oc_covers_on) || (trigger_higher && !_oc_covers_on)) {
                        event.start(); oc_update_tile(event, rid, rid);
                    }
                }
            });
        }
    };

    function oc_get_event_comments(pEvent) {
        if (pEvent === null || pEvent === undefined) {
            return [];
        } else {
            if (pEvent._erased != true && pEvent._pageIndex > -1) {
                var cmts = []; var ev_list = pEvent.list();
                for (var i = 0; i < ev_list.length; i++) {
                    if (ev_list[i].code == 108) { // we have a comment
                        for (var j = 0; j < ev_list[i].parameters.length; j++) {
                            if (ev_list[i].parameters[j] != null) cmts.push(ev_list[i].parameters[j]); // get all rows
                        }
                    }
                } return cmts;
            } else {
                return [];
            }
        }
    }

    // Drawing autotiles
    // ===================================================================================
    function oc_draw_tiles(x, y) {
        var low_bm = new Bitmap(twh[0], twh[1]);
        var high_bm = new Bitmap(twh[0], twh[1]);
        var bitmap = new Bitmap(twh[0], twh[1]);
        var ctm = SceneManager._scene._spriteset._tilemap;
        ctm._paintTilesOnBitmap(low_bm, high_bm, x, y, false);
        bitmap.blt(low_bm, 0, 0, low_bm.width, low_bm.height, 0, 0, low_bm.width, low_bm.height);
        bitmap.blt(high_bm, 0, 0, high_bm.width, high_bm.height, 0, 0, high_bm.width, high_bm.height);
        return bitmap;
    }

    function oc_draw_chars(ev) {
        var ctm = SceneManager._scene._spriteset._tilemap;
        var bitmap = ctm._paintCharacters(ev);
        return bitmap;
    }

    function oc_draw_higher_tiles(x, y, pOnlyHighest) { // For bridges and other B-E tiles
        var low_bm = new Bitmap(twh[0], twh[1]);
        var high_bm = new Bitmap(twh[0], twh[1]);
        var ctm = SceneManager._scene._spriteset._tilemap;
        ctm._paintTilesOnBitmap(low_bm, high_bm, x, y, pOnlyHighest);
        return high_bm;
    }

    // Tilemap extensions // Most of these are copied from rpg_core.js file
    // ===================================================================================
    Tilemap.prototype._drawTileToBitmap = function (bitmap, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile_OC(bitmap, tileId, dx, dy);
            } else {
                this._drawNormalTile_OC(bitmap, tileId, dx, dy);
            }
        }
    };

    Tilemap.prototype._drawShadow_OC = function (bitmap, shadowBits, x1, y1) {
        if (shadowBits & 0x0f) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            var color = 'rgba(0,0,0,0.5)';
            for (var i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    var dx1 = x1 + (i % 2) * w1;
                    var dy1 = y1 + Math.floor(i / 2) * h1;
                    bitmap.fillRect(x1, dy1, w1, h1, color);
                }
            }
        }
    };

    Tilemap.prototype._drawAutotile_OC = function (bitmap, tileId, x1, y1) {

        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var bx = 0;
        var by = 0;
        var setNumber = 0;
        var isTable = false;

        if (Tilemap.isTileA1(tileId)) {
            var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
            setNumber = 0;
            if (kind === 0) {
                bx = waterSurfaceIndex * 2;
                by = 0;
            } else if (kind === 1) {
                bx = waterSurfaceIndex * 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    bx += waterSurfaceIndex * 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    by += this.animationFrame % 3;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        var table = autotileTable[shape];
        var source = this.bitmaps[setNumber];

        if (table && source) {
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 4; i++) {
                var qsx = table[i][0];
                var qsy = table[i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1;
                var dx1 = x1 + (i % 2) * w1;
                var dy1 = y1 + Math.floor(i / 2) * h1;
                if (isTable && (qsy === 1 || qsy === 5)) {
                    var qsx2 = qsx;
                    var qsy2 = 3;
                    if (qsy === 1) {
                        qsx2 = [0, 3, 2, 1][qsx];
                    }
                    var sx2 = (bx * 2 + qsx2) * w1;
                    var sy2 = (by * 2 + qsy2) * h1;
                    bitmap.blt(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                    dy1 += h1 / 2;
                    bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                } else {
                    bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
                }
            }
        }
    };

    Tilemap.prototype._drawNormalTile_OC = function (bitmap, tileId, x1, y1) {
        var setNumber = 0;
        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }
        var w = this._tileWidth;
        var h = this._tileHeight;
        var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        var sy = (Math.floor(tileId % 256 / 8) % 16) * h;
        var source = this.bitmaps[setNumber];
        if (source) {
            bitmap.blt(source, sx, sy, w, h, x1, y1, w, h);
        }
    };

    Tilemap.prototype._drawTableEdge_OC = function (bitmap, tileId, x1, y1) {
        if (Tilemap.isTileA2(tileId)) {
            var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            var kind = Tilemap.getAutotileKind(tileId);
            var shape = Tilemap.getAutotileShape(tileId);
            var tx = kind % 8;
            var ty = Math.floor(kind / 8);
            var setNumber = 1;
            var bx = tx * 2;
            var by = (ty - 2) * 3;
            var table = autotileTable[shape];
            if (table) {
                var source = this.bitmaps[setNumber];
                var w1 = this._tileWidth / 2;
                var h1 = this._tileHeight / 2;
                for (var i = 0; i < 2; i++) {
                    var qsx = table[2 + i][0];
                    var qsy = table[2 + i][1];
                    var sx1 = (bx * 2 + qsx) * w1;
                    var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                    var dx1 = x1 + (i % 2) * w1;
                    var dy1 = y1 + Math.floor(i / 2) * h1;
                    bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                }
            }
        }
    };

    Tilemap.prototype._paintTilesOnBitmap = function (bmLow, bmHigh, x, y, pOnlyHighest) {

        var x1 = (x * this._tileWidth); var y1 = (y * this._tileHeight);
        var lx = x1 / this._tileWidth; var ly = y1 / this._tileHeight;
        var tileId0 = this._readMapData(x, y, 0);
        var tileId1 = this._readMapData(x, y, 1);
        var tileId2 = this._readMapData(x, y, 2);
        var tileId3 = this._readMapData(x, y, 3);
        var shadowBits = this._readMapData(x, y, 4);
        var upperTileId1 = this._readMapData(x, y - 1, 1);
        var tilesHigh = []; var tilesLow = [];

        if (this._isHigherTile(tileId0) && pOnlyHighest) { tilesHigh.push(tileId0); }
        else { tilesLow.push(tileId0); }

        if (this._isHigherTile(tileId1) && pOnlyHighest) { tilesHigh.push(tileId1); }
        else { tilesLow.push(tileId1); }

        tilesLow.push(-shadowBits);

        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) { tilesLow.push(10000 + upperTileId1); }
        }

        // Treat ALL tiles as 'overpassage' tiles 
        // (because nothing else is re-painted in this function)
        if (pOnlyHighest) {
            tilesHigh.push(tileId3);
        } else {
            tilesHigh.push(tileId2); //tilesHigh.push(tileId3);
        } x1 = 0; y1 = 0;
        
        bmLow.clearRect(x1, y1, this._tileWidth, this._tileHeight);
        bmHigh.clearRect(x1, y1, this._tileWidth, this._tileHeight);

        for (var i = 0; i < tilesLow.length; i++) {
            var lowerTileId = tilesLow[i];
            if (lowerTileId < 0) {
                this._drawShadow_OC(bmLow, shadowBits, x1, y1);
            } else if (lowerTileId >= 10000) {
                this._drawTableEdge_OC(bmLow, upperTileId1, x1, y1);
            } else {
                this._drawTileToBitmap(bmLow, lowerTileId, x1, y1);
            }
        }

        for (i = 0; i < tilesHigh.length; i++) {
            this._drawTileToBitmap(bmHigh, tilesHigh[i], x1, y1);
        }

    };

    ImageManager.loadOC_Character = function (filename) {
        return this.loadBitmap('img/characters/', filename, 0, true);
    };

    Tilemap.prototype._paintCharacters = function (ev) {

        var tmp_bm = ImageManager.loadOC_Character(ev._characterName);

        var ch = (tmp_bm.height / 8); var cw = tmp_bm.width / 12;
        var fc = ('' + ev._characterName);
        if (fc.indexOf("$") > -1) {
            // Only 1 char sheet here
            ch = Math.floor(tmp_bm.height / 4);
            cw = Math.floor(tmp_bm.width / 3);
        } var bitmap = new Bitmap(ch, cw);

        var x = ev._characterIndex * (cw * 3);
        var y = Math.floor(ch - 48);
        if (ev._characterIndex > 3) {
            x = (ev._characterIndex - 4) * (cw * 3);
            y = Math.floor((ch * 4) + (ch - 48));
        }

        x += ev.pattern() * cw; // Get stepping point

        // D1 D1 D1 D2 D2 D2 D3 D3 D3 D4 D4 D4 (2)
        // L1 L1 L1 L2 L2 L2 L3 L3 L3 L4 L4 L4 (4)
        // R1 R1 R1 R2 R2 R2 R3 R3 R3 R4 R4 R4 (6)
        // U1 U1 U1 U2 U2 U2 U3 U3 U3 U4 U4 U4 (8)
        switch (ev._direction) {
            case 4: y += ch; break;
            case 6: y += ch * 2; break;
            case 8: y += ch * 3; break;
        }

        bitmap.blt(tmp_bm, x, y, cw, 48, -1, 0, cw, 48);
        return bitmap;

    };

    // Tested copying bitmap from PIXI container...
    function PIXI_To_Bitmap(pixi_cont, w, h) {
        var bm = new Bitmap(w, h); var ctx = bm._context;
        var rt = PIXI.RenderTexture.create(w, h);
        Graphics._renderer.render(pixi_cont, rt);
        var cnvs = Graphics._renderer.extract.canvas(rt);
        ctx.drawImage(cnvs, 0, 0);
        rt.destroy({ destroyBase: true });
        bm._setDirty(); return bm;
    };

})(OcRam_Passages);
