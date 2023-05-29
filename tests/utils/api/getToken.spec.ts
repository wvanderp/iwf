// @ts-nocheck

import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('getToken', () => {
    it('should throw when the input is rubbish', () => {
        expect(() => getToken()).to.throw();
        expect(() => getToken('')).to.throw();
        expect(() => getToken('a', '')).to.throw();
        expect(() => getToken('', 'a')).to.throw();
        expect(() => getToken(null, 'a')).to.throw();
        expect(() => getToken('a', null)).to.throw();
        expect(() => getToken(null, null)).to.throw();
        expect(() => getToken()).to.throw();
        expect(() => getToken(undefined, 'a')).to.throw();
        expect(() => getToken('a')).to.throw();

        expect(() => getToken('a', 'a', '')).to.throw();
        expect(() => getToken('a', 'a', null)).to.throw();
    });
});
