export enum ProductStatus {
  Available = 'available',
  Required = 'required',
  Sold = 'sold',
  Expired = 'expired',
  Ongoing = 'ongoing',
}

// todo: update it later
export type Product = {
  name: string;
  location: string;
  averaWeightPerLoad: string;
  imageSrc: string;
  status: ProductStatus;
  fromDate?: string;
};
