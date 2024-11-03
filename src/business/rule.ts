import { RuleLoader } from '../config/ruleLoader';

export class RuleManager {
  private rules: any;

  constructor() {
    this.rules = require('../../schedule-rules.json');
  }
}
