import corsCheck from '../../../../src/utils/api/corsCheck';

describe('corsCheck', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        delete (globalThis as Record<string, unknown>).window;
    });

    it('warns for browser CORS edge cases', () => {
        Object.assign(globalThis as Record<string, unknown>, { window: globalThis });
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        corsCheck('https://example.org');
        corsCheck('https://www.wikidata.org', 'https://app.example.test');

        expect(warnSpy).toHaveBeenCalledTimes(2);
    });
});
