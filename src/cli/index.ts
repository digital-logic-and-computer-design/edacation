import path from 'path';
import {readFile} from 'fs/promises';

import {Argv} from 'yargs';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

import {exists} from '../util';
import {Project} from '../project';

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
const targetId = argv.target as string;

// Load project
const project = await Project.load(await readFile(projectPath));
const configuration = project.getConfiguration();

console.log(`Loaded project "${project.getName()}".`);

const targetNumber = parseInt(targetId);

const target = configuration.targets.find((target, index) => target.id === targetId || index + 1 === targetNumber);
if (!target) {
    const targetsText = `${configuration.targets.map((target, index) => `${index + 1}. ${target.id} (${target.name})`).join('\n')}`;
    console.error(`Target "${targetId}" does not exist.\n\nAvailable targets:\n${targetsText}`);
    process.exit(1);
}

console.log(`Loaded target "${target.name}".`);

console.log('TODO: ', tool);
