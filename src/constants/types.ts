export interface Admin {
  id?: number;
  username: string;
  password: string;
  email: string;
}

export interface Farmaceut {
  id?: number;
  username: string;
  password: string;
  email: string;
  ime: string;
  prezime: string;
  brojDozvole: number;
}

export interface Kategorija {
  id?: number;
  naziv: string;
  opis: string;
}

export interface Lijek {
  id?: number;
  naziv: string;
  opis: string;
  kolicina: number;
  cijena: number;
  kategorija: Kategorija;
}

export interface NacinPlacanja {
  id?: number;
  naziv: string;
  opis: string;
}

export interface Pacijent {
  id?: number;
  ime: string;
  prezime: string;
  datum_rodjenja: Date;
  sifra_zdravstvene: string;
}

export interface Recept {
  id?: number;
  sadrzaj: string;
  datumIzdavanja: Date;
  nazivUstanove: string;
  pacijent: Pacijent;
}

export interface Racun {
  id?: number;
  datum: Date;
  suma: number;
  recept: Recept;
  nacinPlacanja: NacinPlacanja;
  farmaceut: Farmaceut;
}

export interface Prodaja {
  id?: number;
  racun: Racun;
  lijek: Lijek;
}