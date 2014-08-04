import json
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers import serialize


from battle_machine import make_new_battle, make_battle_dictionary, move_character, use_item
from models import Battle, TerrainMap, Character


@login_required
def battle(_request):

    try:
        player = _request.user.player
        new_battle = Battle.objects.filter(
            characters__in=_request.user.player.characters.all()
        ).distinct()[0]
        # choose_active_character(new_battle)
    except IndexError:
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
    if action_dictionary.get('action') == 'move':
        move_character(
            _character_id=action_dictionary.get('character'),
            _column=action_dictionary.get('column'),
            _row=action_dictionary.get('row'),
            _battle=battle,
        )


    battle, battle_dictionary = make_battle_dictionary(battle_id)

    battle_json = json.dumps(battle_dictionary, cls=DjangoJSONEncoder)

    http_response = HttpResponse(battle_json, content_type="application/json", status=200)
    # http_response['Access-Control-Allow-Origin'] = "*"

    return http_response