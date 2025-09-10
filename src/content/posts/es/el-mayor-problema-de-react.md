---
title: 'El mayor problema en React'
pubDate: 2025-09-10
description: 'La mitad de los useEffect que ves en React son innecesarios. La otra mitad están mal escritos. Y el 1% que queda... ese sí que tiene sentido.'
author: 'Kuro'
language: es
heroImage: "../../../images/blog/react-logo.png"
keywords: ['react', 'reactjs', 'react mayor problema', 'react mayor issue', 'useEffect', 'sincronizar estado en react', 'useState', 'react estado', 'react gestión de estado', 'react hooks', 'tanstack query', 'useMemo']
image:
  url: 'https://docs.astro.build/assets/full-logo-light.png'
  alt: 'The full Astro logo.'
tags: ['react', 'hooks', 'performance']
layout: ../../../layouts/PostLayout.astro
draft: false
---

> La mitad de los useEffect en proyectos de React son redundantes. La otra mitad está implementada incorrectamente. Solo algunos de ellos tienen sentido.

El hook `useEffect` se ha convertido en la solución predeterminada cuando los desarrolladores no encuentran un enfoque directo en React para resolver sus problemas. Se usa como una solución universal para cualquier problema a la hora de gestionar el estado.

Los desarrolladores lo usan para hacer fetching de datos.

Cuando necesitan sincronizar props con el estado local de un componente.

Cuando quieren sincronizar diferentes trozos de estado entre componentes (incluso páginas enteras).

Con el fetching de datos es comprensible hasta cierto punto, pero los otros patrones muestran una comprensión erronea sobre los principios fundamentales de diseño de React. Si recurres a `useEffect` a menudo, lo más seguro es que exista una mejor manera de gestionar tu caso de uso.


## Patrones Comunes

El enfoque más estándar que toman los desarrolladores: *"Los datos cambian → `useEffect` se dispara → modifico estado"*.


```jsx
const Edit = ({ data, onSave }) => {
  const [someData, setSomeData] = useState(data)

  useEffect(() => {
    setSomeData(data) // ❌ ¡No hagas esto! No se sincroniza estado de React con React, es redundante.
  }, [someData])

  return (
    <form>
      <input 
          value={someData.name} 
        onChange={(e) => setSomeData({...someData, name: e.target.value})}
      />
      <button onClick={() => onSave(someData)}>Guardar</button>
    </form>
  )
}
```

Otro uso frecuente es el **fetching manual de datos**:

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

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  return <div>{user?.name}</div>
}
```

## Por Qué useEffect Falla en estos Casos

Cada `useEffect` extra introduce:
- **Re-renders excesivos**
- **Gestión compleja de dependencias**
- **Potencial de bugs** (bucles infinitos, inconsistencias de estado)


> Esto surge como consecuencia de tratar React como un framework imperativo en lugar de usarlo de forma declarativa.

¿Qué quiero decir con eso?

Digamos que tienes un componente que muestra el perfil de un usuario.

```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
}
```
Cuando la prop `userId` cambia, quieres obtener los datos del nuevo usuario. Puedes hacer esto con `useEffect`:

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

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  return <div>{user?.name}</div>
}
```

Esto es **pensamiento imperativo**: "Cuando `userId` cambia, necesito decirle a React que obtenga datos y actualice el estado."

El **enfoque declarativo** sería: "Este componente renderiza datos de usuario. Los datos vendrán del servidor cuando `userId` cambie."

```jsx
const UserProfile = ({ userId }) => {
  // Esta query puede y debe definirse en otro archivo.
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
    enabled: !!userId
  })

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{user?.name}</div>
}
```

Cuando implementas fetching manual con `useEffect`, estás reconstruyendo características que librerías como React Query ya proporcionan:
- estados de carga
- manejo de errores
- mecanismos de caché
- revalidación de datos
- sincronización entre pestañas

Para escenarios que no son fetching, usualmente estás calculando / obteniendo estado que podría derivarse y gestionarse más eficientemente con `useMemo`.

## El Enfoque Anti-Librerías

"Prefiero construir todo desde cero usando custom hooks con `useEffect`".

Aunque esto pueda parecer una buena opción, considera lo siguiente:
- Tu proyecto va a escalar y terminarás manteniendo múltiples custom hooks para diferentes escenarios
- Invertirás tiempo significativo manteniendo soluciones que **ya existen, están completamente probadas, optimizadas y validadas en producción**
- Incluso sin librerías externas, usar `useEffect` para gestionar estado es innecesariamente complejo y fácil de romper.

## Alternativas Mejores

**Escenario 1 (data fetching):** Aprovecha TanStack Query (React Query). Proporciona toda la funcionalidad que estabas tratando de implementar manualmente con `useEffect`.

```jsx
import { useQuery } from '@tanstack/react-query'

const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json())
  })

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{user?.name}</div>
}
```

**Escenario 2 (computar estado derivado):** Utiliza `useMemo`. Aquí tienes un ejemplo práctico:

```jsx
export default function Cart({ items }) {
  // ❌ Patrón común con useEffect
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((acc, i) => acc + i.price * i.qty, 0));
  }, [items]);

  return <div>Total: {total}</div>;
}
```

```jsx
export default function Cart({ items }) {
  // ✅ Declarativo con useMemo
  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  return <div>Total: {total}</div>;
}
```

**Escenario 3 (interacciones reales con el DOM):** Los casos raros donde `useEffect` es genuinamente necesario (`event listeners`, `manejo de scroll`, integraciones de terceros).

```jsx
// ✅ Este es un effect válido: suscribirse a eventos del DOM
const Button = ({ onClick }) => 
  useEffect(() => {
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [onClick])
}
```

## El punto es...

> Antes de recurrir a useEffect, piensa: ¿Es esto fetching de datos? Usa TanStack Query. ¿Es esto un cálculo? Usa useMemo. ¿Es esto manipulación del DOM o integración con API externa? Solo entonces considera usar useEffect.
