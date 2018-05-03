import { AccessType } from "./svd_parser";

// SVD Enumerated value
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_enumeratedValue

// Overview of the Enum, and an array of all the associated values
export class EnumeratedValues {
    public name: string;
    public access: AccessType;
    public values: [EnumeratedValue];
}

// Specific value of an enum
export class EnumeratedValue {
    constructor(public name: string,
                public description: string,
                public value: number,
                public isDefault?: boolean)
                {}
}