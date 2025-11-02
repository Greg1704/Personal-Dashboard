import { storageService } from '../services/storageService';
import * as firestoreService from '../services/firestoreService';

/**
 * Migra datos desde localStorage a Firestore
 * Se ejecuta automáticamente la primera vez que un usuario se autentica
 *
 * @param userId - ID del usuario autenticado
 * @returns Promise que se resuelve cuando la migración termina
 */
export async function migrateLocalStorageToFirestore(userId: string): Promise<void> {
  try {
    console.log('🔄 Starting data migration from localStorage to Firestore...');

    // 1. Leer datos de localStorage
    const localTasks = storageService.getTasks() || [];
    const localCategories = storageService.getCategories() || [];

    console.log(`📦 Found ${localTasks.length} tasks and ${localCategories.length} categories in localStorage`);

    // Si no hay datos para migrar, salir
    if (localTasks.length === 0 && localCategories.length === 0) {
      console.log('✅ No data to migrate');
      return;
    }

    // 2. Migrar categorías primero (las tareas dependen de ellas)
    let migratedCategories = 0;
    for (const category of localCategories) {
      // Skip la categoría "No Category" (id "0") - se crea automáticamente
      if (category.id === '0') continue;

      try {
        await firestoreService.createCategory(userId, {
          name: category.name,
          color: category.color
        });
        migratedCategories++;
        console.log(`✓ Migrated category: ${category.name}`);
      } catch (error) {
        console.error(`✗ Failed to migrate category ${category.name}:`, error);
      }
    }

    // 3. Migrar tareas
    let migratedTasks = 0;
    for (const task of localTasks) {
      try {
        await firestoreService.createTask(userId, {
          title: task.title,
          description: task.description || '',
          completed: task.completed,
          categoryId: task.categoryId || '0'
        });
        migratedTasks++;
        console.log(`✓ Migrated task: ${task.title}`);
      } catch (error) {
        console.error(`✗ Failed to migrate task ${task.title}:`, error);
      }
    }

    console.log(`✅ Migration completed successfully!`);
    console.log(`   - Categories migrated: ${migratedCategories}/${localCategories.length - 1}`); // -1 por "No Category"
    console.log(`   - Tasks migrated: ${migratedTasks}/${localTasks.length}`);

    // 4. Marcar como migrado (NO limpiamos localStorage por seguridad)
    // El usuario puede decidir limpiarlo manualmente después de verificar
    localStorage.setItem('dataMigratedToFirestore', 'true');
    localStorage.setItem('migrationDate', new Date().toISOString());

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Verifica si ya se realizó la migración
 */
export function hasMigrated(): boolean {
  return localStorage.getItem('dataMigratedToFirestore') === 'true';
}

/**
 * Limpia los datos de localStorage después de confirmar que la migración fue exitosa
 * USAR CON CUIDADO - Esta acción no se puede deshacer
 */
export function clearLocalStorageAfterMigration(): void {
  if (!hasMigrated()) {
    console.warn('⚠️ Cannot clear localStorage - migration has not been completed yet');
    return;
  }

  const migrationDate = localStorage.getItem('migrationDate');
  console.log(`🧹 Clearing localStorage data (migrated on ${migrationDate})`);

  // Limpiar solo los datos de tareas y categorías, mantener otros datos
  localStorage.removeItem('taskDashboard_tasks');
  localStorage.removeItem('taskDashboard_categories');
  localStorage.removeItem('taskDashboard_lastDeletedTask');

  console.log('✅ localStorage cleared successfully');
}

/**
 * Obtiene información sobre la migración
 */
export function getMigrationInfo(): {
  hasMigrated: boolean;
  migrationDate: string | null;
  localTasksCount: number;
  localCategoriesCount: number;
} {
  const tasks = storageService.getTasks() || [];
  const categories = storageService.getCategories() || [];

  return {
    hasMigrated: hasMigrated(),
    migrationDate: localStorage.getItem('migrationDate'),
    localTasksCount: tasks.length,
    localCategoriesCount: categories.length
  };
}
