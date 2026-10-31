# Credits

The app ships with original gradient and SVG backgrounds, ambience synthesized in the
browser with the Web Audio API, and a dependency-free completion beep, so no third-party
media is bundled. When you add a third-party image, list it here with its source and
license.

## How to add assets

- **Backgrounds:** drop images in `public/backgrounds/` and add entries to `backgrounds`
  in `src/lib/assets.ts` using `imageBackground('your-file.jpg')`.
- **Ambience:** add a kind to `startAmbience` in `src/lib/ambience.ts` and an entry to
  `tracks` in `src/lib/assets.ts`.

## Vetted free sources (check each item's license page before bundling)

### Images (free for commercial use, no attribution required; StockSnap is CC0)
- Unsplash — https://unsplash.com
- Pexels — https://www.pexels.com
- Pixabay — https://pixabay.com
- StockSnap (CC0) — https://stocksnap.io

### Lofi music
- Pixabay Music (Pixabay License, no attribution) — https://pixabay.com/music/
- Chosic (free; some tracks CC BY — credit required) — https://www.chosic.com/free-music/lofi/
- Free Music Archive (check per-track) — https://freemusicarchive.org
- Incompetech / Kevin MacLeod (CC BY — credit required) — https://incompetech.com

### Nature / ambience sounds
- Freesound (filter to CC0) — https://freesound.org
- Pixabay sound effects — https://pixabay.com/sound-effects/

## License notes

- "Royalty-free" is not the same as "copyright-free" — read each item's terms.
- Avoid CC BY-NC (non-commercial) and CC BY-ND (no-derivatives).
- Site licenses (Pixabay / Unsplash / Pexels) permit use but restrict redistributing an
  asset standalone; a few bundled inside the app is fine.
- Keep the bundle light: 3–5 images, 2–3 tracks; stream the rest if wanted.

## Bundled assets

| Asset | Type | Source | License |
| ----- | ---- | ------ | ------- |
| `public/backgrounds/*.svg` | Image | Original, made for this project | Same as the project |
| Rain, Waves, Brown noise | Audio | Synthesized at runtime | Same as the project |
