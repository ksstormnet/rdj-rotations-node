import { RuleLoader } from '../config/ruleLoader';

export class ScheduleManager {
  private rules: any;

  constructor() {
    this.rules = require('../../schedule-rules.json');
  }
}
