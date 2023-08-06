export enum Operator {
  EQUAL = '===',
  GTE = '>=',
  LTE = '<=',
  NOT_EQUAL = '!==',
  GT = '>',
  LT = '<',
}

export type Relation = 'AND' | 'OR' | 'NOT';

export enum EventType {
  SUCCESS,
  FAILED,
}

export enum ActionType {
  NEXT,
  URL_CALL,
  PREVIOUS,
  END,
}

export interface RulesCondition<T> {
  fact: string;
  field: keyof T;
  path?: string;
  operator: Operator;
  expectedValue: string | number;
  relation?: { [K in Relation]?: RulesCondition<T>[] };
}

export interface EventAction {
  type: ActionType;
  message: string;
  call: (s: any) => ReturnType<any>;
}

export interface RulesEvent {
  event: EventType;
  action: EventAction;
}

export interface Rules<T extends Object> {
  name: string;
  path?: string;
  condition: RulesCondition<T>;
  on: RulesEvent[];
}
