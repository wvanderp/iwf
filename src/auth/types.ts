/**
 * Bot password configuration
 */
export interface BotPasswordConfig {
    username: string; // Format: "MainAccount@BotName"
    password: string; // Bot password, not main account password
    userAgent: string;
}
