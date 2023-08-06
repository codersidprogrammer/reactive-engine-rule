// Import stylesheets
import { lastValueFrom } from 'rxjs';
import { EngineRule } from './engine';
import { ActionType, EventType, Operator, Rules } from './rules.interface';

export interface Employee {
  personalNumber: string;
  personalName: string;
  personalUnit: string;
  personalSuperior: Employee | null;
  isGmfEmployee: boolean;
}

const test: Employee = {
  personalNumber: '800000',
  personalName: 'Asep saipudin',
  personalUnit: 'TDI',
  personalSuperior: {
    personalNumber: '800001',
    personalName: 'Mochammad Dimas Editiya',
    personalUnit: 'DB',
    personalSuperior: null,
    isGmfEmployee: true,
  },
  isGmfEmployee: true,
};

const personalNumberRule: Rules<Employee> = {
  name: 'Employee validation',
  condition: {
    fact: 'Personal number should be 800000',
    operator: Operator.EQUAL,
    expectedValue: '800000',
    path: '$.personalNumber',
    relation: {
      AND: [
        {
          fact: 'Name check',
          operator: Operator.EQUAL,
          path: '$.personalName',
          expectedValue: 'Asep saipudin',
        },
        {
          fact: 'Unit check',
          operator: Operator.EQUAL,
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
          fetch('https://dummyjson.com/products/1').then((res) =>
            console.log(res)
          );
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
    expectedValue: 'TDO', // Change this to TDI, so make it come true
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

const engine = new EngineRule<Employee>()
  .setTestValue(test) // Set value tobe tested
  .setRules(1, unitRule)
  .setRules(0, personalNumberRule)
  .build();

/**
 * Debugging main
 *
 **/
async function main() {
  const r = await lastValueFrom(engine);
  console.log(r);
}

main();
