from datetime import datetime
import random

from django.db import models
from django.contrib.auth.models import User


# Create your models here.

###########################################
# Battle Data
###########################################


class Battle(models.Model):
    """
        All of the settings for a single play session
    """

    player_one = models.ForeignKey(
        to="Player",
        related_name="player_one_battles"
    )

    player_two = models.ForeignKey(
        to="Player",
        related_name="player_two_battles"
    )

    terrain_map = models.ForeignKey(
        to="TerrainMap"
    )

    start_date_time = models.DateTimeField(
        default=datetime.now,
        null=True,
        blank=True
    )

    current_frame = models.IntegerField(
        default=1
    )

    # required. Number of minutes a player has each round to take turns for all characters.
    # The deadline to decide moves is determined by this.
    cycle_duration = models.IntegerField(
        default=0
    )

    def return_battle_history(self):
        pass

    def __unicode__(self):
        return u'{0}'.format(self.start_date_time)

    def __str__(self):
        return str(self.__unicode__())


class TerrainMap(models.Model):
    """
        A string of text, delimited by |, that represents the
        terrain type for each block in a map.
        Starts at the top left corner of the map and ends
        at the bottom right. Assumes a grid of 10x10
    """

    map_data = models.CharField(max_length="2048")

    @staticmethod
    def make_random_map():

        terrain_data_list = []

        for column_number in range(-4, 5):
            for row_number in range(-4, 5):
                tile_data = [
                    column_number,
                    random.randint(1, 3),
                    row_number,
                ]
                terrain_data_list.append(tile_data)

        return terrain_data_list


class BattleFrame(models.Model):
    """
        Stores information about historic (resolved) frames for a battle
    """

    battle = models.ForeignKey(
        to="Battle",
        related_name="frames"
    )

    information_dictionary = models.TextField(
        blank=True,
        null=True
    )

    # The frame number this information refers to
    number = models.IntegerField(
        default=0
    )


###########################################
# Players
###########################################


class Player(models.Model):
    """
        The player. Links to Django users and Characters.
        A player can have several characters that
        are fighting in different battles at the same time.
    """

    user = models.OneToOneField(User, related_name='player')

    def __unicode__(self):
        return u'{0}, {1}'.format(self.user.last_name, self.user.first_name)

    def __str__(self):
        return str(self.__unicode__())


class PlayerCommit(models.Model):
    """
        Stores information about a player's committed choices for future (unresolved) frames
    """

    battle = models.ForeignKey(
        to="Battle",
        related_name="commits"
    )

    player = models.ForeignKey(
        to="Player",
        related_name="commits"
    )

    information_dictionary = models.TextField(
        blank=True,
        null=True
    )

    # The frame number this information refers to
    number = models.IntegerField(
        default=0
    )



    