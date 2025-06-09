import { countries, materialTypes, packing } from '@app/statics';

export interface Filter {
  name: string;
  value: string;
  type: 'select' | 'checkbox' | 'dateRange';
  options: any[];
  placeholder?: string;
  defaultValue?: string;
}

export const allFilters: Filter[] = [
  {
    name: 'LOCATION',
    value: 'country',
    type: 'select',
    options: countries,
  },
  {
    name: 'MATERIAL TYPE',
    value: 'materialType',
    type: 'select',
    options: materialTypes,
  },
  {
    name: 'ITEM',
    value: 'materialItem',
    type: 'select',
    options: [],
  },
  {
    name: 'PACKING',
    value: 'materialPacking',
    type: 'select',
    options: packing,
  },
  {
    name: 'SORT BY',
    value: 'sortBy',
    type: 'select',
    options: [],
  },
  {
    name: 'BUYER',
    value: 'buyerCompanyName',
    type: 'select',
    options: [],
  },
  {
    name: 'SELLER',
    value: 'sellerCompanyName',
    type: 'select',
    options: [],
  },
  {
    name: 'SELLER',
    value: 'company',
    type: 'select',
    options: [],
  },
  {
    name: 'STATUS',
    value: 'status',
    type: 'select',
    options: [
      { code: 'pending', name: 'Pending' },
      {
        name: 'Active',
        code: 'active',
      },
    ],
  },
  {
    name: 'STATE',
    value: 'state',
    type: 'select',
    options: [
      {
        name: 'Active',
        code: 'active',
      },
      { code: 'pending', name: 'Pending' },
    ],
  },
  {
    name: 'FULFILLED LISTINGS',
    value: 'showFullfilledListing',
    type: 'checkbox',
    options: [
      {
        value: 'showFullfilledListing',
      },
    ],
  },

  {
    name: 'SOLD listings',
    value: 'soldListings',
    type: 'checkbox',
    options: [
      {
        name: 'Show SOLD listings',
        value: 'soldListings',
      },
    ],
  },

  {
    name: 'STORED',
    value: 'wasteStoration',
    type: 'checkbox',
    options: [
      {
        value: 'indoor',
        name: 'Indoors',
      },
      {
        value: 'outdoor',
        name: 'Outdoors',
      },
    ],
  },

  {
    name: 'DATE REQUIRED FROM',
    value: 'dateRange',
    type: 'dateRange',
    options: [],
  },

  // for admin wanted listing filter
  {
    name: 'COMPANY',
    value: 'wantedCompany',
    type: 'select',
    options: [],
  },
  {
    name: 'BUYER',
    value: 'wantedBuyer',
    type: 'select',
    options: [],
  },
];

export enum ListingSortBy {
  DEFAULT = 'createAtDesc',
  COMPANY_NAME_ASC = 'companyNameAsc',
  COMPANY_NAME_DESC = 'companyNameDesc',
  MATERIAL_TYPE_ASC = 'materialTypeAsc',
  MATERIAL_TYPE_DESC = 'materialTypeDesc',
  COUNTRY_ASC = 'countryAsc',
  COUNTRY_DESC = 'countryDesc',
  STATUS_ASC = 'statusAsc',
  STATUS_DESC = 'statusDesc',
  STATE_ASC = 'stateAsc',
  STATE_DESC = 'stateDesc',
}

export const listingSortOption = [
  { name: 'Create At Desc', code: ListingSortBy.DEFAULT },
  { name: 'Company Name Asc', code: ListingSortBy.COMPANY_NAME_ASC },
  { name: 'Company Name Desc', code: ListingSortBy.COMPANY_NAME_DESC },
  { name: 'Material Type Asc', code: ListingSortBy.MATERIAL_TYPE_ASC },
  { name: 'Material Type Desc', code: ListingSortBy.MATERIAL_TYPE_DESC },
  { name: 'Country Asc', code: ListingSortBy.COUNTRY_ASC },
  { name: 'Country Desc', code: ListingSortBy.COUNTRY_DESC },
  { name: 'Status Asc', code: ListingSortBy.STATUS_ASC },
  { name: 'Status Desc', code: ListingSortBy.STATUS_DESC },
  { name: 'State Asc', code: ListingSortBy.STATE_ASC },
  { name: 'State Desc', code: ListingSortBy.STATE_DESC },
];

export enum WantedListingSortBy {
  COMPANY_NAME_ASC = 'companyNameAsc',
  COMPANY_NAME_DESC = 'companyNameDesc',
  MATERIAL_TYPE_ASC = 'materialTypeAsc',
  MATERIAL_TYPE_DESC = 'materialTypeDesc',
  COUNTRY_ASC = 'countryAsc',
  COUNTRY_DESC = 'countryDesc',
}

export const wantedSortOption = [
  { name: 'Company Name Asc', code: WantedListingSortBy.COMPANY_NAME_ASC },
  { name: 'Company Name Desc', code: WantedListingSortBy.COMPANY_NAME_DESC },
  { name: 'Material Type Asc', code: WantedListingSortBy.MATERIAL_TYPE_ASC },
  { name: 'Material Type Desc', code: WantedListingSortBy.MATERIAL_TYPE_DESC },
  { name: 'Country Asc', code: WantedListingSortBy.COUNTRY_ASC },
  { name: 'Country Desc', code: WantedListingSortBy.COUNTRY_DESC },
];
