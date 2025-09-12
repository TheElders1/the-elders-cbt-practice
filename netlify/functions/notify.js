// This is a secure, server-side Netlify Function.
// It includes extra logging to help debug any issues.

const activeUsers = new Map(); // Store active users with timestamps
const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

// Clean up inactive users
function cleanupInactiveUsers() {
    const now = Date.now();
    for (const [userId, userData] of activeUsers.entries()) {
        if (now - userData.lastSeen > ONLINE_THRESHOLD) {
            activeUsers.delete(userId);
        }
    }
}

exports.handler = async function(event) {
    // --- 1. Security Check: Only allow POST requests ---
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // --- 2. Get Environment Variables from Netlify ---
        // These are set in your site's dashboard, not in the code.
        const { BOT_TOKEN, CHAT_ID } = process.env;

        // --- 3. Parse the message from the website ---
        const { message, type, userData } = JSON.parse(event.body);

        // --- Handle different notification types ---
        if (type === 'user_activity') {
            // Update active users tracking
            cleanupInactiveUsers();
            const userId = userData.id || userData.name.toLowerCase().replace(/\s+/g, '_');
            activeUsers.set(userId, {
                ...userData,
                lastSeen: Date.now(),
                ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'
            });
            
            // Send activity update to admin
            const activityMessage = `🟢 USER ACTIVITY 🟢\n\n` +
                `Name: ${userData.name}\n` +
                `Department: ${userData.department}\n` +
                `Action: ${userData.action}\n` +
                `Page: ${userData.page}\n` +
                `Time: ${new Date().toLocaleString()}\n` +
                `Total Online: ${activeUsers.size} users`;
            
            await sendToTelegram(BOT_TOKEN, CHAT_ID, activityMessage);
            
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    onlineUsers: activeUsers.size 
                })
            };
        }
        
        if (type === 'get_online_users') {
            // Return current online users
            cleanupInactiveUsers();
            const onlineUsersList = Array.from(activeUsers.values());
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    onlineUsers: onlineUsersList,
                    count: onlineUsersList.length
                })
            };
        }

        // --- 4. LOGGING: Show what the function received ---
        // This helps confirm the front-end is sending data correctly.
        console.log("Function invoked. Received message:", message);

        // --- 5. Validation Check: Make sure we have everything we need ---
        if (!BOT_TOKEN || !CHAT_ID || !message) {
            const errorMessage = "ERROR: Missing required data. Check BOT_TOKEN, CHAT_ID, and that a message was sent.";
            console.error(errorMessage); // Log the error for debugging.
            return { statusCode: 400, body: JSON.stringify({ error: errorMessage }) };
        }

        // Send regular notification
        await sendToTelegram(BOT_TOKEN, CHAT_ID, message);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        // This catches any other unexpected errors in the function.
        console.error("FATAL FUNCTION ERROR:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An internal server error occurred.' })
        };
    }
};

// Helper function to send messages to Telegram
async function sendToTelegram(botToken, chatId, message) {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    console.log("Sending request to Telegram API...");
    
    const response = await fetch(telegramUrl);
    const data = await response.json();
    
    if (!response.ok) {
        console.error("TELEGRAM API ERROR:", data);
        throw new Error(`Telegram API error: ${data.description}`);
    }
    
    console.log("TELEGRAM API SUCCESS: Message sent.", data);
    return data;
}