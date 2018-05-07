import { parseInteger, DimElement } from "./svd_parser";
import { AddressBlock } from "./address_block";
import { Register, RegisterProperties } from "./register";
import { BaseElement } from "./base_element";
import { Interrupt } from "./interrupt";


// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_peripheral
export class Peripheral extends BaseElement{

    dimElement?: DimElement;
    verion?: string;
    groupName?: string;
    baseAddress: number;
    properties?: RegisterProperties;
    addressBlocks? : Array<AddressBlock>;
    interrupts?: Array<Interrupt>;
    registers?: Array<Register>;

    // Not implemented:
    // alternateElement? : ??;
    // prepend? : string;
    // append? :string;
    // headerStructName?: ;
    // disableCondition? : string;

    constructor (xml: any, source?: Peripheral) {
        // A source will be provided, if this peripherial is inheriting from a different peripheral
        if(source) {
            // If a new description isn't provided, copy the description that we're inheriting from
            if(xml.description === null || xml.description === undefined) {
                super(xml, source.description);
            }
            else {
                super(xml);
            }
            this.verion = source.verion;
            this.groupName = source.groupName;
            this.properties = source.properties;
            this.addressBlocks = source.addressBlocks;
            this.interrupts = source.interrupts;
            this.registers = source.registers;
        }
        else {
            super(xml);
            this.verion = xml.version[0];
            this.groupName = xml.groupName && xml.groupName[0];
            this.baseAddress = parseInteger(xml.baseAddress[0]);
        }
    }


    public parseChildren(xml: any) {

        // 0-1 dimElementGroup properties
        this.dimElement = new DimElement(xml);

        // Can be 0 or 1 Register property in a peripheral
        this.properties = new RegisterProperties(xml);

        // Can be multiple address blocks, so loop over all of them
        let hasAddressBlock = xml.addressBlock;
        if(hasAddressBlock) {
            this.addressBlocks = [];
            xml.addressBlock.forEach(block => {
                this.addressBlocks.push(new AddressBlock(block));
            });
        }

        let hasInterrups = xml.interrupt;
        if(hasInterrups) {
            this.interrupts = [];
            xml.interrupt.forEach(int => {
                this.interrupts.push(new Interrupt(int));
            });
        }
        

        if(xml.registers)
        {
            this.registers = [];
            xml.registers[0].register.forEach(reg => {
                // The <registers></registers> block may also contain cluster element
                let newReg = new Register(reg);
                newReg.parseChildren(reg);
                this.registers.push(newReg);
            });
        }
    }
}