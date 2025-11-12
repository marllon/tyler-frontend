# Tyler Project - Frontend

Modern, responsive Vue 3 application for the Tyler charitable platform.

## 🎨 Overview

This is the frontend application built with Vue 3, TypeScript, and Tailwind CSS. It provides both public-facing pages for donations and raffles, as well as a complete admin panel for content management.

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Date Handling**: Native JavaScript Date API
- **Formatting**: Custom composables (currency, date)

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, global CSS
│   │   └── main.css   # Global styles with Tailwind
│   │
│   ├── components/     # Vue components
│   │   ├── ui/        # Reusable UI microcomponents
│   │   │   ├── Avatar.vue
│   │   │   ├── Badge.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── Dropdown.vue
│   │   │   ├── DropdownItem.vue
│   │   │   ├── ImageGallery.vue    # Image carousel
│   │   │   ├── ProgressBar.vue
│   │   │   ├── Skeleton.vue
│   │   │   ├── Spinner.vue
│   │   │   ├── ToastContainer.vue
│   │   │   └── index.ts           # Barrel export
│   │   │
│   │   ├── admin/     # Admin-specific components
│   │   │   └── AdminHeader.vue
│   │   │
│   │   ├── BarraProgressoMeta.vue  # Goal progress bar
│   │   ├── CardEvento.vue          # Event card
│   │   ├── CardProduto.vue         # Product card
│   │   ├── CardRifa.vue            # Raffle card
│   │   ├── Footer.vue
│   │   └── Header.vue
│   │
│   ├── composables/    # Reusable composition functions
│   │   ├── index.ts
│   │   ├── useCurrency.ts  # Currency formatting (R$)
│   │   ├── useDate.ts      # Date formatting
│   │   ├── useLoading.ts   # Loading state management
│   │   └── useToast.ts     # Toast notifications
│   │
│   ├── layouts/        # Layout wrappers
│   │   ├── AdminLayout.vue    # Admin panel layout
│   │   └── DefaultLayout.vue  # Public pages layout
│   │
│   ├── router/         # Vue Router configuration
│   │   └── index.ts    # Routes and navigation guards
│   │
│   ├── stores/         # Pinia stores
│   │   ├── auth.ts     # Authentication state
│   │   ├── events.ts   # Events management
│   │   ├── goals.ts    # Fundraising goals
│   │   ├── products.ts # Products catalog
│   │   └── raffles.ts  # Raffles system
│   │
│   ├── types/          # TypeScript definitions
│   │   └── index.ts    # All type definitions
│   │
│   ├── utils/          # Utility functions
│   │   └── api.ts      # Axios instance and interceptors
│   │
│   ├── views/          # Page components
│   │   ├── About.vue
│   │   ├── Contact.vue
│   │   ├── Events.vue
│   │   ├── Goals.vue
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   ├── Raffles.vue
│   │   └── admin/      # Admin pages
│   │       ├── Dashboard.vue   # Statistics dashboard
│   │       ├── Donations.vue   # Donations management
│   │       ├── Events.vue      # Events CRUD
│   │       ├── Goals.vue       # Goals CRUD
│   │       ├── Login.vue       # Admin login
│   │       ├── Orders.vue      # Orders management
│   │       ├── Products.vue    # Products CRUD
│   │       └── Raffles.vue     # Raffles CRUD
│   │
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
│
├── .env.example        # Environment variables template
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your configuration**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

### Development

```bash
# Start development server
npm run dev

# Development server will run on http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## 🎨 Design System

### Colors

```css
/* Primary Colors */
--tyler-blue: #5cb6f9; /* Hope and lightness */
--tyler-pink: #fba5a4; /* Care and affection */

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--info: #3b82f6;

/* Neutral */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### Typography

- Font Family: System fonts (Inter, SF Pro, Helvetica)
- Base Size: 16px
- Scale: xs (12px) → sm (14px) → base (16px) → lg (18px) → xl (20px) → 2xl (24px) → 3xl (30px)

### Spacing

Based on Tailwind's 4px scale:

- xs: 4px (1)
- sm: 8px (2)
- md: 16px (4)
- lg: 24px (6)
- xl: 32px (8)

## 🧩 Components

### Microcomponents (src/components/ui/)

All microcomponents follow a consistent API pattern:

```vue
<!-- BaseButton -->
<BaseButton
  variant="primary | outline | danger"
  size="sm | md | lg"
  :loading="boolean"
  :disabled="boolean"
>
  Click me
</BaseButton>

<!-- BaseInput -->
<BaseInput
  v-model="value"
  label="Label"
  type="text | email | number | textarea | date | url"
  :error="errorMessage"
  hint="Helper text"
  :required="boolean"
/>

<!-- Badge -->
<Badge variant="success | warning | danger | default" size="sm | md">
  Status
</Badge>

<!-- ProgressBar -->
<ProgressBar :progress="75" color="blue | pink" size="sm | md | lg" />

<!-- ImageGallery -->
<ImageGallery
  :images="['url1', 'url2', 'url3']"
  :show-thumbnails="true"
  :auto-play="false"
  :interval="3000"
/>
```

See [MICROCOMPONENTS.md](./MICROCOMPONENTS.md) for detailed documentation.

## 🔄 State Management

### Pinia Stores

All stores follow this pattern:

```typescript
export const useXStore = defineStore("storeName", () => {
  // State
  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchItems() {
    loading.value = true;
    error.value = null;
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 700));
      // Use dummy data or API call
      items.value = DUMMY_DATA;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // Getters (computed)
  const activeItems = computed(() => items.value.filter((item) => item.active));

  return {
    items,
    loading,
    error,
    fetchItems,
    activeItems,
  };
});
```

### Available Stores

- **useAuthStore**: Authentication state and methods
- **useProductsStore**: Products catalog management
- **useGoalsStore**: Fundraising goals tracking
- **useRafflesStore**: Raffle system with ticket management
- **useEventsStore**: Events calendar and registration

## 🎯 Composables

### useCurrency

```typescript
import { useCurrency } from "@/composables";

const { formatCurrency } = useCurrency();
const price = formatCurrency(59.9); // "R$ 59,90"
```

### useDate

```typescript
import { useDate } from "@/composables";

const { formatDate, formatDateTime, formatRelative } = useDate();
const date = formatDate("2024-12-25"); // "25/12/2024"
```

### useToast

```typescript
import { useToast } from "@/composables";

const { success, error, warning, info } = useToast();
success("Item saved successfully!");
error("Failed to delete item");
```

### useLoading

```typescript
import { useLoading } from "@/composables";

const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

// Wrap async operations
await withLoading(async () => {
  await someAsyncOperation();
});
```

## 🛣️ Routing

### Public Routes

- `/` - Home
- `/products` - Products catalog
- `/goals` - Fundraising goals
- `/raffles` - Active raffles
- `/events` - Events calendar
- `/about` - About page
- `/contact` - Contact form

### Admin Routes (Protected)

- `/admin/login` - Admin login
- `/admin/dashboard` - Statistics dashboard
- `/admin/products` - Products CRUD
- `/admin/goals` - Goals CRUD
- `/admin/raffles` - Raffles CRUD
- `/admin/events` - Events CRUD
- `/admin/orders` - Orders management
- `/admin/donations` - Donations management

### Navigation Guards

```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/admin/login");
  } else {
    next();
  }
});
```

## 🎭 Features

### Public Pages

- **Responsive Design**: Mobile-first approach
- **Image Galleries**: Multi-image carousels for raffles
- **Progress Tracking**: Visual progress bars for goals
- **Event Registration**: Register for upcoming events
- **Product Catalog**: Browse and view products
- **Donation System**: Make direct donations

### Admin Panel

- **Dashboard**: Real-time statistics and analytics
- **Full CRUD**: Complete content management
- **Multi-Image Upload**: Support for multiple images per raffle
- **Photo Galleries**: Unlimited photos for completed events
- **Form Validation**: Client-side validation
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Spinner indicators
- **Preview System**: Live image previews
- **Status Management**: Active/inactive toggles

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder via Netlify CLI or drag-and-drop
```

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 🔧 Configuration

### Vite Config (vite.config.ts)

```typescript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

### Tailwind Config (tailwind.config.js)

```javascript
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tyler-blue": "#5CB6F9",
        "tyler-pink": "#FBA5A4",
      },
    },
  },
};
```

## 📚 Additional Documentation

- [Microcomponents Guide](./MICROCOMPONENTS.md) - UI components documentation
- [Main README](../README.md) - Overall project documentation
- [Admin Area Guide](../ADMIN_AREA.md) - Admin panel documentation
- [Dummy Data Reference](../DUMMY_DATA.md) - Development data

## 🤝 Contributing

1. Follow Vue 3 style guide
2. Use TypeScript strict mode
3. Use Composition API over Options API
4. Extract reusable logic into composables
5. Keep components small and focused
6. Add proper TypeScript types
7. Write meaningful commit messages

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details.

---

**Built with ❤️ using Vue 3, TypeScript, and Tailwind CSS**
