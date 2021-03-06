from django.conf.urls import patterns, include, url
from django.core.urlresolvers import reverse_lazy
from django.conf import settings
from django.views.generic import RedirectView

from django.contrib import admin

from transactions.views import buy_index

admin.autodiscover()

urlpatterns = patterns('')

if settings.USE_CAS:
    urlpatterns += patterns('',
        url(r'^accounts/login$', 'cas.views.login', name='login'),
        url(r'^accounts/logout$', 'cas.views.logout', name='logout'),
        url('^admin/logout/$', RedirectView.as_view(url=reverse_lazy('logout'))),
    )

urlpatterns += patterns('',
    # Examples:
    # url(r'^$', 'terpbooks.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^books/', include('books.urls')),
    url(r'^transactions/', include('transactions.urls')),
    url(r'^messages/', include('messages.urls')),
    url(r'^buy$', buy_index, name='buy'),
)
