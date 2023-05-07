import chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
import { describe, it } from 'mocha';
import * as dotenv from 'dotenv';

import { getToken } from '../src';

chai.use(chaiAsPromised);
const { expect } = chai;

dotenv.config();
declare let process : {
    env: {
        WIKIDATA_USERNAME: string;
        WIKIDATA_PASSWORD: string;
    }
};

describe('get login token', () => {
    it('should return a login token', async function () {
        this.timeout(10000);

        const token = await getToken(
            process.env.WIKIDATA_USERNAME,
            process.env.WIKIDATA_PASSWORD
        );

        expect(token).to.be.a('object');
        expect(token).to.have.property('token');
        expect(token).to.have.property('cookie');
        expect(token.token).to.be.a('string');
        expect(token.cookie).to.be.a('string');
    });

    it('should fail gracefully when given wrong credentials', async function () {
        this.timeout(10000);

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const failFunction = async () => {
            await getToken(
                'wrongUsername',
                'fdsfkdsjflkds'
            );
        };

        expect(failFunction()).to.eventually.throw();
    });
});
