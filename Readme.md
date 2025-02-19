# 🌐 Query State Hook

## 🚀 Introduction

`query-state-hook` provides a simple and efficient way to store and **validate** your component state directly in the URL. This approach enhances usability, improves navigation, and simplifies state management without requiring external state management tools like Redux or Context API.

Storing the state in the URL gives users full control over your app’s state. Because of this, it’s essential to manage and validate that state carefully. This is the core reason for the existence of this library: to help you ensure the state follows your defined rules.

### [Demo](https://fernandicus.github.io/query-state-hook/)

## 📢 Important Note

- **Main Objective:** This library is designed to simplify validation of URL query parameters, ensuring they adhere to your domain rules.

- **Why It Matters:** It prevents users—or even you as the developer—from accidentally setting invalid values as the state of your query parameters

- **Not a Replacement:** This library is meant to complement `useSearchParams()` from `react-router`, not replace it.

### 📝 Practical Example

Imagine you have a form with three checkboxes for color options: red, blue, and white. The form state is stored in the URL so it can be shared or persisted. However, what happens if a user manually changes the URL to include an invalid color, like black?

Without validation, black would be stored as the state, which could cause issues. This library ensures only valid values—red, blue, or white—are allowed, making your app more reliable.

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

Install `query-state-hook` using npm or yarn:

```sh
npm install query-state-hook
# or
yarn add query-state-hook
```

## ⚙️ How it works?

### Basic Example

Use the `useUrlState` hook to sync your component state with the URL.

- The `state` variable retrieves the current value from the query parameter.
- The `setState` function updates the URL accordingly.

```tsx
export function SwitchButton() {
  const [searchParams, updateSearchParams] = useSearchParams();

  const { state, setState, clean } = useUrlState({
    searchParams,
    updateSearchParams,
    props: {
      type: "simple",
      params: {
        name: "switch-btn",
        defaultValue: "off",
        values: ["on", "off"],
      },
    },
  });

  return (
    <button
      className={`btn btn--${state.value}`}
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
const [searchParams, updateSearchParams] = useSearchParams();

const currentYear = new Date().getFullYear();
const minYear = currentYear - 5;

const { state, setState, clean } = useUrlState({
  searchParams,
  updateSearchParams,
  props: {
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
  },
});
```

## 🔄 Managing Multiple States

Sometimes, you need multiple states in a single URL, like for a form with multiple fields.
Use `useUrlMultiState` to handle this scenario:

```tsx
const { state, setState, clean } = useUrlMultiState({
  searchParams,
  updateSearchParams,
  props: {
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
  },
});

setState("name", "John Doe");
setState("age", "under-age");
```

## 📋 Managing Arrays in State

You can also store arrays in the URL:

```tsx
const { state, setState, clean } = useUrlMultiState({
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

setState("food", ["mango", "pizza"]);
```

## 📖 Centralize all your validations into a Provider

You can use `useUrlMultiState` into your own Provider to centralize all your logic and to have access everywhere in your app

```tsx
const FormStateCtx = createContext<FormState>({
  title: "",
  shape: "",
  setTitle() {},
  setShape() {},
});

export const formContext = () => useContext(FormStateCtx);

export function FormStateProvider({ children }: { children: JSX.Element }) {
  const [searchParams, updateSearchParams] = useSearchParams();

  const urlState = useUrlMultiState({
    searchParams,
    updateSearchParams,
    props: {
      ids: {
        title: {
          type: "any",
        },
        shape: {
          type: "simple",
          params: {
            defaultValue: "box",
            values: ["box", "rounded"],
          },
        },
      },
    },
  });

  return (
    <FormStateCtx.Provider
      value={{
        shape: urlState.state.firstElement("shape"),
        title: urlState.state.firstElement("title"),
        setShape: (shape) => urlState.setState("shape", shape),
        setTitle: (title) => urlState.setState("title", title),
      }}
    >
      {children}
    </FormStateCtx.Provider>
  );
}
```

## 📖 Server Components (e.g., NextJS)

When using server components—such as with Next.js—you might notice a slight flicker in the component state due to differences between the server-rendered HTML and the client state. To prevent this flicker, you can pass URLSearchParams to the hook, ensuring the state is initialized consistently on both the server and client.

```tsx
const searchParams = useSearchParams();
const { state, setState, clean } = useUrlState({
  updateSearchParams: (queryParams) => {
    window.history.pushState({}, "", "?" + queryParams.toString());
  },
  searchParams,
  props: {
    type: "simple",
    params: {
      name: "switch-btn",
      defaultValue: "off",
      values: ["on", "off"],
    },
  },
});
```

This approach ensures smoother state hydration and avoids mismatches between server and client-rendered output.

## 📖 Conclusion

`query-state-hook` simplifies managing UI state by leveraging the browser's URL, making applications more user-friendly, persistent, and shareable.

**💡 Try it out and enhance your app’s state management today! 🚀**
