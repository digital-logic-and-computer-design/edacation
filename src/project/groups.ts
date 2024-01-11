export interface ElementGroup {
    name: string;
    sorting: number;
    color: string; // Any CSS color
    elements: string[];
}

const elementGroups: ElementGroup[] = [
    {
        name: 'Arithmetic Elements',
        sorting: 0,
        color: 'blue',
        elements: ['alu', 'add', 'sub', 'mul', 'div', 'divfloor', 'mod', 'modfloor', 'pow']
    },
    {
        name: 'Comparators',
        sorting: 1,
        color: 'yellow',
        elements: ['eq', 'ne', 'ge', 'gt']
    },
    {
        name: 'Memory Elements',
        sorting: 2,
        color: 'green',
        elements: ['adff']
    }
];

let elemLookupTable: Map<string, ElementGroup> | null = null;

export const getElementGroups = (): Map<string, ElementGroup> => {
    if (elemLookupTable === null) {
        elemLookupTable = buildElemTable();
    }
    return elemLookupTable;
};

export const getElementGroup = (primName: string): ElementGroup | null => {
    return getElementGroups().get(primName) ?? null;
};

const buildElemTable = (): Map<string, ElementGroup> => {
    const table: Map<string, ElementGroup> = new Map();

    for (const group of elementGroups) {
        for (const elem of group.elements) {
            if (table.get(elem) !== undefined) {
                console.warn(
                    `Element ${elem} is specified twice in the groups definition. Overwriting to "${group.name}".`
                );
            }
            table.set(elem, group);
        }
    }

    return table;
};
