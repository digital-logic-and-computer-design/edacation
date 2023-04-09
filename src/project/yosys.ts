import path from 'path';

import {FILE_EXTENSIONS_VERILOG, FILE_EXTENSIONS_HDL} from '../util';

import {VENDORS, Vendor} from './devices';
import {getCombined, getTarget} from './target';
import {Project} from './project';

export const generateYosysWorker = (project: Project, targetId: string) => {
    const target = getTarget(project.getConfiguration(), targetId);

    const vendor = (VENDORS as Record<string, Vendor>)[target.vendor];
    const family = vendor.families[target.family];

    const generatedInputFiles = project.getInputFiles().filter((inputFile) => FILE_EXTENSIONS_HDL.includes(path.extname(inputFile).substring(1)));

    const generatedOutputFiles = [
        `${family.architecture}.json`
    ];

    const inputFiles = getCombined(project.getConfiguration(), targetId, 'yosys', 'inputFiles', generatedInputFiles);
    const outputFiles = getCombined(project.getConfiguration(), targetId, 'yosys', 'outputFiles', generatedOutputFiles);

    const generatedCommands = [
        ...inputFiles.map((file) => `read_verilog ${file}`),
        'proc;',
        'opt;',
        `synth_${family.architecture} -json ${generatedOutputFiles[0]};`
    ];

    const tool = 'yosys';
    const commands = getCombined(project.getConfiguration(), targetId, 'yosys', 'commands', generatedCommands);

    return {
        inputFiles,
        outputFiles,
        tool,
        commands
    };
};


export const generateYosysRTLCommands = (inputFiles: string[]): string[] => {
    const verilogFiles = inputFiles.filter((file) => FILE_EXTENSIONS_VERILOG.includes(path.extname(file).substring(1)));

    // Yosys commands taken from yosys2digitaljs (https://github.com/tilk/yosys2digitaljs/blob/1b4afeae61/src/index.ts#L1225)

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
