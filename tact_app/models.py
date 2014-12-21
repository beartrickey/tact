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

    terrain_map = models.ForeignKey('TerrainMap')

    start_date_time = models.DateTimeField(default=datetime.now, blank=True)

    current_frame = models.IntegerField(default=1)

    frames_per_cycle = models.IntegerField(default=1)

    # required. Number of minutes a player has each round to take turns for all characters.
    # The deadline to decide moves is determined by this.
    cycle_duration = models.IntegerField(default=0)

    def return_battle_history(self):
        pass

    def __unicode__(self):
        return u'{0}'.format(self.start_date_time)

    def __str__(self):
        return str(self.__unicode__())


# class GameFrame(models.Model):
#     """
#     """
#
#     battle
#     frame_data - dictionary of all actual events that happened that frame

# class PlayerMove
#
#     battle
#     player
#     frame_data - dictionary of all planned moves made by a certain player. should resemble frame_data dict of GameFrame


class TerrainMap(models.Model):
    """
        A string of text, delimited by |, that represents the
        terrain type for each block in a map.
        Starts at the top left corner of the map and ends
        at the bottom right. Assumes a grid of 16x9
    """

    map_data = models.CharField(max_length='2048')


###########################################
# Players, Characters, and Item Data
###########################################


class Player(models.Model):
    """
        The player. Links to Django users and Characters.
        A player can have several characters that
        are fighting in different battles at the same time.
    """

    user = models.OneToOneField(User, related_name='player')  # should this be a one-to-one?

    def __unicode__(self):
        return u'{0}, {1}'.format(self.user.last_name, self.user.first_name)

    def __str__(self):
        return str(self.__unicode__())


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

    def __unicode__(self):
        return u'{0}'.format(self.name)

    def __str__(self):
        return str(self.__unicode__())


class Character(MapNodeClass):
    """
        Stores information about PCs and NPCs.
        NPCs will have a player field of null and are controlled by game logic.
        Inventory is stored via the related name 'items' in the Item model
    """

    battle = models.ForeignKey('Battle', related_name='characters', null=True, blank=True)

    player = models.ForeignKey('Player', related_name='characters', null=True, blank=True)

    strength = models.IntegerField(default=0)

    round = models.IntegerField(default=0)


class Item(MapNodeClass):
    """
    A specific item a character can hold.
    """

    character = models.ForeignKey('Character', related_name='items')

    attributes = models.ManyToManyField('ItemAttribute', related_name='items')


class ItemAttribute(models.Model):
    """
    The attributes of an item.
    For example 'does damage', or 'fiery'
    """

    name = models.CharField(max_length=16)

    value = models.IntegerField(default=0)

    def __unicode__(self):
        return u'{0}, {1}'.format(self.name, self.value)

    def __str__(self):
        return str(self.__unicode__())
