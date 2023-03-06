import path from 'path';

import {Argv} from 'yargs';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

import {exists} from '../util';

console.log('EDAcation CLI');
console.log();

const buildCommandArgs = (yargs: Argv) => {
    return yargs
        .positional('project', {
            type: 'string',
            description: 'EDA project file (e.g. "full-adder.edaproject")'
        })
        .positional('target', {
            type: 'string',
            description: 'EDA target'
        });
};

// Parse arguments
const argv = await yargs(hideBin(process.argv))
    .scriptName('edacation')
    .command('yosys <project> <target>', 'Synthesize with Yosys', buildCommandArgs)
    .command('nextpnr <project> <target>', 'Place and route with nextpnr', buildCommandArgs)
    .demandCommand()
    .recommendCommands()
    .strict()
    .help()
    .parse();

// Validate project
const cwdPath = path.resolve(process.cwd());
const projectFile = argv.project as string;
let projectPath = path.join(cwdPath, projectFile);

if (!(await exists(projectPath))) {
    if (projectPath.endsWith('.edaproject')) {
        console.error(`Project "${projectFile}" could not be found in "${cwdPath}".`);
        process.exit(1);
    } else {
        projectPath = `${projectPath}.edaproject`;

        if (!await exists(projectPath)) {
            console.error(`Project "${projectFile}" or "${projectFile}.edaproject" could not be found in "${cwdPath}".`);
            process.exit(1);
        }
    }
}

const tool = argv._[0];
const target = argv.target as string;

console.log(tool, projectPath, target);
