import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--color-bg-base)",
        vote: {
          positive: "var(--color-vote-positive)",
          negative: "var(--color-vote-negative)",
          uncertain: "var(--color-vote-uncertain)",
        },
        state: {
          pending: "var(--color-state-pending)",
          required: "var(--color-state-required)",
          done: "var(--color-state-done)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
        border: {
          default: "var(--color-border-default)",
        },
        admin: {
          ink: "var(--color-admin-ink)",
          success: "var(--color-admin-success)",
          warning: "var(--color-admin-warning)",
          danger: "var(--color-admin-danger)",
          pending: "var(--color-admin-pending)",
        },
        pipeline: {
          pending: "var(--color-pipeline-pending)",
          running: "var(--color-pipeline-running)",
          "gate-required": "var(--color-pipeline-gate-required)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        editorial: ["var(--font-editorial)", "serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
    },
  },
} satisfies Config;

export default config;
