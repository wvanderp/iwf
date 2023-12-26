/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-useless-path-segments */
import {
    getToken
} from '../../../../src/';

declare global {
    interface Window {
        login: (username: string, password: string) => Promise<void>;
    }
}

async function login(username: string, password: string): Promise<void> {
    const origin = window.location.origin;
    const token = await getToken(username, password, {
        origin
    });

    if (token) {
        document.body.innerHTML = `success: ${token}`;
    }
}

window.login = login;
