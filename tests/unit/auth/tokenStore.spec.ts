import { promises as fs } from 'fs';
import { join } from 'path';
import { FileTokenStore, MemoryTokenStore } from '../../../src/auth/tokenStore';

describe('MemoryTokenStore', () => {
    let store: MemoryTokenStore;

    beforeEach(() => {
        store = new MemoryTokenStore();
    });

    it('should store and retrieve tokens', async () => {
        await store.saveRefreshToken('test-token');
        const token = await store.loadRefreshToken();

        expect(token).toBe('test-token');
    });

    it('should support multiple keys', async () => {
        await store.saveRefreshToken('token1', 'key1');
        await store.saveRefreshToken('token2', 'key2');

        const token1 = await store.loadRefreshToken('key1');
        const token2 = await store.loadRefreshToken('key2');

        expect(token1).toBe('token1');
        expect(token2).toBe('token2');
    });

    it('should return undefined for non-existent tokens', async () => {
        const token = await store.loadRefreshToken('nonexistent');

        expect(token).toBeUndefined();
    });

    it('should overwrite existing tokens', async () => {
        await store.saveRefreshToken('token1');
        await store.saveRefreshToken('token2');

        const token = await store.loadRefreshToken();

        expect(token).toBe('token2');
    });

    it('should clear all tokens', async () => {
        await store.saveRefreshToken('token1', 'key1');
        await store.saveRefreshToken('token2', 'key2');

        store.clear();

        const token1 = await store.loadRefreshToken('key1');
        const token2 = await store.loadRefreshToken('key2');

        expect(token1).toBeUndefined();
        expect(token2).toBeUndefined();
    });
});

describe('FileTokenStore', () => {
    const testDir = join('/tmp', `iwf-test-${Date.now()}`);
    let store: FileTokenStore;

    beforeEach(() => {
        store = new FileTokenStore(testDir, 'tokens.json');
    });

    afterEach(async () => {
        // Clean up test directory
        try {
            await fs.rm(testDir, { recursive: true, force: true });
        } catch {
            // Ignore errors
        }
    });

    it('should store and retrieve tokens', async () => {
        await store.saveRefreshToken('test-token');
        const token = await store.loadRefreshToken();

        expect(token).toBe('test-token');
    });

    it('should support multiple keys', async () => {
        await store.saveRefreshToken('token1', 'key1');
        await store.saveRefreshToken('token2', 'key2');

        const token1 = await store.loadRefreshToken('key1');
        const token2 = await store.loadRefreshToken('key2');

        expect(token1).toBe('token1');
        expect(token2).toBe('token2');
    });

    it('should return undefined for non-existent file', async () => {
        const token = await store.loadRefreshToken();

        expect(token).toBeUndefined();
    });

    it('should return undefined for non-existent key', async () => {
        await store.saveRefreshToken('token1', 'key1');
        const token = await store.loadRefreshToken('nonexistent');

        expect(token).toBeUndefined();
    });

    it('should create directory if it does not exist', async () => {
        await store.saveRefreshToken('test-token');

        const stats = await fs.stat(testDir);
        expect(stats.isDirectory()).toBe(true);
    });

    it('should persist tokens across instances', async () => {
        await store.saveRefreshToken('test-token');

        const newStore = new FileTokenStore(testDir, 'tokens.json');
        const token = await newStore.loadRefreshToken();

        expect(token).toBe('test-token');
    });

    it('should set restrictive file permissions', async () => {
        await store.saveRefreshToken('test-token');

        const filepath = join(testDir, 'tokens.json');
        const stats = await fs.stat(filepath);
        const mode = stats.mode & 0o777;

        // Should be 0o600 (owner read/write only)
        expect(mode).toBe(0o600);
    });

    it('should overwrite existing tokens for the same key', async () => {
        await store.saveRefreshToken('token1');
        await store.saveRefreshToken('token2');

        const token = await store.loadRefreshToken();

        expect(token).toBe('token2');
    });

    it('should preserve other keys when updating one key', async () => {
        await store.saveRefreshToken('token1', 'key1');
        await store.saveRefreshToken('token2', 'key2');
        await store.saveRefreshToken('token1-updated', 'key1');

        const token1 = await store.loadRefreshToken('key1');
        const token2 = await store.loadRefreshToken('key2');

        expect(token1).toBe('token1-updated');
        expect(token2).toBe('token2');
    });

    it('should handle malformed JSON file gracefully', async () => {
        // Create directory and write invalid JSON
        await fs.mkdir(testDir, { recursive: true });
        const filepath = join(testDir, 'tokens.json');
        await fs.writeFile(filepath, 'invalid json', 'utf-8');

        const token = await store.loadRefreshToken();

        expect(token).toBeUndefined();

        // Should be able to save after encountering invalid file
        await store.saveRefreshToken('new-token');
        const newToken = await store.loadRefreshToken();

        expect(newToken).toBe('new-token');
    });
});
