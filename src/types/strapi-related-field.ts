/**
 * Types to send strapi api request data with related field attributes.
 * F.E: user, address type...
 */
export interface StrapiRelatedFieldPosition {
  before?: string; // documentId
  after?: string; // documentId
  start?: boolean;
  end?: boolean;
}

export interface StrapiRelatedFieldAttributes {
  documentId: string;
  position?: StrapiRelatedFieldPosition;
  locale?: string; //'en', 'fr'....
  status?: string; // 'draft', 'published'...
}

export interface StrapiRelatedField {
  connect: Array<StrapiRelatedFieldAttributes>;
}
