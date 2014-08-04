#python imports
import random

#django imports
from django.forms.models import model_to_dict
from django.core.serializers import serialize

#app imports
import math
from models import Battle, TerrainMap, Character, Player


#blocks
NUM_COLUMNS = 9
NUM_ROWS = 9
TOTAL_BLOCKS = NUM_COLUMNS * NUM_ROWS

#terrain
TERRAIN_TYPE_PATH = 0
TERRAIN_TYPE_WALL = 1
TERRAIN_TYPE_WATER = 2


def get_block_index(_column, _row):
    return (_row * NUM_COLUMNS) + _column


def get_terrain_type(_column, _row, _battle_id):

    map_data = Battle.objects.get(pk=_battle_id).terrain_map.map_data

    block_list = map_data.split('|')

    block_index = get_block_index(_column, _row)

    return block_list[block_index]


def make_random_character_for_player(_player):

    character = make_random_character()
    character.player = _player
    character.save()

    return character


def make_random_character():

    # random color
    rand_color = random.randint(0, 100)
    color = "#000"
    if rand_color < 50:
        color = "#fff"

    # random name
    rand_name = "character_" + str(rand_color)

    #stats
    strength = random.randrange(10, 30)

    facing = random.randrange(0, 3)

    #create character
    character = Character.objects.create(
        name=rand_name,
        font_color=color,
        strength=strength,
        facing=facing,
    )

    character.save()

    return character


def make_new_battle(_character_list):

    #players
    player = Player.objects.get(id=1)

    #character list
    if _character_list is None:
        _character_list = []
        for i in range(6):
            _character_list.append(make_random_character_for_player(player))

    #map data
    terrain_map_data = ""

    for block_number in range(TOTAL_BLOCKS):

        random_terrain = random.randint(0, 100)

        if random_terrain < 85:
            terrain_map_data += str(TERRAIN_TYPE_PATH)
        elif random_terrain < 95:
            terrain_map_data += str(TERRAIN_TYPE_WALL)
        elif random_terrain <= 100:
            terrain_map_data += str(TERRAIN_TYPE_WATER)

        terrain_map_data += "|"

    #remove trailing |
    terrain_map_data = terrain_map_data[:-1]

    terrain_map = TerrainMap.objects.create(map_data=terrain_map_data)
    terrain_map.save()

    #battle
    new_battle = Battle.objects.create(
        terrain_map=terrain_map,
    )

    #place characters in random locations
    for character in _character_list:
        rand_col = random.randint(0, NUM_COLUMNS - 1)
        rand_row = random.randint(0, NUM_ROWS - 1)

        character.column = rand_col
        character.row = rand_row

        character.battle = new_battle

        character.save()

    # make the first character active
    new_battle.active_character = new_battle.characters.all()[0]

    new_battle.save()

    return new_battle


# def end_active_characters_turn(_battle):
#
#     _battle.active_character.round = _battle.current_round
#
#     _battle.active_character.save()
#
#     choose_active_character(_battle)


# def choose_active_character(_battle):
#
#     print "choosing active character for round {0}".format(_battle.current_round)
#
#     active_player = _battle.active_character.player
#
#     # is there a character that this player controls that hasn't gone this round yet?
#     active_player_characters = Character.objects.filter(
#         battle=_battle,
#         player=active_player,
#         round=_battle.current_round - 1,
#     )
#
#     if len(active_player_characters) > 0:
#         _battle.active_character = active_player_characters[0]
#         _battle.save()
#         return
#     else:
#         remaining_player_characters = Character.objects.filter(
#             battle=_battle,
#             round=_battle.current_round - 1,
#         )
#
#         if len(remaining_player_characters) > 0:
#             _battle.active_character = remaining_player_characters[0]
#             _battle.save()
#             return
#
#     #if no character returned, increase round number, and replenish action points
#     increment_current_round(_battle)
#
#
# def increment_current_round(_battle):
#
#     _battle.current_round += 1
#
#     characters = _battle.characters.all()
#
#     for character in characters:
#         character.offset_action_points(character.action_point_recovery_speed)
#         character.save()
#
#     # TODO: Ensure same player doesn't go twice
#     choose_active_character(_battle)


def make_battle_dictionary(_battle_id):

    battle = Battle.objects.get(pk=_battle_id)

    battle_dictionary = model_to_dict(battle)

    #populate map data
    battle_dictionary['terrain_map'] = battle.terrain_map.map_data

    #nodes
    battle_dictionary['node_list'] = serialize('json', battle.characters.all())

    #globals
    battle_dictionary['num_columns'] = NUM_COLUMNS
    battle_dictionary['num_rows'] = NUM_ROWS

    return battle, battle_dictionary


def move_character(_character_id, _column, _row, _battle):

    character = Character.objects.get(pk=_character_id)

    # determine facing
    col_dif = character.column - _column
    row_dif = character.row - _row
    new_facing = character.facing

    if col_dif is 1:
        new_facing = 0
    elif col_dif is -1:
        new_facing = 2
    elif row_dif is 1:
        new_facing = 1
    elif row_dif is -1:
        new_facing = 3

    # set paramters
    character.column = _column;
    character.row = _row;
    character.facing = new_facing

    #update node info
    character.save()

    # print 'moved to block at {0}, {1}'.format(current_col, current_row)

def use_item(_node, _facing, _terrain_map):
    pass