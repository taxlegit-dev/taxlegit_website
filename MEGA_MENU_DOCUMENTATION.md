# Dynamic Mega-Menu Navbar Documentation

## Overview

This project includes a fully dynamic mega-menu navbar system built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. The navbar supports multiple regions (INDIA and US) and allows complete CRUD operations through an admin panel.

## Features

✅ **100% Dynamic** - All menu items stored in PostgreSQL via Prisma  
✅ **Multi-Region Support** - Separate menus for INDIA and US regions  
✅ **Mega-Menu Design** - Large dropdowns with grouped submenus  
✅ **Responsive** - Desktop hover mega-menu, mobile accordion-style  
✅ **Full CRUD** - Create, Read, Update, Delete menu items  
✅ **Reordering** - Change order of menus and submenus  
✅ **Groups/Wrappers** - Group submenu items under labels (e.g., "Company Registration")  
✅ **Auto-Update** - Navbar automatically updates when admin makes changes

## Database Schema

### NavbarItem Model

```prisma
model NavbarItem {
  id          String          @id @default(cuid())
  label       String
  href        String?
  order       Int             @default(0)
  type        NavbarItemType  @default(LINK)
  isLoginLink Boolean         @default(false)
  isActive    Boolean         @default(true)
  region      Region          @default(INDIA)
  parentId    String?         // For nested menu items
  groupLabel  String?         // For grouping submenu items
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  parent   NavbarItem? @relation("NavbarHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children NavbarItem[] @relation("NavbarHierarchy")
}
```

### Menu Structure Example

```
Top Menu: Start A Business (DROPDOWN)
  ├─ Group: Company Registration
  │   ├─ Private Limited Company Registration
  │   ├─ LLP Registration
  │   ├─ OPC Registration
  │   ├─ Section 8 Registration
  │   └─ Sole Proprietorship Registration
  └─ Group: Compliance and Licensing
      ├─ ISO Registration
      ├─ FSSAI Registration
      └─ ISP License Registration
```

## API Routes

### Public API

**GET `/api/navbar?region=INDIA`**  
Fetches navbar items for a specific region (public endpoint)

**Response:**

```json
{
  "items": [
    {
      "id": "xxx",
      "label": "Start A Business",
      "href": null,
      "type": "DROPDOWN",
      "order": 0,
      "groups": [
        {
          "label": "Company Registration",
          "items": [
            {
              "id": "yyy",
              "label": "Private Limited Company Registration",
              "href": "/services/...",
              "order": 0
            }
          ]
        }
      ]
    }
  ],
  "region": "INDIA"
}
```

### Admin API

**GET `/api/admin/navbar?region=INDIA`**  
Fetches all navbar items for admin (includes inactive items)

**POST `/api/admin/navbar`**  
Creates a new navbar item

**Request Body:**

```json
{
  "label": "Start A Business",
  "href": null,
  "order": 0,
  "type": "DROPDOWN",
  "region": "INDIA",
  "parentId": null,
  "groupLabel": null,
  "isLoginLink": false
}
```

**PUT `/api/admin/navbar`**  
Updates an existing navbar item

**Request Body:**

```json
{
  "id": "xxx",
  "label": "Updated Label",
  "href": "/new-path",
  "order": 1,
  "type": "LINK",
  "region": "INDIA",
  "isActive": true,
  "parentId": null,
  "groupLabel": null
}
```

**DELETE `/api/admin/navbar?id=xxx`**  
Deletes a navbar item (cascades to children)

**PATCH `/api/admin/navbar`**  
Reorders navbar items

**Request Body:**

```json
{
  "items": [
    { "id": "xxx", "order": 0 },
    { "id": "yyy", "order": 1 }
  ],
  "region": "INDIA"
}
```

## Components

### NavbarServer (Server Component)

Located at: `components/navigation/navbar-server.tsx`

Fetches navbar data from the database and passes it to the client component.

**Usage:**

```tsx
import { NavbarServer } from "@/components/navigation/navbar-server";

<NavbarServer region={Region.INDIA} />;
```

### MegaNavbar (Client Component)

Located at: `components/navigation/mega-navbar.tsx`

Renders the responsive mega-menu navbar with:

- Desktop: Hover-activated mega-menu dropdowns
- Mobile: Accordion-style menu

### NavMenuManager (Admin Component)

Located at: `components/admin/nav-menu-manager.tsx`

Full-featured admin panel for managing navbar items with:

- Create new menu items
- Edit existing items
- Delete items
- Set parent-child relationships
- Add group labels for submenu organization
- Reorder items

## Admin Panel

Access the admin panel at: `/admin/navigation?region=INDIA`

Features:

- Region selector (INDIA/US)
- Create form for new menu items
- Edit form (appears when editing)
- Hierarchical display of menu structure
- Delete confirmation
- Order management

## Seeding Data

Run the seed file to populate initial menu data:

```bash
npx prisma db seed
```

The seed file includes example menus for both INDIA and US regions with the mega-menu structure.

## Setup Instructions

1. **Update Prisma Schema:**

   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

3. **Seed Database:**

   ```bash
   npx prisma db seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## File Structure

```
├── app/
│   ├── api/
│   │   ├── navbar/
│   │   │   └── route.ts          # Public navbar API
│   │   └── admin/
│   │       └── navbar/
│   │           └── route.ts      # Admin CRUD API
│   └── admin/
│       └── navigation/
│           └── page.tsx          # Admin panel page
├── components/
│   ├── navigation/
│   │   ├── mega-navbar.tsx       # Client mega-menu component
│   │   └── navbar-server.tsx     # Server wrapper component
│   └── admin/
│       └── nav-menu-manager.tsx  # Admin UI component
├── lib/
│   └── validators.ts             # Zod schemas for validation
└── prisma/
    ├── schema.prisma             # Database schema
    └── seed.ts                   # Seed data
```

## Usage Examples

### Creating a Top-Level Menu Item

```typescript
// In admin panel or via API
{
  "label": "Services",
  "href": "/services",
  "order": 1,
  "type": "LINK",
  "region": "INDIA"
}
```

### Creating a Dropdown Menu with Groups

1. Create the parent dropdown:

```json
{
  "label": "Start A Business",
  "href": null,
  "order": 0,
  "type": "DROPDOWN",
  "region": "INDIA"
}
```

2. Create child items with groupLabel:

```json
{
  "label": "Private Limited Company Registration",
  "href": "/services/company-registration/private-limited",
  "order": 0,
  "type": "LINK",
  "region": "INDIA",
  "parentId": "<parent-id>",
  "groupLabel": "Company Registration"
}
```

## Best Practices

1. **Order Management**: Use sequential order values (0, 1, 2...) for easy reordering
2. **Group Labels**: Use consistent group labels for items that should appear together
3. **Active State**: Set `isActive: false` to hide items without deleting them
4. **Region Consistency**: Ensure parent and child items are in the same region
5. **Cascade Deletes**: Deleting a parent item will delete all children

## Troubleshooting

**Menu not updating?**

- Check if items have `isActive: true`
- Verify region matches current page region
- Clear browser cache

**Dropdown not showing?**

- Ensure parent item has `type: "DROPDOWN"`
- Verify children have correct `parentId`
- Check that children have `isActive: true`

**Group labels not appearing?**

- Ensure child items have `groupLabel` set
- Items without `groupLabel` will appear in a "default" group
