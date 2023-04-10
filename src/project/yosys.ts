import path from 'path';

import {FILE_EXTENSIONS_VERILOG, FILE_EXTENSIONS_HDL} from '../util.js';

import {VENDORS, Vendor} from './devices.js';
import {getCombined, getOptions, getTarget, getTargetFile} from './target.js';
import {Project} from './project.js';
import {ProjectConfiguration, YosysOptions} from './configuration.js';

const DEFAULT_OPTIONS: YosysOptions = {
    optimize: true
};

export const generateYosysWorkerOptions = (configuration: ProjectConfiguration, projectInputFiles: string[], targetId: string) => {
    const target = getTarget(configuration, targetId);
    const options = getOptions(configuration, targetId, 'yosys', DEFAULT_OPTIONS);

    const vendor = (VENDORS as Record<string, Vendor>)[target.vendor];
    const family = vendor.families[target.family];

    const inputFiles = projectInputFiles.filter((inputFile) => FILE_EXTENSIONS_HDL.includes(path.extname(inputFile).substring(1)));
    const outputFiles = [
        getTargetFile(target, `${family.architecture}.json`)
    ];

    const tool = 'yosys';
    const commands = [
        ...inputFiles.map((file) => `read_verilog ${file}`),
        'proc;'
    ];

    if (options.optimize) {
        commands.push('opt;');
    }

    if (family.architecture === 'generic') {
        commands.push('synth;');
        commands.push(`write_json ${outputFiles[0]};`);
    } else {
        commands.push(`synth_${family.architecture} -json ${outputFiles[0]};`);
    }

    return {
        inputFiles: inputFiles,
        outputFiles: outputFiles,
        tool,
        commands: commands
    };
};

export const getYosysWorkerOptions = (project: Project, targetId: string) => {
    const generated = generateYosysWorkerOptions(project.getConfiguration(), project.getInputFiles(), targetId);

    const inputFiles = getCombined(project.getConfiguration(), targetId, 'yosys', 'inputFiles', generated.inputFiles);
    const outputFiles = getCombined(project.getConfiguration(), targetId, 'yosys', 'outputFiles', generated.outputFiles);

    const tool = generated.tool;
    const commands = getCombined(project.getConfiguration(), targetId, 'yosys', 'commands', generated.commands);

    return {
        inputFiles,
        outputFiles,
        tool,
        commands
    };
};

export const generateYosysRTLCommands = (inputFiles: string[]): string[] => {
    const verilogFiles = inputFiles.filter((file) => FILE_EXTENSIONS_VERILOG.includes(path.extname(file).substring(1)));

    // Yosys commands taken from yosys2digitaljs (https://github.com/tilk/yosys2digitaljs/blob/1b4afeae61/src/index.js#L1225)

    return [
        ...verilogFiles.map((file) => `read_verilog ${file}`),
        'hierarchy -auto-top',
        'proc;',
        'opt;',
        'memory -nomap;',
        'wreduce -memx;',
        'opt -full;',
        'write_json rtl.digitaljs.json',
        ''
    ];
};

export const generateYosysSynthCommands = (inputFiles: string[]): string[] => {
    const verilogFiles = inputFiles.filter((file) => FILE_EXTENSIONS_VERILOG.includes(path.extname(file).substring(1)));

    return [
        ...verilogFiles.map((file) => `read_verilog ${file}`),
        'proc;',
        'opt;',
        'synth -lut 4',
        'write_json luts.digitaljs.json',
        'design -reset',
        ...verilogFiles.map((file) => `read_verilog ${file}`),
        'proc;',
        'opt;',
        'synth_ecp5 -json ecp5.json;',
        ''
    ];
};
