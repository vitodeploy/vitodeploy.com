import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
	corePlugins: { preflight: false, container: false },
	darkMode: ["class"],
	content: ['./src/**/*.html', './src/**/*.js', './src/**/*.tsx'],
	theme: {
		extend: {
			colors: {
				primary: colors.indigo,
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
};
