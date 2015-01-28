from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from tact_app.login_view import login_user
from tact_app.views import battle, get_battle_dictionary, perform_action, get_visible_tiles

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tact.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', login_user, name='login'),
    url(r'^battle/', battle, name='battle'),
    url(r'^get_battle_dictionary/', get_battle_dictionary, name='get_battle_dictionary'),
    url(r'^get_visible_tiles/', get_visible_tiles, name='get_visible_tiles'),
    url(r'^perform_action/', perform_action, name='perform_action'),
)
