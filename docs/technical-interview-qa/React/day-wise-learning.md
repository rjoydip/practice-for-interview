# React Interview Q&A — Days 1 to 25

---

## Day 1

### 341. What is a higher-order component (HOC) in ReactJS?

A Higher-Order Component is a function that takes a component as input and returns a new enhanced component. HOCs act as wrappers that inject props, modify behavior, and reuse common logic across multiple components without repeating code.

```jsx
// HOC that adds a loading state to any component
function withLoading(WrappedComponent) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Loading...</div>;
    return <WrappedComponent {...props} />;
  };
}

const UserListWithLoading = withLoading(UserList);

// Usage
<UserListWithLoading isLoading={true} users={users} />;
```

---

### 342. What is the purpose of the "key" prop in ReactJS?

The `key` prop uniquely identifies elements in a list. It helps React efficiently update and re-render only the necessary components when a list changes, by tracking which items were added, removed, or reordered.

```jsx
const fruits = ['Apple', 'Banana', 'Cherry'];

// Without key — React can't track elements efficiently
<ul>{fruits.map(f => <li>{f}</li>)}</ul>

// With key — React knows exactly which element changed
<ul>
  {fruits.map((fruit) => (
    <li key={fruit}>{fruit}</li>  // use unique ID, not index
  ))}
</ul>
```

---

### 343. Explain the concept of controlled and uncontrolled components in ReactJS.

Controlled components have their form input state managed by React via `useState`, updated through `onChange` handlers. Uncontrolled components let the DOM manage state directly, accessed via refs. Controlled gives more control; uncontrolled is simpler for basic cases.

```jsx
// Controlled — React controls the value
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled — DOM manages the value
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => alert(inputRef.current.value);
  return <input ref={inputRef} defaultValue="hello" />;
}
```

---

### 344. What is the purpose of the "setState" method in ReactJS and how does it work?

`setState` updates the state of a class component. When called, it merges the new state with the old one and triggers a re-render. It is asynchronous — React may batch multiple `setState` calls for performance.

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    // Use functional form when new state depends on old state
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return <button onClick={this.increment}>Count: {this.state.count}</button>;
  }
}
```

---

### 345. What is the significance of the "React.Fragment" component?

`React.Fragment` lets you group multiple elements without adding extra DOM nodes. This keeps the HTML output clean and avoids unnecessary wrapper divs, especially useful in lists or when CSS layout would break with an extra element.

```jsx
// Without Fragment — extra div pollutes the DOM
function List() {
  return (
    <div>
      <li>Item 1</li>
      <li>Item 2</li>
    </div>
  );
}

// With Fragment — clean, no extra DOM node
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

---

## Day 2

### 346. How does React handle event handling?

React uses synthetic events — cross-browser wrappers around native browser events. When an event fires, React creates a `SyntheticEvent` object and passes it to the handler, ensuring consistent behavior across all browsers.

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault(); // works same in all browsers
    console.log(e.target); // SyntheticEvent
    console.log(e.nativeEvent); // original browser event
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

---

### 347. What are the differences between class components and functional components in ReactJS?

Class components use ES6 classes, have lifecycle methods (`componentDidMount`, etc.), and manage state via `this.state`. Functional components are plain functions that use Hooks (`useState`, `useEffect`) for state and side effects — they're simpler and now preferred.

```jsx
// Class component
class Greeting extends React.Component {
  state = { name: "World" };
  componentDidMount() {
    console.log("mounted");
  }
  render() {
    return <h1>Hello, {this.state.name}!</h1>;
  }
}

// Functional component (modern, preferred)
function Greeting() {
  const [name, setName] = useState("World");
  useEffect(() => {
    console.log("mounted");
  }, []);
  return <h1>Hello, {name}!</h1>;
}
```

---

### 348. How can you optimize the performance of React applications?

Performance can be improved by using `React.memo` to skip re-renders, `useMemo`/`useCallback` to memoize values/functions, lazy loading with `React.lazy` for code splitting, virtualization for long lists, and using the production build of React.

```jsx
// React.memo — skip re-render if props unchanged
const Button = React.memo(({ onClick, label }) => <button onClick={onClick}>{label}</button>);

// useCallback — stable function reference
const handleClick = useCallback(() => doSomething(id), [id]);

// Lazy loading a heavy component
const Chart = React.lazy(() => import("./HeavyChart"));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
}
```

---

### 349. What is React Router and how does it work?

React Router is a library for client-side routing in React apps. It maps URL paths to components, enabling multi-page experiences without full page reloads. When the user navigates, the matching component renders.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 350. Explain the concept of React Hooks and their benefits.

React Hooks are functions that let functional components use state, side effects, and other React features without writing class components. They improve code reusability, readability, and make it easy to share logic across components.

```jsx
// useState — local state
const [count, setCount] = useState(0);

// useEffect — side effects (fetch, subscriptions)
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// Custom hook — reusable logic
function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setSize(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}
```

---

## Day 3

### 351. Can web browsers read JSX directly?

No. Browsers only understand plain JavaScript. JSX is a syntax extension that looks like HTML but is not valid JS. Babel transforms JSX into `React.createElement()` calls before the browser ever sees it.

```jsx
// JSX — what you write
const element = <h1 className="title">Hello</h1>;

// What Babel compiles it to
const element = React.createElement("h1", { className: "title" }, "Hello");
// Both produce: { type: 'h1', props: { className: 'title', children: 'Hello' } }
```

---

### 352. "In React, everything is a component." Explain.

React builds UIs from small, independent, reusable components. Each component manages its own rendering and can be composed with others to build complex UIs. A page is just a tree of components — from the entire layout down to a single button.

```jsx
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} />;
}
function UserName({ name }) {
  return <span>{name}</span>;
}

// Composed into a larger component
function UserCard({ user }) {
  return (
    <div>
      <Avatar src={user.avatar} alt={user.name} />
      <UserName name={user.name} />
    </div>
  );
}

// App is just components all the way down
function App() {
  return <UserCard user={currentUser} />;
}
```

---

### 353. What are Pure Components?

Pure Components are class components that implement `shouldComponentUpdate` with a shallow prop and state comparison. They skip re-rendering if neither props nor state have changed, improving performance for simple components.

```jsx
// Class-based Pure Component (auto shallow comparison)
class Greeting extends React.PureComponent {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Functional equivalent: React.memo
const Greeting = React.memo(({ name }) => {
  return <h1>Hello, {name}</h1>;
});
// Won't re-render unless 'name' prop changes
```

---

### 354. Why is it necessary to start component names with a capital letter?

JSX treats lowercase tags as HTML elements and capitalized names as React components. If you use a lowercase name, React will try to render it as a DOM element (like `<div>`) and throw an error.

```jsx
// WRONG — React treats 'myButton' as an unknown HTML element
function myButton() {
  return <button>Click</button>;
}
const el = <myButton />; // renders <mybutton> in DOM — wrong!

// CORRECT — capitalized means it's a React component
function MyButton() {
  return <button>Click</button>;
}
const el = <MyButton />; // React finds and renders the component
```

---

### 355. When do we prefer to use a class component over a function component?

Before React 16.8, class components were needed for state and lifecycle methods. Now, Hooks provide all of that in functional components. Today, class components are mainly used in legacy code or when using Error Boundaries (which still require classes).

```jsx
// Only class-specific use case today: Error Boundaries
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}

// Everything else: use functional + Hooks
```

---

## Day 4

### 356. How do you handle forms in React?

React forms typically use controlled components — form input values are stored in state and updated via `onChange`. On submit, you read from state rather than the DOM, giving you full control over validation and processing.

```jsx
function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### 357. Explain the Flux architectural pattern.

Flux is a data-flow architecture for React apps. Data flows in one direction: Actions describe what happened → Dispatcher routes them → Stores update state → Views re-render. This unidirectional flow makes state changes predictable and easy to debug.

```jsx
// 1. Action — describes an event
const action = { type: "ADD_TODO", payload: { text: "Learn Flux" } };

// 2. Dispatcher — sends action to all stores
Dispatcher.dispatch(action);

// 3. Store — holds state, updates on action
store.on("ADD_TODO", (action) => {
  todos.push(action.payload);
  store.emit("change");
});

// 4. View — listens to store, re-renders
function TodoList() {
  const [todos, setTodos] = useState(store.getTodos());
}
```

---

### 358. Explain the concept of context in React. How does it work?

Context lets you share data (like theme, auth, locale) across the component tree without passing props manually at every level. A Provider wraps the tree and sets the value; any descendant can consume it with `useContext`.

```jsx
const ThemeContext = React.createContext("light");

// Provider sets the value for all children
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// Deep child consumes it without prop drilling
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

---

### 359. What are portals in React? When would you use them?

Portals render a component's children into a different DOM node outside the parent's DOM hierarchy. They're ideal for modals, tooltips, and dropdowns that need to visually escape their parent's `overflow` or `z-index` constraints.

```jsx
import { createPortal } from "react-dom";

function Modal({ children, onClose }) {
  // Renders into document.body, not the parent div
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body, // target DOM node
  );
}
// React events still bubble through the React tree normally
```

---

### 360. Explain the concept of lazy loading in React.

Lazy loading defers loading of a component until it's needed, reducing the initial bundle size. `React.lazy()` dynamically imports the component, and `Suspense` shows a fallback UI while it loads.

```jsx
import React, { lazy, Suspense } from "react";

// Component is only downloaded when first rendered
const HeavyChart = lazy(() => import("./HeavyChart"));

function App() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Load Chart</button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Day 5

### 361. What is useEffect hook?

`useEffect` handles side effects in functional components — things like data fetching, subscriptions, timers, and DOM manipulation. It runs after the render and can optionally clean up by returning a function.

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Side effect: fetch data when userId changes
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    // Cleanup: runs when userId changes or component unmounts
    return () => {
      /* abort controller here */
    };
  }, [userId]); // dependency — re-run when userId changes

  return <div>{user?.name}</div>;
}
```

---

### 362. What is the role of the useReducer hook in React? How does it differ from the useState hook?

`useReducer` manages complex state logic with a reducer function — similar to Redux. Unlike `useState` (which handles simple values), `useReducer` suits state with multiple sub-values or when the next state depends on the previous one in complex ways.

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "setStep":
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

---

### 363. Describe the purpose of the useRef hook.

`useRef` creates a mutable container (`.current`) that persists across renders without triggering a re-render when changed. It's used to reference DOM elements directly, or to store any mutable value like a timer ID or previous prop.

```jsx
function TextInput() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++; // mutating ref doesn't re-render
  });

  const focusInput = () => {
    inputRef.current.focus(); // direct DOM access
  };

  return (
    <>
      <input ref={inputRef} placeholder="Type here..." />
      <button onClick={focusInput}>Focus</button>
      <p>Rendered {renderCount.current} times</p>
    </>
  );
}
```

---

### 364. What is the purpose of the useMemo hook? How does it help optimize performance in React?

`useMemo` memoizes the result of an expensive computation. It only recomputes when its dependencies change. This prevents wasteful recalculations on every render, especially for heavy data transformations.

```jsx
function ProductList({ products, filterText }) {
  // Without useMemo — filters on EVERY render
  // const filtered = products.filter(p => p.name.includes(filterText));

  // With useMemo — only recomputes when dependencies change
  const filtered = useMemo(() => {
    return products.filter((p) => p.name.includes(filterText));
  }, [products, filterText]);

  return (
    <ul>
      {filtered.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

---

### 365. When would you use the useCallback hook in React? How does it differ from the useMemo hook?

`useCallback` memoizes a function (not its result), returning the same function reference as long as dependencies don't change. Use it when passing callbacks to child components wrapped in `React.memo`. `useMemo` memoizes values; `useCallback` memoizes functions.

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // With useCallback — same reference, MemoizedChild won't re-render
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []); // no deps — never recreated

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <MemoizedChild onClick={handleClick} />
    </>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});
```

---

## Day 6

### 366. What happens when you call setState?

Calling `setState` schedules a state update asynchronously. React merges the new state with the old, then queues a re-render of the component and its children. React may batch multiple `setState` calls together for efficiency.

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  handleClick = () => {
    // These two setState calls get BATCHED — count only becomes 1
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });

    // Use updater function to rely on latest state
    this.setState((prev) => ({ count: prev.count + 1 }));
    this.setState((prev) => ({ count: prev.count + 1 }));
    // Now count correctly becomes 2
  };
}
```

---

### 367. What is `children` prop in React?

The `children` prop refers to any JSX elements placed between a component's opening and closing tags. It lets components act as wrappers or containers that render dynamic content passed by their parent.

```jsx
// Component that accepts children
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage — any content can be passed as children
function App() {
  return (
    <Card title="User Info">
      <p>Name: Alice</p>
      <button>Edit Profile</button>
    </Card>
  );
}
```

---

### 368. What are stateless components?

Stateless components don't have or manage their own state — they simply receive props and render UI. They're predictable and easy to test. Functional components without `useState` are stateless by nature.

```jsx
// Stateless — depends only on props, no internal state
function UserBadge({ name, role }) {
  return (
    <div className="badge">
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
}

// Same input always produces same output — pure and predictable
<UserBadge name="Alice" role="Admin" />
<UserBadge name="Bob" role="Viewer" />
```

---

### 369. What are stateful components?

Stateful components manage their own internal state that can change over time. They use `useState` (functional) or `this.state` (class) to track data that affects rendering. The component re-renders when state changes.

```jsx
// Stateful functional component using useState
function Toggle() {
  const [isOn, setIsOn] = useState(false); // internal state

  return <button onClick={() => setIsOn((prev) => !prev)}>{isOn ? "ON" : "OFF"}</button>;
}
// The rendered output changes based on internal state
```

---

### 370. What is the impact of indexes as keys?

Using array indexes as keys causes bugs when lists are reordered or filtered. React uses keys to match old elements with new ones — if the index shifts, React associates the wrong component state with the wrong element.

```jsx
const todos = [
  { id: "a1", text: "Buy milk" },
  { id: "b2", text: "Walk dog" },
];

// BAD — index as key causes bugs on reorder/delete
todos.map((todo, index) => <li key={index}>{todo.text}</li>);

// GOOD — use stable, unique ID as key
todos.map((todo) => <li key={todo.id}>{todo.text}</li>);
```

---

## Day 7

### 371. What is prop drilling in react?

Prop drilling is passing props through many intermediate components that don't use them, just to get data to a deeply nested child. It creates tight coupling and makes components harder to reuse and maintain.

```jsx
// Prop drilling problem — Sidebar and Nav don't need 'user'
// but must pass it down
function App() {
  const user = { name: "Alice" };
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  // doesn't use user
  return <Nav user={user} />;
}

function Nav({ user }) {
  // doesn't use user
  return <UserAvatar user={user} />;
}

function UserAvatar({ user }) {
  // finally uses it
  return <img src={user.avatar} />;
}
```

---

### 372. How can we avoid prop drilling?

Prop drilling is avoided by using React's Context API to share data globally, or state management libraries like Redux or Zustand. These allow components to access shared state directly without threading props through every level.

```jsx
const UserContext = React.createContext(null);

function App() {
  const user = { name: "Alice", avatar: "..." };
  return (
    <UserContext.Provider value={user}>
      <Sidebar /> {/* no props needed */}
    </UserContext.Provider>
  );
}

function Sidebar() {
  return <Nav />;
} // no user prop!
function Nav() {
  return <UserAvatar />;
} // no user prop!

function UserAvatar() {
  const user = useContext(UserContext); // reads directly
  return <img src={user.avatar} alt={user.name} />;
}
```

---

### 373. How would you prevent a component from rendering in React?

Prevent rendering by returning `null` from the component, or wrapping JSX in an `if` statement or ternary. React skips rendering entirely when a component returns `null`.

```jsx
// Return null to render nothing
function Alert({ message, visible }) {
  if (!visible) return null;
  return <div className="alert">{message}</div>;
}

// Conditional rendering with ternary and short-circuit
function Dashboard({ isAdmin }) {
  return (
    <div>
      <p>Welcome!</p>
      {isAdmin ? <AdminPanel /> : null}
      {isAdmin && <AdminPanel />} {/* short-circuit */}
    </div>
  );
}
```

---

### 374. What do these three dots (...) in React do?

The spread operator (`...`) copies all properties from one object or elements from an array into another. In React, it's commonly used to forward all props to a child component or to create new state objects without mutation.

```jsx
// Spread props — forward all props to a child
function Button({ className, ...rest }) {
  return <button className={`btn ${className}`} {...rest} />;
}
<Button className="primary" onClick={fn} disabled={false} />;

// Spread to create new objects (immutable state update)
const [user, setUser] = useState({ name: "Alice", age: 25 });
setUser((prev) => ({ ...prev, age: 26 })); // only updates age

// Spread arrays
const newItems = [...existingItems, newItem];
```

---

### 375. Why React uses className over class attribute?

In JSX, you write JavaScript, and `class` is a reserved keyword in JavaScript (used for ES6 classes). To avoid a syntax conflict, React uses `className` for CSS classes. Babel compiles `className` back to the HTML `class` attribute.

```jsx
// WRONG — 'class' is a JS reserved keyword, causes error
const el = <div class="container">Hello</div>;

// CORRECT — use className in JSX
const el = <div className="container">Hello</div>;

// Babel compiles it to:
React.createElement("div", { className: "container" }, "Hello");
// In the real DOM: <div class="container">Hello</div>
```

---

## Day 8

### 376. Why we should not update state directly?

Directly mutating state bypasses React's reactivity system — the component won't re-render, and changes won't be reflected in the UI. Always use `setState` (class) or the setter from `useState` (functional) to trigger proper re-renders.

```jsx
// WRONG — direct mutation, NO re-render triggered
this.state.count = 5;

let [items, setItems] = useState([]);
items.push(newItem); // mutates original, NO re-render

// CORRECT — use the setter function
this.setState({ count: 5 });
setItems((prev) => [...prev, newItem]);

// Also wrong for objects:
user.name = "Bob"; // mutation!
setUser({ ...user, name: "Bob" }); // correct
```

---

### 377. What is StrictMode in React?

`React.StrictMode` is a development tool that adds extra checks and warnings. It intentionally double-invokes render and lifecycle functions to detect side effects, warns about deprecated APIs, and helps identify potential problems early.

```jsx
// Wrap your app in StrictMode — ZERO effect in production builds
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Router>
        <Header />
        <Main />
      </Router>
    </StrictMode>
  );
}

// In development, StrictMode will:
// 1. Double-invoke render to detect side effects
// 2. Warn about legacy string refs
// 3. Warn about deprecated findDOMNode usage
```

---

### 378. What's wrong with using Context in React?

Context is not bad, but overusing it causes performance issues: every consumer re-renders when the context value changes, even if they only care about a small part of it. For large apps with complex global state, Redux or Zustand are better choices.

```jsx
// Problem: ALL consumers re-render when ANY part changes
const AppContext = createContext({});

// Better: split into separate focused contexts
const UserContext = createContext(null);
const ThemeContext = createContext("light");

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Main />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

---

### 379. Does React re-render all components and sub components every time setState is called?

No. React only re-renders the component where `setState` was called and its children. It then runs reconciliation to find the minimal DOM changes needed. You can further optimize with `React.memo` and `shouldComponentUpdate`.

```jsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Counter count={count} setCount={setCount} />
      <Footer /> {/* does NOT re-render when count changes */}
    </div>
  );
}

const Footer = React.memo(() => {
  console.log("Footer rendered"); // only logs once
  return <footer>Static footer</footer>;
});
```

---

### 380. Explain why and when would you use `useMemo()`?

Use `useMemo` when you have an expensive calculation that you don't want to repeat on every render. It caches the result and only recomputes when the listed dependencies change. Don't use it for cheap operations — the overhead isn't worth it.

```jsx
function DataGrid({ rows, searchTerm }) {
  // Expensive: sorting + filtering a large dataset
  const processedRows = useMemo(() => {
    return rows
      .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, searchTerm]); // only recompute when these change

  return <table>{processedRows.map(renderRow)}</table>;
}
```

---

## Day 9

### 381. When shall we use useReducer hook in ReactJS?

Use `useReducer` when state logic is complex — multiple related values, state transitions depend on previous state, or when next state depends on an action type. It centralizes state logic into one reducer function, making it easier to reason about.

```jsx
const initialState = { name: "", email: "", errors: {}, loading: false };

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, errors: { ...state.errors, ...action.errors } };
    case "SUBMIT":
      return { ...state, loading: true };
    case "SUCCESS":
      return { ...initialState };
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  // dispatch({ type: 'SET_FIELD', field: 'name', value: 'Alice' })
}
```

---

### 382. How does React renderer work exactly when we call setState?

`setState` schedules a state update → React triggers reconciliation → it creates a new Virtual DOM and diffs it against the previous one → it calculates the minimal set of real DOM changes → it commits only those changes to the browser.

```jsx
// Simplified mental model:

// 1. You call setState
setCount(5);

// 2. React schedules a re-render (may batch with others)

// 3. React calls your component function again to get new VDOM

// 4. React diffs old VDOM vs new VDOM (reconciliation)
//    Old: <div><p>Count: 3</p></div>
//    New: <div><p>Count: 5</p></div>
//    Diff: update text node "3" → "5"

// 5. React commits ONLY that change to the real DOM
```

---

### 383. What are styled components?

Styled-components is a CSS-in-JS library that lets you write CSS directly inside your JavaScript. Styles are scoped to the component, support dynamic values via props, and generate unique class names to prevent conflicts.

```jsx
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => (props.primary ? "#3498db" : "white")};
  color: ${(props) => (props.primary ? "white" : "#3498db")};
  padding: 0.5rem 1rem;
  border: 2px solid #3498db;
  border-radius: 4px;
`;

function App() {
  return (
    <>
      <Button>Default Button</Button>
      <Button primary>Primary Button</Button>
    </>
  );
}
```

---

### 384. What are the advantages of styled components?

Styled-components provide automatic class scoping (no conflicts), support for dynamic styles via props, built-in theming support, easy component reuse, and co-location of styles with components for better maintainability.

```jsx
const theme = { colors: { primary: "#3498db", danger: "#e74c3c" } };

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PrimaryButton>Save</PrimaryButton>
      <DangerButton>Delete</DangerButton>
    </ThemeProvider>
  );
}

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
`;

const DangerButton = styled.button`
  background: ${({ theme }) => theme.colors.danger};
`;
```

---

### 385. What are the disadvantages of styled components?

Styled-components have a learning curve for CSS-in-JS concepts, generate unreadable auto-generated class names (harder to debug in DevTools), add runtime overhead for style injection, and can make SSR setup more complex.

```jsx
// Debugging challenge — class names are not human-readable
// In browser DevTools you'll see:
// <button class="sc-bdXxxt fKMfLv">Click me</button>
// Not: <button class="primary-button">Click me</button>

// Solution: add displayName for debugging
const Button = styled.button`
  background: blue;
`;
Button.displayName = "Button"; // shows "Button" in DevTools

// Alternative: use .attrs() for semantic class names
const Input = styled.input.attrs({
  className: "form-input",
})`
  border: 1px solid #ccc;
`;
```

---

## Day 10

### 386. Why props cannot be updated in ReactJS?

Props are read-only by design — they represent data passed down from a parent and belong to the parent. This enforces unidirectional data flow: a child can't change a parent's data. To trigger a change, the child should call a callback function passed as a prop.

```jsx
// WRONG — cannot mutate props directly
function Child({ name }) {
  // props.name = 'Bob'; // Error! Props are read-only
  return <p>{name}</p>;
}

// CORRECT — parent passes a callback to allow updates
function Parent() {
  const [name, setName] = useState("Alice");
  return <Child name={name} onNameChange={setName} />;
}

function Child({ name, onNameChange }) {
  return <button onClick={() => onNameChange("Bob")}>{name}</button>;
}
```

---

### 387. What is a dispatcher?

In the Flux pattern, the Dispatcher is the central hub that receives Actions and broadcasts them to all registered Stores. Every action passes through a single dispatcher, ensuring predictable, centralized event routing.

```jsx
import { Dispatcher } from "flux";

const AppDispatcher = new Dispatcher();

// Actions send through the dispatcher
const TodoActions = {
  addTodo: (text) => {
    AppDispatcher.dispatch({ type: "ADD_TODO", payload: { text } });
  },
};

// Stores register to receive dispatched actions
AppDispatcher.register((action) => {
  if (action.type === "ADD_TODO") {
    TodoStore.addTodo(action.payload.text);
  }
});
```

---

### 388. What are Default Props?

Default props provide fallback values for props that a parent might not pass. They ensure a component always has valid values to work with, preventing `undefined` errors and making components more self-sufficient.

```jsx
// Functional component with default props via destructuring
function Button({ label = 'Click me', color = 'blue', size = 'md' }) {
  return <button style={{ color }} className={`btn-${size}`}>{label}</button>;
}

// Or using defaultProps (older style)
Button.defaultProps = {
  label: 'Click me',
  color: 'blue',
  size: 'md',
};

<Button />                    // "Click me", blue, md
<Button label="Submit" />     // "Submit", blue, md
```

---

### 389. What are inline conditional expressions?

Inline conditionals in JSX use JavaScript's `&&` (short-circuit) or ternary (`? :`) operator to conditionally render elements directly inside JSX, without needing separate `if` statements.

```jsx
function Dashboard({ user, notifications }) {
  return (
    <div>
      {/* Ternary — render one of two options */}
      {user ? <p>Welcome, {user.name}!</p> : <p>Please log in.</p>}

      {/* Short-circuit && — render or show nothing */}
      {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
    </div>
  );
}
```

---

### 390. What are the differences between React and React Native?

React builds web UIs and renders to the browser DOM using HTML elements. React Native builds mobile apps (iOS/Android) and renders to native UI components — there's no HTML or CSS. Both share the same component and Hooks model.

```jsx
// React (web) — uses HTML elements, CSS
function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Hello Web</h1>
      <button onClick={() => alert("clicked")}>Press</button>
    </div>
  );
}

// React Native (mobile) — uses native components
import { View, Text, TouchableOpacity } from "react-native";
function App() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Hello Mobile</Text>
      <TouchableOpacity onPress={() => alert("clicked")}>
        <Text>Press</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Day 11

### 391. Is React a library or a Framework and why?

React is a library — specifically a UI library. It only handles the view layer (rendering components to the DOM). It doesn't provide routing, HTTP, forms, or state management out of the box. You choose and add those tools yourself, unlike a full framework like Angular.

```jsx
// React handles ONLY the view layer
// You choose everything else:

import { BrowserRouter } from "react-router-dom"; // routing
import { createStore } from "redux"; // state
import axios from "axios"; // HTTP
import { useForm } from "react-hook-form"; // forms

// A framework (like Next.js) bundles routing + SSR + more
```

---

### 392. What are nested components in react?

Nested components are components rendered inside other components, forming a parent-child tree. This is the fundamental pattern for building complex UIs from simple, composable pieces.

```jsx
function App() {
  return (
    <Page>
      <Header>
        <Logo />
        <NavMenu />
      </Header>
      <Main>
        <Sidebar />
        <Content>
          <ArticleList />
        </Content>
      </Main>
    </Page>
  );
}
// Each component knows only about its own children
```

---

### 393. Can a nested child component access the state of its sibling component?

No. Siblings cannot directly access each other's state. Communication should go through their common parent: lift the shared state up, and pass it down as props or callbacks to both siblings.

```jsx
// WRONG — sibling can't access another's state directly
function SiblingA() {
  const [count, setCount] = useState(0); // private to A
}

// CORRECT — lift state to parent
function Parent() {
  const [count, setCount] = useState(0); // shared state

  return (
    <>
      <SiblingA count={count} onIncrement={() => setCount((c) => c + 1)} />
      <SiblingB count={count} />
    </>
  );
}
```

---

### 394. What are error boundaries in react?

Error boundaries are class components that catch JavaScript errors thrown during rendering in their child tree, log them, and display a fallback UI instead of crashing the whole app. They must be class components (no Hook equivalent yet).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Oops! Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>;
```

---

### 395. What is React Dev Tool?

React DevTools is a browser extension (Chrome/Firefox) for inspecting React component trees. You can view component props and state, edit them live, profile render performance, and highlight re-renders in real time.

```jsx
// After installing React DevTools browser extension:

// 1. Open browser DevTools (F12)
// 2. "Components" tab — inspect any component's:
//    props, state, context values, hooks

// 3. "Profiler" tab — record and analyze:
//    which components re-rendered, render duration,
//    what caused each re-render

// Tip: use displayName for cleaner component names
const MyComponent = React.memo(() => <div>Hi</div>);
MyComponent.displayName = "MyComponent";
```

---

## Day 12

### 396. What is "React Node" in react?

A React Node is anything that can be rendered by React. This includes JSX elements, strings, numbers, booleans, null, arrays, and fragments. The `ReactNode` type in TypeScript describes all renderable content.

```jsx
// All of these are valid React Nodes
const node1 = <h1>Hello</h1>; // JSX element
const node2 = "Hello"; // string
const node3 = 42; // number
const node4 = true; // boolean (renders nothing)
const node5 = null; // null (renders nothing)
const node6 = [<li>A</li>, <li>B</li>]; // array of elements
const node7 = (
  <>
    <p>A</p>
    <p>B</p>
  </>
); // fragment

function Container({ children }) {
  return <div>{children}</div>; // children is a ReactNode
}
```

---

### 397. Why do we need to React Router?

React is a single-page application library with no built-in navigation. React Router adds client-side routing — it maps URLs to components so different views render for different paths without full page reloads.

```jsx
// Without React Router — no URL changes, back button broken
function App() {
  const [page, setPage] = useState("home");
  if (page === "home") return <Home />;
  if (page === "about") return <About />;
}

// With React Router — URL-driven, back button works
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/user/:id" element={<User />} />
    </Routes>
  );
}
```

---

### 398. Explain the role of Reducer.

A reducer is a pure function that takes the current state and an action, and returns the next state. It determines how state should change based on the action type. Reducers must be pure — no side effects, same input always gives same output.

```jsx
function todoReducer(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case "TOGGLE_TODO":
      return state.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t));
    case "DELETE_TODO":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state; // always return state for unknown actions
  }
}
```

---

### 399. What is the use of React.cloneElement?

`React.cloneElement` clones an existing React element and lets you add or override its props. It's useful in HOCs or when a parent wants to inject extra props (like event handlers or styles) into child elements it receives.

```jsx
// Parent injects an extra prop into each child
function Toolbar({ children }) {
  return (
    <div className="toolbar">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          highlighted: true,
          style: { ...child.props.style, margin: "0 4px" },
        }),
      )}
    </div>
  );
}

<Toolbar>
  <Button>Save</Button>
  <Button>Cancel</Button>
</Toolbar>;
// Both buttons receive highlighted=true and margin style
```

---

### 400. Can you explain React's "lifting state up" concept and why it is important?

"Lifting state up" means moving shared state to the nearest common ancestor of components that need it. This creates a single source of truth, ensures components stay in sync, and makes data flow predictable.

```jsx
// AFTER lifting — parent owns the state, passes it down
function TempConverter() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = (celsius * 9) / 5 + 32;

  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitInput value={fahrenheit} />
    </>
  );
}
// Both inputs always stay in sync because they share one state
```

---

## Day 13

### 401. What is a ref in React and what is its purpose?

A ref is a way to get a direct reference to a DOM element or React component instance, bypassing the normal React data flow. It's used for things like focusing inputs, measuring element dimensions, or integrating with non-React libraries.

```jsx
function VideoPlayer() {
  const videoRef = useRef(null);

  const play = () => videoRef.current.play(); // direct DOM call
  const pause = () => videoRef.current.pause(); // direct DOM call

  return (
    <>
      <video ref={videoRef} src="movie.mp4" />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </>
  );
}
```

---

### 402. How does using refs differ from traditional DOM manipulation?

Traditional DOM manipulation uses `document.querySelector` or `getElementById` — imperative and error-prone. Refs provide a React-integrated way to access DOM nodes, with automatic cleanup and proper lifecycle management.

```jsx
// Traditional DOM — imperative, no React integration
function focusSearch() {
  const el = document.getElementById("search");
  if (el) el.focus(); // could be null, no guarantee
}

// React ref — safe, integrated with component lifecycle
function SearchBar() {
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus(); // auto-run after render
  }, []);

  return <input ref={searchRef} />;
  // React ensures searchRef.current is set before effect runs
}
```

---

### 403. What is the main difference between "string refs" and "callback refs" in React.

String refs (legacy) identify elements with a string like `ref="myInput"`, accessed via `this.refs.myInput`. Callback refs use a function that receives the DOM node directly, giving more control. String refs are deprecated and should not be used.

```jsx
// String ref — LEGACY, deprecated, avoid
class OldWay extends React.Component {
  handleClick() {
    this.refs.input.focus();
  }
  render() {
    return <input ref="input" />;
  }
}

// Callback ref — more control
class CallbackRef extends React.Component {
  setInputRef = (el) => {
    this.inputEl = el;
  };
  handleClick() {
    this.inputEl?.focus();
  }
  render() {
    return <input ref={this.setInputRef} />;
  }
}

// useRef — current best practice
function Modern() {
  const ref = useRef(null);
  return <input ref={ref} />;
}
```

---

### 404. Explain the concept of "forwarding refs" in React.

Ref forwarding lets a parent pass a ref through a component to one of its children's DOM nodes. This is needed when a parent wants to control a DOM element inside a child component (e.g., focus an input inside a custom `InputField`).

```jsx
const FancyInput = React.forwardRef((props, ref) => {
  return (
    <div className="fancy-wrapper">
      <input ref={ref} {...props} className="fancy-input" />
    </div>
  );
});

// Parent can now hold a ref to the inner <input>
function Form() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();

  return (
    <>
      <FancyInput ref={inputRef} placeholder="Type here" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

---

### 405. How do refs affect the component lifecycle in React?

Refs don't affect the lifecycle directly. A ref's `.current` is set to the DOM node after the component mounts, and cleared to `null` when it unmounts. Changing a ref never triggers a re-render.

```jsx
function Timer() {
  const intervalRef = useRef(null);

  useEffect(() => {
    // After mount: start timer, store in ref
    intervalRef.current = setInterval(() => {
      console.log("tick");
    }, 1000);

    // Before unmount: clean up using the ref
    return () => {
      clearInterval(intervalRef.current); // no memory leak
    };
  }, []);

  return <div>Timer running...</div>;
}
```

---

## Day 14

### 406. What are the benefits of using callback refs over string refs?

Callback refs give you direct access to the DOM node in a function, letting you perform setup/teardown immediately. They work in all React versions, support dynamic refs, and are composable — unlike string refs which are limited and deprecated.

```jsx
function MeasuredBox() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div ref={measuredRef}>
      <p>This box is {height}px tall</p>
    </div>
  );
}
// When the element mounts, callback fires immediately with the DOM node
```

---

### 407. Can we use refs with functional components in React? If yes, how?

Yes. Functional components use the `useRef` hook to create refs. To expose a ref from a functional component to its parent, use `React.forwardRef`. To expose specific methods (not the DOM node), use `useImperativeHandle`.

```jsx
// Exposing specific methods with useImperativeHandle
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => {
      inputRef.current.value = "";
    },
  }));
  return <input ref={inputRef} />;
});

// Parent only gets 'focus' and 'clear', not the full DOM node
function Form() {
  const ref = useRef(null);
  return (
    <>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}
```

---

### 408. What are the limitations or caveats of using refs in React?

Refs bypass React's data flow, making components harder to understand and test. Overusing refs leads to imperative code that fights React's declarative nature. Refs don't trigger re-renders, so UI won't update if you only change `ref.current`.

```jsx
function BadCounter() {
  const countRef = useRef(0);

  return (
    <div>
      {/* BUG: clicking updates ref but UI never re-renders */}
      <button
        onClick={() => {
          countRef.current++;
        }}
      >
        Increment
      </button>
      <p>Count: {countRef.current}</p> {/* Always shows 0! */}
    </div>
  );
}

// Fix: use useState for values that should update the UI
function GoodCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

### 409. How do you clean up or release the resources associated with a ref in React?

Clean up ref-associated resources (timers, event listeners, connections) in the cleanup function returned from `useEffect`. When the component unmounts, the cleanup runs and you can use the ref to find and release the resource.

```jsx
function LiveStream({ url }) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Setup: create WebSocket connection, store in ref
    socketRef.current = new WebSocket(url);
    socketRef.current.onmessage = (e) => console.log(e.data);

    // Cleanup: close connection when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null; // release reference
      }
    };
  }, [url]);

  return <div>Streaming from {url}...</div>;
}
```

---

### 410. How do you access the DOM node using refs in React?

Create a ref with `useRef(null)`, attach it to a JSX element via the `ref` attribute, then access the real DOM node via `ref.current` after the component mounts (inside `useEffect` or event handlers).

```jsx
function AutoFocusInput() {
  const inputRef = useRef(null); // 1. Create ref

  useEffect(() => {
    // 3. Access DOM node after mount
    console.log(inputRef.current); // <input> DOM node
    console.log(inputRef.current.value); // current input value
    inputRef.current.focus(); // call DOM methods
    inputRef.current.style.border = "2px solid blue";
  }, []);

  // 2. Attach ref to element
  return <input ref={inputRef} placeholder="Auto-focused!" />;
}
```

---

## Day 15

### 411. What is binding in React and why is it important?

Binding ensures that inside a class method, `this` correctly refers to the component instance. Without binding, `this` is `undefined` inside event handler methods (in strict mode), causing errors when trying to access state or other methods.

```jsx
class Counter extends React.Component {
  state = { count: 0 };

  increment() {
    // If 'this' is wrong → TypeError: Cannot read property of undefined
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <button onClick={this.increment.bind(this)}>{this.state.count}</button>;
  }
}
```

---

### 412. What happens if you don't bind a function in React? Explain the potential issues that can arise.

Without binding, `this` inside the class method is `undefined` when called as an event handler. Any attempt to access `this.state` or `this.setState` will throw a `TypeError`, crashing that part of the UI.

```jsx
class Broken extends React.Component {
  state = { name: "Alice" };

  // NOT bound — 'this' will be undefined when called as handler
  greet() {
    console.log(this.state.name);
    // TypeError: Cannot read properties of undefined (reading 'state')
  }

  render() {
    // When clicked: 'this' is undefined inside greet()
    return <button onClick={this.greet}>Greet</button>;
  }
}
```

---

### 413. How can you bind a function in a React class component? Describe the different methods available.

Three common methods: `bind()` in the constructor (classic), inline `.bind(this)` in the render (creates new function each render), or class field arrow functions (cleanest, auto-bound).

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    // Method 1: bind in constructor (recommended for class)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.state);
  }

  // Method 2: class field arrow function (auto-bound, most popular)
  handleHover = () => {
    console.log(this.state);
  };

  render() {
    return (
      <>
        <button onClick={this.handleClick}>Method 1</button>
        <button onClick={this.handleHover}>Method 2</button>
        {/* Method 3: inline bind (new fn each render, avoid) */}
        <button onClick={this.handleClick.bind(this)}>Method 3</button>
      </>
    );
  }
}
```

---

### 414. What is the recommended approach for binding functions in React components?

For class components: use class field arrow functions (`handleClick = () => {}`) — they're auto-bound and concise. For functional components: no binding needed at all, since closures naturally capture the variables they need.

```jsx
// Class component — recommended: class field arrow function
class Form extends React.Component {
  // Automatically bound to the instance — no constructor needed
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
  };

  render() {
    return <form onSubmit={this.handleSubmit}>...</form>;
  }
}

// Functional component — no binding concerns at all
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 415. Explain the difference between binding in class components and functional components in React.

Class components require explicit binding because regular methods lose their `this` context when passed as event handlers. Functional components don't have `this` at all — closures capture the variables they need naturally, so binding is irrelevant.

```jsx
// Class — must handle 'this' binding
class ClassComp extends React.Component {
  state = { count: 0 };
  // Arrow function = auto-bound
  increment = () => this.setState((s) => ({ count: s.count + 1 }));
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}

// Functional — no 'this', closures handle everything
function FuncComp() {
  const [count, setCount] = useState(0);
  function increment() {
    setCount((c) => c + 1);
  } // no binding needed
  return <button onClick={increment}>{count}</button>;
}
```

---

## Day 16

### 416. What is the difference between Element and Component in React?

A React element is a plain JS object describing what to render (type, props, children) — it's the output of JSX. A component is a function or class that returns elements. Elements are instances; components are the blueprints.

```jsx
// React Element — plain object, describes UI
const element = <h1 className="title">Hello</h1>;
// Same as: { type: 'h1', props: { className: 'title', children: 'Hello' } }

// React Component — function that returns elements
function Greeting({ name }) {
  return <h1 className="title">Hello, {name}!</h1>;
}

// When you use a component in JSX, React calls it to get elements
const el = <Greeting name="Alice" />;
// React calls Greeting({ name: 'Alice' }) → returns element
```

---

### 417. How to apply validation on props in React?

Use the `prop-types` library to declare expected prop types and whether they're required. React shows console warnings during development if props don't match. In TypeScript projects, interface/type definitions provide the same at compile time.

```jsx
import PropTypes from "prop-types";

function UserCard({ name, age, role }) {
  return (
    <div>
      {name} ({age}) — {role}
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string,
  role: PropTypes.oneOf(["admin", "user", "mod"]),
};

UserCard.defaultProps = { role: "user" };

// TypeScript alternative (preferred in modern projects):
// interface UserCardProps { name: string; age: number; role?: 'admin' | 'user'; }
```

---

### 418. Why is a React component declarative?

React components are declarative because you describe what the UI should look like for a given state — not the step-by-step instructions for how to update the DOM. React figures out the "how" internally via reconciliation.

```jsx
// Imperative (vanilla JS) — tells HOW to update DOM step by step
const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  const count = parseInt(span.textContent) + 1;
  span.textContent = count;
  if (count > 5) btn.style.color = "red";
});

// Declarative (React) — describes WHAT the UI should look like
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button style={{ color: count > 5 ? "red" : "black" }} onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

### 419. What is ReactDOM package?

ReactDOM is the package that connects React to the browser's real DOM. It provides the `createRoot` method (React 18+) to mount React component trees, and handles efficient DOM updates via reconciliation.

```jsx
import React from "react";
import ReactDOM from "react-dom/client"; // React 18+
import App from "./App";

// Mount the React tree into the real DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Other ReactDOM utilities:
// ReactDOM.createPortal(child, container) — portals
// ReactDOM.flushSync(fn)                 — sync updates
```

---

### 420. How is React different from Angular?

React is a UI library (only handles views, you pick other tools). Angular is a full MVC framework with routing, forms, HTTP, and DI built in. React uses JavaScript/JSX; Angular uses TypeScript. React has a gentler learning curve; Angular is more opinionated and structured.

```jsx
// React — just the view layer, you add what you need
import React from "react";
// + React Router for routing
// + Axios for HTTP
// + Redux for state
// + Formik for forms

// Angular — everything included out of the box
import { HttpClient } from "@angular/common/http"; // built-in
import { Router } from "@angular/router"; // built-in
import { FormBuilder } from "@angular/forms"; // built-in
// Angular enforces TypeScript, decorators, DI, modules
```

---

## Day 17

### 421. Explain the use of CSS modules in React.

CSS Modules scope CSS class names to the component by auto-generating unique identifiers at build time. This prevents class name collisions between components, allowing you to use simple names like `.button` without worrying about conflicts.

```jsx
/* Button.module.css */
.button { background: blue; color: white; padding: 8px 16px; }
.disabled { opacity: 0.5; cursor: not-allowed; }

/* Button.jsx */
import styles from './Button.module.css';

function Button({ disabled, children }) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`}
    >
      {children}
    </button>
  );
}
// Compiled class name: Button_button__3aF9x (unique — no collision!)
```

---

### 422. Can you explain what custom hooks are in React and how they differ from regular hooks?

Custom hooks are user-defined functions that start with `use` and call existing React hooks internally. They extract reusable stateful logic from components. Unlike built-in hooks (`useState`, `useEffect`), custom hooks are written by you and specific to your app's needs.

```jsx
// Custom hook — extracts window resize logic
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return size;
}

// Reuse in any component
function App() {
  const { width, height } = useWindowSize();
  return (
    <p>
      Window: {width}x{height}
    </p>
  );
}
```

---

### 423. What are the benefits of using custom hooks in React? Can you provide an example of a scenario where a custom hook would be useful?

Custom hooks reduce code duplication, improve component readability by hiding complex logic, make logic testable in isolation, and enable sharing logic across components without HOCs or render props.

```jsx
// Custom hook: useLocalStorage — saves state to localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const setAndStore = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setAndStore];
}

// Reusable across multiple components
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [lang, setLang] = useLocalStorage("lang", "en");
}
```

---

### 424. How do you create a custom hook in React?

Create a function prefixed with `use`, call existing React hooks inside it, and return any values or functions consumers need. The `use` prefix is required — it tells React to apply the rules of hooks to this function.

```jsx
// Step 1: Define function with 'use' prefix
function useFetch(url) {
  // Step 2: Use React hooks inside
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [url]);

  // Step 3: Return what consumers need
  return { data, loading, error };
}

// Usage
function Posts() {
  const { data, loading } = useFetch("/api/posts");
  if (loading) return <p>Loading...</p>;
  return (
    <ul>
      {data?.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

---

### 425. Are there any limitations or considerations when using custom hooks in React? Are there any performance implications or potential pitfalls that developers should be aware of?

Custom hooks must follow the rules of hooks: only call them at the top level (not inside conditionals or loops), and only call them from React functions. Incorrect dependency arrays inside custom hooks can cause stale closures or infinite loops.

```jsx
// WRONG — conditional hook usage breaks rules of hooks
function useConditionalFetch(url, enabled) {
  if (!enabled) return null; // VIOLATION: returns before hooks
  const [data, setData] = useState(null);
  useEffect(() => {
    /* fetch */
  }, [url]);
  return data;
}

// CORRECT — hook always runs, condition is inside
function useFetch(url, enabled = true) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!enabled) return; // condition INSIDE hook is fine
    fetch(url)
      .then((r) => r.json())
      .then(setData);
  }, [url, enabled]);

  return data;
}
```

---

## Day 18

### 426. What is Formik, and why would you use it in a React application?

Formik is a form management library that handles form state, validation, and submission boilerplate. It reduces repetitive controlled component code, integrates with validation libraries like Yup, and manages touched/error states automatically.

```jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const schema = Yup.object({ email: Yup.string().email().required() });

function LoginForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />
        <Field name="password" type="password" />
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
}
```

---

### 427. What are the advantages of using Formik over traditional form handling in React?

Formik eliminates boilerplate — no manual `onChange` handler for every field, no separate error state management, no touched tracking. It provides built-in Yup integration for schema validation and handles async submission with `isSubmitting` state.

```jsx
// Traditional — lots of manual state management
function TraditionalForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  // ... even more state for every field

  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={() => setTouched(true)}
    />
  );
}

// Formik — all the above handled automatically
// Just declare initialValues, validationSchema, onSubmit
```

---

### 428. What is Axios, and what problem does it solve in JavaScript or React development?

Axios is an HTTP client for JavaScript. It solves the verbosity of the Fetch API by providing automatic JSON parsing, easier error handling (non-2xx responses are thrown as errors), request/response interceptors, and timeout support.

```jsx
import axios from "axios";

// Axios — automatic JSON parsing, cleaner syntax
async function fetchUser(id) {
  try {
    const { data } = await axios.get(`/api/users/${id}`);
    return data; // already parsed JSON
  } catch (error) {
    console.error(error.response.status); // 404, 500, etc.
  }
}

// Compare with Fetch — more steps needed
async function fetchUserFetch(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Request failed"); // manual check!
  return await res.json(); // must parse manually
}
```

---

### 429. What are the advantages of using Axios over the built-in fetch API in JavaScript?

Axios automatically transforms JSON, throws errors for non-2xx status codes (fetch doesn't), supports request cancellation, allows global interceptors for auth headers/logging, supports timeout out of the box, and works in both browser and Node.js.

```jsx
// Axios interceptor — add auth token to every request
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

// Axios interceptor — global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) logout();
    return Promise.reject(error);
  },
);

// Request cancellation
const controller = new AbortController();
axios.get("/api/data", { signal: controller.signal });
controller.abort(); // cancel the request
```

---

### 430. What is Material-UI, and what is its purpose in React development?

Material-UI (MUI) is a React component library implementing Google's Material Design. It provides ready-made, accessible, customizable components (buttons, forms, modals, etc.) so developers can build polished UIs quickly without designing from scratch.

```jsx
import { Button, TextField, Card, CardContent, Typography } from "@mui/material";

function LoginCard() {
  return (
    <Card sx={{ maxWidth: 400, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <TextField label="Email" type="email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## Day 19

### 431. What is render hijacking in react?

Render hijacking is controlling what a component renders from outside it, typically via an HOC. The HOC wraps the component and can change the output — conditionally rendering different UI, adding props, or replacing the render entirely.

```jsx
// HOC that "hijacks" render — shows auth guard instead
function withAuthGuard(WrappedComponent) {
  return function AuthGuarded({ isAuthenticated, ...props }) {
    if (!isAuthenticated) {
      // Hijacked! Render login prompt instead of the component
      return <div>Please log in to access this page.</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuthGuard(Dashboard);

<ProtectedDashboard isAuthenticated={false} />;
// → Shows "Please log in..." instead of Dashboard
```

---

### 432. What are Keyed Fragments?

Keyed Fragments use `<React.Fragment key={id}>` to wrap elements in a list without adding DOM nodes, while still providing React's required key for efficient reconciliation. You can't use the shorthand `<></>` syntax with keys.

```jsx
function GlossaryList({ items }) {
  return (
    <dl>
      {items.map((item) => (
        // Keyed Fragment — no extra DOM wrapper, but has a key
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
        // Can't use <> here because shorthand doesn't support key
      ))}
    </dl>
  );
}
```

---

### 433. What is suspense component?

`Suspense` lets you declaratively specify a fallback UI to show while lazy-loaded components or data are still loading. It "catches" the loading state of any child that suspends, showing the fallback until the content is ready.

```jsx
import { lazy, Suspense } from "react";

const HeavyMap = lazy(() => import("./HeavyMap"));
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<div className="spinner">Loading...</div>}>
      <Dashboard />
      <HeavyMap />
    </Suspense>
  );
}

// Nest Suspense for granular loading states
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>;
```

---

### 434. Is it possible to use react without JSX?

Yes. JSX is just syntactic sugar for `React.createElement()`. You can write React apps purely with function calls, but the code becomes much harder to read as nesting increases. JSX is not mandatory, just highly recommended.

```jsx
// With JSX (recommended)
const element = (
  <div className="container">
    <h1>Hello, {name}</h1>
    <button onClick={fn}>Click</button>
  </div>
);

// Without JSX — using createElement directly
const element = React.createElement(
  "div",
  { className: "container" },
  React.createElement("h1", null, `Hello, ${name}`),
  React.createElement("button", { onClick: fn }, "Click"),
);
// Both are identical — JSX compiles to createElement calls
```

---

### 435. Why does strict mode render twice in React?

In development, StrictMode intentionally calls render and some lifecycle methods twice to help detect unintended side effects. If a component is pure (same output for same input), double-rendering won't cause any visible issues.

```jsx
function Counter() {
  const [count, setCount] = useState(() => {
    console.log("initializer called"); // called TWICE in dev
    return 0;
  });

  console.log("render called"); // called TWICE in dev

  useEffect(() => {
    console.log("effect setup"); // called TWICE in dev (React 18)
    return () => console.log("effect cleanup");
  }, []);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
// In PRODUCTION — renders once, effects run once
```

---

## Day 20

### 436. What is React Fiber?

React Fiber is the internal reconciliation algorithm rewritten in React 16. It breaks rendering work into small units called "fibers", allows pausing and resuming work, and enables priority-based scheduling — powering features like Concurrent Mode and Suspense.

```jsx
// React Fiber powers features you use daily:
// 1. Priority scheduling — user interactions > background updates
// 2. Time-slicing — breaks rendering into chunks, won't block UI
// 3. Concurrent features — useTransition, useDeferredValue

import { useTransition } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value); // high priority — instant
    startTransition(() => {
      setResults(search(e.target.value)); // low priority — can defer
    });
  };
}
```

---

### 437. How does React Fiber improve the overall performance of React applications?

Fiber enables incremental rendering — React can pause work, prioritize urgent updates (like typing), and resume later. This prevents the main thread from blocking during heavy renders, keeping animations and interactions smooth.

```jsx
import { useDeferredValue } from "react";

function SearchResults({ query }) {
  // Low-priority update — won't block user typing
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => heavySearch(deferredQuery), // runs when browser is idle
    [deferredQuery],
  );

  return (
    <ul style={{ opacity: query !== deferredQuery ? 0.7 : 1 }}>
      {results.map((r) => (
        <li key={r.id}>{r.title}</li>
      ))}
    </ul>
  );
}
```

---

### 438. What is Babel in React js?

Babel is a JavaScript compiler that transforms modern JS (ES6+, JSX, TypeScript) into plain ES5 that older browsers can run. In React, it's essential for converting JSX into `React.createElement()` calls at build time.

```jsx
// .babelrc config for a React project
{
  "presets": [
    "@babel/preset-env",      // transforms ES6+ → ES5
    "@babel/preset-react",    // transforms JSX → createElement
    "@babel/preset-typescript" // strips TypeScript types
  ]
}

// Babel input:
const greet = (name) => <h1>Hello, {name}!</h1>;

// Babel output (ES5 + no JSX):
var greet = function(name) {
  return React.createElement("h1", null, "Hello, " + name + "!");
};
```

---

### 439. What is a wrapper component in react?

A wrapper component encapsulates another component to add functionality, styling, or behavior — like a decorator pattern. Common examples are layout wrappers, authentication guards, error boundaries, and theme providers.

```jsx
// Layout wrapper — adds consistent page structure
function PageLayout({ children, title }) {
  return (
    <div className="page">
      <Header />
      <main>
        <h1>{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Auth wrapper — protects routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

<PageLayout title="Dashboard">
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
</PageLayout>;
```

---

### 440. Explain DOM diffing?

DOM diffing (reconciliation) is React comparing the new Virtual DOM with the previous one after a state change. React identifies the minimum number of changes needed and applies only those to the real DOM — making updates fast.

```jsx
// Before state change (old VDOM)
<ul>
  <li key="a">Alice</li>
  <li key="b">Bob</li>
  <li key="c">Charlie</li>
</ul>

// After state change (new VDOM — Bob removed)
<ul>
  <li key="a">Alice</li>
  <li key="c">Charlie</li>
</ul>

// React's diff result (using keys):
// Remove: <li key="b"> (Bob)
// Keep:   <li key="a"> (Alice) — no DOM update needed
// Keep:   <li key="c"> (Charlie) — no DOM update needed
// Only ONE real DOM operation performed
```

---

## Day 21

### 441. What are the dependencies in the dependency array of the useEffect hook? How do they affect the behavior of the hook?

Dependencies are values the effect relies on. React compares them between renders. If any dependency changed, the effect re-runs. Empty array means run once after mount. Omitting the array means run after every render.

```jsx
// Run once after mount only (empty deps)
useEffect(() => {
  fetchData();
}, []);

// Run when 'userId' changes
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Run after every render (no deps array)
useEffect(() => {
  document.title = "Updated";
});

// Run when multiple deps change
useEffect(() => {
  const filtered = filterData(data, searchTerm, page);
  setResults(filtered);
}, [data, searchTerm, page]);
```

---

### 442. What are some common use cases for the useEffect hook?

Common uses: fetching data from APIs, subscribing to WebSockets or event emitters, setting document title, adding/removing DOM event listeners, and syncing with third-party (non-React) libraries.

```jsx
// 1. Data fetching
useEffect(() => {
  fetch("/api/data").then(setData);
}, [id]);

// 2. Document title
useEffect(() => {
  document.title = `${unreadCount} unread messages`;
}, [unreadCount]);

// 3. Event listeners
useEffect(() => {
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);

// 4. Third-party library (e.g., chart.js)
useEffect(() => {
  const chart = new Chart(canvasRef.current, config);
  return () => chart.destroy();
}, [data]);
```

---

### 443. Can you explain the concept of multiple useEffect hooks in a single component? How do they interact with each other?

You can use as many `useEffect` hooks as needed in one component — each handles a separate concern. They run independently in the order they're declared and do not directly interact with each other.

```jsx
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(0);

  // Effect 1: fetch user profile
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // Effect 2: subscribe to activity feed
  useEffect(() => {
    const unsub = subscribeToActivity(userId, setActivity);
    return () => unsub();
  }, [userId]);

  // Effect 3: update document title
  useEffect(() => {
    document.title = `${unread} notifications`;
  }, [unread]);

  // Each effect is independent — clean separation of concerns
}
```

---

### 444. What is the purpose of the cleanup function returned by the useEffect hook? How can you utilize it effectively?

The cleanup function runs before the next effect execution and when the component unmounts. It's used to prevent memory leaks by cancelling subscriptions, clearing timers, aborting fetches, or removing event listeners.

```jsx
function LiveChat({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Setup: subscribe to room
    const socket = subscribeToRoom(roomId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup: runs before next effect OR on unmount
    return () => {
      socket.disconnect(); // stop WebSocket
      setMessages([]); // clear stale messages
    };
  }, [roomId]); // when roomId changes, cleanup runs first, then re-subscribes

  return <MessageList messages={messages} />;
}
```

---

### 445. What are the potential pitfalls or common mistakes when using the useEffect hook? How can you avoid them?

Common mistakes: missing dependencies (stale values), adding too many deps (infinite loops), forgetting cleanup (memory leaks), and running effects when they shouldn't. Use ESLint's `exhaustive-deps` rule to catch missing dependencies.

```jsx
// MISTAKE 1: Missing dependency — stale closure
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // always logs 0 — stale!
    }, 1000);
    return () => clearInterval(id);
  }, []); // BUG: count missing from deps
  // FIX: use functional update: setCount(c => c + 1)
}

// MISTAKE 2: Object in deps — infinite loop
useEffect(() => {
  fetch("/api", { body: JSON.stringify(options) });
}, [options]); // new object reference each render → infinite loop
// FIX: useMemo for options, or list specific fields as deps
```

---

## Day 22

### 446. What is server-side rendering (SSR) in React.js?

SSR renders React components on the server into HTML, sending a fully rendered page to the browser. The browser shows content immediately (no blank screen), then React hydrates the HTML to make it interactive.

```jsx
// Server (Node.js + Express) — renders React to HTML string
import { renderToString } from "react-dom/server";
import App from "./App";

app.get("*", (req, res) => {
  const html = renderToString(<App url={req.url} />);

  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="root">${html}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `);
});
```

---

### 447. Why would you choose to use server-side rendering instead of client-side rendering in React.js?

Choose SSR when you need: fast First Contentful Paint (users see content immediately), SEO (search engines index the pre-rendered HTML), or good performance on low-end devices that struggle with heavy JS bundles.

```jsx
// CSR (Client-Side Rendering) timeline:
// 1. Browser gets empty <div id="root"></div>
// 2. Downloads JS bundle (slow on bad connection)
// 3. JS executes, fetches data, renders page
// SEO: search engine sees empty page

// SSR timeline:
// 1. Server renders full HTML and sends it
// 2. User sees content immediately
// 3. JS hydrates — page becomes interactive
// SEO: search engine sees full content
// Use Next.js or Remix for SSR in React projects
```

---

### 448. How does server-side rendering differ from client-side rendering in React.js?

CSR: server sends an empty HTML shell, browser downloads JS, React runs in browser and renders. SSR: server renders React to full HTML, browser shows it instantly, then JS hydrates it. SSR is faster to first paint; CSR is faster for subsequent navigation.

```jsx
// CSR — what the server sends:
// <html><body><div id="root"></div><script src="app.js"></script></body></html>
// Browser downloads and runs app.js before anything shows

// SSR — what the server sends:
// <html><body>
//   <div id="root">
//     <h1>Hello Alice</h1>
//     <nav>...</nav>
//     <main><article>...</article></main>
//   </div>
//   <script src="app.js"></script>
// </body></html>
// User sees the full page before JS even loads
```

---

### 449. Explain the benefits and drawbacks of server-side rendering in React.js.

SSR benefits: better SEO, faster First Contentful Paint, works for users with disabled JS. Drawbacks: higher server load, slower Time to Interactive (hydration cost), more complex setup, and browser-specific code (`window`, `localStorage`) breaks on the server.

```jsx
// SSR pitfall — browser APIs don't exist on server
function MyComponent() {
  // CRASH on server: 'window is not defined'
  // const width = window.innerWidth;

  // FIX 1: Check for browser environment
  const width = typeof window !== "undefined" ? window.innerWidth : 0;

  // FIX 2: Move browser API to useEffect (client-only)
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth); // only runs in browser
  }, []);
}
```

---

### 450. What are the performance implications of server-side rendering in React.js?

SSR improves Time to First Byte and First Contentful Paint, but increases server CPU load per request. Time to Interactive (TTI) may be longer because the browser still must download and parse JS for hydration before the page is fully interactive.

```jsx
// Performance metrics comparison:
//
// Metric               | CSR      | SSR
// First Content Paint  | SLOW     | FAST (server sends HTML)
// Time to Interactive  | MEDIUM   | SLOWER (hydration overhead)
// Server Load          | LOW      | HIGH (renders per request)
// Subsequent pages     | FAST     | FAST (client-side nav)

// Optimization: streaming SSR (React 18)
import { renderToPipeableStream } from "react-dom/server";

app.get("/", (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      pipe(res);
    }, // stream HTML as it renders
  });
});
```

---

## Day 23

### 451. How can you implement server-side rendering with React.js without using frameworks like Next.js?

Set up a Node.js + Express server, use Webpack/Babel to compile JSX, and use `react-dom/server`'s `renderToString` or `renderToPipeableStream` to generate HTML on the server for each request.

```jsx
// server.js
import express from "express";
import { renderToString } from "react-dom/server";
import App from "./src/App";

const app = express();
app.use(express.static("dist")); // serve client bundle

app.get("*", (req, res) => {
  const appHtml = renderToString(<App />);
  res.send(`<!DOCTYPE html>
    <html>
      <head><title>My App</title></head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.js"></script>
      </body>
    </html>`);
});

app.listen(3000);
```

---

### 452. Describe the steps involved in setting up server-side rendering with React.js from scratch.

Steps: 1) Node.js server (Express), 2) Webpack with two configs (server + client), 3) Babel for JSX/ES6, 4) Server entry point using `renderToString`, 5) Client entry point using `hydrateRoot`, 6) Static asset serving.

```jsx
// 1. Server entry — renders to string
import { renderToString } from "react-dom/server";
const html = renderToString(<App url={req.url} />);

// 2. Client entry — hydrates the server HTML
import { hydrateRoot } from "react-dom/client";
hydrateRoot(document.getElementById("root"), <App />);
// hydrateRoot attaches event listeners WITHOUT re-rendering

// 3. webpack.config.js — two build targets
module.exports = [
  { target: "node", entry: "./server.js", output: { filename: "server.bundle.js" } },
  { target: "web", entry: "./client.js", output: { filename: "client.js" } },
];
```

---

### 453. What libraries or tools can be used to perform server-side rendering with React.js?

Core: `react-dom/server` (`renderToString`, `renderToPipeableStream`). Full frameworks: Next.js (most popular), Remix, Gatsby (static). Build tools: Webpack, Vite. Server: Express, Fastify.

```jsx
// Core SSR APIs from react-dom/server

// renderToString — synchronous, waits for full render
import { renderToString } from "react-dom/server";
const html = renderToString(<App />);

// renderToPipeableStream — streaming, React 18+ (preferred)
import { renderToPipeableStream } from "react-dom/server";
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady: () => pipe(response),
});

// Next.js — easiest SSR setup
// pages/index.js
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}
```

---

### 454. How can you handle data fetching and asynchronous operations during server-side rendering in React.js?

Fetch data before rendering on the server, pass it as props. In React 18, use async Server Components. In Next.js, use `getServerSideProps` or `getStaticProps`. Pass fetched data via hydration to avoid double-fetching on the client.

```jsx
// Next.js — server-side data fetching
// getServerSideProps runs on server BEFORE render
export async function getServerSideProps(context) {
  const { id } = context.params;
  const user = await db.users.findById(id); // direct DB access!

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}

export default function UserPage({ user }) {
  // 'user' is pre-fetched — no useEffect needed
  return <h1>Welcome, {user.name}</h1>;
}
```

---

### 455. What considerations should you keep in mind when implementing server-side rendering for a large-scale React.js application?

Key considerations: caching rendered pages (CDN/Redis), avoiding memory leaks in server-side code, handling browser-only APIs safely, managing serialized state size, splitting code for faster hydration, and load balancing under high traffic.

```jsx
// 1. Caching — avoid re-rendering same page on every request
const cache = new Map();
app.get("/product/:id", (req, res) => {
  const cacheKey = req.url;
  if (cache.has(cacheKey)) return res.send(cache.get(cacheKey));
  const html = renderToString(<ProductPage id={req.params.id} />);
  cache.set(cacheKey, html);
  res.send(html);
});

// 2. Guard browser-only code
const isServer = typeof window === "undefined";
const storage = isServer ? null : localStorage;

// 3. Serialize initial state carefully (avoid XSS)
const stateJson = JSON.stringify(state).replace(/</g, "\\u003c");
```

---

## Day 24

### 456. Can you explain the concept of code splitting and how it relates to server-side rendering in React.js?

Code splitting breaks the JS bundle into smaller chunks loaded on demand. With SSR, you can serve the pre-rendered HTML immediately, then load only the JS chunk needed for that specific page — reducing Time to Interactive.

```jsx
// React.lazy + dynamic import (works with SSR frameworks)
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

function App() {
  return (
    <Routes>
      <Route
        path="/product/:id"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <ProductPage /> {/* chunk only loads on /product/* */}
          </Suspense>
        }
      />
      <Route
        path="/checkout"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <CheckoutPage /> {/* separate chunk */}
          </Suspense>
        }
      />
    </Routes>
  );
}
```

---

### 457. How can you optimize server-side rendered React.js applications for search engine optimization (SEO)?

For SEO: ensure all important content is in the initial server-rendered HTML, set accurate meta tags (title, description, Open Graph) per page, use semantic HTML, and add structured data (JSON-LD).

```jsx
// Next.js — SEO metadata per page
import Head from "next/head";

export default function BlogPost({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} — My Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.coverImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
          })}
        </script>
      </Head>
      <article>{post.content}</article>
    </>
  );
}
```

---

### 458. What are some common challenges or pitfalls associated with server-side rendering in React.js, and how can you address them?

Common pitfalls: browser APIs (`window`/`document`) causing server crashes, hydration mismatches, large serialized state, third-party libraries not SSR-compatible, and memory leaks from global state on the server.

```jsx
// Challenge 1: Hydration mismatch
// BAD: Date.now() differs between server and client
function Timestamp() {
  return <span>{Date.now()}</span>;
}

// FIX: Render consistently, update in useEffect
function Timestamp() {
  const [time, setTime] = useState("");
  useEffect(() => {
    setTime(Date.now().toString());
  }, []);
  return <span>{time || "Loading..."}</span>;
}

// Challenge 2: Non-SSR-compatible library (e.g., uses window)
// FIX: Dynamic import with ssr: false (Next.js)
const Chart = dynamic(() => import("./Chart"), { ssr: false });
```

---

### 459. How does server-side rendering impact the development and debugging process compared to client-side rendering?

SSR adds complexity: you debug in two environments (Node.js + browser), hydration mismatches are tricky to diagnose, server errors appear in the terminal not DevTools, and some browser debugging tools only work on client-side code.

```jsx
// Debugging SSR-specific issues

// 1. Hydration warning in browser console:
// "Warning: Text content did not match. Server: '...' Client: '...'"
// Fix: ensure server and client render identically

// 2. Logging on server vs client
function debugLog(msg, data) {
  if (typeof window === "undefined") {
    console.log("[SERVER]", msg, data); // terminal
  } else {
    console.log("[CLIENT]", msg, data); // browser DevTools
  }
}

// 3. React DevTools only shows client-rendered components
// For server errors, check your terminal/server logs
```

---

### 460. Can you explain the concept of hydration in the context of server-side rendering in React.js?

Hydration is the process where React attaches event listeners and state to existing server-rendered HTML without re-rendering it. React "rehydrates" the static HTML into a fully interactive app — matching the server's render to avoid replacing the DOM.

```jsx
// Server sends pre-rendered HTML:
// <div id="root"><button>Clicked 0 times</button></div>

// Client entry point — hydrateRoot (not createRoot)
import { hydrateRoot } from "react-dom/client";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>;
}

// hydrateRoot: attaches React to existing HTML WITHOUT replacing DOM
// createRoot: would replace the server HTML with fresh React render
hydrateRoot(document.getElementById("root"), <Counter />);
// Now the button is interactive!
```

---

## Day 25

### 461. What are the best practices for organizing and structuring a React application?

Organize by feature (co-locate related files), separate UI components from containers/logic, use an `index.js` barrel file per folder, keep components small and focused, and use TypeScript for type safety.

```
src/
├── features/
│   ├── auth/
│   │   ├── AuthForm.jsx
│   │   ├── useAuth.js       (custom hook)
│   │   ├── authSlice.js     (Redux slice)
│   │   └── index.js         (barrel export)
│   └── products/
│       ├── ProductCard.jsx
│       ├── ProductList.jsx
│       └── useProducts.js
├── components/              (shared/generic UI)
│   ├── Button.jsx
│   └── Modal.jsx
├── hooks/                   (shared custom hooks)
├── utils/                   (helpers, formatters)
└── App.jsx
```

---

### 462. How do you handle authentication and authorization in React applications?

Common approaches: JWT stored in httpOnly cookies (most secure), protect routes with a `ProtectedRoute` component, and use third-party solutions like Auth0, Firebase Auth, or NextAuth.js for the full auth flow.

```jsx
// Protected Route pattern
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Role-based authorization
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/403" />;
  return children;
}

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>;
```

---

### 463. What are the pros and cons of using React in a project compared to other JavaScript frameworks?

Pros: huge ecosystem, flexible, component reuse, virtual DOM, strong community, excellent DevTools. Cons: just a library (must choose own routing/state), JSX learning curve, rapid ecosystem churn, and not opinionated (too many choices can slow teams).

```jsx
// React — most flexible, you assemble your own stack
import { BrowserRouter } from "react-router-dom"; // routing
import { Provider } from "react-redux"; // state
import axios from "axios"; // HTTP
import { useForm } from "react-hook-form"; // forms

// Angular — batteries included, forces TypeScript + decorators
// Vue — middle ground, friendlier learning curve
//       vue-router + Pinia are the official choices
```

---

### 464. Why do we need Nextjs?

Next.js extends React with SSR, SSG, file-based routing, API routes, Image optimization, and more — out of the box. It removes the need to configure Webpack, Babel, routing, and server setup, letting you focus on building features.

```jsx
// Next.js file-based routing — just create files!
// pages/index.js          → /
// pages/about.js          → /about
// pages/blog/[slug].js    → /blog/any-post
// pages/api/users.js      → /api/users (serverless API endpoint!)

// getStaticProps — build-time static generation
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts }, revalidate: 60 }; // ISR!
}

// getServerSideProps — per-request SSR
export async function getServerSideProps({ req }) {
  const user = await getUser(req.cookies.token);
  return { props: { user } };
}
```

---

### 465. What are some of the challenges you have faced working with React?

_Write your own answer based on your experience._

Some common challenges developers mention: managing complex state across deeply nested components, debugging stale closures in `useEffect`, handling race conditions in data fetching, optimizing performance for large lists, and keeping up with the rapidly evolving React ecosystem.

```jsx
// Example: Handling race conditions in useEffect
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false; // flag to prevent stale updates

    fetchUser(userId).then((data) => {
      if (!cancelled) setUser(data); // only update if still relevant
    });

    return () => {
      cancelled = true;
    }; // cleanup on userId change
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

---

_End of Days 69–93 — 125 Questions Total_
