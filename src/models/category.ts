export const VALID_CATEGORIES = [
  'Music',
  'Sound Effects',
  'Sweepers',
  'Station IDs',
  'Jingles',
  'Promos',
  'Commercials',
  'News',
  'Interviews',
  'Radio Shows',
  'Radio Streams',
  'Rotation Elements',
] as const;

export type ValidCategory = (typeof VALID_CATEGORIES)[number];

interface CategoryProps {
  ID: number;
  name: string;
}

export class Category {
  readonly ID: number;
  readonly name: string;

  constructor(props: CategoryProps) {
    this.validateName(props.name);
    this.ID = props.ID;
    this.name = props.name;
  }

  private validateName(name: string): void {
    if (!name) {
      throw new Error('Category name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Category name cannot exceed 100 characters');
    }
  }

  isValidCategoryName(): boolean {
    return VALID_CATEGORIES.includes(this.name as ValidCategory);
  }
}
