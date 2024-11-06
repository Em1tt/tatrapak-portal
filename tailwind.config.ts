
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

import { createThemes } from 'tw-colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				zoomin: {
					"0%": {
						transform: "scale(0)",
						opacity: "0"
					},
					"50%": {
						opacity: "1"
					},
					"100%": {
						transform: "scale(1)",
						opacity: "0"
					}
				},
			},
			animation: {
				"zoomin": "zoomin 400ms ease-in-out forwards",
			}
		}
	},
	plugins: [
		typography,
		forms,
		containerQueries,
		createThemes({
			light: {
				"primary-base": "#10b981",
				"primary-dark-1": "#059669",
				"primary-dark-2": "#047857",
				"primary-dark-3": "#065f46",
				"primary-dark-4": "#064e3b",
				"primary-light-1": "#34d399",
				"primary-light-2": "#6ee7b7",
				"primary-light-3": "#a7f3d0",
				"primary-light-4": "#d1fae5",
				"secondary-base": "#3b82f6",
				"secondary-dark-1": "#2563eb",
				"secondary-dark-2": "#1d4ed8",
				"secondary-dark-3": "#1e40af",
				"secondary-dark-4": "#1e3a8a",
				"secondary-light-1": "#60a5fa",
				"secondary-light-2": "#93c5fd",
				"secondary-light-3": "#bfdbfe",
				"secondary-light-4": "#dbeafe",
				"warning-base": "#f59e0b",
				"warning-dark-1": "#d97706",
				"warning-dark-2": "#b45309",
				"warning-dark-3": "#92400e",
				"warning-dark-4": "#78350f",
				"warning-light-1": "#fbbf24",
				"warning-light-2": "#fcd34d",
				"warning-light-3": "#fde68a",
				"warning-light-4": "#fef3c7",
				"danger-base": "#ef4444",
				"danger-dark-1": "#dc2626",
				"danger-dark-2": "#b91c1c",
				"danger-dark-3": "#991b1b",
				"danger-dark-4": "#7f1d1d",
				"danger-light-1": "#f87171",
				"danger-light-2": "#fca5a5",
				"danger-light-3": "#fecaca",
				"danger-light-4": "#fee2e2",
				"text-base": "#1e293b",
				"text-dark-1": "#0f172a",
				"text-dark-2": "#020617",
				"text-light-1": "#475569",
				"text-light-2": "#64748b",
				"text-light-3": "#94a3b8",
				"text-light-4": "#e2e8f0",
				"background": "#e2e8f0",
				"background-dark-1": "#cbd5e1",
				"background-dark-2": "#94a3b8",
				"background-light-1": "#f1f5f9",
				"background-light-2": "#f8fafc",
				"border-base": "#cbd5e1"
			},
			dark: {
				"primary-base": "#10b981",
				"primary-dark-1": "#059669",
				"primary-dark-2": "#047857",
				"primary-dark-3": "#065f46",
				"primary-dark-4": "#064e3b",
				"primary-light-1": "#34d399",
				"primary-light-2": "#6ee7b7",
				"primary-light-3": "#a7f3d0",
				"primary-light-4": "#d1fae5",
				"secondary-base": "#3b82f6",
				"secondary-dark-1": "#2563eb",
				"secondary-dark-2": "#1d4ed8",
				"secondary-dark-3": "#1e40af",
				"secondary-dark-4": "#1e3a8a",
				"secondary-light-1": "#60a5fa",
				"secondary-light-2": "#93c5fd",
				"secondary-light-3": "#bfdbfe",
				"secondary-light-4": "#dbeafe",
				"warning-base": "#f59e0b",
				"warning-dark-1": "#d97706",
				"warning-dark-2": "#b45309",
				"warning-dark-3": "#92400e",
				"warning-dark-4": "#78350f",
				"warning-light-1": "#fbbf24",
				"warning-light-2": "#fcd34d",
				"warning-light-3": "#fde68a",
				"warning-light-4": "#fef3c7",
				"danger-base": "#ef4444",
				"danger-dark-1": "#dc2626",
				"danger-dark-2": "#b91c1c",
				"danger-dark-3": "#991b1b",
				"danger-dark-4": "#7f1d1d",
				"danger-light-1": "#f87171",
				"danger-light-2": "#fca5a5",
				"danger-light-3": "#fecaca",
				"danger-light-4": "#fee2e2",
				"text-base": "#e2e8f0",
				"text-dark-1": "#0f172a",
				"text-dark-2": "#020617",
				"text-light-1": "#475569",
				"text-light-2": "#64748b",
				"text-light-3": "#94a3b8",
				"text-light-4": "#e2e8f0",
				"background": "#0f172a",
				"background-dark-1": "#020617",
				"background-dark-2": "#94a3b8",
				"background-light-1": "#1e293b",
				"background-light-2": "#334155",
				"border-base": "#cbd5e1"
			},
		})
	]
} satisfies Config;
