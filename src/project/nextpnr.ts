import {NextpnrOptions} from './configuration.js';
import {VENDORS, Vendor} from './devices.js';
import {Project} from './project.js';
import {getCombined, getOptions, getTarget, getTargetFile} from './target.js';

const DEFAULT_OPTIONS: NextpnrOptions = {
    placedSvg: true,
    routedSvg: true,
    routedJson: true
};

export const generateNextpnrWorker = (project: Project, targetId: string) => {
    const target = getTarget(project.getConfiguration(), targetId);
    const options = getOptions(project.getConfiguration(), targetId, 'nextpnr', DEFAULT_OPTIONS);

    const vendor = (VENDORS as Record<string, Vendor>)[target.vendor];
    const family = vendor.families[target.family];
    const device = family.devices[target.device];

    const generatedInputFiles = [
        getTargetFile(target, `${family.architecture}.json`)
    ];

    const generatedOutputFiles: string[] = [];
    const generatedArgs: string[] = [];

    switch (family.architecture) {
        case 'ecp5': {
            generatedArgs.push(`--${device.device}`);
            generatedArgs.push('--package', target.package.toUpperCase());
            break;
        }
        case 'generic': {
            break;
        }
        case 'gowin': {
            generatedArgs.push('--device', `${device.device.replace('-', '-UV')}${target.package}C5/I4`);
            break;
        }
        case 'ice40': {
            generatedArgs.push(`--${device.device}`);
            generatedArgs.push('--package', target.package);
            break;
        }
        case 'nexus': {
            const packageLookup = {
                WLCSP72: 'UWG72',
                QFN72: 'SG72',
                csfBGA121: 'MG121',
                caBGA256: 'BG256',
                csfBGA289: 'MG289',
                caBGA400: 'BG400'
            };

            if (target.package in packageLookup) {
                throw new Error(`Package "${target.package}" is currenty not supported.`);
            }

            generatedArgs.push('--device', `${device.device}-7${packageLookup[target.package]}C`);
            break;
        }
        default: {
            throw new Error(`Architecture "${family.architecture}" is currently not supported.`);
        }
    }

    generatedArgs.push('--json', generatedInputFiles[0]);

    if (options.placedSvg) {
        const file = getTargetFile(target, 'placed.svg');
        generatedOutputFiles.push(file);
        generatedArgs.push('--placed-svg', file);
    }
    if (options.routedSvg) {
        const file = getTargetFile(target, 'routed.svg');
        generatedOutputFiles.push(file);
        generatedArgs.push('--routed-svg', file);
    }
    if (options.routedJson) {
        const file = getTargetFile(target, 'routed.nextpnr.json');
        generatedOutputFiles.push(file);
        generatedArgs.push('--write', file);
    }

    const inputFiles = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'inputFiles', generatedInputFiles);
    const outputFiles = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'outputFiles', generatedOutputFiles);

    const tool = `nextpnr-${family.architecture}`;
    const args = getCombined(project.getConfiguration(), targetId, 'nextpnr', 'arguments', generatedArgs);

    return {
        inputFiles,
        outputFiles,
        tool,
        arguments: args
    };
};
