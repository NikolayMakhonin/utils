export declare class Priority {
    readonly order: number;
    readonly parent: Priority;
    constructor(order: number, parent?: Priority);
    private _brunch;
    get brunch(): number[];
}
export declare function priorityCreate(order: number, parent?: Priority): Priority;
export declare function priorityCompare(o1: Priority, o2: Priority): number;
