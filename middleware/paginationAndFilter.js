class PaginationAndFilter {
  constructor(model) {
    this.model = model;
  }

  async getPaginatedAndFilteredResults(queryParams) {
    const { page = 1, limit = 10, name, status, featured, isVerified, email, contactNumber, district, pincode, state, listType } = queryParams;



    let filters = {};

    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }

    if (status) {
      filters.status = status;
    }

    if (featured) {
      filters.featured = featured === 'true';
    }

    if (isVerified) {
      filters.isVerified = isVerified;
    }

    if (email) {
      filters.isVerified = email;
    }

    if (contactNumber) {
      filters.isVerified = contactNumber;
    }

    if (district) {
      filters.isVerified = district;
    }

    if (pincode) {
      filters.isVerified = pincode;
    }

    if (state) {
      filters.isVerified = state;
    }

    if (listType) {
      filters.membershipStatus = listType;
    }

    const skip = (page - 1) * limit;

    try {

      const items = await this.model.find(filters)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();


      const total = await this.model.countDocuments(filters);

      const totalPages = Math.ceil(total / limit);

      const paginationHtml = this.generatePaginationHtml(totalPages, parseInt(page));

      return {
        items,
        paginationHtml
      };
    } catch (error) {
      throw new Error('Error fetching');
    }
  }

  generatePaginationHtml(totalPages, currentPage) {
    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                              <a class="page-link" href="#" data-page="${i}">${i}</a>
                            </li>`;
    }
    return paginationHtml;
  }
}

module.exports = PaginationAndFilter;