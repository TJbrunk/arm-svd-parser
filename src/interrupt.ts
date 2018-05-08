import { parseNumber } from "./svd_parser";
import { BaseElement } from "./base_element";

// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html#elem_interrupt
export class Interrupt extends BaseElement {
    value: number;

    constructor (xml: any) {
        super(xml);
        this.value = parseNumber(xml.value[0]);
        
        return this;
    }

    public parseChildren(xml: any) {
        // Interrupts don't have any childre
        return;
    }
}