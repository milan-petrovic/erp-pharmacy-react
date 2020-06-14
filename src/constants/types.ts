export interface Admin {
    adminId?: number;
    username: string;
    password: string;
    email: string;
}

export interface Farmaceut {
    farmaceutId?: number;
    username: string;
    password: string;
    email: string;
    ime: string;
    prezime: string;
    brojDozvole: number;
}

export interface Kategorija {
    kategorijaId?: number;
    naziv: string;
    opis: string;
}

export interface Lijek {
    lijekId?: number;
    naziv: string;
    opis: string;
    kolicina: number;
    cijena: number;
    kategorija: number;
}

export interface NacinPlacanja {
    nacinPlacanjaId?: number;
    naziv: string;
    opis: string;
}

export interface Pacijent {
    pacijentId?: number;
    ime: string;
    prezime: string;
    datumRodjenja: Date;
    sifraZdravstvene: number;
}

export interface Recept {
    receptId?: number;
    sadrzaj: string;
    datumIzdavanja: Date;
    nazivUstanove: string;
    pacijentId: number;
}

export interface Racun {
    racunId?: number;
    datum: Date;
    suma: number;
    recept?: number;
    nacinPlacanja: number;
    farmaceut?: number;
}

export interface Prodaja {
    prodajaId?: number;
    racun: number;
    lijek: number;
}

export interface AuthUser {
    userId?: number;
    username?: string;
    password?: string;
    email?: string;
    role?: string;
}

export interface LoginModel {
    username: string;
    password: string;
}

export interface NotificationProps {
    popupDuration?: number;
    severity?: 'error' | 'warning' | 'success' | 'info';
    message: string;
    onClose(): void; // will invalidate the entire notification object so this can get freshly re-rendered
}
