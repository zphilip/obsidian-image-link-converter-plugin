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
/**
 * Converts Obsidian wikilink image format to standard markdown format
 */
export function convertLocalImageLink(imagePath: string, baseURL: string = ""): string {
  // Convert spaces and special characters properly
  const encodedPath = imagePath.split('/').map(segment => 
    encodeURIComponent(segment)).join('/');
  
  return baseURL ? `![](${baseURL}/${encodedPath})` : `![](/${encodedPath})`;
}

export function convertImageLinksInContent(content: string, baseURL: string = ""): string {
  return content.replace(
    /!\[\[(.*?)\]\]/g,
    (match, imagePath) => convertLocalImageLink(imagePath, baseURL)
  );
}