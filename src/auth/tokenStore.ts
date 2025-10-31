import { promises as fs } from 'fs';
import { join } from 'path';
import { TokenStore } from './types';

/**
 * Simple file-based token store for Node.js environments
 * Stores tokens in a JSON file in the specified directory
 */
export class FileTokenStore implements TokenStore {
    private readonly directory: string;
    private readonly filename: string;

    constructor(directory = '.iwf', filename = 'tokens.json') {
        this.directory = directory;
        this.filename = filename;
    }

    private get filepath(): string {
        return join(this.directory, this.filename);
    }

    async loadRefreshToken(key = 'default'): Promise<string | undefined> {
        try {
            const content = await fs.readFile(this.filepath, 'utf-8');
            const tokens = JSON.parse(content) as Record<string, string>;
            return tokens[key];
        } catch (error) {
            // File doesn't exist or is invalid - return undefined
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return undefined;
            }
            // Handle JSON parse errors
            if (error instanceof SyntaxError) {
                return undefined;
            }
            throw error;
        }
    }

    async saveRefreshToken(value: string, key = 'default'): Promise<void> {
        // Ensure directory exists
        try {
            await fs.mkdir(this.directory, { recursive: true });
        } catch {
            // Directory might already exist
        }

        // Load existing tokens
        let tokens: Record<string, string> = {};
        try {
            const content = await fs.readFile(this.filepath, 'utf-8');
            tokens = JSON.parse(content) as Record<string, string>;
        } catch {
            // File doesn't exist or is invalid - start fresh
        }

        // Update and save
        tokens[key] = value;
        await fs.writeFile(this.filepath, JSON.stringify(tokens, null, 2), 'utf-8');

        // Set restrictive permissions (owner read/write only)
        await fs.chmod(this.filepath, 0o600);
    }
}

/**
 * In-memory token store for testing and temporary usage
 */
export class MemoryTokenStore implements TokenStore {
    private tokens: Map<string, string> = new Map();

    async loadRefreshToken(key = 'default'): Promise<string | undefined> {
        return this.tokens.get(key);
    }

    async saveRefreshToken(value: string, key = 'default'): Promise<void> {
        this.tokens.set(key, value);
    }

    clear(): void {
        this.tokens.clear();
    }
}
