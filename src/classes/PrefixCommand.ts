import { PrefixCommandInformation, PrefixCommandPermission, PrefixCommandProps, PrefixCommandRunner } from "../types/PrefixCommand";

export default class PrefixCommand implements PrefixCommandProps {
    declare name: string;
    declare information: PrefixCommandInformation;
    declare execute: PrefixCommandRunner;

    public aliases?: string[] | undefined;
    public exclusive?: boolean | undefined;
    public permission?: PrefixCommandPermission | undefined;
    public private?: boolean | undefined;

    public constructor(properties: PrefixCommandProps) {
        Object.assign(this, properties);
    }
}