// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"HIME_SideviewActorEnemies","status":true,"description":"v1.2 - Allows you to use side-view actors as enemies.","parameters":{}},
{"name":"NIA_SimpleCrafting","status":true,"description":"Simple crafting system.","parameters":{}},
{"name":"YEP_CoreEngine","status":true,"description":"v1.32 Needed for the majority of Yanfly Engine Scripts. Also\r\ncontains bug fixes found inherently in RPG Maker.","parameters":{"---Screen---":"","Screen Width":"1280","Screen Height":"720","Scale Battlebacks":"true","Scale Title":"true","Scale Game Over":"true","Open Console":"false","Reposition Battlers":"true","GameFont Load Timer":"0","Update Real Scale":"true","Collection Clear":"true","---Gold---":"","Gold Max":"99999999","Gold Font Size":"20","Gold Icon":"314","Gold Overlap":"A lotta","---Items---":"","Default Max":"99","Quantity Text Size":"20","---Parameters---":"","Max Level":"99","Actor MaxHP":"9999","Actor MaxMP":"9999","Actor Parameter":"999","Enemy MaxHP":"999999","Enemy MaxMP":"9999","Enemy Parameter":"999","---Battle---":"","Animation Rate":"4","Flash Target":"false","Show Events Transition":"true","Show Events Snapshot":"true","---Map Optimization---":"","Refresh Update HP":"true","Refresh Update MP":"true","Refresh Update TP":"false","---Font---":"","Chinese Font":"SimHei, Heiti TC, sans-serif","Korean Font":"Dotum, AppleGothic, sans-serif","Default Font":"GameFont, Verdana, Arial, Courier New","Font Size":"28","Text Align":"left","---Windows---":"","Digit Grouping":"true","Line Height":"36","Icon Width":"32","Icon Height":"32","Face Width":"144","Face Height":"144","Window Padding":"18","Text Padding":"6","Window Opacity":"192","Gauge Outline":"true","Gauge Height":"18","Menu TP Bar":"true","---Window Colors---":"","Color: Normal":"0","Color: System":"16","Color: Crisis":"17","Color: Death":"18","Color: Gauge Back":"19","Color: HP Gauge 1":"20","Color: HP Gauge 2":"21","Color: MP Gauge 1":"22","Color: MP Gauge 2":"23","Color: MP Cost":"23","Color: Power Up":"24","Color: Power Down":"25","Color: TP Gauge 1":"28","Color: TP Gauge 2":"29","Color: TP Cost Color":"29"}},
{"name":"SRD_FullscreenToggleOption","status":true,"description":"Adds a Fullscreen Toggle to the Options Window","parameters":{"Option Name":"Полный экран","Position":"Middle","Default Value":"true","Persist Default?":"true"}},
{"name":"KODERA_optimization","status":true,"description":"1.0.3 Speed up core RPG Maker engine","parameters":{}},
{"name":"YEP_QuestJournal","status":true,"description":"v1.02 Insert a quest journal system into your game!","parameters":{"---Main Menu---":"","Quest Command":"Задания","Show Command":"true","Enable Command":"true","Auto Place Command":"true","---Quest Menu---":"","Quest Category Window":"{\"---Categories---\":\"\",\"Category Order\":\"[\\\"available\\\",\\\"completed\\\",\\\"failed\\\",\\\"all\\\"]\",\"Available Text\":\"\\\\i[192]Доступные (%1)\",\"Completed Text\":\"\\\\i[191]Завершенные (%1)\",\"Failed Text\":\"\\\\i[194]Проваленные (%1)\",\"All Text\":\"\\\\i[189]Все задания (%1)\",\"Cancel Text\":\"\\\\i[161]Закрыть\",\"---Window Settings---\":\"\",\"X\":\"0\",\"Y\":\"0\",\"Width\":\"Graphics.boxWidth / 3\",\"Height\":\"this.fittingHeight(this.numVisibleRows())\",\"Rows\":\"4\",\"Columns\":\"1\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Text Alignment\":\"left\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\"}","Quest List Window":"{\"---Types---\":\"\",\"Show Types\":\"true\",\"Type Order\":\"[\\\"\\\\\\\\c[6]Основные\\\",\\\"\\\\\\\\c[4]Дополнительные\\\",\\\"\\\\\\\\c[3]Персональные\\\",\\\"\\\\\\\\c[5]Обучающие\\\"]\",\"List Open Symbol\":\"-\",\"List Closed Symbol\":\"+\",\"Type Text Format\":\"%1%2 (%3)\",\"Quest Indent\":\"0\",\"Show Empty\":\"false\",\"Read Quest\":\"\\\\i[121]Read Quest\",\"Cancel\":\"\\\\i[16]Cancel\",\"---Window Settings---\":\"\",\"X\":\"0\",\"Y\":\"Graphics.boxHeight - height\",\"Width\":\"Graphics.boxWidth / 3\",\"Height\":\"Graphics.boxHeight - this.fittingHeight(4)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Type Alignment\":\"left\",\"Quest Alignment\":\"left\",\"Window Skin\":\"Window\"}","Quest Title Window":"{\"---Window Settings---\":\"\",\"No Quest Title\":\"\\\\c[4]Журнал задний\",\"X\":\"Graphics.boxWidth - width\",\"Y\":\"0\",\"Width\":\"Graphics.boxWidth * 2 / 3\",\"Height\":\"this.fittingHeight(1)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Text Alignment\":\"center\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\"}","Quest Data Window":"{\"---Data Settings---\":\"\",\"No Data Text\":\"\\\"Это ваш \\\\\\\\c[4]Журнал Задний\\\\\\\\c[0].\\\\n\\\\nЗдесь вы можете увидеть все\\\\nдоступные и завершенные задания\\\"\",\"Quest Data Format\":\"\\\"\\\\\\\\{%1\\\\\\\\}\\\\n\\\\\\\\c[4]Сложность:\\\\\\\\c[0] %2\\\\n\\\\\\\\c[4]От:\\\\\\\\c[0] %3\\\\n\\\\\\\\c[4]Место:\\\\\\\\c[0] %4\\\\n\\\\n\\\\\\\\c[4]Оисание:\\\\\\\\c[0]\\\\n%5\\\\n\\\\n\\\\\\\\c[4]Цели:\\\\\\\\c[0]\\\\n%6\\\\n\\\\n\\\\\\\\c[4]Награда:\\\\\\\\c[0]\\\\n%7\\\\n\\\\n%8\\\"\",\"Uncleared Objective\":\"\\\\i[160]%1\",\"Completed Objective\":\"\\\\i[165]%1\",\"Failed Objective\":\"\\\\i[162]%1\",\"Unclaimed Reward\":\"\\\\i[160]%1\",\"Claimed Reward\":\"\\\\i[163]%1\",\"Denied Reward\":\"\\\\i[161]%1\",\"Load Delay\":\"30\",\"---Window Settings---\":\"\",\"X\":\"Graphics.boxWidth - width\",\"Y\":\"Graphics.boxHeight - height\",\"Width\":\"Graphics.boxWidth * 2 / 3\",\"Height\":\"Graphics.boxHeight - this.fittingHeight(1)\",\"Line Height\":\"36\",\"Font Face\":\"GameFont\",\"Font Size\":\"28\",\"Standard Padding\":\"18\",\"Text Padding\":\"6\",\"Standard Opacity\":\"255\",\"Back Opacity\":\"192\",\"Window Skin\":\"Window\",\"Scroll Speed\":\"4\"}","Lunatic Mode":"{\"---Quest Menu---\":\"\",\"Before Create Windows\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\\n//\\\\n// background.bitmap = ImageManager.loadTitle1(\\\\\\\"Book\\\\\\\");\\\\n// this.fitScreen(background);\\\"\",\"After Create Windows\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\"\",\"Close Quest Menu\":\"\\\"// Variables\\\\n//   background - background image used for the menu\\\\n//   windowLayer - sprite layer that contains all windows\\\"\",\"---Quest Status---\":\"\",\"Quest Add\":\"\\\"// Variables:\\\\n//   questId - ID of the quest being added\\\\n//\\\\n// console.log('Quest ' + questId + ' successfully added!')\\\"\",\"Quest Remove\":\"\\\"// Variables:\\\\n//   questId - ID of the quest being removed\\\\n//\\\\n// console.log('Quest ' + questId + ' successfully removed!')\\\"\",\"Quest Complete\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to completed\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Completed!')\\\"\",\"Quest Fail\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to failed\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Failed!')\\\"\",\"Quest Available\":\"\\\"// Variables:\\\\n//   questId - ID of the quest set to available\\\\n//\\\\n// console.log('Quest ' + questId + ' status changed to Available!')\\\"\",\"---Description---\":\"\",\"Change Description\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose description is changed\\\\n//   index - Description index being changed to\\\\n//\\\\n// console.log('Quest ' + questId + ' description index changed to ' + index)\\\"\",\"---Objectives---\":\"\",\"Show Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being shown\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to shown!')\\\"\",\"Hide Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being hidden\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to hidden!')\\\"\",\"Complete Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective being completed\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to completed!')\\\"\",\"Fail Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective having failed\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to failed!')\\\"\",\"Normalize Objective\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose objectives are altered\\\\n//   objectiveId - ID of the objective normalized\\\\n//\\\\n// console.log('Quest ' + questId + ' objective ' + objectiveId + ' changed to normal!')\\\"\",\"---Rewards---\":\"\",\"Show Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward being shown\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' becomes shown!')\\\"\",\"Hide Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward being hidden\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' becomes hidden!')\\\"\",\"Claim Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward becoming claimed\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is now claimed!')\\\"\",\"Deny Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward becoming denied\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is now denied!')\\\"\",\"Normalize Reward\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose rewards are altered\\\\n//   rewardId - ID of the reward normalized\\\\n//\\\\n// console.log('Quest ' + questId + ' reward ' + rewardId + ' is normalized!')\\\"\",\"---Subtext---\":\"\",\"Change Subtext\":\"\\\"// Variables:\\\\n//   questId - ID of the quest whose subtext is changed\\\\n//   index - Subtext index being changed to\\\\n//\\\\n// console.log('Quest ' + questId + ' subtext index changed to ' + index)\\\"\"}","---Quest List---":"","Quest 1":"{\"Title\":\"\\\\i[87]Мой друг не Призрак\",\"Type\":\"Основные\",\"Difficulty\":\"Легко\",\"From\":\"Проводник\",\"Location\":\"Рыбацкая деревня\",\"Description\":\"[\\\"\\\\\\\"Несмотря на свою мёртвость,призраки непротив найти\\\\\\\\nновых друзей которых сами и убивают.\\\\\\\\nПостарайтесь не пополнить их компанию.\\\\\\\\n\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Победите\\\\\\\\\\\\\\\\c[0] 5 призраков.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[314]100 Золота\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[302]Магическая сфера\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\",\\\"2\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 2":"{\"Title\":\"\\\\i[87]Спасение утопающих\",\"Type\":\"Дополнительные\",\"Difficulty\":\"Легко\",\"From\":\"Странники\",\"Location\":\"Увядающий Лес\",\"Description\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Помгите\\\\\\\\\\\\\\\\c[0] странникам.\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Необходимо\\\\\\\\\\\\\\\\c[0] \\\\\\\\\\\\\\\\i[176]Зелье востановления.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[7]Новый персонаж\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 3":"{\"Title\":\"\\\\i[87]Скользкие будни\",\"Type\":\"Основные\",\"Difficulty\":\"Легко\",\"From\":\"Проводник\",\"Location\":\"Рыбацкая деревня\",\"Description\":\"[\\\"\\\\\\\"Слизьни любят поглащать всё на своём пути,\\\\\\\\nособенно красивых девушек.\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Победить\\\\\\\\\\\\\\\\c[0] 8 слизней.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[314]200 Золото\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 4":"{\"Title\":\"\\\\i[87]Из слизи к жизни\",\"Type\":\"Дополнительные\",\"Difficulty\":\"Легко\",\"From\":\"Странники\",\"Location\":\"Болото\",\"Description\":\"[\\\"\\\\\\\"Не каждый день тебя поедают слизни.\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Необходимо\\\\\\\\\\\\\\\\c[0] \\\\\\\\\\\\\\\\i[176]Зелье востановления.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[7]Новый персонаж\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 5":"{\"Title\":\"\\\\i[87]Пещерные воины\",\"Type\":\"Основные\",\"Difficulty\":\"Средне\",\"From\":\"Король\",\"Location\":\"Замок\",\"Description\":\"[\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\"\\\",\\\"\\\\\\\"This is the \\\\\\\\\\\\\\\\c[4]default\\\\\\\\\\\\\\\\c[0] quest description.\\\\\\\\n\\\\\\\\nYou can insert multiple description entries in case you\\\\\\\\never want to update the quest description midway while the\\\\\\\\nquest is in progress.\\\\\\\"\\\"]\",\"Objectives List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]First\\\\\\\\\\\\\\\\c[0] objective to be cleared.\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\c[4]Second\\\\\\\\\\\\\\\\c[0] objective, but it's hidden.\\\\\\\"\\\",\\\"\\\\\\\"To make other objectives appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nObjectives'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Objectives\":\"[\\\"1\\\"]\",\"Rewards List\":\"[\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[176]Potion x5\\\\\\\"\\\",\\\"\\\\\\\"\\\\\\\\\\\\\\\\i[178]Ether x3\\\\\\\"\\\",\\\"\\\\\\\"To make other rewards appear,\\\\\\\\nenable them through the \\\\\\\\\\\\\\\\c[4]'Visible\\\\\\\\nRewards'\\\\\\\\\\\\\\\\c[0] plugin parameter or by\\\\\\\\nusing a plugin command to make\\\\\\\\nthem appear\\\\\\\"\\\"]\",\"Visible Rewards\":\"[\\\"1\\\"]\",\"Subtext\":\"[\\\"\\\\\\\"\\\\\\\"\\\",\\\"\\\\\\\"This is a subtext. It is used as\\\\\\\\nextra text that you may want to\\\\\\\\nplace on your quest journal that\\\\\\\\ndiffers from the description.\\\\\\\"\\\"]\"}","Quest 6":"","Quest 7":"","Quest 8":"","Quest 9":"","Quest 10":"","Quest 11":"","Quest 12":"","Quest 13":"","Quest 14":"","Quest 15":"","Quest 16":"","Quest 17":"","Quest 18":"","Quest 19":"","Quest 20":"","Quest 21":"","Quest 22":"","Quest 23":"","Quest 24":"","Quest 25":"","Quest 26":"","Quest 27":"","Quest 28":"","Quest 29":"","Quest 30":"","Quest 31":"","Quest 32":"","Quest 33":"","Quest 34":"","Quest 35":"","Quest 36":"","Quest 37":"","Quest 38":"","Quest 39":"","Quest 40":"","Quest 41":"","Quest 42":"","Quest 43":"","Quest 44":"","Quest 45":"","Quest 46":"","Quest 47":"","Quest 48":"","Quest 49":"","Quest 50":"","Quest 51":"","Quest 52":"","Quest 53":"","Quest 54":"","Quest 55":"","Quest 56":"","Quest 57":"","Quest 58":"","Quest 59":"","Quest 60":"","Quest 61":"","Quest 62":"","Quest 63":"","Quest 64":"","Quest 65":"","Quest 66":"","Quest 67":"","Quest 68":"","Quest 69":"","Quest 70":"","Quest 71":"","Quest 72":"","Quest 73":"","Quest 74":"","Quest 75":"","Quest 76":"","Quest 77":"","Quest 78":"","Quest 79":"","Quest 80":"","Quest 81":"","Quest 82":"","Quest 83":"","Quest 84":"","Quest 85":"","Quest 86":"","Quest 87":"","Quest 88":"","Quest 89":"","Quest 90":"","Quest 91":"","Quest 92":"","Quest 93":"","Quest 94":"","Quest 95":"","Quest 96":"","Quest 97":"","Quest 98":"","Quest 99":"","Quest 100":""}},
{"name":"YEP_PatchNotes","status":false,"description":"v1.00 Add the ability to read Patch Notes from inside your game.","parameters":{"---General---":"","Patch Notes File":"patchnotes.txt","---Title---":"","PatchTitleCommand":"Patch Notes","Add Title Screen":"true","---Menu---":"","PatchMenuCommand":"Patch Notes","Auto Add Menu":"true","Show Command":"true","Auto Place Command":"true"}},
{"name":"BBS_VersionDisplay","status":true,"description":"v1.02 Adds display of the game version to the title screen.\r\nSpecial Thanks to Tsukihime for all the help.\r\nSpecial Thanks to 'Ramza' Michael Sweeney for all the support.\r\n\r\n============================================================================\r\nParameters\r\n============================================================================","parameters":{"Game Version Number":"0.6","Game Version Font":"","Version Font Size":"20","Show Version Number?":"true","Version Text Color":"white","Version Outline Color":"black","Version Outline Width":"8","Title Italic":"false","Version Text Max Width":"Graphics.width / 3\r"}}
];
