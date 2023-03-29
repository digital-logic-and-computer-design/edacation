import path from 'path';
import {readFile, writeFile} from 'fs/promises';

import {Argv} from 'yargs';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

import {exists} from '../util';
import {Project, VENDORS} from '../project';
import {executeTool} from '../tool';

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
    .command('init <project>', 'Initialize EDA project', (yargs) => {
        return yargs
            .positional('project', {
                type: 'string',
                description: 'EDA project file (e.g. "full-adder.edaproject")'
            })
            .option('name', {
                type: 'string',
                description: 'Name of the project (e.g. "Full Adder")'
            });
    })
    .command('yosys <project> <target>', 'Synthesize with Yosys', buildCommandArgs)
    .command('nextpnr <project> <target>', 'Place and route with nextpnr', buildCommandArgs)
    .demandCommand()
    .recommendCommands()
    .strict()
    .help()
    .parse();

const command = argv._[0];

// Validate project
const cwdPath = path.resolve(process.cwd());
let projectFile = argv.project as string;
let projectPath = path.join(cwdPath, projectFile);

if (command === 'init') {
    if (!projectPath.endsWith('.edaproject')) {
        projectFile = `${projectFile}.edaproject`;
        projectPath = `${projectPath}.edaproject`;
    }

    if (await exists(projectPath)) {
        console.error(`Project "${projectFile}" already exists in "${cwdPath}".`);
        process.exit(1);
    }

    let name = argv.name as string;
    if (!name) {
        name = path.basename(projectPath);
        name = name.substring(0, name.length - '.edaproject'.length);
    }

    const project = new Project(name);
    await writeFile(projectPath, await Project.store(project));

    console.log(`Created project "${name}" in "${projectPath}".`);

    process.exit(0);
}

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
console.log();

console.log(`Vendor:  ${VENDORS[target.vendor].name}`);
console.log(`Family:  ${VENDORS[target.vendor].families[target.family].name}`);
console.log(`Device:  ${VENDORS[target.vendor].families[target.family].devices[target.device].name}`);
console.log(`Package: ${VENDORS[target.vendor].packages[target.package]}`);
console.log();

// TODO: arguments/input
executeTool(command as 'yosys' | 'nextpnr', []);
