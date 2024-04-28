export interface ElementGroup {
    name: string;
    sorting: number;
    color: string; // Any CSS color
    elements: string[];
}

const elementGroups: ElementGroup[] = [
    {
        name: 'Multipliers and Divisions',
        sorting: 0,
        color: '#008000',
        elements: ['mul', 'div', 'divfloor', 'macc', 'alu', 'pow']
    },
    {
        name: 'Comparators',
        sorting: 1,
        color: '#33cccc',
        elements: ['eq', 'ne', 'ge', 'gt', 'eqx', 'nex', 'lt', 'le', 'bweqx']
    },
    {
        name: 'Memory Elements',
        sorting: 2,
        color: '#ffcc00',
        elements: [
            'dff',
            'dffe',
            'dffsr',
            'dffsre',
            'adff',
            'aldff',
            'sdff',
            'adffe',
            'aldffe',
            'sdffe',
            'sdffce',
            'fsm',
            'memrd',
            'memrd_v2',
            'memwr',
            'memwr_v2',
            'mem',
            'mem_v2'
        ]
    },
    {
        name: 'Latch Elements',
        sorting: 3,
        color: '#ff0000',
        elements: ['sr', 'dlatchsr', 'dlatch', 'adlatch']
    },
    {
        name: 'Bit Operators',
        sorting: 4,
        color: '#99cc00',
        elements: [
            'not',
            'pos',
            'neg',
            'and',
            'or',
            'xor',
            'xnor',
            'reduce_and',
            'reduce_or',
            'reduce_xor',
            'reduce_xnor',
            'reduce_bool',
            'logic_not',
            'logic_and',
            'logic_or'
        ]
    },
    {
        name: 'Multiplexers',
        sorting: 5,
        color: '#3366ff',
        elements: ['mux', 'bmux', 'pmux', 'demux', 'bwmux']
    },
    {
        name: 'Shifts',
        sorting: 6,
        color: '#ff9900',
        elements: ['shl', 'shr', 'sshl', 'sshr', 'shift', 'shiftx']
    },
    {
        name: 'Adders',
        sorting: 7,
        color: '#339966',
        elements: ['add', 'sub']
    },
    {
        name: 'Formal verification cells',
        sorting: 8,
        color: '#800080',
        elements: [
            'check',
            'assert',
            'assume',
            'live',
            'fair',
            'cover',
            'equiv',
            'initstate',
            'anyconst',
            'anyseq',
            'anyinit',
            'allconst',
            'allseq'
        ]
    },
    {
        name: 'Debugging cells',
        sorting: 9,
        color: '#999999',
        elements: ['print']
    },
    {
        name: 'Modulo',
        sorting: 10,
        color: '#00ff00',
        elements: ['modfloor', 'mod']
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
