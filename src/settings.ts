// Version: 0.0.1
// Description: A simple Obsidian plugin to convert local image links to markdown format.
/*
Copyright 2025 Zhu Tianda

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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