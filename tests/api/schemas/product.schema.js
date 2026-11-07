
export const productSchema = {
  type: 'object',

  required: [
    'id',
    'title',
    'description',
    'category',
    'price',
    'stock',
    'rating',
    'brand',
    'thumbnail',
  ],

  properties: {
    id: {
      type: 'integer',
      minimum: 1,
    },

    title: {
      type: 'string',
      minLength: 1,
    },

    description: {
      type: 'string',
    },

    category: {
      type: 'string',
    },

    price: {
      type: 'number',
      minimum: 0,
    },

    stock: {
      type: 'integer',
      minimum: 0,
    },

    rating: {
      type: 'number',
      minimum: 0,
      maximum: 5,
    },

    brand: {
      type: 'string',
    },

    thumbnail: {
      type: 'string',
      minLength: 1,
    },
  },

  // DummyJSON may return additional product properties.
  additionalProperties: true,
};
