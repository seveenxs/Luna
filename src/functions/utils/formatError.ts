import errors from '@constants/errors.json';
import formatEmoji from './formatEmoji';

export default function formatError(type: keyof typeof errors, ...args: Array<any>) {
    let i: number = 0;

    return formatEmoji(errors[type])
    .replace(/\[(\w+)\]/g, (_, keyword) => {
        const arg = args[i];
        i++;
        return arg ? arg : keyword
    });
}