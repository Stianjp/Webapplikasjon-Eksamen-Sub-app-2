export interface Product {
  id?: number;
  name: string;
  description: string;
  categoryList: string[];
  category?: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  allergens?: string;
  selectedAllergens: string[];
  producerId?: string;
}