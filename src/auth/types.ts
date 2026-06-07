/**
 * Bot password configuration
 */
export interface BotPasswordConfig {
    username: string; // Format: "MainAccount@BotName"
    password: string; // Bot password, not main account password
    userAgent: string;
}

/**
 * OAuth 2.0 configuration
 */
export interface OAuthConfig {
    /** OAuth 2.0 client ID obtained from Wikimedia Special:OAuthConsumerRegistration */
    clientId: string;
    /** Redirect URI registered with the OAuth consumer (must match exactly) */
    redirectUri: string;
    /** User-Agent header sent with API requests */
    userAgent: string;
}
