// tailwind.config.js
module.exports = {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
	theme: {
		extend: {
			colors: {
				nerv: {
					red: "#e31e24",
					black: "#071013",
					white: "#ebebd3",
					orange: "#f18f01",
				},
			},
			fontSize: {
				fluidLarge: "max(20px, 5vw)",
			},
            fontFamily: {
                'nerv': ['Times New Roman', 'Times', 'serif'],
              },
		},
	},
	plugins: [],
};
