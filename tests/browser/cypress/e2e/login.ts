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

const testServer = 'https://test.wikidata.org';

async function login(username: string, password: string): Promise<void> {
    const token = await getToken(username, password, {
        server: testServer,
        origin: 'http://localhost:3000'
    });

    if (token) {
        document.body.innerHTML = `success: ${token}`;
    }
}

window.login = login;
