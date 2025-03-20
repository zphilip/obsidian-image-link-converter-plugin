"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ConvertLocalImagesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/utils/image-converter.ts
function convertLocalImageLink(imagePath, baseURL = "") {
  const encodedPath = imagePath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return baseURL ? `![](${baseURL}/${encodedPath})` : `![](/${encodedPath})`;
}
function convertImageLinksInContent(content, baseURL = "") {
  return content.replace(
    /!\[\[(.*?)\]\]/g,
    (match, imagePath) => convertLocalImageLink(imagePath, baseURL)
  );
}

// src/main.ts
var DEFAULT_SETTINGS = {
  baseExternalURL: "",
  showNotifications: true
};
var ConvertLocalImagesPlugin = class extends import_obsidian.Plugin {
  settings = DEFAULT_SETTINGS;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ConvertLocalImagesSettingTab(this.app, this));
    this.addRibbonIcon("image", "Convert Image Links", async () => {
      await this.convertLocalImages();
      if (this.settings.showNotifications) {
        new import_obsidian.Notice("Finished converting all image links");
      }
    });
    this.addCommand({
      id: "convert-local-images",
      name: "Convert Obsidian local image link to md format",
      callback: async () => {
        await this.convertLocalImages();
      }
    });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        console.log("File menu opened", file);
        if (file instanceof import_obsidian.TFile && file.extension === "md") {
          console.log("Adding menu item for", file.name);
          menu.addItem((item) => {
            item.setTitle("Convert Obsidian image link to md format").setIcon("image").onClick(() => this.convertSingleFile(file));
          });
        }
      })
    );
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        const selectedText = editor.getSelection();
        const imageLinkRegex = /!\[\[(.*?)\]\]/;
        const match = selectedText.match(imageLinkRegex);
        if (match) {
          const imagePath = match[1];
          menu.addItem((item) => {
            item.setTitle("Convert selected image link").setIcon("image").onClick(() => {
              const convertedLink = convertLocalImageLink(imagePath, this.settings.baseExternalURL);
              editor.replaceSelection(convertedLink);
              new import_obsidian.Notice("Converted selected image link");
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
  async convertSingleFile(file) {
    let content = await this.app.vault.read(file);
    const updatedContent = convertImageLinksInContent(content, this.settings.baseExternalURL);
    if (content !== updatedContent) {
      await this.app.vault.modify(file, updatedContent);
      new import_obsidian.Notice(`\u2705 Converted image links in: ${file.name}`);
      console.log(`\u2705 Converted image links in: ${file.path}`);
    } else {
      new import_obsidian.Notice("No image links to convert in this file");
    }
  }
  async convertLocalImages() {
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      let content = await this.app.vault.read(file);
      const updatedContent = convertImageLinksInContent(content, this.settings.baseExternalURL);
      if (content !== updatedContent) {
        await this.app.vault.modify(file, updatedContent);
        console.log(`\u2705 Converted image links in: ${file.path}`);
      }
    }
  }
};
var ConvertLocalImagesSettingTab = class extends import_obsidian.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Image Converter Settings" });
    new import_obsidian.Setting(containerEl).setName("Base External URL").setDesc("The base URL for external image links. Leave blank for standard markdown links.").addText((text) => text.setPlaceholder("https://cdn.example.com").setValue(this.plugin.settings.baseExternalURL).onChange(async (value) => {
      this.plugin.settings.baseExternalURL = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Show Notifications").setDesc("Show notification when conversion is complete").addToggle((toggle) => toggle.setValue(this.plugin.settings.showNotifications).onChange(async (value) => {
      this.plugin.settings.showNotifications = value;
      await this.plugin.saveSettings();
    }));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3V0aWxzL2ltYWdlLWNvbnZlcnRlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gVmVyc2lvbjogMS4wLjBcbi8vIERlc2NyaXB0aW9uOiBBIHNpbXBsZSBPYnNpZGlhbiBwbHVnaW4gdG8gY29udmVydCBsb2NhbCBpbWFnZSBsaW5rcyB0byBtYXJrZG93biBmb3JtYXQuXG4vKlxuTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDI1IFpodSBUaWFuZGFcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXHUyMDFDU29mdHdhcmVcdTIwMUQpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiAuLi5cbltyZXN0IG9mIHRoZSBNSVQgbGljZW5zZSB0ZXh0XVxuKi9cbmltcG9ydCB7IEFwcCwgUGx1Z2luLCBURmlsZSwgTWVudSwgTm90aWNlLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBFZGl0b3IsIE1hcmtkb3duVmlldyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IGNvbnZlcnRJbWFnZUxpbmtzSW5Db250ZW50LCBjb252ZXJ0TG9jYWxJbWFnZUxpbmsgfSBmcm9tICcuL3V0aWxzL2ltYWdlLWNvbnZlcnRlcic7XG5cbmludGVyZmFjZSBQbHVnaW5TZXR0aW5ncyB7XG4gICAgYmFzZUV4dGVybmFsVVJMOiBzdHJpbmc7XG4gICAgc2hvd05vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFBsdWdpblNldHRpbmdzID0ge1xuICAgIGJhc2VFeHRlcm5hbFVSTDogJycsXG4gICAgc2hvd05vdGlmaWNhdGlvbnM6IHRydWVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnZlcnRMb2NhbEltYWdlc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gICAgc2V0dGluZ3M6IFBsdWdpblNldHRpbmdzID1ERUZBVUxUX1NFVFRJTkdTO1xuXG4gICAgYXN5bmMgb25sb2FkKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQ29udmVydExvY2FsSW1hZ2VzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMuYWRkUmliYm9uSWNvbignaW1hZ2UnLCAnQ29udmVydCBJbWFnZSBMaW5rcycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29udmVydExvY2FsSW1hZ2VzKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93Tm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoJ0ZpbmlzaGVkIGNvbnZlcnRpbmcgYWxsIGltYWdlIGxpbmtzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2NvbnZlcnQtbG9jYWwtaW1hZ2VzJyxcbiAgICAgICAgICAgIG5hbWU6ICdDb252ZXJ0IE9ic2lkaWFuIGxvY2FsIGltYWdlIGxpbmsgdG8gbWQgZm9ybWF0JyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jb252ZXJ0TG9jYWxJbWFnZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW1lbnUnLCAobWVudSwgZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIG1lbnUgb3BlbmVkJywgZmlsZSk7IC8vIEFkZCB0aGlzIGxpbmVcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlICYmIGZpbGUuZXh0ZW5zaW9uID09PSAnbWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgbWVudSBpdGVtIGZvcicsIGZpbGUubmFtZSk7IC8vIEFkZCB0aGlzIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKCdDb252ZXJ0IE9ic2lkaWFuIGltYWdlIGxpbmsgdG8gbWQgZm9ybWF0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbignaW1hZ2UnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuY29udmVydFNpbmdsZUZpbGUoZmlsZSkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbignZWRpdG9yLW1lbnUnLCAobWVudSwgZWRpdG9yLCB2aWV3KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlTGlua1JlZ2V4ID0gLyFcXFtcXFsoLio/KVxcXVxcXS87XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBzZWxlY3RlZFRleHQubWF0Y2goaW1hZ2VMaW5rUmVnZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlUGF0aCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoJ0NvbnZlcnQgc2VsZWN0ZWQgaW1hZ2UgbGluaycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oJ2ltYWdlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZExpbmsgPSBjb252ZXJ0TG9jYWxJbWFnZUxpbmsoaW1hZ2VQYXRoLCB0aGlzLnNldHRpbmdzLmJhc2VFeHRlcm5hbFVSTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGNvbnZlcnRlZExpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKCdDb252ZXJ0ZWQgc2VsZWN0ZWQgaW1hZ2UgbGluaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGFzeW5jIGNvbnZlcnRTaW5nbGVGaWxlKGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZENvbnRlbnQgPSBjb252ZXJ0SW1hZ2VMaW5rc0luQ29udGVudChjb250ZW50LCB0aGlzLnNldHRpbmdzLmJhc2VFeHRlcm5hbFVSTCk7XG5cbiAgICAgICAgaWYgKGNvbnRlbnQgIT09IHVwZGF0ZWRDb250ZW50KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgdXBkYXRlZENvbnRlbnQpO1xuICAgICAgICAgICAgbmV3IE5vdGljZShgXHUyNzA1IENvbnZlcnRlZCBpbWFnZSBsaW5rcyBpbjogJHtmaWxlLm5hbWV9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgXHUyNzA1IENvbnZlcnRlZCBpbWFnZSBsaW5rcyBpbjogJHtmaWxlLnBhdGh9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKCdObyBpbWFnZSBsaW5rcyB0byBjb252ZXJ0IGluIHRoaXMgZmlsZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY29udmVydExvY2FsSW1hZ2VzKCkge1xuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWRDb250ZW50ID0gY29udmVydEltYWdlTGlua3NJbkNvbnRlbnQoY29udGVudCwgdGhpcy5zZXR0aW5ncy5iYXNlRXh0ZXJuYWxVUkwpO1xuXG4gICAgICAgICAgICBpZiAoY29udGVudCAhPT0gdXBkYXRlZENvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgdXBkYXRlZENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBcdTI3MDUgQ29udmVydGVkIGltYWdlIGxpbmtzIGluOiAke2ZpbGUucGF0aH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQ29udmVydExvY2FsSW1hZ2VzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogQ29udmVydExvY2FsSW1hZ2VzUGx1Z2luO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQ29udmVydExvY2FsSW1hZ2VzUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgfVxuXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdJbWFnZSBDb252ZXJ0ZXIgU2V0dGluZ3MnIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0Jhc2UgRXh0ZXJuYWwgVVJMJylcbiAgICAgICAgICAgIC5zZXREZXNjKCdUaGUgYmFzZSBVUkwgZm9yIGV4dGVybmFsIGltYWdlIGxpbmtzLiBMZWF2ZSBibGFuayBmb3Igc3RhbmRhcmQgbWFya2Rvd24gbGlua3MuJylcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignaHR0cHM6Ly9jZG4uZXhhbXBsZS5jb20nKVxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXNlRXh0ZXJuYWxVUkwpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXNlRXh0ZXJuYWxVUkwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ1Nob3cgTm90aWZpY2F0aW9ucycpXG4gICAgICAgICAgICAuc2V0RGVzYygnU2hvdyBub3RpZmljYXRpb24gd2hlbiBjb252ZXJzaW9uIGlzIGNvbXBsZXRlJylcbiAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZVxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93Tm90aWZpY2F0aW9ucylcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOb3RpZmljYXRpb25zID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICB9XG59IiwgIi8vIFZlcnNpb246IDEuMC4wXG4vLyBEZXNjcmlwdGlvbjogQSBzaW1wbGUgT2JzaWRpYW4gcGx1Z2luIHRvIGNvbnZlcnQgbG9jYWwgaW1hZ2UgbGlua3MgdG8gbWFya2Rvd24gZm9ybWF0LlxuLypcbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAyNSBaaHUgVGlhbmRhXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFx1MjAxQ1NvZnR3YXJlXHUyMDFEKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gLi4uXG5bcmVzdCBvZiB0aGUgTUlUIGxpY2Vuc2UgdGV4dF1cbiovXG4vKipcbiAqIENvbnZlcnRzIE9ic2lkaWFuIHdpa2lsaW5rIGltYWdlIGZvcm1hdCB0byBzdGFuZGFyZCBtYXJrZG93biBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRMb2NhbEltYWdlTGluayhpbWFnZVBhdGg6IHN0cmluZywgYmFzZVVSTDogc3RyaW5nID0gXCJcIik6IHN0cmluZyB7XG4gIC8vIENvbnZlcnQgc3BhY2VzIGFuZCBzcGVjaWFsIGNoYXJhY3RlcnMgcHJvcGVybHlcbiAgY29uc3QgZW5jb2RlZFBhdGggPSBpbWFnZVBhdGguc3BsaXQoJy8nKS5tYXAoc2VnbWVudCA9PiBcbiAgICBlbmNvZGVVUklDb21wb25lbnQoc2VnbWVudCkpLmpvaW4oJy8nKTtcbiAgXG4gIHJldHVybiBiYXNlVVJMID8gYCFbXSgke2Jhc2VVUkx9LyR7ZW5jb2RlZFBhdGh9KWAgOiBgIVtdKC8ke2VuY29kZWRQYXRofSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEltYWdlTGlua3NJbkNvbnRlbnQoY29udGVudDogc3RyaW5nLCBiYXNlVVJMOiBzdHJpbmcgPSBcIlwiKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZShcbiAgICAvIVxcW1xcWyguKj8pXFxdXFxdL2csXG4gICAgKG1hdGNoLCBpbWFnZVBhdGgpID0+IGNvbnZlcnRMb2NhbEltYWdlTGluayhpbWFnZVBhdGgsIGJhc2VVUkwpXG4gICk7XG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUEsc0JB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
