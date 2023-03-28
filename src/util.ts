import {access} from 'fs/promises';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const exists = async (...args: Parameters<typeof access>) => {
    try {
        await access(...args);
        return true;
    } catch (err) {
        return false;
    }
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const encodeText = (input: string) => textEncoder.encode(input.endsWith('\n') ? input : `${input}\n`);
export const encodeJSON = (input: unknown, pretty: boolean = false) => encodeText(JSON.stringify(input, undefined, pretty ? 4 : undefined));

export const decodeText = (input: NodeJS.ArrayBufferView | ArrayBuffer) => textDecoder.decode(input);
export const decodeJSON = (input: NodeJS.ArrayBufferView | ArrayBuffer) => JSON.parse(decodeText(input));

export const FILE_EXTENSIONS_VERILOG = ['v', 'vh', 'sv', 'svh'];
export const FILE_EXTENSIONS_VHDL = ['vhd'];
