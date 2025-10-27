# Plan de Implementación - Sistema de Login con Firebase

## Objetivo
Implementar autenticación en el Personal Dashboard usando Firebase Authentication con dos métodos:
- Login con Email/Password
- Login con Google

---

## Fases de Implementación

### FASE 4: Componentes de UI (1-2 horas)

#### 4.1 Crear componentes de autenticación
- [ ] `src/pages/SignUp.tsx` - Página de registro
- [ ] `src/components/auth/SignUpForm.tsx` - Formulario de registro
- [ ] `src/components/auth/ProtectedRoute.tsx` - Rutas protegidas

#### 4.2 Diseñar UI con TailwindCSS
- [ ] Diseño responsive
- [ ] Validación de formularios
- [ ] Mensajes de error
- [ ] Estados de loading
- [ ] Animaciones de transición

---

### FASE 5: Configuración de Routing (20-30 min)

#### 5.1 Modificar App.tsx
- [ ] Agregar rutas públicas:
  - `/login` → Login page
  - `/signup` → SignUp page
- [ ] Proteger rutas privadas:
  - `/dashboard` → Dashboard (protegido)
  - `/statistics` → Statistics (protegido)
- [ ] Configurar redirecciones:
  - Usuario autenticado en `/login` → `/dashboard`
  - Usuario no autenticado en `/dashboard` → `/login`

#### 5.2 Implementar ProtectedRoute
- [ ] Verificar autenticación
- [ ] Mostrar loading mientras verifica
- [ ] Redirigir según estado

---

### FASE 6: Migración de Datos a Firestore (2-3 horas)

#### 6.1 Modificar estructura de datos
- [ ] Diseñar colecciones de Firestore:
  - `users/{userId}`
  - `tasks/{taskId}` con campo `userId`
  - `categories/{categoryId}` con campo `userId`

#### 6.2 Crear nuevo servicio Firestore
- [ ] `src/services/firestoreService.ts`
- [ ] Funciones CRUD para tasks:
  - `createTask()`
  - `getTasks()`
  - `updateTask()`
  - `deleteTask()`
- [ ] Funciones CRUD para categories:
  - `createCategory()`
  - `getCategories()`
  - `updateCategory()`
  - `deleteCategory()`

#### 6.3 Modificar useTaskStore
- [ ] Reemplazar `storageService` por `firestoreService`
- [ ] Agregar manejo de userId en todas las operaciones
- [ ] Implementar estados de loading
- [ ] Manejar errores de red

#### 6.4 Modificar useCategoryStore
- [ ] Reemplazar `storageService` por `firestoreService`
- [ ] Agregar manejo de userId
- [ ] Implementar estados de loading
- [ ] Manejar errores de red

#### 6.5 Mantener useFilterStore local
- [ ] Dejar usando localStorage (son preferencias locales)
- [ ] No requiere sincronización en la nube

---

### FASE 7: Reglas de Seguridad de Firestore (15-20 min)

#### 7.1 Configurar reglas en Firebase Console
- [ ] Ir a Firestore Database → Rules
- [ ] Implementar reglas para:
  - Solo usuarios autenticados pueden leer/escribir
  - Usuarios solo acceden a sus propios datos
  - Validación de campos obligatorios
- [ ] Publicar reglas
- [ ] Probar reglas con simulador

---

### FASE 8: Mejoras de UX (30-60 min)

#### 8.1 Indicadores de loading
- [ ] Agregar spinners en operaciones async
- [ ] Loading states en listas de tasks
- [ ] Skeleton screens (opcional)

#### 8.2 Manejo de errores
- [ ] Toast notifications para errores de auth
- [ ] Mensajes amigables para usuarios
- [ ] Recuperación de errores de red

#### 8.3 Componente de Header
- [ ] Mostrar nombre/email del usuario
- [ ] Botón de logout
- [ ] Avatar (opcional, usar inicial del email)

---

### FASE 9: Testing y Validación (1-2 horas)

#### 9.1 Flujos de autenticación
- [ ] Probar registro con email/password
- [ ] Probar login con email/password
- [ ] Probar login con Google
- [ ] Probar logout
- [ ] Verificar persistencia de sesión (cerrar/abrir navegador)

#### 9.2 Flujos de datos
- [ ] Crear tasks como usuario A
- [ ] Verificar que usuario B no ve tasks de A
- [ ] Probar CRUD completo de tasks
- [ ] Probar CRUD completo de categories
- [ ] Verificar sincronización entre pestañas

#### 9.3 Casos edge
- [ ] Email duplicado en registro
- [ ] Credenciales incorrectas
- [ ] Sin conexión a internet
- [ ] Token expirado
- [ ] Firestore offline

---

### FASE 10: Migración de Datos Existentes (Opcional, 30-60 min)

#### 10.1 Script de migración
- [ ] Crear `scripts/migrateLocalStorageToFirestore.ts`
- [ ] Exportar datos de localStorage a JSON
- [ ] Función para importar JSON a Firestore
- [ ] Ejecutar migración manual

#### 10.2 Mantener backup
- [ ] Guardar datos locales en archivo JSON
- [ ] Documentar proceso de restauración

---

## Resumen de Archivos Nuevos

```
task-dashboard/
├── .env.local (NUEVO)
├── src/
│   ├── services/
│   │   ├── firebaseService.ts (NUEVO)
│   │   ├── authService.ts (NUEVO)
│   │   └── firestoreService.ts (NUEVO)
│   ├── stores/
│   │   ├── useAuthStore.ts (NUEVO)
│   │   ├── useTaskStore.ts (MODIFICADO)
│   │   └── useCategoryStore.ts (MODIFICADO)
│   ├── types/
│   │   ├── User.ts (NUEVO)
│   │   └── AuthError.ts (NUEVO)
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.tsx (NUEVO)
│   │       ├── SignUpForm.tsx (NUEVO)
│   │       ├── GoogleLoginButton.tsx (NUEVO)
│   │       └── ProtectedRoute.tsx (NUEVO)
│   ├── pages/
│   │   ├── Login.tsx (NUEVO)
│   │   └── SignUp.tsx (NUEVO)
│   └── App.tsx (MODIFICADO)
└── scripts/
    └── migrateLocalStorageToFirestore.ts (OPCIONAL)
```

---

## Resumen de Archivos Modificados

- `src/App.tsx` - Agregar rutas de auth y protección
- `src/stores/useTaskStore.ts` - Cambiar localStorage por Firestore
- `src/stores/useCategoryStore.ts` - Cambiar localStorage por Firestore
- `src/components/layout/Header.tsx` - Agregar info de usuario y logout

---

## Tiempo Estimado Total

- **Mínimo (flujo básico)**: 5-7 horas
- **Completo (con todas las fases)**: 8-12 horas
- **Con pulido y testing exhaustivo**: 12-15 horas

---

## Notas Importantes

1. **Variables de entorno**: NUNCA subir `.env.local` a Git
2. **Reglas de Firestore**: Configurarlas desde el inicio para seguridad
3. **Testing incremental**: Probar cada fase antes de continuar
4. **Commits frecuentes**: Hacer commit después de cada fase completada
5. **Branch separado**: Trabajar en branch `feature/firebase-auth`

---

## Recursos Útiles

- [Firebase Auth Docs](https://firebase.google.com/docs/auth/web/start)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks) (opcional)

---

## Próximo Paso

Una vez que tengas el proyecto de Firebase creado y las credenciales, comenzaremos con **FASE 2: Setup Inicial de Firebase en el Código**.
