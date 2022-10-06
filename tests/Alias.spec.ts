import { describe, it } from 'mocha';
import { expect } from 'chai';
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Alias } from '../src';

const aliasJson = {
    language: 'en',
    value: 'Berlin, Germany'
} as LabelAndDescription;

const aliasJson2 = {
    language: 'de',
    value: 'Berlin, Deutschland'
} as LabelAndDescription;

describe('alias', () => {
    describe('internalID', () => {
        it('should be the language and value of the alias', () => {
            const alias = new Alias(aliasJson);
            expect(alias.internalID).to.equal('en:Berlin, Germany');
        });
    });

    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const alias = new Alias(aliasJson);

            expect(alias.toJSON()).to.deep.equal(aliasJson);
        });
    });

    describe('equals', () => {
        it('should be true if the aliases are equal', () => {
            const alias = new Alias(aliasJson);

            expect(alias.equals(alias)).to.be.true;
        });

        it('should be true if the aliases are equal but not the same object', () => {
            const alias = new Alias(aliasJson);
            const alias2 = new Alias(aliasJson);

            expect(alias.equals(alias2)).to.be.true;
        });

        it('should be false if the aliases are NOT equal', () => {
            const alias = new Alias(aliasJson);
            const alias2 = new Alias(aliasJson2);

            expect(alias2.equals(alias)).to.be.false;
        });
    });
});
