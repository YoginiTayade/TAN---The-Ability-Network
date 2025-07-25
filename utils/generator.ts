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


export const TanCatalogGenerator = (apiData: any,) => {
  const services = apiData?.services ?? [];

  // Collect all unique categories from all services at catalog level
  const allCategories = new Set<string>();
  services.forEach((service: any) => {
    (service.disabilities || [])
      .filter(Boolean)
      .forEach((cat: string) => allCategories.add(cat));
  });

  // Create universal categories for the catalog
  const catalogCategories = Array.from(allCategories).map((cat: string) => ({
    id: cat.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''),
    descriptor: { code: cat },
  }));

  const providers = services.map((service: any) => {
    // Map all addresses to locations with their associated contacts
    const locations = (service.addresses || [])
      .filter((address: any) => address.address_line_1 || address.city)
      .map((address: any) => {
        const addressParts = [
          address.address_line_1,
          address.address_line_2,
          address.city,
          address.state,
          address.pincode?.toString(),
          address.organization_name,
        ].filter(Boolean);
        
        const loc: any = {
          id: address.address_label || address.city || service.id,
        };

        if (addressParts.length > 0) {
          loc.address = addressParts.join(", ");
        }

        // Add contacts to this specific location
        const locationContacts = (address.contacts || [])
          .filter((contact: any) => contact.phone || contact.email)
          .map((contact: any) => {
            const contactObj: any = {};
            if (contact.phone) contactObj.phone = contact.phone;
            if (contact.email) contactObj.email = contact.email;
            return contactObj;
          });

        if (locationContacts.length > 0) {
          loc.contacts = locationContacts;
        }

        return loc;
      });

    // Get category IDs for this service by matching with universal categories
    const serviceCategoryIds = (service.disabilities || [])
      .filter(Boolean)
      .map((cat: string) => cat.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, ''));

    // Map tags from disabilities
    const tags = (service.disabilities || [])
      .filter(Boolean)
      .map((tag: string) => ({
        code: "disability_type",
        value: tag,
      }));

    // Create item only if service has required data
    const items = [];
    if (service.id && service.service_name) {
      const item: any = {
        id: service.id,
        descriptor: {},
      };

      if (service.service_name) {
        item.descriptor.name = service.service_name;
      }

      if (service.service_description) {
        item.descriptor.short_desc = service.service_description;
        item.descriptor.long_desc = service.service_description;
      }

      // Add category_ids only if categories exist - reference universal categories
      if (serviceCategoryIds.length > 0) {
        item.category_ids = serviceCategoryIds;
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

    // Add provider name - use first organization name if available
    if (service.organization_names && service.organization_names.length > 0) {
      provider.descriptor.name = service.organization_names[0];
    }

    // Add provider description only if it exists
    if (service.service_description) {
      provider.descriptor.short_desc = service.service_description;
    }

    // Add arrays only if they have content
    if (locations.length > 0) {
      provider.locations = locations;
    }

    if (items.length > 0) {
      provider.items = items;
    }

    return provider;
  }).filter(provider => provider.items && provider.items.length > 0); // Only include providers with items

  // Create catalog descriptor
  const catalogDescriptor: any = {
    name: "Disability Service Catalog",
  };

  const catalog: any = {
    descriptor: catalogDescriptor,
    providers,
  };

  // Add universal categories to catalog if they exist
  if (catalogCategories.length > 0) {
    catalog.categories = catalogCategories;
  }

  // Return complete response format
  return {
    message: {
      catalog,
    },
  };
};






















