#python imports
import json
import random

#django imports
from django.forms.models import model_to_dict
from django.core.serializers import serialize

#app imports
import math
from models import Battle, TerrainMap, Player


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


def make_new_battle(player_one, player_two, cycle_duration):

    # Generate map data
    terrain_map_data = json.dumps(
        TerrainMap.make_random_map()
    )

    terrain_map = TerrainMap.objects.create(
        map_data=terrain_map_data
    )

    # Battle
    new_battle = Battle.objects.create(
        player_one=player_one,
        player_two=player_two,
        terrain_map=terrain_map,
        cycle_duration=cycle_duration,
    )

    return new_battle


def make_battle_dictionary(_battle_id):

    battle = Battle.objects.get(pk=_battle_id)

    battle_dictionary = model_to_dict(battle)

    #populate map data
    battle_dictionary['terrain_map'] = battle.terrain_map.map_data

    #globals
    # battle_dictionary['num_columns'] = NUM_COLUMNS
    # battle_dictionary['num_rows'] = NUM_ROWS

    return battle, battle_dictionary


def move_unit(request, battle, frame_number, from_column, from_row, amount, direction):
    # Validate unit exists

    # Validate collision with terrain

    # Validate collision with other units

    # Validate energy

    pass



