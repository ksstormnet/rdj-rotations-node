import { RuleLoader } from '../config/ruleLoader';

export class ValidationManager {
  private rules: any;

  constructor() {
    this.rules = require('../../schedule-rules.json');
  }
}
