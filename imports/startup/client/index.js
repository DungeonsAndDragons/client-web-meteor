import React from 'react';
import { render } from 'react-dom';

import Router from './routes';

export function onClientStartup() {
    render(<Router />, document.getElementById('render-target'));
}
