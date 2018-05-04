import { BaseElement } from "./base_element";
import { DimElement, AccessType, ProtectionType, parseInteger, ACCESS_TYPE_MAP } from "./svd_parser";
import { WriteConstraint } from "./write_constraint";
import { FieldNode } from "./field";

export enum DataType {
    uint8 = 'uint8_t',
    uint16 = 'uint16_t',
    uint32 = 'uint32_t',
    // TODO:
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html
export class Register extends BaseElement {

    dimElement: DimElement;
    displayName?: string;
    altGroup?: string;
    altRegister?: string;
    offset: number;
    properties?: RegisterProperties;
    dataType?: DataType;
    modifiedWrite?: ModifiedWriteType;
    writeContraint?: WriteConstraint;
    // readAction?: 
    // fields?: FieldNode;

    constructor(xml: any) {
        super(xml);
        this.dimElement = new DimElement(xml);
        this.displayName = xml.displayName && xml.displayName[0];
        this.altGroup = xml.alternateGroup && xml.alternateGroup[0];
        this.altRegister = xml.alternateRegister && xml.alternateRegister[0];
        this.offset = xml.addressOffset[0];
        this.properties = new RegisterProperties(xml);
        this.dataType = xml.dataType && xml.dataType[0];
        this.modifiedWrite = xml.modifiedWriteValues && xml.modifiedWriteValues[0];
        this.writeContraint = new WriteConstraint(xml);
    }

    public parseChildren(xml: any) {
        throw new Error("Method not implemented.");
    }
}

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_special.html#registerPropertiesGroup_gr
export class RegisterProperties {
    size?: number;
    access?: AccessType;
    protection?: ProtectionType;
    resetValue?: number;
    resetMask?: number;

    constructor (xml: any) {
            this.size = parseInteger(xml.size && xml.size[0])
            this.access = ACCESS_TYPE_MAP[xml.access && xml.access[0]]; 
            this.protection = <ProtectionType>xml.protection && xml.protection[0];
            this.resetValue = xml.resetValue && xml.resetValue[0];
            this.resetMask = xml.resetMask && xml.resetMask[0];
            return this;
    }
}

// See: https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_field
// for descriptions of modified write values
export enum ModifiedWriteType {
    OneToClear = 'oneToClear',
    OneToSet = 'oneToSet',
    OneToToggle = 'oneToToggle',
    ZeroToClear = 'zeroToClear',
    ZeroToSet = 'zeroToSet',
    ZeroToToggle = 'zeroToToggle',
    Clear = 'clear',
    Set = 'set',
    Modify= 'modify'
}