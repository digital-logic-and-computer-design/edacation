import {spawn} from 'child_process';

export const executeTool = (tool: string, args: string[], cwd: string) => new Promise<void>((resolve, reject) => {
    const p = spawn(tool, args, {
        cwd,
        stdio: ['pipe', 'inherit', 'inherit']
    });

    p.on('error', (err) => {
        reject(err);
    });

    p.on('exit', () => {
        resolve();
    });
});
