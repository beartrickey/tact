#python imports
import random

#django imports
from django.forms.models import model_to_dict
from django.core.serializers import serialize

#app imports
from models import Battle, TerrainMap, Character


#blocks
NUM_COLUMNS = 16
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
    pass


def make_random_character():

    # random color
    rand_color = random.randint(0, 100)
    color = "#000"
    if rand_color < 50:
        color = "#fff"

    # random name
    rand_name = "character_" + str(rand_color)

    #stats
    hit_points = random.randrange(10, 30)
    action_points = 5
    action_point_recovery_speed = 1

    #create character
    character = Character.objects.create(
        name=rand_name,
        font_color=color,
        action_points=action_points,
        total_action_points=action_points,
        hit_points=hit_points,
        total_hit_points=hit_points,
        action_point_recovery_speed=action_point_recovery_speed,
    )

    character.save()

    return character


def make_new_battle(_character_list):

    #character list
    if _character_list is None:
        _character_list = []
        for i in range(6):
            _character_list.append(make_random_character())

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

    choose_active_character(new_battle)

    new_battle.save()

    return new_battle


def end_active_characters_turn(_battle):

    _battle.active_character.round += 1

    _battle.active_character.save()

    choose_active_character(_battle)


def choose_active_character(_battle):

    print "choosing active character for round {0}".format(_battle.current_round)

    characters = _battle.characters.all()

    for character in characters:

        #skip if not enough action points or turn has already been taken this round
        if character.action_points < character.total_action_points:
            print "character has no action points: " + character.name
            continue

        if character.round == _battle.current_round:
            print "character {0} has already gone this round".format(character.name)
            continue

        print "found active character: {0}".format(character.name)
        _battle.active_character = character

        _battle.save()

        return

    #if no character returned, increase round number, and replenish action points
    increment_current_round(_battle)


def increment_current_round(_battle):

    _battle.current_round += 1

    characters = _battle.characters.all()

    for character in characters:
        character.round = _battle.current_round - 1  # ensure all character rounds are up to date
        character.offset_action_points(character.action_point_recovery_speed)
        character.save()

    choose_active_character(_battle)


def make_battle_dictionary(_battle_id):

    battle = Battle.objects.get(pk=_battle_id)

    battle_dictionary = model_to_dict(battle)

    #populate map data
    battle_dictionary['terrain_map'] = battle.terrain_map.map_data

    #nodes
    battle_dictionary['node_list'] = serialize('json', battle.characters.all())

    return battle, battle_dictionary


def move_node(_node, _facing, _terrain_map):

    current_col = _node.column
    current_row = _node.row
    map_list = _terrain_map.map_data.split('|')

    if _facing == 0:
        current_col -= 1
    if _facing == 1:
        current_row -= 1
    if _facing == 2:
        current_col += 1
    if _facing == 3:
        current_row += 1

    #clamp
    if current_row > NUM_ROWS - 1:
        current_row = NUM_ROWS - 1
    if current_row < 0:
        current_row = 0
    if current_col > NUM_COLUMNS - 1:
        current_col = NUM_COLUMNS - 1
    if current_col < 0:
        current_col = 0

    # don't move if the next block is a wall
    next_block = int(map_list[get_block_index(current_col, current_row)])

    _node.facing = _facing

    #just update facing if no more action points
    if _node.action_points <= 0:
        _node.save()
        return

    if next_block == TERRAIN_TYPE_PATH:
        # print 'cannot move to block at {0}, {1}'.format(current_col, current_row)
        _node.column = current_col
        _node.row = current_row
        _node.offset_action_points(-1)

    #update node info
    _node.save()

    # print 'moved to block at {0}, {1}'.format(current_col, current_row)