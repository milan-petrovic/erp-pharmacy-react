export enum BaseRoutes {
    BaseUrl = 'http://localhost:3000',
    ApiUrl = 'http://localhost:8081/api',
}

export enum AppRoutes {
    AdminLogin = '/admin/login',
    Admini = '/admin/admini',
    AdminiNew = '/admin/admini/new',
    AdminById = '/admin/admini/:id?',
    Kategorije = '/admin/kategorije',
    KategorijeNew = '/admin/kategorije/new',
    KategorijaById = '/admin/kategorije/:id?',
    NaciniPlacanja = '/admin/naciniPlacanja',
    NaciniPlacanjaNew = '/admin/naciniPlacanja/new',
    NaciniPlacanjaById = '/admin/naciniPlacanja/:id?',
    Farmaceuti = '/admin/farmaceuti',
    FarmaceutiNew = '/admin/farmaceuti/new',
    ApotekaLogin = '/apoteka/login',
    Lijekovi = '/apoteka/lijekovi',
    Prodaje = '/apoteka/prodaje',
    Pacijenti = '/apoteka/pacijenti',
    PacijentiNew = '/apoteka/pacijenti/new',
    PacijentById = '/apoteka/pacijenti/:id?',
    Recepti = '/apoteka/recepti',
}
