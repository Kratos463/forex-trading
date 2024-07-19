// Helper function to validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


// Helper function to validate phone number format
function isValidPhone(phone) {
    const regex = /^[0-9]{12}$/;
    return !phone || regex.test(phone);
}


// Helper function to validate password format
function isValidPassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}

const extractTokenFromHeader = (authorizationHeader) => {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
        return null;
    }
    return authorizationHeader.split(" ")[1];
};

module.exports = {isValidEmail, isValidPassword, isValidPhone, extractTokenFromHeader}