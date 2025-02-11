# 🌐 Query State

## 🚀 Introduction

`query-state` provides a simple and efficient way to store and validate your component state directly in the URL. This approach enhances usability, improves navigation, and simplifies state management without requiring external state management tools like Redux or Context API.

## 🎯 Benefits of Managing State Through the URL

### 🚀 1. Easily Shareable State

If a user copies and pastes the URL, someone else can open it and see the exact same state without extra steps.

### 🔄 2. Persistence Across Page Reloads

The state remains even if the user refreshes the page, unlike local component state, which resets.

### ⏪ 3. Better Navigation and History Support

Users can navigate back and forward using the browser’s history, just like with regular web pages.

### 🔗 4. Improved Deep Linking

You can create URLs that link directly to a specific state, making it easy to bookmark or share particular views.

### 🛠 5. Reduces the Need for Global State Management

No need for external state management tools (like Redux or Context) for simple UI state that should be reflected in the URL.

## 📦 Installation

Install `query-state` using npm or yarn:

```sh
npm install query-state
# or
yarn add query-state
```

## ⚙️ How it works?

### Basic Example

Use the `useUrlState` hook to sync your component state with the URL.

- The `state` variable retrieves the current value from the query parameter.
- The `setState` function updates the URL accordingly.

```tsx
export function SwitchButton() {
  const [state, setState] = useUrlState({
    type: "simple",
    params: {
      name: "switch-btn",
      defaultValue: "off",
      values: ["on", "off"],
    },
  });

  return (
    <button
      className={`btn btn--${state}`}
      onClick={() => {
        if (state === "on") {
          setState("off");
          return;
        }

        setState("on");
      }}
    >
      Switch
    </button>
  );
}
```

### Parameters

- **name**: The query parameter name in the URL.
- **defaultValue**: The fallback value if the parameter is missing or invalid.
- **values**: A list of valid values to prevent invalid inputs.

## 🛠 Custom Validation

Define your own validation logic by setting `type: "custom"`.
For example, validating a **year range**:

```tsx
const currentYear = new Date().getFullYear();
const minYear = currentYear - 5;

const [state, setState] = useUrlState({
  type: "custom",
  params: {
    name: "year",
    getState(urlSearchParams) {
      const stateUrl = parseInt(urlSearchParams.get());
      if (stateUrl < minYear || stateUrl > currentYear) return currentYear.toString();
    },
    setState(urlSearchParams, value) {
      const year = parseInt(value);
      if (year < minYear || year > currentYear) {
        urlSearchParams.set(currentYear.toString());
        return urlSearchParams;
      }
    },
  },
});
```

## 🔄 Managing Multiple States

Sometimes, you need multiple states in a single URL, like for a form with multiple fields.
Use `useUrlMultiState` to handle this scenario:

```tsx
const [state, setState] = useUrlMultiState({
  key: "form",
  ids: {
    name: {
      type: "any",
    },
    age: {
      type: "simple",
      params: {
        defaultValue: "under-age",
        values: ["under-age", "adult"],
      },
    },
  },
});

setState.set("name", "John Doe");
setState.set("age", "under-age");
```

## 📋 Managing Arrays in State

You can also store arrays in the URL:

```tsx
const [state, setState] = useUrlMultiState({
  key: "form",
  ids: {
    food: {
      type: "simple",
      params: {
        defaultValue: "mango",
        values: ["mango", "pizza", "water"],
      },
    },
  },
});

setState.set("food", ["mango", "pizza"]);
```

## 📖 Conclusion

`query-state` simplifies managing UI state by leveraging the browser's URL, making applications more user-friendly, persistent, and shareable.

**💡 Try it out and enhance your app’s state management today! 🚀**
