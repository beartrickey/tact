import json
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize


from battle_machine import make_new_battle, choose_active_character, make_battle_dictionary, move_node,\
    end_active_characters_turn, use_item
from models import Battle, TerrainMap, Character


@login_required
def battle(_request):

    try:
        new_battle = Battle.objects.get(pk=1)
        choose_active_character(new_battle)
    except:
        new_battle = make_new_battle(_character_list=None)

    return render(
        _request,
        'tact_app/game.html',
        {
            'battle_id': new_battle.pk,
        }
    )


@login_required
def get_battle_dictionary(_request):

    battle_id = _request.GET.get('battle_id')

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    battle_json = json.dumps(battle_dictionary, cls=DjangoJSONEncoder)

    http_response = HttpResponse(battle_json, content_type="application/json", status=200)
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response


@login_required
def perform_action(_request):

    # battle
    battle_id = _request.GET.get('battle_id')

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    action_dictionary = json.loads(_request.GET.get('action_dictionary'))

    #process action
    if action_dictionary.get('move') is not None:
        move_node(
            _node=battle.active_character,
            _facing=action_dictionary.get('move'),
            _battle=battle,
        )

    elif action_dictionary.get('end_turn') is not None:
        end_active_characters_turn(
            _battle=battle,
        )

    elif action_dictionary.get('use_item') is not None:
        use_item(
            _node=battle.active_character,
            _item=action_dictionary.get('use_item'),
            _facing=action_dictionary.get('use_item_facing'),
            _terrain_map=battle.terrain_map,
        )

    battle, battle_dictionary = make_battle_dictionary(battle_id)

    battle_json = json.dumps(battle_dictionary, cls=DjangoJSONEncoder)

    http_response = HttpResponse(battle_json, content_type="application/json", status=200)
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response