# javigallostra.github.io

Personal website. Built with Jekyll, served by GitHub Pages at
[www.javigallostra.com](https://www.javigallostra.com).

## Adding a book

Create a file in `_books/`, named after the book's slug — e.g.
`_books/the-name-of-the-wind.md`:

```markdown
---
title: The Name of the Wind
author: Patrick Rothfuss
finished: 2026-05-21
rating: 8
categories: [fantasy]
---
Notes go here, as markdown. They can run to several paragraphs.
```

All five front matter fields are required:

| Field | Notes |
| --- | --- |
| `title` | string |
| `author` | string |
| `finished` | `YYYY-MM-DD`, **unquoted** so YAML reads it as a date |
| `rating` | integer, 1–10 |
| `categories` | always a bracketed list, even for one value: `[tech]` |

Optional:

| Field | Notes |
| --- | --- |
| `notes_lang` | BCP 47 code for the language of the notes, e.g. `es`. Sets `lang` on the notes cell so screen readers pronounce them correctly and browsers offer to translate. It applies to the notes only, not the title. Omit when the notes are in English. |

The body is the notes, and may use markdown. The table sorts newest-first and
picks up new categories automatically.

Commit and push — GitHub Pages rebuilds the table.

## Local development

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

`script/` and `docs/` are gitignored: they hold local-only test harnesses and
design notes, and have no effect on the published site. GitHub Pages runs
`jekyll build` and nothing else.

## Layouts

No theme is configured. Note that the `github-pages` gem silently falls back
to `jekyll-theme-primer` for any layout the site does not define, so all
layouts in use are defined locally in `_layouts/`: `default`, `home`, `page`,
`post`, `books`.
