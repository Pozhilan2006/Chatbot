const { ethers } = require('ethers');

/**
 * Validates if a string is a valid Ethereum address.
 * @param {string} address
 * @returns {boolean}
 */
const isValidAddress = (address) => {
    return ethers.isAddress(address);
};

module.exports = { isValidAddress };
