import {spawn} from 'child_process';

export const executeTool = (tool: 'yosys' | 'nextpnr', args: string[]) => {
    const p = spawn(tool, args, {
        stdio: ['pipe', 'inherit', 'inherit']
    });
    console.log(p);
};
