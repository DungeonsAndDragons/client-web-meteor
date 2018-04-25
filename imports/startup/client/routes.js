import React from 'react';

import createBrowserRouter from 'found/lib/createBrowserRouter';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';

import { requireLogin } from '../../ui/helpers/authentication';

import App from '../../ui/pages/App';
import LandingPage from '../../ui/pages/LandingPage';
import Login from '../../ui/pages/userManagement/Login';
import Register from '../../ui/pages/userManagement/Register';
import Dashboard from '../../ui/pages/Dashboard';
import CharacterDetail from '../../ui/pages/CharacterDetail';

export default (BrowserRouter = createBrowserRouter({
    historyOptions: { useBeforeUnload: true },
    routeConfig: makeRouteConfig(
        <Route path="/" Component={App}>
            <Route Component={LandingPage} />
            <Route path="login" Component={Login} />
            <Route path="register" Component={Register} />
            <Route path="dashboard" Component={requireLogin(Dashboard)} />
            <Route
                path="character/:characterID"
                Component={requireLogin(CharacterDetail)}
            />
        </Route>
    ),
    renderError: (
        { error } // eslint-disable-line react/prop-types
    ) => <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
}));
