
export default function formatDate(dateString) {
    // Parse and validate date string
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
        return "Invalid Date"; // Return "Invalid Date" if date is not valid
    }

    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time (HH:mm)
    } else if (isYesterday) {
        return "Yesterday"; // Display 'Yesterday'
    } else {
        return messageDate.toLocaleDateString(); // Return full date
    }
};
