module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/src/**/*.test.ts'], // Adjust this if you put your tests elsewhere
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json', // Path to your tsconfig file
        },
    },
};
