#python imports
import json
import random

#django imports
from django.forms.models import model_to_dict
from django.core.serializers import serialize

#app imports
import math
from models import Battle, TerrainMap, Player, BattleFrame


#blocks
NUM_COLUMNS = 9
NUM_ROWS = 9
TOTAL_BLOCKS = NUM_COLUMNS * NUM_ROWS

#terrain
TERRAIN_TYPE_PATH = 0
TERRAIN_TYPE_WALL = 1
TERRAIN_TYPE_WATER = 2


def get_height_at_coordinates(terrain_data_list, x, z):

    for data in terrain_data_list:
        if data[0] == x and data[2] == z:
            return data[1]

    return None


def point_inside_block(terrain_data_list, point):

    for data in iter(terrain_data_list):

        block_min_x = data[0] - 0.5
        block_max_x = data[0] + 0.5

        block_max_y = data[1]

        block_min_z = data[2] - 0.5
        block_max_z = data[2] + 0.5

        if all([
            block_min_x <= point[0] <= block_max_x,
            point[1] <= block_max_y,
            block_min_z <= point[2] <= block_max_z,
        ]):
            return True

    return False


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

    # Build first frame with units placed on either side of map
    terrain_data_list = json.loads(new_battle.terrain_map.map_data)
    player_one_starting_unit_coordinates = [-4, get_height_at_coordinates(terrain_data_list, -4, -4), -4]
    player_two_starting_unit_coordinates = [4, get_height_at_coordinates(terrain_data_list, 4, 4), 4]

    battle_frame_information_dict = {

        "forces": [
            {
                "owner": player_one.pk,
                "amount": 10,
                "coordinates": player_one_starting_unit_coordinates,
            },
            {
                "owner": player_two.pk,
                "amount": 10,
                "coordinates": player_two_starting_unit_coordinates,
            },
        ]

    }

    BattleFrame.objects.create(
        number=1,
        battle=new_battle,
        information_dictionary=json.dumps(battle_frame_information_dict)
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



