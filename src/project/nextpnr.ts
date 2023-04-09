import {VENDORS, Vendor} from './devices';
import {Project} from './project';
import {getCombined, getTarget} from './target';

export const generateNextpnrWorker = (project: Project, targetId: string) => {
    const target = getTarget(project.getConfiguration(), targetId);

    const vendor = (VENDORS as Record<string, Vendor>)[target.vendor];
    const family = vendor.families[target.family];
    const device = family.devices[target.device];

    const generatedInputFiles = [
        `${family.architecture}.json`
    ];

    const generatedOutputFiles = [
        'routed.nextpnr.json',
        'placed.svg',
        'routed.svg'
    ];

    const inputFiles = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'inputFiles', generatedInputFiles);
    const outputFiles = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'outputFiles', generatedOutputFiles);

    const generatedArgs = [
        // TODO: this might only works for ice40/ecp5 ?
        `--${device.device}`,
        '--package', target.package.toUpperCase(),

        '--json', generatedInputFiles[0],

        // TODO: add flags for these options
        '--write', generatedOutputFiles[0],
        '--placed-svg', generatedOutputFiles[1],
        '--routed-svg', generatedOutputFiles[2]
    ];

    const tool = `nextpnr-${family.architecture}`;
    const args = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'arguments', generatedArgs);

    return {
        inputFiles,
        outputFiles,
        tool,
        arguments: args
    };
};
