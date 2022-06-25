# Create floating things easily

useOverlay uses floating-ui and framer-moting under the hood, giving you an API that provides great usability.

> **Warning** Documentation is not complete!
> useOverlay is a very fresh hook. API can be changed.

> **Note** You should know!
> For styling useOverlay doesn't do anything than passing className parameter to floating overlay for now. You can use Tailwind or some other solutions.

```console
npm install react-useoverlay
```

## Why Floating UI?

> Floating UI is a tiny, low-level library for creating "floating" elements.
The library provides two key functionalities:

### 1. Anchored positioning primitives
> CSS is currently missing a feature called “anchored positioning” — the ability to anchor an element (like a tooltip) to another one (like a button) while simultaneously keeping it in view as best as possible by avoiding clipping and overflow.
> Attempting to do fully dynamic anchored positioning with today’s plain CSS is not possible. Floating UI provides a JavaScript implementation of this feature.

### 2. User interaction primitives
> When creating a popover, dropdown menu, select, or combobox component that follows WAI-ARIA authoring practices, the complexity increases dramatically. Focus traps, indexed navigation, and typeahead are difficult to get right.
This functionality is currently available for React DOM but will be made agnostic in the future.

---

## Why framer-motion?

### 1. Production-ready motion library for React
> Utilize the power behind Framer, the best prototyping tool for teams. Proudly open source.

### 2. Simple declarative syntax means you write less code
> Less code means your codebase is easier to read and maintain. Animations that work like magic. When animating between two separate components, Framer Motion will take care of everything in between.

---

## Why useOverlay?

### 1. Because it simplifies the API you need to deal with it.
> That's it.

## Use cases

- If you don't wanna handle all the logic of floating elements
- If you are building your own UI Library
- If you wanna create a custom build floating overlays