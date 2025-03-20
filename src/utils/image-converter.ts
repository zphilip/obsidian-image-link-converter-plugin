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