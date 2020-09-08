export interface Workshop {
    id: number;
    desc: string;
    coverImage: string;
    title: string;
    capacity: number;
    isOnline: boolean;
    date: Date;
}

const emptyWorkshop = (): Workshop => ({
    capacity: 0,
    coverImage: "",
    desc: "",
    id: 0,
    date: new Date(Date.now()),
    isOnline: false,
    title: "",
});

export default emptyWorkshop;
