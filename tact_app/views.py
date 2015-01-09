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

    battle = None
    try:
        battle = Battle.objects.get(
            pk=1
        )
    except Battle.DoesNotExist:
        player_one = Player.objects.get(pk=1)
        player_two = Player.objects.get(pk=2)

        battle = make_new_battle(
            player_one=player_one,
            player_two=player_two,
            cycle_duration=1440     # 24 hours
        )

    stage_data = {
        "tile_data_list": json.loads(battle.terrain_map.map_data)
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