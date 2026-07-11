const fs = require('fs');
const path = require('path');

const jsonPath = 'C:\\Users\\1122\\Downloads\\wild-cafe-backup-2026-07-11 (1).json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const { items, sales, extras, settings, settlements } = data.state;

const tsContent = `import { CafeItem, Settings, Extra, Sale, KitchenSettlement } from '../types';

export const initialItems: CafeItem[] = ${JSON.stringify(items, null, 2)};

export const initialSales: Sale[] = ${JSON.stringify(sales, null, 2)};

export const initialExtras: Extra[] = ${JSON.stringify(extras, null, 2)};

export const initialSettings: Settings = ${JSON.stringify(settings, null, 2)};

export const initialSettlements: KitchenSettlement[] = ${JSON.stringify(settlements || [], null, 2)};
`;

fs.writeFileSync('C:\\Users\\1122\\Wild Gaming Menu dashboard\\data\\initialData.ts', tsContent);
console.log('Successfully wrote initialData.ts');
