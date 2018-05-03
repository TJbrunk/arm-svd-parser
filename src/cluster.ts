import { DimElement } from "./svd_parser";
import { Register, RegisterProperties } from "./register";

// SVD Cluster element
// https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_cluster

export class Cluster {
    dim: DimElement;
    name: string;
    description?: string;
    //alternateCluster:
    // headerStructName:
    offset: number;
    props?: RegisterProperties;
    registers?: [Register];
    clusters?: [Cluster];
    constructor (xml: string) {
        this.dim = null;
        this.name = xml['name'][0];
        this.offset = xml['offset'][0];
    }
}