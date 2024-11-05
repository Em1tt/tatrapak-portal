import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

import { createThemes } from 'tw-colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},

	plugins: [
		typography,
		forms,
		containerQueries,
		aspectRatio,
		createThemes({
			light: {
				primary: "hsl(116, 100%, 43%)",
				"primary-dark": 'hsl(116, 100%, 33%)',
				brand: '#F3F3F3'
			},
			dark: {
				primary: "rgb(200,220,0)",
				secondary: 'darkblue',
				brand: '#F3F3F3'
			}
		})
	]
} satisfies Config;
