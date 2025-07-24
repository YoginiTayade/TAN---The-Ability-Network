const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
};


const getMediaArray = (url: string | undefined) => {
  if (url) {
    const formattedUrl = isValidUrl(url)
    if (formattedUrl) {
      return [
        {
          url: url,
        },
      ]
    }
    else {
      return [
        {
          url: encodeURI('https://image/' + url)
        }
      ]
    }
  }
  return [];
};


export const TanCatalogGenerator = (apiData: any, contextData?: any) => {
  const services = apiData?.services ?? [];

  const providers = services.map((service: any) => {
    // Map all addresses to locations - only if they have actual data
    const locations = (service.addresses || [])
      .filter((address: any) => address.address_line_1 || address.city || address.latitude || address.longitude)
      .map((address: any) => {
        const addressParts = [
          address.address_line_1,
          address.address_line_2,
          address.city,
          address.state,
          address.pincode,
          address.organization_name,
        ].filter(Boolean);
        
        if (addressParts.length === 0 && !address.latitude && !address.longitude) {
          return null; // Skip if no address data
        }

        const loc: any = {
          id: address.address_label || address.city || service.id,
        };

        if (addressParts.length > 0) {
          loc.address = addressParts.join(", ");
        }

        if (address.latitude && address.longitude) {
          loc.gps = `${address.latitude},${address.longitude}`;
        }

        return loc;
      })
      .filter(Boolean); // Remove null entries

    // Map fulfillments - only if fulfillment_types exist
    const fulfillments = (service.addresses || [])
      .filter((address: any) => Array.isArray(address.fulfillment_types) && address.fulfillment_types.length > 0)
      .flatMap((address: any, idx: number) => {
        return address.fulfillment_types.map((type: string, tIdx: number) => ({
          id: address.fulfillment_id || `${service.id}_fulfillment_${idx}_${tIdx}`,
          type,
          start: {
            location: {
              location_id: address.address_label || address.city || service.id,
            },
          },
        }));
      });

    // Map contacts - only if they exist
    const contacts = (service.addresses || [])
      .flatMap((address: any) => (address.contacts || []))
      .filter((contact: any) => contact.phone || contact.email)
      .map((contact: any) => {
        const contactObj: any = {};
        if (contact.phone) contactObj.phone = contact.phone;
        if (contact.email) contactObj.email = contact.email;
        return contactObj;
      });

    // Map categories - only if they exist
    const categories = (service.categories || service.disabilities || [])
      .filter(Boolean)
      .map((cat: string) => ({
        id: cat.toLowerCase().replace(/\s+/g, '_'),
        descriptor: { code: cat },
      }));

    const categoryIds = categories.map(c => c.id);

    // Map tags - only if disabilities exist
    const tags = (service.tags || service.disabilities || [])
      .filter(Boolean)
      .map((tag: string) => ({
        code: "disability_type",
        value: tag,
      }));

    // Create item only if service has required data
    const items = [];
    if (service.id && (service.service_name || service.service_description)) {
      const item: any = {
        id: service.id,
        descriptor: {},
      };

      if (service.service_name) {
        item.descriptor.name = service.service_name;
      }

      if (service.service_short_desc) {
        item.descriptor.short_desc = service.service_short_desc;
      } else if (service.service_description) {
        item.descriptor.short_desc = service.service_description;
      }

      if (service.service_description) {
        item.descriptor.long_desc = service.service_description;
      }

      if (service.image) {
        item.descriptor.images = getMediaArray(service.image);
      }

      // Add price only if it exists
      if (service.price && (service.price.value || service.price.listed_value)) {
        item.price = {};
        if (service.price.currency) {
          item.price.currency = service.price.currency;
        }
        if (service.price.value) {
          item.price.value = service.price.value;
        } else if (service.price.listed_value) {
          item.price.value = service.price.listed_value;
        }
      }

      // Add rating only if it exists
      if (service.rating) {
        item.rating = service.rating.toString();
      }

      // Add fulfillment_ids only if fulfillments exist
      if (fulfillments.length > 0) {
        item.fulfillment_ids = fulfillments.map(f => f.id);
      }

      // Add category_ids only if categories exist
      if (categoryIds.length > 0) {
        item.category_ids = categoryIds;
      }

      // Add tags only if they exist
      if (tags.length > 0) {
        item.tags = tags;
      }

      items.push(item);
    }

    // Create provider object
    const provider: any = {
      id: service.id,
      descriptor: {},
    };

    // Add provider name only if it exists
    if (service.organization_names && service.organization_names[0]) {
      provider.descriptor.name = service.organization_names[0];
    }

    // Add provider description only if it exists
    if (service.service_description) {
      provider.descriptor.short_desc = service.service_description;
    }

    // Add provider images only if they exist
    if (service.org_image) {
      provider.descriptor.images = getMediaArray(service.org_image);
    }

    // Add arrays only if they have content
    if (fulfillments.length > 0) {
      provider.fulfillments = fulfillments;
    }

    if (locations.length > 0) {
      provider.locations = locations;
    }

    if (categories.length > 0) {
      provider.categories = categories;
    }

    if (items.length > 0) {
      provider.items = items;
    }

    if (contacts.length > 0) {
      provider.contacts = contacts;
    }

    return provider;
  }).filter(provider => provider.items && provider.items.length > 0); // Only include providers with items

  // Create catalog descriptor
  const catalogDescriptor: any = {
    name: "Disability Service Catalog",
  };

  if (apiData.catalog_image) {
    catalogDescriptor.images = getMediaArray(apiData.catalog_image);
  }

  const catalog = {
    descriptor: catalogDescriptor,
    providers,
  };

  // Return complete response format
  return {
    message: {
      catalog,
    },
  };
};






















