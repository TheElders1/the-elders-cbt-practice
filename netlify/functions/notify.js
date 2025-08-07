// This is a secure, server-side Netlify Function.
// It includes extra logging to help debug any issues.

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
        const { message } = JSON.parse(event.body);

        // --- 4. LOGGING: Show what the function received ---
        // This helps confirm the front-end is sending data correctly.
        console.log("Function invoked. Received message:", message);

        // --- 5. Validation Check: Make sure we have everything we need ---
        if (!BOT_TOKEN || !CHAT_ID || !message) {
            const errorMessage = "ERROR: Missing required data. Check BOT_TOKEN, CHAT_ID, and that a message was sent.";
            console.error(errorMessage); // Log the error for debugging.
            return { statusCode: 400, body: JSON.stringify({ error: errorMessage }) };
        }

        // --- 6. Construct the secure URL to call the Telegram API ---
        // encodeURIComponent handles special characters like newlines (\n), spaces, etc.
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
        
        // --- 7. LOGGING: Show that we are about to contact Telegram ---
        console.log("Sending request to Telegram API...");

        // --- 8. Make the actual request to Telegram's servers ---
        const response = await fetch(telegramUrl);
        const data = await response.json(); // Get the response from Telegram

        // --- 9. Check Telegram's response and log the result ---
        if (!response.ok) {
            // This means Telegram returned an error (e.g., "Unauthorized" or "chat not found").
            console.error("TELEGRAM API ERROR:", data);
            return { statusCode: response.status, body: JSON.stringify(data) };
        }
        
        // If we get here, everything worked.
        console.log("TELEGRAM API SUCCESS: Message sent.", data);
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