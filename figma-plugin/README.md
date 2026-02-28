# Liquid Glass Studio – Figma Plugin

A Figma plugin that lets you generate and apply the **Liquid Glass** WebGL effect directly to your Figma layers.

## What it does

The plugin renders the same physics-based glass effect as the Liquid Glass Studio web app (refraction, Fresnel highlights, glare, Gaussian blur, chromatic dispersion) and exports it as a PNG image fill onto any Figma layer or a new rectangle.

## Installation (development / sideload)

1. Open Figma Desktop.
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select the `manifest.json` file inside this `figma-plugin/` directory.
4. The plugin will now appear under **Plugins → Development → Liquid Glass Studio**.

## Usage

1. Run the plugin from **Plugins → Development → Liquid Glass Studio**.
2. A panel opens with a live WebGL preview and controls.
3. **Move your cursor** over the preview canvas to position the glass shape.
4. Adjust any of the controls:
   - **Export Size** – pixel dimensions of the exported image.
   - **Shape** – width, height, corner radius, roundness, and whether to show the merging blob.
   - **Background** – choose a pattern (checkerboard, bars, half) or upload a custom image.
   - **Refraction / Fresnel / Glare / Tint / Shadow** – fine-tune the glass look.
5. Click **"Apply to Selection"** to apply the rendered image as a fill on the currently selected Figma layer, resized to match the export dimensions.
6. Click **"Insert New Layer"** to create a new rectangle at the viewport center with the glass fill.

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Figma plugin metadata |
| `code.js` | Plugin sandbox code – runs in Figma's JS environment, handles `figma.*` API calls |
| `ui.html` | Self-contained plugin UI – WebGL renderer with all shaders inlined, controls, and Figma messaging |

## Notes

- The plugin uses **WebGL 2** and requires the `EXT_color_buffer_float` extension (available in all modern browsers that Figma Desktop uses).
- Export sizes up to **1000 × 1000 px** are supported via the sliders; larger sizes may be entered by editing the HTML.
- The exported PNG includes the background; it is applied as a `FILL` image on the target layer.
- No network requests are made; everything runs locally in the plugin iframe.
