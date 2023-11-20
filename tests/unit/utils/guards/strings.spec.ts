import { isPString, isQString } from '../../../../src';

const QStrings: [string, boolean][] = [
    ['Q1', true],
    ['Q22312344122321', true],
    ['Qabc', false],
    ['Q', false],
    ['Q123', true],
    ['QABC', false],
    ['Q123ABC', false],
    ['Q123ABC123', false],
    ['Q12321 312321', false]
];

const PStrings: [string, boolean][] = [
    ['P1', true],
    ['P22312344122321', true],
    ['Pabc', false],
    ['P', false],
    ['P123', true],
    ['PABC', false],
    ['P123ABC', false],
    ['P123ABC123', false],
    ['P12321 312321', false]
];

describe('Statement', () => {
    describe('QString', () => {
        for (const [string, expected] of QStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${string} as a QString`, () => {
                expect(isQString(string)).toEqual(expected);
            });
        }
    });

    describe('PString', () => {
        for (const [string, expected] of PStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${string} as a PString`, () => {
                expect(isPString(string)).toEqual(expected);
            });
        }
    });
});
