# Typography handoff — The Astral Archives

## Approved family roles
- **Orbitron** (500/600/700): game logo-like title and room/major headings only. Keep original logo artwork intact; this is UI typography, not a replacement logo.
- **IBM Plex Sans** (400/500/600/700): English text, evidence card names, buttons, navigation, descriptions.
- **IBM Plex Mono** (400/500/600): evidence IDs, timestamps, numerical readings, source metadata and technical labels. Set numerical text to LTR even in RTL layouts.
- **IBM Plex Sans Arabic** (400/500/600/700): Arabic localized UI. Never force Orbitron or Plex Mono for Arabic prose.

## Usage
Import `typography.css` from the main application stylesheet. Font loading uses Google Fonts over the network; for offline play, obtain and self-host the appropriate webfont assets yourself in compliance with their license (font files are NOT included here). Use fallback fonts until loaded. Never convert UI text or scientific data into flat images.

## Size tokens (desktop baseline)
- Game display: 44px / 600 / letter spacing 0.08em
- Room heading: 28px / 600
- Panel heading: 20px / 600
- Evidence card title: 18px / 600
- Body: 16px / 400, line-height 1.5
- Supporting caption: 14px / 400
- Data/IDs: 13px / 500, tabular numbers
- Buttons: 15px / 600
- Arabic body: 16px / 400, line-height 1.7

## QA
- Verify desktop and mobile truncation without hiding source IDs.
- Check numeric strings on Arabic screens; use `dir="ltr"` for raw telemetry and timestamps.
- Avoid all-caps paragraphs, excessive Orbitron usage, fake NASA records, or baked-in text in final evidence cards.
- SVG/PNG evidence imagery are concept assets, not editable real-data interfaces.
