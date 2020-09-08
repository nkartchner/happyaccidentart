export interface Address {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: number;
    name: string;
}

const emptyAddress = (): Address => ({
    address: "",
    name: "",
    city: "",
    state: "",
    zipCode: 0,
    id: 0,
});

export default emptyAddress;
