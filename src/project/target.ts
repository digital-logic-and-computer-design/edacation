import path from 'path';

import {ProjectConfiguration, TargetConfiguration, TargetDefaultsConfiguration, TargetOptionTypes, WorkerId} from './configuration.js';

export const getTargetDefaults = (configuration: ProjectConfiguration): TargetDefaultsConfiguration => {
    return configuration.defaults ?? {};
};

export const getTarget = (configuration: ProjectConfiguration, targetId: string): TargetConfiguration => {
    const target = configuration.targets.find((target) => target.id === targetId);
    if (!target) {
        throw new Error(`Target "${targetId}" could not be found.`);
    }
    return target;
};

export const getTargetFile = (target: TargetConfiguration, file: string) => path.join(target.directory ?? '.', file);

export const getOptions = <W extends WorkerId>(
    configuration: ProjectConfiguration,
    targetId: string,
    workerId: W,
    defaultValues: TargetOptionTypes[W]
): TargetOptionTypes[W] => {
    const targetDefaults = getTargetDefaults(configuration)[workerId];
    const target = getTarget(configuration, targetId)[workerId];

    const defaultConfig = targetDefaults ? targetDefaults.options : undefined;
    const config = target ? target.options : undefined;

    return {
        ...defaultValues,
        ...defaultConfig,
        ...config
    };
};

export const getCombined = (configuration: ProjectConfiguration, targetId: string, workerId: WorkerId, configId: string, generated: string[]) => {
    const targetDefaults = getTargetDefaults(configuration)[workerId];
    const target = getTarget(configuration, targetId)[workerId];

    const defaultConfig = targetDefaults ? targetDefaults[configId] : undefined;
    const config = target ? target[configId] : undefined;

    return [
        ...(!config || config.useGenerated) ? generated : [],
        ...(!config || config.useDefault) && !!defaultConfig ? defaultConfig.values : [],
        ...(config ? config.values : [])
    ];
};
