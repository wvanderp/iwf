import {
    isPString, isQString, isLString, isEString, isSenseString, isFormString
} from '../../../../src';

const QStrings: [string, boolean][] = [
    ['Q1', true],
    ['Q22312344122321', true],
    ['Qabc', false],
    ['Q', false],
    ['Q123', true],
    ['QABC', false],
    ['Q123ABC', false],
    ['Q123ABC123', false],
    ['Q12321 312321', false],
    ['XQ123', false],
    ['Q123\nX', false],
    ['X\nQ123', false]
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
    ['P12321 312321', false],
    ['XP123', false],
    ['P123\nX', false],
    ['X\nP123', false]
];

const LStrings: [string, boolean][] = [
    ['L1', true],
    ['L22312344122321', true],
    ['Labc', false],
    ['L', false],
    ['L123', true],
    ['LABC', false],
    ['L123ABC', false],
    ['L123ABC123', false],
    ['L12321 312321', false],
    ['XL123', false],
    ['L123\nX', false],
    ['X\nL123', false]
];

const EStrings: [string, boolean][] = [
    ['E1', true],
    ['E22312344122321', true],
    ['Eabc', false],
    ['E', false],
    ['E123', true],
    ['EABC', false],
    ['E123ABC', false],
    ['E123ABC123', false],
    ['E12321 312321', false],
    ['XE123', false],
    ['E123\nX', false],
    ['X\nE123', false]
];

const SenseStrings: [string, boolean][] = [
    ['L1-S1', true],
    ['L123-S456', true],
    ['L1-S', false],
    ['L-S1', false],
    ['L1S1', false],
    ['L123-s456', false],
    ['L123S456', false],
    ['L123-S456ABC', false],
    ['L12321-S312321', true],
    ['L12321-S312321 ', false],
    ['XL123-S456', false],
    ['L123-S456\nX', false]
];

const FormStrings: [string, boolean][] = [
    ['L1-F1', true],
    ['L123-F456', true],
    ['L1-F', false],
    ['L-F1', false],
    ['L1F1', false],
    ['L123-f456', false],
    ['L123-S456', false],
    ['L123-F456ABC', false],
    ['XL123-F456', false],
    ['L123-F456\nL1', false],
    ['L12321-F312321 ', false]
];

describe('Statement', () => {
    describe('QString', () => {
        for (const [string, expected] of QStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as a QString`, () => {
                expect(isQString(string)).toEqual(expected);
            });
        }
    });

    describe('PString', () => {
        for (const [string, expected] of PStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as a PString`, () => {
                expect(isPString(string)).toEqual(expected);
            });
        }
    });

    describe('LString', () => {
        for (const [string, expected] of LStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as a LString`, () => {
                expect(isLString(string)).toEqual(expected);
            });
        }
    });

    describe('EString', () => {
        for (const [string, expected] of EStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as an EString`, () => {
                expect(isEString(string)).toEqual(expected);
            });
        }
    });

    describe('SenseString', () => {
        for (const [string, expected] of SenseStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as a SenseString`, () => {
                expect(isSenseString(string)).toEqual(expected);
            });
        }
    });

    describe('FormString', () => {
        for (const [string, expected] of FormStrings) {
            it(`should ${expected ? 'accept' : 'reject'} ${JSON.stringify(string)} as a FormString`, () => {
                expect(isFormString(string)).toEqual(expected);
            });
        }
    });
});
