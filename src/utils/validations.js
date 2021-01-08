/**
 * Checks if provided message is valid
 * @param {String} message
 * @returns {Boolean} Returns true if message is valid. Else returns false
 */
const validateMessage = (msg) => {
    if (msg.trim() === "") {
        return false;
    }
    return true;
}

export { validateMessage }