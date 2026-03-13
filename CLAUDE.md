# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run (dev):** `bun run dev`
- **Format:** `bun run format` (prettier)
- **Format check:** `bun run format:check`

No test suite exists yet.

## Architecture

Hyprview is a TUI (Terminal UI) application for managing Hyprland monitors and workspaces. It uses React 19 + [Ink](https://github.com/vadimdemedes/ink) for rendering in the terminal, with Bun as the runtime.

### Layered structure

**Ports & Adapters:** `hyprland/ports/` defines abstract interfaces; `hyprland/adapters/` holds concrete implementations (e.g., calling `hyprctl` CLI). Wire up via `hyprland/index.ts`.

**Error handling:** All fallible operations use [neverthrow](https://github.com/supermacro/neverthrow) `Result`/`ResultAsync`. Custom error types live in `errors/index.ts` (`TerminalError`, `JsonParseError`, `ConfigError`).

**Theming:** All colors come from a centralized theme system. Components call `useTheme()` from `src/theme/context.tsx` — never hardcode color strings. The default theme is in `src/config/defaults.ts`. At startup, `src/cli.tsx` accepts an optional `--config <file>` flag pointing to a JSON file with a `colors` field, which can be either a [base16](https://github.com/chriskempson/base16) palette (`base00`–`base0F`) or a semantic palette (`primary`, `secondary`, etc.). The resolver in `src/config/resolver.ts` converts either format to `Theme = SemanticColors` before passing it to `ThemeProvider`.

**Data flow:** App → `useMonitors()` hook → `HyprlandQueryPort.getMonitors()` → `hyprctlQueryAdapter` → runs `hyprctl monitors -j` → parsed into `Monitor[]`.

### Key conventions

- Prettier: single quotes, 2-space indent, 100-char line width, trailing commas (`all`)
- ESNext + strict TypeScript, bundler module resolution
- Each new Hyprland query should have a port interface + adapter, following the existing monitor pattern
