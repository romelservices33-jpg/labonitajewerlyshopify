---
name: gluestack-ui-v5
description: Enforces constrained, opinionated styling and architectural patterns for gluestack-ui v5 with NativeWind v5 and Tailwind CSS v4.
---

# gluestack-ui v5 Agent Skill

## Overview
This skill provides comprehensive instructions, patterns, and best practices for developing mobile and web user interfaces with **gluestack-ui v5**, **NativeWind v5**, and **Tailwind CSS v4**.

## Core Principles
1. **Semantic Tokens First**: Always use semantic design tokens and color scales instead of arbitrary hex codes or ad-hoc styles.
2. **Component Props over className**: Prioritize built-in component props (e.g. `size`, `variant`, `action`) before overriding styles with `className`.
3. **Compound Components**: Follow the compound sub-component architecture (e.g., `<Button><ButtonText>...</ButtonText></Button>`).
4. **Copy-Paste Philosophy**: gluestack-ui v5 uses an unbundled, copy-paste component architecture for complete control over design tokens and styles.
5. **Tailwind CSS v4 Integration**: Leverages CSS variables and `global.css` theme configuration rather than legacy `tailwind.config.js`.

## Component Pattern Examples

### Button Component
```tsx
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';

export function ActionButton({ isLoading, title, onPress }) {
  return (
    <Button size="md" variant="solid" action="primary" onPress={onPress} isDisabled={isLoading}>
      {isLoading ? <ButtonSpinner /> : <ButtonText>{title}</ButtonText>}
    </Button>
  );
}
```

### Card & Box Layout
```tsx
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

export function ProductCard({ title, price }) {
  return (
    <Card size="md" variant="elevated" className="m-3 p-4 rounded-2xl bg-background-0">
      <Heading size="md" className="mb-1 text-typography-900">{title}</Heading>
      <Text size="sm" className="text-typography-500">{price}</Text>
    </Card>
  );
}
```

### Styling with TVA (Tailwind Variants)
```tsx
import { tva } from '@gluestack-ui/nativewind-utils/tva';

export const customBadgeStyle = tva({
  base: 'rounded-full px-3 py-1 items-center justify-center',
  variants: {
    action: {
      primary: 'bg-primary-500 text-primary-0',
      success: 'bg-success-500 text-success-0',
      warning: 'bg-warning-500 text-warning-0',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    action: 'primary',
    size: 'md',
  },
});
```

## Setup & Migration Notes
- Ensure `@gluestack-ui/nativewind-utils` is installed.
- Setup `global.css` with `@import "tailwindcss";` and custom color/token definitions.
- When creating custom components, use `withStyleContext` and `useStyleContext` for parent-child style inheritance where applicable.
