// Version: 1.0.0
// Description: A simple Obsidian plugin to convert local image links to markdown format.
/*
MIT License

Copyright (c) 2025 Zhu Tianda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation ...
[rest of the MIT license text]
*/
import { App, Plugin, TFile, Menu, Notice, PluginSettingTab, Setting, Editor, MarkdownView } from 'obsidian';
import { convertImageLinksInContent, convertLocalImageLink } from './utils/image-converter';

interface PluginSettings {
    baseExternalURL: string;
    showNotifications: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
    baseExternalURL: '',
    showNotifications: true
};

export default class ConvertLocalImagesPlugin extends Plugin {
    settings: PluginSettings =DEFAULT_SETTINGS;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new ConvertLocalImagesSettingTab(this.app, this));

        this.addRibbonIcon('image', 'Convert Image Links', async () => {
            await this.convertLocalImages();
            if (this.settings.showNotifications) {
                new Notice('Finished converting all image links');
            }
        });

        this.addCommand({
            id: 'convert-local-images',
            name: 'Convert Obsidian local image link to md format',
            callback: async () => {
                await this.convertLocalImages();
            }
        });

        this.registerEvent(
            this.app.workspace.on('file-menu', (menu, file) => {
                console.log('File menu opened', file); // Add this line
                if (file instanceof TFile && file.extension === 'md') {
                    console.log('Adding menu item for', file.name); // Add this line
                    menu.addItem((item) => {
                        item.setTitle('Convert Obsidian image link to md format')
                            .setIcon('image')
                            .onClick(() => this.convertSingleFile(file));
                    });
                }
            })
        );

        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor, view) => {
                const selectedText = editor.getSelection();
                const imageLinkRegex = /!\[\[(.*?)\]\]/;
                const match = selectedText.match(imageLinkRegex);

                if (match) {
                    const imagePath = match[1];
                    menu.addItem((item) => {
                        item.setTitle('Convert selected image link')
                            .setIcon('image')
                            .onClick(() => {
                                const convertedLink = convertLocalImageLink(imagePath, this.settings.baseExternalURL);
                                editor.replaceSelection(convertedLink);
                                new Notice('Converted selected image link');
                            });
                    });
                }
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async convertSingleFile(file: TFile) {
        let content = await this.app.vault.read(file);
        const updatedContent = convertImageLinksInContent(content, this.settings.baseExternalURL);

        if (content !== updatedContent) {
            await this.app.vault.modify(file, updatedContent);
            new Notice(`✅ Converted image links in: ${file.name}`);
            console.log(`✅ Converted image links in: ${file.path}`);
        } else {
            new Notice('No image links to convert in this file');
        }
    }

    async convertLocalImages() {
        const files = this.app.vault.getMarkdownFiles();

        for (const file of files) {
            let content = await this.app.vault.read(file);
            const updatedContent = convertImageLinksInContent(content, this.settings.baseExternalURL);

            if (content !== updatedContent) {
                await this.app.vault.modify(file, updatedContent);
                console.log(`✅ Converted image links in: ${file.path}`);
            }
        }
    }
}

class ConvertLocalImagesSettingTab extends PluginSettingTab {
    plugin: ConvertLocalImagesPlugin;

    constructor(app: App, plugin: ConvertLocalImagesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Image Converter Settings' });

        new Setting(containerEl)
            .setName('Base External URL')
            .setDesc('The base URL for external image links. Leave blank for standard markdown links.')
            .addText(text => text
                .setPlaceholder('https://cdn.example.com')
                .setValue(this.plugin.settings.baseExternalURL)
                .onChange(async (value) => {
                    this.plugin.settings.baseExternalURL = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Notifications')
            .setDesc('Show notification when conversion is complete')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showNotifications)
                .onChange(async (value) => {
                    this.plugin.settings.showNotifications = value;
                    await this.plugin.saveSettings();
                }));
    }
}