export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  category: 'Food' | 'People' | 'Ambiance';
}

export const galleryItems: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'Delicious food being prepared on a grill',
    caption: 'Shared Moments',
    category: 'Food',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A group of friends laughing together',
    caption: 'Genuine Connections',
    category: 'People',
  },
  {
    src: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A cozy restaurant interior with warm lighting',
    caption: 'Perfect Settings',
    category: 'Ambiance',
  },
  {
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A vibrant and healthy salad bowl',
    caption: 'Fresh Connections',
    category: 'Food',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A chef presenting a dish to a happy customer',
    caption: 'More than just a meal',
    category: 'People',
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A restaurant table set for a dinner party',
    caption: 'Ready for an Evening',
    category: 'Ambiance',
  },
  {
    src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A beautifully plated dish at a restaurant',
    caption: 'Tasteful Experiences',
    category: 'Ambiance',
  },
  {
    src: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    alt: 'A variety of fresh ingredients on a kitchen counter',
    caption: 'Simple Ingredients, Great Company',
    category: 'Food',
  },
];