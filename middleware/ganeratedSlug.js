function generateSlug(inputSlug) {
    if(inputSlug){
      const slug = inputSlug.toLowerCase().replace(/\s+/g, '-');
  
    // Remove special characters
    const cleanedSlug = slug.replace(/[^\w-]+/g, '');
  
    return cleanedSlug;
    }
  }

  module.exports = generateSlug