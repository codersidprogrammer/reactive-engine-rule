// Import stylesheets
import { EngineRule } from './engine';
import { ActionType, EventType, Operator, Rules } from './rules.interface';

export interface Employee {
  personalNumber: string;
  personalName: string;
  personalTitle: string;
  personalEmail: string;
  personalUnit: string;
  personalImage: string;
  personalSuperior: Employee | null;
  isGmfEmployee: boolean;
}

const test: Employee = {
  personalNumber: '531955',
  personalName: 'Balugu Gomo Sibagariang',
  personalTitle: 'SM Innovation & Digital Transformation',
  personalEmail: '531956@gmf-aeroasia.co.id',
  personalUnit: 'TDI',
  personalImage:
    'https://talentlead.gmf-aeroasia.co.id/images/avatar/531956.jpg',
  personalSuperior: {
    personalNumber: '782774',
    personalName: 'Irvan Pribadi',
    personalTitle: 'Director Of Base Operation',
    personalEmail: '782774@gmf-aeroasia.co.id',
    personalUnit: 'DB',
    personalImage:
      'https://talentlead.gmf-aeroasia.co.id/images/avatar/782774.jpg',
    personalSuperior: null,
    isGmfEmployee: true,
  },
  isGmfEmployee: true,
};

const personalNumberRule: Rules<Employee> = {
  name: 'Employee validation',
  condition: {
    fact: 'Personal number should be 531956',
    operator: Operator.EQUAL,
    field: 'personalNumber',
    expectedValue: '531956',
    path: '$.personalNumber',
    relation: {
      AND: [
        {
          fact: 'Name check',
          operator: Operator.EQUAL,
          field: 'personalName',
          path: '$.personalName',
          expectedValue: 'Balugu Gomo Sibagariang',
        },
        {
          fact: 'Name check',
          operator: Operator.EQUAL,
          field: 'personalUnit',
          path: '$.personalUnit',
          expectedValue: 'TDI',
        },
      ],
    },
  },
  on: [
    {
      event: EventType.SUCCESS,
      action: {
        type: ActionType.NEXT,
        message: 'Approved',
        call: (val) => {
          console.log(val);
        },
      },
    },
    {
      event: EventType.FAILED,
      action: {
        type: ActionType.END,
        message: 'Rules not match. Goto end',
        call: (val) => console.error(val),
      },
    },
  ],
};

const unitRule: Rules<Employee> = {
  name: 'Unit validation',
  condition: {
    fact: 'Should handle by TDO',
    operator: Operator.EQUAL,
    field: 'personalUnit',
    expectedValue: 'TDO',
    path: '$.personalUnit',
  },
  on: [
    {
      event: EventType.SUCCESS,
      action: {
        type: ActionType.NEXT,
        message: 'Handled by TDO',
        call: (val) => console.log(val),
      },
    },
    {
      event: EventType.FAILED,
      action: {
        type: ActionType.END,
        message: 'This should be handled by TDO',
        call: (val) => console.error(val),
      },
    },
  ],
};

const engine = new EngineRule<Employee>();
engine
  .setTestValue(test)
  .setRules(0, personalNumberRule)
  .setRules(1, unitRule)
  .build()
  .subscribe();
