export class ApiService {
  private static readonly BASE_URL = 'https://dieti-esates-backend-scalable.grayfield-620e8113.italynorth.azurecontainerapps.io/api';

  static get endpoints() {
    return {
      login: `${this.BASE_URL}/users/login`,
      register: `${this.BASE_URL}/users/register`,
      adminLogin: `${this.BASE_URL}/admin/login`,
      adminPanel: `${this.BASE_URL}/admin/panel`,
      adminChangePassword: `${this.BASE_URL}/admin/change-password`,
      adminCreate: `${this.BASE_URL}/admin/create`,
      agentCreate: `${this.BASE_URL}/agent/create`
    } as const;
  }

  // Helper method to get full URL
  static getEndpoint<T extends keyof typeof ApiService.endpoints>(
    endpoint: T
  ): typeof ApiService.endpoints[T] {
    return this.endpoints[endpoint];
  }
}

export default ApiService;
