interface RotationProps {
  ID: number;
  name: string;
}

export class Rotation {
  readonly ID: number;
  readonly name: string;

  constructor(props: RotationProps) {
    this.validateProps(props);
    this.ID = props.ID;
    this.name = props.name;
  }

  private validateProps(props: RotationProps): void {
    if (!props.name) {
      throw new Error('Rotation name cannot be empty');
    }

    if (!props.name.match(/^Hr [A-F]$/)) {
      throw new Error('Rotation name must be in format "Hr [A-F]"');
    }
  }

  // Get the hour letter (A-F)
  getHourLetter(): string {
    return this.name.split(' ')[1];
  }
}
