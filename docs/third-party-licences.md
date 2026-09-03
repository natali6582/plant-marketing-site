# Third-party licences

Everything third-party that ships in the built site is listed here. Anything
added later that reaches a visitor belongs in this file too.

## Phosphor Icons — icons

Every icon on the site comes from Phosphor. The geometry is copied into
`src/data/icons-duotone.ts` by `scripts/build-duotone-icons.mjs`, taken verbatim
from `@phosphor-icons/core` v2.1.1; the package itself is not a dependency and
nothing is fetched from a CDN at runtime.

Each icon is two layers — a solid `fill` glyph plus one accent element, which is
either a subpath already cut out of that same glyph or the secondary layer of the
icon's `duotone` weight. One accent (the puzzle tab) is drawn by hand because the
glyph offered no cut-out to borrow.

Home: https://phosphoricons.com — Source: https://github.com/phosphor-icons/core

```
MIT License

Copyright (c) 2023 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Lucide, which the previous outline icons came from, is no longer used: its data
file was removed when the duotone set replaced it.

## Heebo — typeface

Heebo is served from Google Fonts and is licensed under the SIL Open Font
License 1.1. https://fonts.google.com/specimen/Heebo
