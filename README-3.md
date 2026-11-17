# থিম সুইচার — মেসার্স সাদ এন্টারপ্রাইজ

Adds a **থিম** button (bottom-right of every page) with three choices:

| Theme | What it is |
|---|---|
| **মূল থিম** | Your current site, exactly as it is today (`css/style.css` is not touched) |
| **এনার্জি** | Your `mssaadenterprisev2` design (red + lime) |
| **ম্যাঙ্গা** | Your `mssaadenterprisev3` design (comic / manga) |

The visitor's choice is remembered (browser `localStorage`), so every page follows it.

## Install (2 steps)

**1. Upload these files into your repository, keeping the folders:**

```
js/theme.js
css/themes/energy.css
css/themes/manga.css
```

**2. Add this one line to every `.html` page, just before `</head>`:**

```html
<script src="js/theme.js"></script>
```

It must come *after* the existing `<link rel="stylesheet" ...>` lines. There are 9 pages
(`index`, `about`, `services`, `complete-construction`, `materials`, `projects`,
`interior`, `contact`, `404`).

*Shortcut:* if you have the site folder on your computer, run
`python3 add-theme-switcher.py path/to/your-site-folder` and it adds the line to all pages
(safe to run twice). Commit and push, then wait a minute for GitHub Pages to update.

## Sharing a theme link

Add `?theme=manga` or `?theme=energy` to any page address, e.g.
`https://saadkamal219.github.io/mssaadenterprise/?theme=manga`
The visitor gets that theme (and it is remembered). `?theme=default` is also accepted.

## Good to know

- **Your real photos and logo are kept in every theme.** The placeholder SVG artwork inside the two
  zips is *not* used. In the red themes the logo image gets a small white rounded background so it stays
  readable on the red header.
- **Home page extras:** the marquee strip, spinning "বিনামূল্যে পরামর্শ" badge, glass cards and 12 / 8 / 1
  numbers strip exist only in the two new themes; `theme.js` adds them on the home page when one is chosen.
  The default theme's home page is unchanged.
- **Editing text:** because the themes reuse your page content, you edit text in one place (your normal pages).
  The few extra home-page sentences in the new themes live inside `js/theme.js`.
- **After changing a theme CSS file**, raise `VER` at the top of `js/theme.js` (e.g. `"1"` → `"2"`) so
  visitors' browsers fetch the new file instead of a cached one.
- **To remove the feature:** delete the `<script src="js/theme.js">` line from the pages. Nothing else changes.
- If a theme file ever fails to load, the page falls back to the default theme instead of breaking.
