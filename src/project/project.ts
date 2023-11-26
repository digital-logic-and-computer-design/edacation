import {decodeJSON, encodeJSON} from '../util.js';

import {DEFAULT_CONFIGURATION, type ProjectConfiguration, schemaProjectConfiguration} from './configuration.js';

export interface ProjectState {
    name: string;
    inputFiles: string[];
    outputFiles: string[];
    configuration: ProjectConfiguration;
}

export class Project {
    private name: string;
    private inputFiles: string[];
    private outputFiles: string[];
    private configuration: ProjectConfiguration;

    constructor(
        name: string,
        inputFiles: string[] = [],
        outputFiles: string[] = [],
        configuration: ProjectConfiguration = DEFAULT_CONFIGURATION
    ) {
        this.name = name;
        this.inputFiles = inputFiles;
        this.outputFiles = outputFiles;

        const config = schemaProjectConfiguration.safeParse(configuration);
        if (config.success) {
            this.configuration = config.data;
        } else {
            throw new Error(`Failed to parse project configuration: ${config.error.toString()}`);
        }
    }

    getName() {
        return this.name;
    }

    getInputFiles() {
        return this.inputFiles;
    }

    hasInputFile(filePath: string) {
        return this.inputFiles.some((file) => file === filePath);
    }

    addInputFiles(filePaths: string[]) {
        for (const filePath of filePaths) {
            if (!this.hasInputFile(filePath)) {
                this.inputFiles.push(filePath);
            }
        }

        this.inputFiles.sort((a, b) => {
            return a < b ? -1 : 1;
        });
    }

    removeInputFiles(filePaths: string[]) {
        this.inputFiles = this.inputFiles.filter((file) => !filePaths.includes(file));
    }

    getOutputFiles() {
        return this.outputFiles;
    }

    hasOutputFile(filePath: string) {
        return this.outputFiles.some((file) => file === filePath);
    }

    addOutputFiles(filePaths: string[]) {
        for (const filePath of filePaths) {
            if (!this.hasOutputFile(filePath)) {
                this.outputFiles.push(filePath);
            }
        }

        this.outputFiles.sort((a, b) => {
            return a < b ? -1 : 1;
        });
    }

    removeOutputFiles(filePaths: string[]) {
        this.outputFiles = this.outputFiles.filter((file) => !filePaths.includes(file));
    }

    getConfiguration() {
        return this.configuration;
    }

    updateConfiguration(configuration: Partial<ProjectConfiguration>) {
        this.configuration = {
            ...this.configuration,
            ...configuration
        };
    }

    static serialize(project: Project): ProjectState {
        return {
            name: project.name,
            inputFiles: project.inputFiles,
            outputFiles: project.outputFiles,
            configuration: project.configuration
        };
    }

    static deserialize(data: ProjectState, ..._args: unknown[]): Project {
        const name: string = data.name;
        const inputFiles: string[] = data.inputFiles ?? [];
        const outputFiles: string[] = data.outputFiles ?? [];
        const configuration: ProjectConfiguration = data.configuration ?? {};

        return new Project(name, inputFiles, outputFiles, configuration);
    }

    static loadFromData(rawData: Uint8Array): Project {
        const data = decodeJSON(rawData);
        const project = Project.deserialize(data as ProjectState);
        return project;
    }

    static storeToData(project: Project): Uint8Array {
        const data = Project.serialize(project);
        return encodeJSON(data, true);
    }
}
