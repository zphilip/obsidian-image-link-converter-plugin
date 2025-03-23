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
import { PluginSettingTab, Setting } from "obsidian";

export interface PluginSettings {
  baseExternalURL: string;
}

export class Settings {
  private settings: PluginSettings;

  constructor() {
    this.settings = { baseExternalURL: "https://cdn.example.com" }; // Default value
  }

  loadSettings() {
    // Logic to load settings from storage
  }

  saveSettings() {
    // Logic to save settings to storage
  }

  getSettings(): PluginSettings {
    return this.settings;
  }

  setBaseExternalURL(url: string) {
    this.settings.baseExternalURL = url;
    this.saveSettings();
  }
}

export class ConvertLocalImagesSettingTab extends PluginSettingTab {
  private plugin: any;

  constructor(plugin: any) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Convert Local Images Plugin Settings" });

    new Setting(containerEl)
      .setName("Base External URL")
      .setDesc("Set the base URL for external image links.")
      .addText((text) =>
        text
          .setPlaceholder("Enter base URL")
          .setValue(this.plugin.settings.getSettings().baseExternalURL)
          .onChange(async (value) => {
            this.plugin.settings.setBaseExternalURL(value);
          })
      );
  }
}