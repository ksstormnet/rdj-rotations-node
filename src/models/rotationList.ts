// src/models/rotationList.ts
// First, let's modify the type definition for repeatRule
interface RotationListProps {
  ID: number;
  pID: number;
  catID: number;
  subID: number;
  genID: number;
  ord: number;
  data: string;
  repeatRule: string; // Changed from 'True' | 'False' to string since that's what comes from DB
  selType: number;
  sweeper: number;
  track_separation: number;
  artist_separation: number;
  title_separation: number;
  album_separation: number;
  mood?: string | null;
  gender?: string | null;
  language?: string | null;
  start_type?: number;
  end_type?: number;
  advanced?: string | null;
}

export class RotationList {
  readonly ID: number;
  readonly pID: number;
  readonly catID: number;
  readonly subID: number;
  readonly genID: number;
  readonly ord: number;
  readonly data: string;
  readonly repeatRule: string; // Changed type here too
  readonly selType: number;
  readonly sweeper: number;
  readonly track_separation: number;
  readonly artist_separation: number;
  readonly title_separation: number;
  readonly album_separation: number;
  readonly mood?: string | null;
  readonly gender?: string | null;
  readonly language?: string | null;
  readonly start_type?: number;
  readonly end_type?: number;
  readonly advanced?: string | null;

  constructor(props: RotationListProps) {
    this.validateProps(props);

    this.ID = props.ID;
    this.pID = props.pID;
    this.catID = props.catID;
    this.subID = props.subID;
    this.genID = props.genID;
    this.ord = props.ord;
    this.data = props.data;
    this.repeatRule = props.repeatRule;
    this.selType = props.selType;
    this.sweeper = props.sweeper;
    this.track_separation = props.track_separation;
    this.artist_separation = props.artist_separation;
    this.title_separation = props.title_separation;
    this.album_separation = props.album_separation;

    // Optional properties
    this.mood = props.mood ?? undefined;
    this.gender = props.gender ?? undefined;
    this.language = props.language ?? undefined;
    this.start_type = props.start_type;
    this.end_type = props.end_type;
    this.advanced = props.advanced ?? undefined;
  }

  private validateProps(props: RotationListProps): void {
    if (props.ord < 0) {
      throw new Error('Order must be non-negative');
    }

    if (props.pID <= 0) {
      throw new Error('Parent rotation ID must be positive');
    }

    if (props.catID <= 0) {
      throw new Error('Category ID must be positive');
    }

    if (props.subID <= 0) {
      throw new Error('Subcategory ID must be positive');
    }

    // Validate repeatRule is either 'True' or 'False'
    if (props.repeatRule !== 'True' && props.repeatRule !== 'False') {
      throw new Error('RepeatRule must be either "True" or "False"');
    }
  }

  // Helper method to check if repeat is enabled
  isRepeatEnabled(): boolean {
    return this.repeatRule === 'True';
  }
}
