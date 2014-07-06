from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login


def login_user(_request):

    _form = AuthenticationForm()

    if _request.method == 'POST':

        _form = AuthenticationForm(data=_request.POST,)

        if _form.is_valid():

            username = _form.cleaned_data.get('username')
            password = _form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(_request, user)

                    # Redirect to a success page.
                    return redirect(reverse('battle'))
                else:
                    pass
                    # Return a 'disabled account' error message
            else:
                pass
                # Return an 'invalid login' error message.

    return render(
        _request,
        'tact_app/login.html',
        {
            'form': _form,
        }
    )
