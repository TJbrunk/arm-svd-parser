
// Common propterties and methods that all SVD elements should have/handle
export abstract class BaseElement {

    name: string;
    description?: string;

    constructor (xml: any) {
        this.name = xml.name[0];
        this.description = xml.description && xml.description[0];
        };

    public abstract parseChildren(xml: string)
    }