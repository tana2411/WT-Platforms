import { countries, materialTypes, packing } from '@app/statics';
import { marker as localized$ } from '@colsen1991/ngx-translate-extract-marker';
import { AuditTrailUserRoleEnum } from 'app/models/admin/audit-trail.model';

export interface Filter {
  name: string;
  value: string;
  type: 'select' | 'checkbox' | 'input' | 'dateRange';
  options?: any[];
  placeholder?: string;
  defaultValue?: string;
}

export enum ListingSortBy {
  DEFAULT = 'createdAtDesc',
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
  AVAILABLE_LISTINGS_ASC = 'availableListingsAsc',
  AVAILABLE_LISTINGS_DESC = 'availableListingsDesc',
}

export const roleOption = [
  { name: localized$('Super Admin'), code: AuditTrailUserRoleEnum.SUPER_ADMIN },
  { name: localized$('Admin'), code: AuditTrailUserRoleEnum.ADMIN },
  // { name: localized$('Haulier'), code: AuditTrailUserRoleEnum.HAULIER },
  // { name: localized$('Trader'), code: AuditTrailUserRoleEnum.TRADER },
  { name: localized$('Seller'), code: AuditTrailUserRoleEnum.SELLER },
  { name: localized$('Buyer'), code: AuditTrailUserRoleEnum.BUYER },
];

export const allFilters: Filter[] = [
  {
    name: localized$('LOCATION'),
    value: 'country',
    type: 'select',
    placeholder: localized$('All Countries'),
    options: countries,
  },
  {
    name: localized$('MATERIAL'),
    value: 'materialType',
    type: 'select',
    options: materialTypes,
  },
  {
    name: localized$('ITEM'),
    value: 'materialItem',
    type: 'select',
    options: [],
  },
  {
    name: localized$('PACKING'),
    value: 'materialPacking',
    type: 'select',
    options: packing,
  },
  {
    name: localized$('SORT BY'),
    value: 'sortBy',
    type: 'select',
    options: [
      {
        name: localized$('Available Material'),
        code: ListingSortBy.AVAILABLE_LISTINGS_ASC,
      },
      {
        name: localized$('Unavailable Material'),
        code: ListingSortBy.AVAILABLE_LISTINGS_DESC,
      },
    ],
  },
  {
    name: localized$('BUYER'),
    value: 'buyerName',
    type: 'input',
  },
  {
    name: localized$('SELLER'),
    value: 'sellerName',
    type: 'input',
  },
  {
    name: localized$('SELLER'),
    value: 'name',
    type: 'input',
  },
  {
    name: localized$('USER'),
    value: 'loggedUserName',
    type: 'input',
  },
  {
    name: localized$('ORGANISATION'),
    value: 'loggedCompanyName',
    type: 'input',
  },
  {
    name: localized$('ROLE'),
    value: 'loggedUserRole',
    type: 'select',
    options: roleOption,
  },
  {
    name: localized$('COMPANY'),
    value: 'company',
    type: 'select',
    options: [],
  },
  {
    name: localized$('STATUS'),
    value: 'status',
    type: 'select',
    options: [
      { code: 'pending', name: localized$('Pending') },
      {
        name: localized$('Active'),
        code: 'active',
      },
      { code: 'rejected', name: localized$('Rejected') },
      { code: 'accepted', name: localized$('Accepted') },
      { code: 'shipped', name: localized$('Shipped') },
    ],
  },
  {
    name: localized$('STATE'),
    value: 'state',
    type: 'select',
    options: [
      {
        name: localized$('Approved'),
        code: 'approved',
      },
      { code: 'pending', name: localized$('Pending') },
      { code: 'rejected', name: localized$('Rejected') },
      { code: 'active', name: localized$('Active') },
    ],
  },
  {
    name: localized$('Show FULFILLED listings'),
    value: 'showFullfilledListing',
    type: 'checkbox',
    options: [
      {
        value: 'showFullfilledListing',
      },
    ],
  },

  {
    name: localized$('Show SOLD listings'),
    value: 'soldListings',
    type: 'checkbox',
    options: [
      {
        value: 'soldListings',
      },
    ],
  },

  {
    name: localized$('STORED'),
    value: 'wasteStoration',
    type: 'checkbox',
    options: [
      {
        value: 'indoor',
        name: localized$('Indoors'),
      },
      {
        value: 'outdoor',
        name: localized$('Outdoors'),
      },
    ],
  },

  {
    name: localized$('DATE REQUIRED FROM'),
    value: 'dateRange',
    type: 'dateRange',
    options: [],
  },
];

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
  { name: localized$('Company Name Asc'), code: WantedListingSortBy.COMPANY_NAME_ASC },
  { name: localized$('Company Name Desc'), code: WantedListingSortBy.COMPANY_NAME_DESC },
  { name: localized$('Material Type Asc'), code: WantedListingSortBy.MATERIAL_TYPE_ASC },
  { name: localized$('Material Type Desc'), code: WantedListingSortBy.MATERIAL_TYPE_DESC },
  { name: localized$('Country Asc'), code: WantedListingSortBy.COUNTRY_ASC },
  { name: localized$('Country Desc'), code: WantedListingSortBy.COUNTRY_DESC },
];

export enum OfferSortBy {
  // BUYER_COMPANY_NAME_ASC = 'buyerCompanyNameAsc',
  // BUYER_COMPANY_NAME_DESC = 'buyerCompanyNameDesc',
  // SELLER_COMPANY_NAME_ASC = 'sellerCompanyNameAsc',
  // SELLER_COMPANY_NAME_DESC = 'sellerCompanyNameDesc',
  // BUYER_COUNTRY_ASC = 'buyerCountryAsc',
  // BUYER_COUNTRY_DESC = 'buyerCountryDesc',
  // SELLER_COUNTRY_ASC = 'sellerCountryAsc',
  // SELLER_COUNTRY_DESC = 'sellerCountryDesc',
  // BUYER_NAME_ASC = 'buyerNameAsc',
  // BUYER_NAME_DESC = 'buyerNameDesc',
  // SELLER_NAME_ASC = 'sellerNameAsc',
  // SELLER_NAME_DESC = 'sellerNameDesc',
  // STATUS_ASC = 'statusAsc',
  // STATUS_DESC = 'statusDesc',
  // STATE_ASC = 'stateAsc',
  // STATE_DESC = 'stateDesc',
  // MATERIAL_TYPE_ASC = 'materialTypeAsc',
  // MATERIAL_TYPE_DESC = 'materialTypeDesc',
  // MATERIAL_PACKING_ASC = 'materialPackingAsc',
  // MATERIAL_PACKING_DESC = 'materialPackingDesc',
  AVAILABLE_LISTINGS_ASC = 'availableListingsAsc',
  AVAILABLE_LISTINGS_DESC = 'availableListingsDesc',
  // CREATED_AT_ASC = 'createdAtAsc',
  // CREATED_AT_DESC = 'createdAtDesc',
}
