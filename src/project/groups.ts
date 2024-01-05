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

const elemLookupTable: Map<string, ElementGroup> = new Map();

export const getElementGroup = (primFqn: string): ElementGroup | null => {
    // Build lookup table for future use
    if (elemLookupTable.size === 0) {
        for (const group of elementGroups) {
            for (const elem of group.elements) {
                if (elemLookupTable.get(elem) !== undefined) {
                    console.warn(
                        `Element ${elem} is specified twice in the groups definition. Overwriting to "${group.name}".`
                    );
                }
                elemLookupTable.set(elem, group);
            }
        }
    }

    return elemLookupTable.get(primFqn) ?? null;
};
