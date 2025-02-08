export class ApiService {
  private static readonly BASE_URL = 'https://dieti-esates-backend-scalable.grayfield-620e8113.italynorth.azurecontainerapps.io/api';

  static get endpoints() {
    return {

      //! Auth

        //? Buyer
        // buyerLogin: `${this.BASE_URL}/buyer/login`,
        // buyerRegister: `${this.BASE_URL}/buyer/register`,
        buyerLogin: `${this.BASE_URL}/users/login`,

        //? Admin
        // adminLogin: `${this.BASE_URL}/admin/login`,
        adminLogin: `${this.BASE_URL}/users/login`,

        //? Agent
        // agentLogin: `${this.BASE_URL}/agent/login`,
        agentLogin: `${this.BASE_URL}/users/login`,


      // After login

        // Buyer
        //TODO: Add buyer endpoints

        // Admin
        adminPanel: `${this.BASE_URL}/admin/panel`,
        adminChangePassword: `${this.BASE_URL}/admin/change-password`,
        adminCreate: `${this.BASE_URL}/admin/create`,
        agentCreate: `${this.BASE_URL}/agent/create`,

        // Agent
        //TODO: Add agent endpoints

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
