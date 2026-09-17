# OCUPA: Space Finder

Create the initial frontend for a web application called "OCUPA".

OCUPA is a marketplace for underutilized physical spaces. The platform connects people who have unused or partially unused spaces with people who temporarily need a place for activities such as storage, work, photography, small workshops, study, parking, or creative activities.

Tagline:

"Todo espaço pode ter uma função."

IMPORTANT:

This is the FRONTEND ONLY.

Do not implement a backend, database, Supabase, real authentication, real payments, or external APIs yet.

Use realistic mock data and local state where necessary.

TECHNOLOGY:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui

- Lucide icons

- Responsive, mobile-first architecture

- Component-based architecture

- Keep the code clean and reusable because a Django REST API will be connected later.

VISUAL DIRECTION:

Create a sophisticated, modern, urban and editorial visual identity.

Do NOT make it look like a generic real-estate website.

Do NOT use excessive gradients, glassmorphism, or excessive rounded cards.

Color palette:

- Background: #F7F5F0

- Primary text: #242424

- Primary green: #315C4A

- Light green: #DDE7E0

- Terracotta accent: #B96F50

- Neutral gray: #D9D6CE

- White: #FFFFFF

Typography:

- Use a refined serif font for major headlines, similar to DM Serif Display.

- Use a clean sans-serif font such as Inter for interface text.

The visual concept should communicate:

space, usefulness, reuse, urban life, simplicity and human connection.

CREATE THE LANDING PAGE:

Header:

- OCUPA logo/wordmark

- Navigation links:

  Explorar

  Como funciona

  Disponibilizar espaço

- Right side:

  Favoritos

  Entrar

  "Disponibilizar espaço" primary CTA

Hero section:

Large headline:

"Todo espaço pode ter uma função."

Supporting text:

"Encontre lugares disponíveis perto de você para guardar, criar, trabalhar ou realizar o que precisar."

Create a prominent search experience with:

- "O que você precisa fazer?"

- location

- date

- primary CTA "Encontrar espaço"

The main search should feel like the central interaction of the product.

Add a category section titled:

"Encontre um espaço para..."

Categories:

- Armazenar

- Trabalhar

- Fotografar

- Criar

- Guardar

- Produzir

- Ensinar

- Outros

Use elegant icons and compact cards.

Create a "Espaços em destaque" section using realistic mock data.

Create at least 6 fictional spaces:

1. Garagem Central — 18 m² — R$15/dia — Vila Mariana

2. Sala Criativa — 24 m² — R$20/h — Pinheiros

3. Depósito 42 — 12 m² — R$12/dia — Mooca

4. Estúdio Luz — 35 m² — R$35/h — Liberdade

5. Oficina Verde — 28 m² — R$25/h — Saúde

6. Quintal das Árvores — 45 m² — R$30/dia — Lapa

Each space card should show:

- image placeholder

- space name

- neighborhood

- area

- price

- rating

- favorite button

Add a section explaining how OCUPA works:

1. Encontre

2. Reserve

3. Ocupe

Keep the explanation concise and visually elegant.

Add a section for people who have unused spaces:

"Tem um espaço parado?"

"Transforme um espaço que você não está usando em uma oportunidade para alguém."

CTA:

"Disponibilizar meu espaço"

Footer:

- OCUPA

- tagline

- Explorar

- Como funciona

- Disponibilizar espaço

- Termos

- Privacidade

DESIGN REQUIREMENTS:

- Strong visual hierarchy.

- Generous whitespace.

- High-quality responsive layout.

- Elegant hover states.

- Subtle transitions.

- Accessible contrast.

- Avoid unnecessary animations.

- The page should feel like a real startup product, not a student template.

ARCHITECTURE:

Create reusable components such as:

Navbar

SearchBar

CategoryCard

SpaceCard

SpaceGrid

SectionHeader

Footer

Use mock data in a dedicated data structure rather than hardcoding repeated markup.

Do not build the other application pages yet.

Focus on establishing a strong design system and polished landing page that will be reused throughout the application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ocupa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/def3f82b-7c5b-4e5e-b754-7d3774263504).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
