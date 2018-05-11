import { parseNumber } from "./svd_parser";
import { AddressBlock } from "./address_block";
import { Register, RegisterProperties } from "./register";
import { BaseElement } from "./base_element";
import { Interrupt } from "./interrupt";


// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_peripheral
export class Peripheral extends BaseElement{

    verion?: string;
    groupName?: string;
    baseAddress: number;
    properties?: RegisterProperties;
    addressBlocks? : Array<AddressBlock>;
    interrupts?: Map<string, Interrupt>;
    registers?: Map<string, Register>;

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
            // Not derived from another object. Just set the provided properties
            super(xml);
            this.verion = xml.version[0];
            this.groupName = xml.groupName && xml.groupName[0];
            this.baseAddress = parseNumber(xml.baseAddress[0]);
        }
    }


    public parseChildren(xml: any) {

        // 0-1 dimElementGroup properties
        // this.dimElement = new DimElement(xml);

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
            this.interrupts = new Map();
            xml.interrupt.forEach(int => {
                let i: Interrupt = new Interrupt(int)
                this.interrupts.set(i.name, i);
            });
        }
        

        if(xml.registers)
        {
            this.registers = new Map();
            xml.registers[0].register.forEach(reg => {
                // Check if the register is derived from another register
                let isDerived = reg.$ && reg.$.derivedFrom || null;
                let derived = null;

                if(isDerived) {
                    // TODO:
                    //derived = this.registers.get(isDerived);
                }
                let newReg : Register;
                // Check if the register is defined as an array
                if(reg.dimIncrement && reg.dimIncrement[0]) {
                    let dims = BaseElement.parseDimElement(reg);
                    dims.forEach(dim => {
                        reg.name[0] = dim.name;
                        reg.description[0] = dim.description;
                        reg.addressOffset[0] = dim.addressOffset;
                        newReg = new Register(reg)
                        newReg.parseChildren(reg);
                        this.registers.set(newReg.name, newReg);
                    })
                }
                // Dim element not defined. Processes straight
                else {
                    newReg = new Register(reg);
                    newReg.parseChildren(reg);
                    this.registers.set(newReg.name, newReg);
                }
            });

            // TODO: Process Cluster elements
        }
    }
}