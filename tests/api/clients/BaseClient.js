
export class BaseClient {
  constructor(request) {
    this.request = request;
  }

  async get(endpoint, options = {}) {
    return this.request.get(endpoint, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request.post(endpoint, {
      ...options,
      data,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request.put(endpoint, {
      ...options,
      data,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request.patch(endpoint, {
      ...options,
      data,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request.delete(endpoint, options);
  }
}
