import json
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize
from django.views.decorators.cache import cache_page
import math

from battle_machine import make_new_battle, make_battle_dictionary, get_height_at_coordinates, point_inside_block
from models import Battle, TerrainMap, Player


# @login_required
def battle(request):

    battle_list = Battle.objects.all().order_by('-pk')

    if any(battle_list):
        latest_battle = Battle.objects.all().order_by('-pk')[0]
    else:
        player_one = Player.objects.get(pk=1)
        player_two = Player.objects.get(pk=2)

        latest_battle = make_new_battle(
            player_one=player_one,
            player_two=player_two,
            cycle_duration=1440     # 24 hours
        )

    terrain_data_list = json.loads(latest_battle.terrain_map.map_data)
    battle_frame_query_set = latest_battle.frames.all().order_by("number")
    battle_frame_list = []

    for battle_frame in battle_frame_query_set:
        battle_frame_list.append(
            {
                "information_dictionary": json.loads(battle_frame.information_dictionary),
                "number": battle_frame.number
            }
        )

    # Build final dictionary
    stage_data = {
        "terrain_data_list": terrain_data_list,
        "battle_frame_list": battle_frame_list
    }

    my_json = json.dumps(stage_data)

    http_response = HttpResponse(my_json, content_type="application/json", status=200)

    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response


@login_required
def get_battle_dictionary(request):

    battle_id = request.GET.get('battle_id')

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    battle_json = json.dumps(battle_dictionary, cls=DjangoJSONEncoder)

    http_response = HttpResponse(battle_json, content_type="application/json", status=200)
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response


@login_required
def perform_action(request):

    # battle
    battle_id = request.GET.get("battle_id")

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    action_dictionary = json.loads(request.GET.get("action_dictionary"))

    #process action
    if action_dictionary.get("action") == "move":
        move_character(
            column=action_dictionary.get("column"),
            row=action_dictionary.get("row"),
            battle=battle,
        )


    battle, battle_dictionary = make_battle_dictionary(battle_id)

    battle_json = json.dumps(battle_dictionary, cls=DjangoJSONEncoder)

    http_response = HttpResponse(battle_json, content_type="application/json", status=200)
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response

# @login_required
@cache_page(60 * 15)
def get_visible_tiles(request):

    # battle
    battle_id = int(request.GET.get("battle_id"))

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    terrain_map = json.loads(battle.terrain_map.map_data)

    starting_coordinates = json.loads(request.GET.get("coordinates"))
    starting_coordinates[1] += 0.5

    # Loop through all blocks. Draw line between standing coordinates and each blocks top
    visible_block_list = []
    for block in iter(terrain_map):

        end_coordinates = block[:]  # copy
        end_coordinates[1] += 0.5

        # Add slight x offset to prevent line going through diagonal blocks
        # end_coordinates[0] += 0.1

        # Skip self
        if all([
            end_coordinates[0] == starting_coordinates[0],
            end_coordinates[1] == starting_coordinates[1],
            end_coordinates[2] == starting_coordinates[2],
        ]):
            continue

        vector = [
            end_coordinates[0] - starting_coordinates[0],
            end_coordinates[1] - starting_coordinates[1],
            end_coordinates[2] - starting_coordinates[2],
        ]

        magnitude = math.sqrt(
            math.pow(vector[0], 2) + math.pow(vector[1], 2) + math.pow(vector[2], 2)
        )

        unit_vector = [
            vector[0] / magnitude,
            vector[1] / magnitude,
            vector[2] / magnitude,
        ]

        # Grab the offsets that are a bit to the left and right (90 degrees) of the line to give it thickness
        left_offset = [
            -unit_vector[2] * 0.1,
            unit_vector[1] * 0.1,
            unit_vector[0] * 0.1,
        ]

        right_offset = [
            unit_vector[2] * 0.1,
            unit_vector[1] * 0.1,
            -unit_vector[0] * 0.1,
        ]

        # Increment in set lengths through the vector and see if we occupy a space that has a block in it
        block_is_visible = True
        for distance in frange(0.0, magnitude, 0.1):

            # Main line
            point = [
                starting_coordinates[0] + (unit_vector[0] * distance),
                starting_coordinates[1] + (unit_vector[1] * distance),
                starting_coordinates[2] + (unit_vector[2] * distance),
            ]

            # Left line
            left_point = [
                point[0] + left_offset[0],
                point[1],
                point[2] + left_offset[2],
            ]

            # Right line
            right_point = [
                point[0] + right_offset[0],
                point[1],
                point[2] + right_offset[2],
            ]

            if point_inside_block(terrain_map, point):
                block_is_visible = False
                break

            if point_inside_block(terrain_map, left_point):
                block_is_visible = False
                break

            if point_inside_block(terrain_map, right_point):
                block_is_visible = False
                break

        if block_is_visible is True:
            visible_block_list.append(block)

    http_response = HttpResponse(
        json.dumps(visible_block_list),
        content_type="application/json",
        status=200
    )
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response


def frange(start, stop, step):
    while start < stop:
        yield start
        start += step