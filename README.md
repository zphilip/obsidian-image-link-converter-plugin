# Obsidian Image Converter Plugin

## Overview
The Obsidian Image Converter Plugin is designed to convert local image links in your Obsidian notes to an external format. This allows for easier management and access to images hosted on external servers or CDNs.

## Features
- Converts local image links to external URLs.
- Simple command to trigger the conversion process.
- Customizable base URL for external image hosting.

## Installation
1. Download the plugin files.
2. Place the `obsidian-image-converter-plugin` folder in your Obsidian plugins directory.
3. Enable the plugin in the Obsidian settings under the "Community Plugins" section.

## Usage

- After enabling the plugin, you can convert local image links by executing the command "Convert Obsidian Image Links to Markdown Format" from the command palette (Ctrl+P).

- The plugin also adds a right-click menu option to convert individual image links.

- **Examples:**

  - **Local Conversion (no `baseExternalURL`):**

    The local image link `![[assets/path/to/image.png]]` will be converted to:

    `![](/assets/path/to/image.png)`

    Note how spaces are encoded as `%20`.

  - **External Conversion (with `baseExternalURL` set to `http://example.com`):**

    The local image link `![[assets/path/to/image.png]]` will be converted to:

    `![](http://example.com/assets/path/to/image.png)`

    The `baseExternalURL` is prepended to the encoded path.

## Configuration
You can customize the base external URL in the `src/main.ts` file:
```typescript
const baseExternalURL = "https://cdn.example.com"; // Change this to your actual CDN or external host
```

## Contributing
If you would like to contribute to the development of this plugin, feel free to submit a pull request or open an issue on the repository.

## License

This plugin is released under the Apache 2.0 License. See the `LICENSE` file for details.