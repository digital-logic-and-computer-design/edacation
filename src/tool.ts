import {spawn} from 'child_process';

export const executeTool = (tool: string, args: string[], cwd: string) => {
    const p = spawn(tool, args, {
        cwd,
        stdio: ['pipe', 'inherit', 'inherit']
    });
    console.log(p.exitCode);
};
