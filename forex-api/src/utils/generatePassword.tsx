export function generateStrongPassword(length = 16) {
    const specialChars = '!@#$%&?';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';

    // Combine all character sets
    const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;

    // Function to get a random character from a given string
    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];

    // Generate the password
    let password = '';
    
    // Ensure at least one character from each set
    password += getRandomChar(lowerCaseChars);
    password += getRandomChar(upperCaseChars);
    password += getRandomChar(numberChars);
    password += getRandomChar(specialChars);
    
    // Fill the rest of the password length with random characters from all sets
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(allChars);
    }

    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}
