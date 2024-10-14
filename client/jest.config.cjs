module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom', // Use 'jsdom' for testing browser-like environments (frontend)
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform .ts/.tsx files using ts-jest
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions to consider
};
