import { describe, it } from 'mocha';
import { expect } from 'chai';
import { LabelAndDescription } from '@wmde/wikibase-datamodel-types';
import { Alias } from '../src';

const alias = {
    language: 'en',
    value: 'Berlin, Germany'
} as LabelAndDescription;

const alias2 = {
    language: 'de',
    value: 'Berlin, Deutschland'
} as LabelAndDescription;

describe('alias', () => {
    describe('toJSON', () => {
        it('should have the right JSON stringification', () => {
            const aliasObject = new Alias(alias);

            expect(aliasObject.toJSON()).to.deep.equal(alias);
        });
    });

    describe('equals', () => {
        it('should be true if the aliases are equal', () => {
            const aliasObject = new Alias(alias);

            expect(aliasObject.equals(aliasObject)).to.be.true;
        });

        it('should be true if the aliases are equal but not the same object', () => {
            const aliasObject = new Alias(alias);
            const aliasObject2 = new Alias(alias);

            expect(aliasObject.equals(aliasObject2)).to.be.true;
        });

        it('should be false if the aliases are NOT equal', () => {
            const aliasObject = new Alias(alias);
            const aliasObject2 = new Alias(alias2);

            expect(aliasObject2.equals(aliasObject)).to.be.false;
        });
    });
});
