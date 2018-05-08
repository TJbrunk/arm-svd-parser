import { parseNumber } from "./svd_parser";

// SVD write constraint element
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_writeConstraint


export class WriteConstraint {
    public max?: number;
    public min?: number;

    public writeAsRead?: boolean;
    public useEnumValues?: boolean;

    constructor(xml : any) {
        let range = xml.range && xml.range[0];
        if(range)  {
            this.min = parseNumber(range.minimum[0]);
            this.max = parseNumber(range.maximum[0]);
        }

        this.writeAsRead = xml.writeAsRead && xml.writeAsRead[0];
        this.useEnumValues = xml.useEnumValues && xml.useEnumValues[0];
    }
}



