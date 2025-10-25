// src/components/CategoryModal.tsx
import { type Category } from '../types/Category';
import { CategoryManager } from './CategoryManager';
import { ModalBackdrop } from './ModalBackdrop';

interface CategoryModalProps {
  categories: Category[];
  categoriesCount: { id: string; count: number }[];
  isClosing: boolean;
  onClose: () => void;
  onAddCategory: (name: string, color: string) => void;
  onEditCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryModal = ({
  categories,
  categoriesCount,
  isClosing,
  onClose,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoryModalProps) => {
  return (
    <ModalBackdrop isClosing={isClosing} onClose={onClose}>
      <CategoryManager
        categories={categories}
        categoriesCount={categoriesCount}
        onClose={onClose}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </ModalBackdrop>
  );
};
