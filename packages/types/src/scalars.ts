// Escalares tipados para evitar Date en contratos externos
export type ISODateString = string & { readonly brand: "ISODateString" };