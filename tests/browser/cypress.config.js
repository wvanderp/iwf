// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress');

const path = require('path');
const dotenvPath = path.resolve(__dirname, '..', '..', '.env');
require('dotenv').config({ path: dotenvPath });

module.exports = defineConfig({
    env: {
        ...process.env,
    },
    e2e: {
        setupNodeEvents(on, config) {},
    },
});
