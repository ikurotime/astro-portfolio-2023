---
title: 'The biggest issue in React'
pubDate: 2025-09-10
description: 'Half of the useEffect hooks you see in React are unnecessary. The other half are poorly written. And the remaining 1%... that one actually makes sense.'
author: 'Kuro'
language: en
heroImage: "../../../images/blog/react-logo.png"
keywords: ['react', 'reactjs', 'react biggest issue', 'react biggest problem', 'useEffect', 'sync state in react', 'useState', 'react state', 'react state management', 'react hooks', 'tanstack query', 'useMemo']
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'The full Astro logo.'
tags: ['react', 'hooks', 'performance']
layout: ../../../layouts/PostLayout.astro
draft: false
---
> Half of the useEffect hooks in React codebases are redundant. The other half are implemented incorrectly. A few of them actually make sense.

The `useEffect` hook has become the go-to solution for developers when they can't find a direct React approach to solve their problems. It's treated like a universal fix for any state management challenge.

Developers reach for it when fetching data.

When they need to sync props with local state.

When they want to coordinate different pieces of state between components (even entire pages).

Data fetching is somewhat understandable, but the other patterns reveal a fundamental misunderstanding of React's design principles. If you find yourself reaching for `useEffect` often, there's probably a better way to handle your use case.


## The Common Pattern

The standard approach developers take: *"Data changes → trigger `useEffect` → modify state"*.


```jsx
const Edit = ({ data, onSave }) => {
  const [someData, setSomeData] = useState(data)

  useEffect(() => {
    setSomeData(data) // ❌ Don't do this! You don't synchronize React state to React state; it's redundant.
  }, [someData])

  return (
    <form>
      <input 
          value={someData.name} 
        onChange={(e) => setSomeData({...someData, name: e.target.value})}
      />
      <button onClick={() => onSave(someData)}>Save</button>
    </form>
  )
}
```

Another frequent use is **manual data fetching**:

```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return <div>{user?.name}</div>
}
```
## Why useEffect Approach Fails

Every additional `useEffect` introduces:
- **Excessive re-renders**
- **Complex dependency management**
- **Bug potential** (infinite loops, state inconsistencies)


> This stems from treating React as an imperative framework rather than embracing its declarative nature.

What do I mean by that?

Let's say you have a component that displays a user's profile.

```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
}
```
When the `userId` prop changes, you want to fetch the new user's data. You can do this with `useEffect`:

```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/users/${userId}`)
        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return <div>{user?.name}</div>
}
```

This is **imperative thinking**: "When userId changes, I need to tell React to fetch data and update the state."

The **declarative approach** would be: "This component displays user data. The data comes from the server based on the userId."

```jsx
const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
    enabled: !!userId
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{user?.name}</div>
}
```


When you manually implement data fetching with `useEffect`, you're essentially rebuilding features that libraries like React Query already provide:
- loading states
- error handling
- caching mechanisms
- data revalidation
- cross-tab synchronization

For non-fetching scenarios, you're usually computing derived state that could be handled more efficiently with `useMemo`.

## The Anti-Library Approach

"I prefer to build everything from scratch using custom hooks with `useEffect`."

While this might seem appealing, consider the reality:
- Your project scales and you end up maintaining multiple custom hooks for different scenarios
- You invest significant time maintaining solutions that **already exist, are thoroughly tested, optimized, and battle-tested in production**
- Even without external libraries, using `useEffect` for state derivation is unnecessarily complex

## Better Alternatives

**Scenario 1 (data fetching):** Leverage TanStack Query (React Query). It provides all the functionality you were trying to implement manually with `useEffect`.

```jsx
import { useQuery } from '@tanstack/react-query'

const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json())
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{user?.name}</div>
}
```

**Scenario 2 (computing derived state):** Utilize `useMemo`. Here's a practical example:

```jsx
export default function Cart({ items }) {
  // ❌ Common pattern with useEffect
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((acc, i) => acc + i.price * i.qty, 0));
  }, [items]);

  return <div>Total: {total}</div>;
}
```

```jsx
export default function Cart({ items }) {
  // ✅ Declarative with useMemo
  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  return <div>Total: {total}</div>;
}
```

**Scenario 3 (actual DOM interactions):** The rare cases where `useEffect` is genuinely needed (`event listeners`, `scroll handling`, third-party integrations).

```jsx
// ✅ This is a valid effect: subscribing to DOM events
const Button = ({ onClick }) => {
  useEffect(() => {
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [onClick])

  return <button>Click</button>
}
```

## The point is...

> Before reaching for useEffect, evaluate: Is this data fetching? Use TanStack Query. Is this a computation? Use useMemo. Is this DOM manipulation or external API integration? Only then consider useEffect.
