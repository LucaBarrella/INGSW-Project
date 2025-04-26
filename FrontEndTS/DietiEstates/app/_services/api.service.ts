export class ApiService {
  // private static readonly BASE_URL = 'https://dieti-esates-backend-scalable.grayfield-620e8113.italynorth.azurecontainerapps.io/api';
  
  // Localhost, for testing
  private static readonly BASE_URL = 'http://localhost:8080/api';

  static get endpoints() {
    return {

      //! Auth

        //? Buyer
        // buyerLogin: `${this.BASE_URL}/buyer/login`,
        // buyerRegister: `${this.BASE_URL}/buyer/register`,
        buyerLogin: `${this.BASE_URL}/users/login`,

        //? Admin
        // adminLogin: `${this.BASE_URL}/admin/login`,
        adminLogin: `${this.BASE_URL}/admins/login`,

        //? Agent
        //TODO CHECK!!!!
        // agentLogin: `${this.BASE_URL}/agent/login`,
        agentLogin: `${this.BASE_URL}/estates_agents/login`,


      // After login

        // Buyer
        //TODO: Add buyer endpoints

        // Admin
        adminPanel: `${this.BASE_URL}/admins/panel`, //! Remove, not needed

        adminChangePassword: `${this.BASE_URL}/admins/change-amministration-password`,
        adminCreate: `${this.BASE_URL}/admins/create-admin`,
        agentCreate: `${this.BASE_URL}/agent/create-estate-agent-account`,

        // Agent
        agentProfile: `${this.BASE_URL}/agent/profile`,

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
