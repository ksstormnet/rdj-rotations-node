interface SubcategoryProps {
  ID: number;
  parentid: number;
  name: string;
}

export class Subcategory {
  readonly ID: number;
  readonly parentid: number;
  readonly name: string;

  constructor(props: SubcategoryProps) {
    this.validateProps(props);
    this.ID = props.ID;
    this.parentid = props.parentid;
    this.name = props.name;
  }

  private validateProps(props: SubcategoryProps): void {
    if (!props.name) {
      throw new Error("Subcategory name cannot be empty");
    }
    if (props.name.length > 100) {
      throw new Error("Subcategory name cannot exceed 100 characters");
    }
    if (props.parentid <= 0) {
      throw new Error("Parent ID must be positive");
    }
  }

  getCode(): string {
    // Extract code from name (e.g., "CE - Core Early" -> "CE")
    const match = this.name.match(/^([A-Z]+)(?:\s*-|$)/);
    return match ? match[1] : this.name.split(" ")[0];
  }
}
