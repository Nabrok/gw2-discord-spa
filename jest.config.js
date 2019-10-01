module.exports = {
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: [
		"html",
		"text-summary",
		"lcov"
	],
	coveragePathIgnorePatterns: [
		"__fixtures__"
	],
	moduleNameMapper: {
		"\\.(sa|sc|c)ss$": "identity-obj-proxy"
	},
	setupFiles: [
		"core-js/stable",
		"regenerator-runtime/runtime"
	],
	setupFilesAfterEnv: [
		"@testing-library/jest-dom/extend-expect"
	]
};
