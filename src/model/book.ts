export type book={
    id:string,
    title: string,
    author: string,
    genre: Genres,
    status: StatusBook,
    picklist: PickRecord[],
}

export enum Genres {
    "SCI_FI"='sci-fi',
    "FANTASY"='fantasy',
    "ROMANTIC"='love',
    "PHILOSOPHICAL"='philosophical',
    "POEMS"='poems',
    "CLASSIC"='classic'
}

export enum StatusBook {
    'ON_STOCK'='on_stock',
    'ON_HAND'='on_hand',
    'REMOVED'='removed',

}
export type PickRecord = {
    reader:string,
    date: string,
}
export enum Role{
    USER= 'user',
    ADMIN = 'admin',
    LIBRARIAN = 'librarian',
    ROOT_ADMIN = 'owner'
}