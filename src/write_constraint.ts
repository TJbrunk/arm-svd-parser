// SVD write constraint element
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_writeConstraint


export class WriteConstraint {
    public max?: number;
    public min?: number;

    public writeAsRead?: boolean;
    public useEnumValues?: boolean;

    constructor(xml : string) {
        if(xml['range'])  {
            this.min = xml['range'][0]['minimum'][0];
            this.max = xml['range'][0]['maximum'][0];
        }

        this.writeAsRead = xml['writeAsRead'] ? xml['writeAsRead'][0] : undefined;
        this.useEnumValues = xml['useEnumValues'] ? xml['useEnumValues'][0] : undefined;
    }
}



