from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

###########################################
# Battle Data
###########################################


class Battle(models.Model):
    """
        All of the settings for a single play session
    """

    start_date_time = models.DateTimeField(default=datetime.now, blank=True)

    current_round = models.IntegerField(default=1)

    active_character = models.ForeignKey('Character', null=True, blank=True, related_name='active_character')

    terrain_map = models.ForeignKey('TerrainMap')

    def return_battle_history(self):
        pass


class GameEvent(models.Model):
    """
        A string of text that represents a single event in the battle.
        One Character's turn is made up of several events.
        ex: Char:1,Move:0 means character of pk1 moved one space to the left
    """

    event_data = models.CharField(max_length='32')

    battle = models.ForeignKey('Battle', related_name='battle_history')


class TerrainMap(models.Model):
    """
        A string of text, delimited by |, that represents the
        terrain type for each block in a map.
        Starts at the top left corner of the map and ends
        at the bottom right. Assumes a grid of 16x9
    """

    map_data = models.CharField(max_length='512')


###########################################
# Players, Characters, and Item Data
###########################################


class Player(models.Model):
    """
        The player. Links to Django users and Characters.
        A player can have several characters that
        are fighting in different battles at the same time.
    """

    user = models.ForeignKey(User)


class MapNodeClass(models.Model):
    """
        Anything that can appear on the map.
        Displays as a single ascii character with a background color
        and font color. Covers both living Characters and inanimate
        Items.
    """

    name = models.CharField(max_length=16)

    column = models.IntegerField(default=0)

    row = models.IntegerField(default=0)

    facing = models.IntegerField(default=0)

    font_color = models.CharField(max_length=4, blank=True)  # ex '#rgb'

    background_color = models.CharField(max_length=4, blank=True)  # ex '#rgb'

    ascii_character = models.CharField(max_length=1, blank=True)  # ex '@'

    class Meta:
        abstract = True


class Character(MapNodeClass):
    """
        Stores information about PCs and NPCs.
        NPCs will have a player field of null and are controlled by game logic.
        Inventory is stored via the related name 'items' in the Item model
    """

    battle = models.ForeignKey('Battle', related_name='characters', null=True, blank=True)

    player = models.ForeignKey('Player', related_name='characters', null=True, blank=True)

    hit_points = models.IntegerField(default=0)

    total_hit_points = models.IntegerField(default=0)

    action_points = models.IntegerField(default=0)

    total_action_points = models.IntegerField(default=0)

    action_point_recovery_speed = models.IntegerField(default=0)

    round = models.IntegerField(default=0)

    def offset_action_points(self, _amount):

        self.action_points += _amount

        #clamp
        if self.action_points <= 0:
            self.action_points = 0
        if self.action_points >= self.total_action_points:
            self.action_points = self.total_action_points



class Item(MapNodeClass):

    character = models.ForeignKey('Character', related_name='items')


class ItemAttribute(models.Model):
    """
        Links an Item to a set of python logic.
    """

    component_name = models.CharField(max_length=32)

    items = models.ManyToManyField('Item', related_name='attributes')