import { AccessType } from "./svd_parser";

// SVD Enumerated value
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_enumeratedValue

// Specific value of an enum
export class EnumeratedValue {

    name: string; //Name is the key value in the Map
    description?: string;
    value?: number;
    isDefault?: boolean;

    private static newEnum(enumeratedValue: any) : EnumeratedValue {
        let e : EnumeratedValue = new EnumeratedValue();
        e.name = enumeratedValue.name && enumeratedValue.name[0];
        e.description = enumeratedValue.description && enumeratedValue.description[0];
        e.value = enumeratedValue.value && enumeratedValue.value[0];
        e.isDefault = enumeratedValue.isDefault && enumeratedValue.isDefault[0];

        if(!e.name) {
            e.name = e.value.toString();
        }
        return e;
    }

    public static parseEnum(enumeratedValues: any) : Map<string, EnumeratedValue> {
        let enums : Map<string, EnumeratedValue> = new Map();
        enumeratedValues.enumeratedValue.forEach(e => {
            let newEnum : EnumeratedValue = EnumeratedValue.newEnum(e);
            enums.set(newEnum.name, newEnum);
        });

        return enums;
    }
}