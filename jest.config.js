module.exports = {
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    transformIgnorePatterns: [
        '/node_modules/(?!(axios-cookiejar-support|http-cookie-agent)/)'
    ],
    transform: {
        '^.+\\.(ts|js)$': 'babel-jest'
    }
};
