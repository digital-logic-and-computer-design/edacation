import {ProjectConfiguration, TargetConfiguration, ValueListConfiguration, ValueListConfigurationTarget, WorkerId} from './configuration';

export const getTarget = (configuration: ProjectConfiguration, targetId: string): TargetConfiguration => {
    const target = configuration.targets.find((target) => target.id === targetId);
    if (!target) {
        throw new Error(`Target "${targetId}" could not be found.`);
    }
    return target;
};

export const getCombined = (configuration: ProjectConfiguration, targetId: string, workerId: WorkerId, configId: string, generated: string[]) => {
    const defaultTarget = configuration[workerId] as Record<string, ValueListConfiguration | ValueListConfigurationTarget> | undefined;
    const target = getTarget(configuration, targetId);

    const defaultConfig = defaultTarget ? defaultTarget[configId] : undefined;
    const config = target[workerId] ? (target[workerId] as Record<string, ValueListConfigurationTarget>)[configId] : undefined;

    return [
        ...(!config || config.useGenerated) ? generated : [],
        ...(!config || config.useDefault) && !!defaultConfig ? defaultConfig.values : [],
        ...(config ? config.values : [])
    ];
};
