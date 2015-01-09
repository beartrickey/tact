import json
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize


from battle_machine import make_new_battle, make_battle_dictionary
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