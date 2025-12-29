### Project Guidelines: Repeater

#### 1. General Principles
- **Mobile-First**: Design and implement for mobile screens first. Ensure touch targets are at least 44x44px. Use Tailwind's responsive prefixes only for larger screen adaptations.
- **Simplicity**: Focus on an intuitive interface for interval timing. Minimize distractions.
- **Performance**: Ensure timer accuracy and smooth UI transitions.

#### 2. Technical Stack
- **Framework**: React 19 with Vite.
- **Styling**: Tailwind CSS 4.
- **UI Components**: shadcn/ui (Radix UI).
- **Icons**: Lucide React.
- **Type Safety**: TypeScript.

#### 3. Project Structure
- `src/components/ui`: Base UI components from shadcn/ui.
- `src/components`: Application-specific components (e.g., `TimerDisplay`, `Controls`).
- `src/hooks`: Custom React hooks (e.g., `useTimer`, `useLocalStorage`).
- `src/lib`: Shared utilities (e.g., `utils.ts` for `cn`).
- `src/types`: TypeScript definitions and interfaces.

#### 4. Coding Standards
- **Components**: Functional components with TypeScript. Prefer `const ComponentName = () => {}` over `function ComponentName() {}`.
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `TimerCard.tsx`).
  - Variables/Functions: `camelCase` (e.g., `startTimer`).
  - Constants: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_INTERVAL`).
- **Tailwind CSS**: Use the `cn()` utility for conditional classes. Follow the established ordering (layout, spacing, typography, etc.).
- **Props**: Always define types for component props.

#### 5. shadcn/ui Integration
- Component installation: `npx shadcn@latest add <component>`.
- Modifications: If a shadcn component needs project-specific changes, apply them directly in `src/components/ui`.
- Theming: Use the CSS variables in `src/index.css` for consistent colors and radii.

#### 6. Timer Implementation Guidelines
- **Logic**: Use `useEffect` and `setInterval` carefully, ensuring intervals are cleared on unmount.
- **State Management**: Keep the active timer state as close to the top as needed, or use a Context if shared across many components.
- **Visibility**: Be aware that `setInterval` may throttle when the tab is in the background.
- **Feedback**: Consider adding sound or haptic feedback (using the Vibration API) when an interval finishes.

#### 7. UI & Animations
- **Animations**: Use `tw-animate-css` or standard Tailwind transitions for smooth state changes. Keep animations purposeful and not distracting.
- **Consistency**: Use shadcn/ui variants to maintain a consistent look and feel across the application.

#### 8. Accessibility (A11y)
- Use semantic HTML (`<main>`, `<section>`, `<button>`, `<time>`).
- Ensure high contrast ratios for text.
- Provide clear visual focus indicators.
- Use ARIA labels for icon-only buttons.

#### 9. Performance
- Minimize unnecessary re-renders during active timing.
