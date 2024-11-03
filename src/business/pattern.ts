import { RuleLoader } from '../config/ruleLoader';

export class PatternManager {
  private rules: any;

  constructor() {
    this.rules = require('../../schedule-rules.json');
  }
}
