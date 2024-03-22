class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    // console.log(query);
    this.queryString = queryString;
    // console.log(queryString);
  }
  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search.split(',').join(' ');
      this.query = this.query.find({
        "$or": [
          { name: { $regex: searchQuery } },
          { email: { $regex: searchQuery } },
        ]
      })
    }
    return this;
  }
}
module.exports = APIFeatures