# )----------------------------------------------------------------------------(
# )--     AUTHOR:     Mr. Trivel                                             --(
# )--     NAME:       Crafting Simple                                        --(
# )--     CREATED:    2014-06-25                                             --(
# )--     VERSION:    1.0                                                    --(
# )----------------------------------------------------------------------------(
# )--                         VERSION HISTORY                                --(
# )--  1.0 - Initial Release                                                 --(
# )----------------------------------------------------------------------------(
# )--                          DESCRIPTION                                   --(
# )--  Adds crafting. Infinite amount of different crafting Disciplines, each--(
# )--  having it's own level. Recipes can be learned by calling a method or  --(
# )--  by gaining a higher level in specific crafting discipline.            --(
# )----------------------------------------------------------------------------(
# )--                          INSTRUCTIONS                                  --(
# )--                  Carefully set up everything.                          --(
# )--          Learn new recipes by calling learn_recipe(id) method          --(
# )--  Call crafting scene by calling SceneManager.call(MrTS_Scene_Crafting) --(
# )----------------------------------------------------------------------------(
# )--                          LICENSE INFO                                  --(
# )--    http://mrtrivelvx.wordpress.com/terms-of-use/                       --(
# )----------------------------------------------------------------------------(

# )----------------------------------------------------------------------------(
# )--         Main Crafting module - Setup all data you want here.           --(
# )----------------------------------------------------------------------------(
module MrTS
  module Crafting
    # )------------------------------------------------------------------------(
    # )--  Formula for craft levels exp requirements.                        --(
    # )--  "50 * lvl" would mean level 1 requires 50 EXP, level 2 - 100 EXP..--(
    # )------------------------------------------------------------------------(
    CRAFT_EXP_FORMULA = "50 * lvl"
    
    # )------------------------------------------------------------------------(
    # )--  Max level of Discipline player can reach.                         --(
    # )------------------------------------------------------------------------(
    CRAFT_MAX_LEVEL = 175
    
    # )------------------------------------------------------------------------(
    # )--  Setup your Discipline names here.                                 --(
    # )------------------------------------------------------------------------(
    DISCIPLINES = { 0 => "Smithing",
                    1 => "Alchemy",
                    2 => "Bowmaking"
                  }
    # )------------------------------------------------------------------------(
    # )--  Setup Recipes here.                                               --(
    # )------------------------------------------------------------------------(
    # )--  TYPE - 0: Item, 1: Weapon: 2: Armor                               --(
    # )--  ITEM = [TYPE, ID, AMOUNT]                                         --(
    # )------------------------------------------------------------------------(
    # )--  :discipline => ID of the Discipline, the DISCIPLINES Key value.   --(
    # )--                                                                    --(
    # )--  :item => [TYPE, ID, AMOUNT] - What item Player gets from crafting --(
    # )--  with this recipe. ID from database. AMOUNT - how much of the item --(
    # )--  Player gets                                                       --(
    # )--                                                                    --(
    # )--  :exp => AMOUNT - How much Discipline EXP Player gets.             --(
    # )--                                                                    --(
    # )--  :ingredients => [ITEM, ITEM, ITEM]                                --(
    # )--  What items Player requires to be able to craft using this Recipe. --(
    # )--  E.g. [[0, 10, 7], [1, 15, 1]]                                     --(
    # )--                                                                    --(
    # )--  :unlocking => HOW - "default" it will be there by default (only   --(
    # )--  shown if playe has sufficient discipline level requirement.       --(
    # )--  "learn" - learned from method call learn_recipe(ID)               --(
    # )--                                                                    --(
    # )--  :level_req - LEVEL - Discipline level requirement                 --(
    # )------------------------------------------------------------------------(
    RECIPES = {
      0 => {
          :discipline   => 0,
          :item         => [1,9,1],
          :exp          => 10,
          :ingredients  => [[0,23,1],[0,24,10]],      
          :unlocking    => "default",
          :level_req    => 0
      },
      1 => {
          :discipline   => 0,
          :item         => [2,3,1],
          :exp          => 10,
          :ingredients  => [[0,24,15],[0,21,5]],      
          :unlocking    => "default",
          :level_req    => 0         
      },
      2 => {
          :discipline   => 0,
          :item         => [0,23,1],
          :exp          => 10,
          :ingredients  => [[0,24,3]],    
          :unlocking    => "learn",
          :level_req    => 0
      },
      3 => {
          :discipline   => 2,
          :item         => [1,34,1],
          :exp          => 25,
          :ingredients  => [[0,24,3]],        
          :unlocking    => "default",
          :level_req    => 1
      }
    }
    
    # )------------------------------------------------------------------------(
    # )--  Crafting command text.                                            --(
    # )------------------------------------------------------------------------(
    TEXT_CRAFT = "Craft"
    
    # )------------------------------------------------------------------------(
    # )--  Disciplines command text                                          --(
    # )------------------------------------------------------------------------(
    TEXT_DISCIPLINES = "Disciplines"
    
    # )------------------------------------------------------------------------(
    # )--                  Setting up part - finished.                       --(
    # )------------------------------------------------------------------------(
    
    # )------------------------------------------------------------------------(
    # )--  Method: self.get_all_recipes                                      --(
    # )------------------------------------------------------------------------(
    def self.get_all_recipes(discipline)
      recipes = []
      RECIPES.each_key do |key|
        data = RECIPES[key]
        if  data[:discipline] == discipline && 
            data[:level_req] <= $game_party.get_discipline_level(discipline) && 
            (data[:unlocking] == "default" || $game_party.known_recipe?(key))
          recipes.push(key)
        end
      end
      return recipes
    end
    
  end
end

# )----------------------------------------------------------------------------(
# )--  Don't worry about this one.                                           --(
# )--                                                                        --(
$imported ||= {} ; $imported["MrTS_Crafting_Main"] = true #                  --(
# )----------------------------------------------------------------------------(

# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Scene_Crafting                                            --(
# )----------------------------------------------------------------------------(
class MrTS_Scene_Crafting < Scene_Base
  
  # )--------------------------------------------------------------------------(
  # )--  Method: start                                                       --(
  # )--------------------------------------------------------------------------(
  def start
    create_main_viewport
    create_all_windows
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_all_windows                                          --(
  # )--------------------------------------------------------------------------(
  def create_all_windows
    create_help_window
    create_main_command_window
    create_discipline_info_window
    create_item_list_window
    create_requirements_window
    create_disciplines_command_window
  end
  
  # )--------------------------------------------------------------------------(
  # )-- All Windows
  # )-----
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_help_window                                          --(
  # )--------------------------------------------------------------------------(
  def create_help_window
    @help_window = Window_Help.new
    @help_window.viewport = @viewport
    @help_window.y = Graphics.height - @help_window.height
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_main_command_window                                  --(
  # )--------------------------------------------------------------------------(
  def create_main_command_window
    @command_window = MrTS_Main_Command_Window.new
    @command_window.set_handler(:discover_on, method(:command_discover_on))
    @command_window.set_handler(:discipline_on, method(:command_discipline_on))
    @command_window.set_handler(:craft_on, method(:command_craft_on))
    @command_window.set_handler(:cancel, method(:command_cancel_on))
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_discipline_info_window                               --(
  # )--------------------------------------------------------------------------(
  def create_discipline_info_window
    @discipline_info_window = MrTS_Discipline_Info_Window.new
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_item_list_window                                     --(
  # )--------------------------------------------------------------------------(
  def create_item_list_window
    @item_window = MrTS_Item_Window.new(@command_window.height, Graphics.height-@command_window.height-@help_window.height)
    @item_window.set_handler(:cancel, method(:item_list_cancel_on))
    @item_window.set_handler(:ok, method(:item_list_ok_on))
    @item_window.help_window = @help_window
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_requirements_window                                  --(
  # )--------------------------------------------------------------------------(
  def create_requirements_window
    @requirements_window = MrTS_Requirements_Window.new(@item_window.y, @item_window.height)
    @item_window.requirement_window = @requirements_window
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: create_disciplines_command_window                           --(
  # )--------------------------------------------------------------------------(
  def create_disciplines_command_window
    @discipline_command_window = MrTS_Discipline_Command_Window.new(@command_window.width/2, @command_window.height)
    @discipline_command_window.set_handler(:ok, method(:discipline_choice_on))
    @discipline_command_window.set_handler(:cancel, method(:discipline_cancel_on))
  end
  
  # )--------------------------------------------------------------------------(
  # )-- All methods for windows
  # )-----
  # )---
  # )--  Command Window
  # )-
  
  # )--------------------------------------------------------------------------(
  # )--  Method: command_discover_on                                         --(
  # )--------------------------------------------------------------------------(
  def command_discover_on
    @item_window.activate
    @item_window.type = 0
    @requirements_window.type = 0
    @item_window.refresh
    @item_window.select(0)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: command_craft_on                                    --(
  # )--------------------------------------------------------------------------(
  def command_craft_on
    @item_window.activate
    @item_window.type = 1
    @requirements_window.type = 1
    @item_window.refresh
    @item_window.select(0)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: command_discipline_on                                       --(
  # )--------------------------------------------------------------------------(
  def command_discipline_on
    @discipline_command_window.open
    @discipline_command_window.activate
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: command_cancel_on                                           --(
  # )--------------------------------------------------------------------------(
  def command_cancel_on
    return_scene
  end
  
  # )---
  # )--  Item List Window
  # )-
  
  # )--------------------------------------------------------------------------(
  # )--  Method: item_list_cancel_on                                         --(
  # )--------------------------------------------------------------------------(
  def item_list_cancel_on
    @item_window.unselect
    @command_window.activate
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: item_list_ok_on                                             --(
  # )--------------------------------------------------------------------------(
  def item_list_ok_on
    @requirements_window.craft_item
    @item_window.activate
    @discipline_info_window.refresh
    @item_window.refresh
  end
  
  # )---
  # )--  Discipline Command List Window
  # )-
  
  # )--------------------------------------------------------------------------(
  # )--  Method: discipline_choice_on                                        --(
  # )--------------------------------------------------------------------------(
  def discipline_choice_on
    i = @discipline_command_window.index
    @item_window.discipline = i
    @item_window.refresh
    @discipline_info_window.discipline = i
    @discipline_info_window.refresh
    @command_window.activate
    @discipline_command_window.close
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: discipline_cancel_on                                        --(
  # )--------------------------------------------------------------------------(
  def discipline_cancel_on
    @command_window.activate
    @discipline_command_window.close
  end  
end


# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Requirements_Window                                       --(
# )----------------------------------------------------------------------------(
class MrTS_Requirements_Window < Window_Base
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize                                                  --(
  # )--------------------------------------------------------------------------(
  def initialize(y, height)
    super(Graphics.width/2, y, Graphics.width/2, height)
    @type = 0
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: type=                                                       --(
  # )--------------------------------------------------------------------------(
  def type=(value)
    @type = value
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_true_item                                               --(
  # )--------------------------------------------------------------------------(
  def get_true_item(i)
    return unless i
    return [$data_items[i[1]], i[2]] if i[0] == 0
    return [$data_weapons[i[1]], i[2]] if i[0] == 1
    return [$data_armors[i[1]], i[2]] if i[0] == 2
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: set_recipe                                                  --(
  # )--------------------------------------------------------------------------(
  def set_recipe(item)
    return unless item
    @recipe = item
    @item_list = []
    MrTS::Crafting::RECIPES[@recipe][:ingredients].each { |i| @item_list.push(get_true_item(i)) }
    refresh
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: refresh                                                     --(
  # )--------------------------------------------------------------------------(
  def refresh
    contents.clear
    draw_window_name
    draw_item_requirements
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: draw_window_name                                            --(
  # )--------------------------------------------------------------------------(
  def draw_window_name
    change_color(system_color)
    draw_text(0,0,contents.width, line_height, @type == 1 ? "Requirements" : "Items added:", 1)
    change_color(normal_color)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: draw_item_requirements                                      --(
  # )--------------------------------------------------------------------------(
  def draw_item_requirements
    return unless @recipe    
    a = 0
    @item_list.each do |il|
      y = line_height + line_height*a
      draw_item_name(il[0], 0, y)
      txt = "/" + il[1].to_s
      draw_text(0, y, contents.width, line_height, txt, 2)
      nmb = $game_party.item_number(il[0])
      change_color(nmb >= il[1] ? tp_cost_color : nmb == 0 ? power_down_color : crisis_color)
      draw_text(0, y, contents.width-text_size(txt).width, line_height, nmb, 2)
      a += 1
    end
    change_color(system_color)
    txt = "EXP Given: "
    txtw = text_size(txt).width
    draw_text(0, contents.height - line_height, contents.width-txtw, line_height, txt, 1)
    change_color(crisis_color)
    draw_text(0, contents.height - line_height, contents.width+txtw, line_height, MrTS::Crafting::RECIPES[@recipe][:exp].to_s, 1) 
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: craft_item                                                  --(
  # )--------------------------------------------------------------------------(
  def craft_item
    @item_list.each do |il|
      if $game_party.item_number(il[0]) < il[1]
        Sound.play_buzzer
        return
      end
    end
    @item_list.each do |il|
      $game_party.lose_item(il[0], il[1])
    end
    geto = get_true_item(MrTS::Crafting::RECIPES[@recipe][:item])
    $game_party.gain_item(geto[0], geto[1])
    $game_party.add_craft_exp(MrTS::Crafting::RECIPES[@recipe][:discipline], MrTS::Crafting::RECIPES[@recipe][:exp])
  end
end


# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Item_Window                                               --(
# )----------------------------------------------------------------------------(
class MrTS_Item_Window < Window_Selectable
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize                                                  --(
  # )--------------------------------------------------------------------------(
  def initialize(y, height)
    super(0, y, Graphics.width/2, height)
    @discipline = 0
    @type = 1
    @data = []
    @requirement_window = nil
    refresh
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: type=                                                       --(
  # )--------------------------------------------------------------------------(
  def type=(value)
    @type = value
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: discipline=                                                 --(
  # )--------------------------------------------------------------------------(
  def discipline=(value)
    @discipline = value
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: requirement_window=                                         --(
  # )--------------------------------------------------------------------------(
  def requirement_window=(value)
    @requirement_window = value
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: col_max                                                     --(
  # )--------------------------------------------------------------------------(
  def col_max
    return 1
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: item_max                                                    --(
  # )--------------------------------------------------------------------------(
  def item_max
    @data ? @data.size : 1
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: item                                                        --(
  # )--------------------------------------------------------------------------(
  def item
    @data && index >= 0 ? @data[index] : nil
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: current_item_enabled?                                       --(
  # )--------------------------------------------------------------------------(
  def current_item_enabled? ; true ;  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: include?                                                    --(
  # )--------------------------------------------------------------------------(
  def include?(item) ; true ;  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: discipline_cancel_on                                        --(
  # )--------------------------------------------------------------------------(
  def make_item_list
    @data = @type == 0 ? $game_party.all_items : MrTS::Crafting::get_all_recipes(@discipline)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: select_last                                                 --(
  # )--------------------------------------------------------------------------(
  def select_last
    select(@data.index($game_party.last_item.object) || 0)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: draw_item                                                   --(
  # )--------------------------------------------------------------------------(
  def draw_item(index)
    case @type
    when 0
      item = @data[index]
      if item
        rect = item_rect(index)
        rect.width -= 4
        draw_item_name(item, rect.x, rect.y, true)
        draw_item_number(rect, item)
      end
    when 1
      item = @data[index]
      if item
        rect = item_rect(index)
        rect.width -= 4
        draw_recipe_name(item, rect.x, rect.y, true)
      end
    end    
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: draw_recipe_name                                            --(
  # )--------------------------------------------------------------------------(
  def draw_recipe_name(item, x, y, enabled)
    return unless item
    true_item = get_true_item(item)
    draw_icon(true_item.icon_index, x, y, enabled)
    change_color(normal_color, enabled)
    draw_text(x + 24, y, width, line_height, true_item.name)
    draw_text(x, y, contents.width, line_height, sprintf("x%2d", $game_party.item_number(true_item)), 2)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_true_item                                               --(
  # )--------------------------------------------------------------------------(
  def get_true_item(i)
    return unless i
    temp = MrTS::Crafting::RECIPES[i][:item]
    return $data_items[temp[1]] if temp[0] == 0
    return $data_weapons[temp[1]] if temp[0] == 1
    return $data_armors[temp[1]] if temp[0] == 2
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: draw_item_number                                            --(
  # )--------------------------------------------------------------------------(
  def draw_item_number(rect, item)
    draw_text(rect, sprintf(":%2d", $game_party.item_number(item)), 2)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: update_help                                                 --(
  # )--------------------------------------------------------------------------(
  def update_help
    @help_window.set_item(@type == 0 ? item : get_true_item(item))
    @requirement_window.set_recipe(item) if @type == 1
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: refresh                                                     --(
  # )--------------------------------------------------------------------------(
  def refresh
    make_item_list
    create_contents
    draw_all_items
  end
end


# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Discipline_Info_Window                                    --(
# )----------------------------------------------------------------------------(
class MrTS_Discipline_Info_Window < Window_Base
  
  # )--------------------------------------------------------------------------(
  # )--  Public Instance Variables                                           --(
  # )--------------------------------------------------------------------------(
  attr_writer :discipline
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize                                                  --(
  # )--------------------------------------------------------------------------(
  def initialize
    super(Graphics.width - Graphics.width/2+50, 0, Graphics.width/2-50, line_height + standard_padding*2)
    @discipline = 0
    refresh
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: refresh                                                     --(
  # )--------------------------------------------------------------------------(
  def refresh
    contents.clear
    change_color(system_color)
    draw_text(0,-5,contents.width, line_height, MrTS::Crafting::DISCIPLINES[@discipline].to_s)
    change_color(normal_color)
    draw_text(0,-5,contents.width, line_height, "Lv: " + $game_party.get_discipline_level(@discipline).to_s,2)
    draw_gauge(0, 4, contents.width, $game_party.get_discipline_rate(@discipline), normal_color, crisis_color)
    make_font_smaller
    change_color(power_down_color)
    draw_text(10, 7, contents.width, line_height, $game_party.get_discipline_exp(@discipline).to_s + "/" + $game_party.get_discipline_next_level_exp(@discipline).to_s, 1)
    change_color(normal_color)
    make_font_bigger
  end
end


# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Main_Command_Window                                       --(
# )----------------------------------------------------------------------------(
class MrTS_Main_Command_Window < Window_HorzCommand
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize                                                  --(
  # )--------------------------------------------------------------------------(
  def initialize
    super(0,0)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: window_width                                                --(
  # )--------------------------------------------------------------------------(
  def window_width
    (Graphics.width/2)+50
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: col_max                                                     --(
  # )--------------------------------------------------------------------------(
  def col_max
    return 2
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: spacing                                                     --(
  # )--------------------------------------------------------------------------(
  def spacing
    return 3
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: make_command_list                                           --(
  # )--------------------------------------------------------------------------(
  def make_command_list
    add_command(MrTS::Crafting::TEXT_CRAFT, :craft_on)
    add_command(MrTS::Crafting::TEXT_DISCIPLINES, :discipline_on)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: item_rect_for_text                                          --(
  # )--------------------------------------------------------------------------(
  def item_rect_for_text(index)
    rect = item_rect(index)
    rect
  end
end


# )----------------------------------------------------------------------------(
# )--  Class: MrTS_Discipline_Command_Window                                 --(
# )----------------------------------------------------------------------------(
class MrTS_Discipline_Command_Window < Window_Command
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize                                                  --(
  # )--------------------------------------------------------------------------(
  def initialize(x, y)
    super(x, y)
    self.openness = 0
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: window_width                                                --(
  # )--------------------------------------------------------------------------(
  def window_width
    ((Graphics.width/2)+50)/2
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: make_command_list                                           --(
  # )--------------------------------------------------------------------------(
  def make_command_list
    MrTS::Crafting::DISCIPLINES.each_value { |d| add_command(d, :ok) }
  end
end

# )----------------------------------------------------------------------------(
# )--  Class: Game_Party                                                     --(
# )----------------------------------------------------------------------------(
class Game_Party < Game_Unit
  
  # )--------------------------------------------------------------------------(
  # )--  Public Instance Variables                                           --(
  # )--------------------------------------------------------------------------(
  attr_reader   :disciplines #lv, xp
  attr_reader   :learned_recipes
  
  # )--------------------------------------------------------------------------(
  # )--  Alias to: initialize                                                --(
  # )--------------------------------------------------------------------------(
  alias mrts_gp_initialize initialize
  def initialize
    mrts_gp_initialize
    initialize_disciplines
    initialize_recipes
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize_disciplines                                      --(
  # )--------------------------------------------------------------------------(
  def initialize_disciplines
    @disciplines = []
    MrTS::Crafting::DISCIPLINES.each_value { |value| @disciplines.push([1, 0]) }
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: initialize_recipes                                          --(
  # )--------------------------------------------------------------------------(
  def initialize_recipes
    @learned_recipes = []
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: add_craft_exp                                               --(
  # )--------------------------------------------------------------------------(
  def add_craft_exp(id, exp)
    @disciplines[id][1] += exp
    craft_level_up(id)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: craft_level_up                                              --(
  # )--------------------------------------------------------------------------(
  def craft_level_up(id)
    while get_discipline_exp(id) >= get_discipline_next_level_exp(id) && get_discipline_level(id) < MrTS::Crafting::CRAFT_MAX_LEVEL
      @disciplines[id][0] += 1 
      @disciplines[id][1] -= get_discipline_current_level_exp(id)
    end
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_discipline_exp                                          --(
  # )--------------------------------------------------------------------------(
  def get_discipline_exp(id)
    return @disciplines[id][1]
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_discipline_level                                        --(
  # )--------------------------------------------------------------------------(
  def get_discipline_level(id)
    return @disciplines[id][0]
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: known_recipe?                                               --(
  # )--------------------------------------------------------------------------(
  def known_recipe?(id)
    @learned_recipes.include?(id)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_discipline_current_level_exp                            --(
  # )--------------------------------------------------------------------------(
  def get_discipline_current_level_exp(id)
    lvl = get_discipline_level(id)-1
    return eval(MrTS::Crafting::CRAFT_EXP_FORMULA)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_discipline_next_level_exp                               --(
  # )--------------------------------------------------------------------------(
  def get_discipline_next_level_exp(id)
    lvl = get_discipline_level(id)
    return eval(MrTS::Crafting::CRAFT_EXP_FORMULA)
  end
  
  # )--------------------------------------------------------------------------(
  # )--  Method: get_discipline_rate                                         --(
  # )--------------------------------------------------------------------------(
  def get_discipline_rate(id)
    return 1.0 if get_discipline_level(id) == MrTS::Crafting::CRAFT_MAX_LEVEL
    return get_discipline_exp(id).to_f / get_discipline_next_level_exp(id).to_f
  end
end

# )----------------------------------------------------------------------------(
# )--  Class: Game_Interpreter                                               --(
# )----------------------------------------------------------------------------(
class Game_Interpreter
  
  # )--------------------------------------------------------------------------(
  # )--  Method: learn_recipe                                                --(
  # )--------------------------------------------------------------------------(
  def learn_recipe(id)
    $game_party.learned_recipes.push(id)
  end
end