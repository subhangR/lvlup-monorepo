# @levelup/shared-hooks

Shared React hooks for the LevelUp unified platform.

## Features

- 🔐 **Auth Hooks**: Firebase authentication state management
- 📦 **Data Hooks**: Firestore and Realtime Database subscriptions
- 🎨 **UI Hooks**: Media queries, debounce, local storage, click outside

## Installation

```bash
pnpm add @levelup/shared-hooks
```

## Usage

### Auth Hooks

```typescript
import { useAuth, useUserId, useUserEmail } from '@levelup/shared-hooks/auth';

function MyComponent() {
  const { user, loading, error, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{isAuthenticated ? `Hello ${user.email}` : 'Not logged in'}</div>;
}

// Get just the user ID
function AnotherComponent() {
  const userId = useUserId();
  return <div>User ID: {userId}</div>;
}
```

### Data Hooks - Firestore

```typescript
import {
  useFirestoreDoc,
  useFirestoreCollection,
} from '@levelup/shared-hooks/data';
import { where, orderBy } from 'firebase/firestore';

// Subscribe to a single document
function StudentProfile({ orgId, studentId }) {
  const { data, loading, error } = useFirestoreDoc(
    orgId,
    'students',
    studentId
  );

  if (loading) return <div>Loading...</div>;
  return <div>{data?.name}</div>;
}

// Subscribe to a collection with query constraints
function StudentList({ orgId, classId }) {
  const { data, loading, error } = useFirestoreCollection(
    orgId,
    'students',
    [where('classId', '==', classId), orderBy('name')]
  );

  return (
    <ul>
      {data.map((student) => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}
```

### Data Hooks - Realtime Database

```typescript
import { useRealtimeDB } from '@levelup/shared-hooks/data';

function Leaderboard({ orgId }) {
  const { data, loading, error } = useRealtimeDB(orgId, 'leaderboard');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Top Score: {data?.topScore}</h2>
    </div>
  );
}
```

### UI Hooks - Media Queries

```typescript
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useMediaQuery,
} from '@levelup/shared-hooks/ui';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  // Custom media query
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

### UI Hooks - Debounce

```typescript
import { useDebounce } from '@levelup/shared-hooks/ui';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // This will only run 500ms after the user stops typing
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

### UI Hooks - Local Storage

```typescript
import { useLocalStorage } from '@levelup/shared-hooks/ui';

function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  );
}
```

### UI Hooks - Click Outside

```typescript
import { useClickOutside } from '@levelup/shared-hooks/ui';
import { useRef, useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}
```

## API Reference

### Auth Hooks

- `useAuth(): { user, loading, error, isAuthenticated }`
- `useUserId(): string | null`
- `useUserEmail(): string | null`

### Data Hooks

- `useFirestoreDoc<T>(orgId, collectionName, docId, options?): { data, loading, error }`
- `useFirestoreCollection<T>(orgId, collectionName, constraints?, options?): { data, loading, error }`
- `useRealtimeDB<T>(orgId, path, options?): { data, loading, error }`

### UI Hooks

- `useMediaQuery(query: string): boolean`
- `useIsMobile(breakpoint?: number): boolean`
- `useIsTablet(minBreakpoint?: number, maxBreakpoint?: number): boolean`
- `useIsDesktop(breakpoint?: number): boolean`
- `usePrefersDarkMode(): boolean`
- `useDebounce<T>(value: T, delay?: number): T`
- `useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void]`
- `useClickOutside<T>(ref: RefObject<T>, handler: (event) => void, enabled?: boolean): void`

## Peer Dependencies

This package requires the following peer dependencies:

- `react` ^18.0.0
- `firebase` ^11.0.0
- `@levelup/shared-services` (for data and auth hooks)
