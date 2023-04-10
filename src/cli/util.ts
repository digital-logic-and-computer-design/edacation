import {access} from 'fs/promises';

export const exists = async (...args: Parameters<typeof access>) => {
    try {
        await access(...args);
        return true;
    } catch (err) {
        return false;
    }
};
