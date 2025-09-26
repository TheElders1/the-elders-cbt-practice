// Secure admin authentication function
exports.handler = async (event, context) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { username, passwordHash } = JSON.parse(event.body);
        
        // Secure admin credentials (stored as environment variables in production)
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@theelders.dev';
        const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
        
        // Verify credentials
        if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
            // Generate secure session token
            const sessionToken = generateSecureToken();
            
            // Log successful login (in production, use proper logging service)
            console.log(`Admin login successful: ${username} at ${new Date().toISOString()}`);
            
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    sessionToken: sessionToken,
                    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
                })
            };
        } else {
            // Log failed attempt
            console.warn(`Failed admin login attempt: ${username} at ${new Date().toISOString()}`);
            
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Invalid credentials' })
            };
        }
        
    } catch (error) {
        console.error('Admin auth error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

function generateSecureToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}