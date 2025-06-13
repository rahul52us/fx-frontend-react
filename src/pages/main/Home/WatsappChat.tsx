
const WhatsAppChat = () => {
    const phoneNumber = '9098212700'; // Replace with the recipient's phone number
    const message = 'Hello! I would like to connect.'; // Customize your message

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    const chatUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <div>
            <h2>Contact Us</h2>
            <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                Open Chat on WhatsApp
            </a>
        </div>
    );
};

export default WhatsAppChat;
