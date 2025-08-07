import httpClient from '../httpClient'; // Importa l'istanza mockata di httpClient
import ApiService, { apiEndpoints } from '../api.service'; // Importa il servizio e gli endpoint

// Mock completo del modulo httpClient
jest.mock('../httpClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  // Aggiungere altri metodi (put, delete, etc.) se usati nel servizio
}));

describe('ApiService Functions', () => {

  // Mock dei metodi di httpClient prima di ogni test
  const mockHttpGet = httpClient.get as jest.Mock;
  const mockHttpPost = httpClient.post as jest.Mock;

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    mockHttpGet.mockClear();
    mockHttpPost.mockClear();
  });

  // --- Test Funzioni di Login ---

  it('loginUser dovrebbe chiamare httpClient.post con l\'endpoint e le credenziali corrette', async () => {
    const credentials = { email: 'test@user.com', password: 'password123' };
    const mockResponse = { data: { token: 'user-token' } };
    mockHttpPost.mockResolvedValueOnce(mockResponse); // Simula risposta di successo

    const result = await ApiService.loginUser(credentials);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.buyerLogin, credentials);
    expect(result).toEqual(mockResponse.data); // Verifica che i dati della risposta siano restituiti
  });

  it('loginAdmin dovrebbe chiamare httpClient.post con l\'endpoint e le credenziali corrette', async () => {
    const credentials = { email: 'admin@test.com', password: 'adminpassword' };
    const mockResponse = { data: { token: 'admin-token' } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.loginAdmin(credentials);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.adminLogin, credentials);
    expect(result).toEqual(mockResponse.data);
  });

  it('loginAgent dovrebbe chiamare httpClient.post con l\'endpoint e le credenziali corrette', async () => {
    const credentials = { email: 'agent@test.com', password: 'agentpassword' };
    const mockResponse = { data: { token: 'agent-token' } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.loginAgent(credentials);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.agentLogin, credentials);
    expect(result).toEqual(mockResponse.data);
  });

  // --- Test Funzione di Registrazione ---

  it('registerUser dovrebbe chiamare httpClient.post con l\'endpoint e i dati utente corretti', async () => {
    const userData = { name: 'New User', email: 'new@user.com', password: 'newpassword' };
    const mockResponse = { data: { message: 'User registered successfully' } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.registerUser(userData);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.buyerRegister, userData);
    expect(result).toEqual(mockResponse.data);
  });

  // --- Test Funzioni Admin ---

  it('changeAdminPassword dovrebbe chiamare httpClient.post con l\'endpoint e i dati password corretti', async () => {
    const passwordData = { oldPassword: 'old', newPassword: 'new' };
    const mockResponse = { data: { message: 'Password changed' } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.changeAdminPassword(passwordData);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.adminChangePassword, passwordData);
    expect(result).toEqual(mockResponse.data);
  });

  it('createAdmin dovrebbe chiamare httpClient.post con l\'endpoint e i dati admin corretti', async () => {
    const adminData = { name: 'New Admin', email: 'new@admin.com', password: 'adminpass' };
    const mockResponse = { data: { id: 'admin123', ...adminData } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.createAdmin(adminData);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.adminCreate, adminData);
    expect(result).toEqual(mockResponse.data);
  });

  it('createAgent dovrebbe chiamare httpClient.post con l\'endpoint e i dati agente corretti', async () => {
    const agentData = { name: 'New Agent', email: 'new@agent.com', password: 'agentpass', licenseNumber: 'REA123' };
    const mockResponse = { data: { id: 'agent123', ...agentData } };
    mockHttpPost.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.createAgent(agentData);

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.agentCreate, agentData);
    expect(result).toEqual(mockResponse.data);
  });

  // --- Test Funzioni Agente ---

  it('getAgentProfile dovrebbe chiamare httpClient.get con l\'endpoint corretto', async () => {
    const mockProfileData = { fullName: 'Agent Name', email: 'agent@test.com' };
    const mockResponse = { data: mockProfileData };
    mockHttpGet.mockResolvedValueOnce(mockResponse); // Simula risposta GET

    const result = await ApiService.getAgentProfile();

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(apiEndpoints.agentProfile);
    expect(result).toEqual(mockResponse.data);
  });

  it('getAgentStats dovrebbe chiamare httpClient.get con l\'endpoint corretto', async () => {
    const mockStatsData = { totalProperties: 10, soldProperties: 2 };
    const mockResponse = { data: mockStatsData };
    mockHttpGet.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.getAgentStats();

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(apiEndpoints.agentStats);
    expect(result).toEqual(mockResponse.data);
  });

  it('getAgentProperties dovrebbe chiamare httpClient.get con l\'endpoint e i parametri corretti', async () => {
    const params = { page: 1, limit: 10 };
    const mockPropertiesData = [{ id: 'prop1', title: 'Property 1' }];
    const mockResponse = { data: mockPropertiesData };
    mockHttpGet.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.getAgentProperties(params);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(apiEndpoints.agentProperties, { params });
    expect(result).toEqual(mockResponse.data);
  });

  // --- Test Funzioni Proprietà (Buyer & General) ---

  it('searchProperties dovrebbe chiamare httpClient.get con l\'endpoint e i parametri di ricerca corretti', async () => {
    const searchParams = { query: 'villa', category: 'residential' };
    const mockResultsData = [{ id: 'prop2', title: 'Villa Bella' }];
    const mockResponse = { data: mockResultsData };
    mockHttpGet.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.searchProperties(searchParams);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(apiEndpoints.searchProperties, { params: searchParams });
    expect(result).toEqual(mockResponse.data);
  });

  it('getFeaturedProperties dovrebbe chiamare httpClient.get con l\'endpoint corretto', async () => {
    const mockFeaturedData = [{ id: 'prop3', title: 'Featured Prop' }];
    const mockResponse = { data: mockFeaturedData };
    mockHttpGet.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.getFeaturedProperties();

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(apiEndpoints.featuredProperties);
    expect(result).toEqual(mockResponse.data);
  });

  it('getPropertyDetails dovrebbe chiamare httpClient.get con l\'URL corretto (endpoint + ID)', async () => {
    const propertyId = 'prop123';
    const mockDetailsData = { id: propertyId, title: 'Detailed Property', description: '...' };
    const mockResponse = { data: mockDetailsData };
    const expectedUrl = `${apiEndpoints.propertyDetails}/${propertyId}`;
    mockHttpGet.mockResolvedValueOnce(mockResponse);

    const result = await ApiService.getPropertyDetails(propertyId);

    expect(mockHttpGet).toHaveBeenCalledTimes(1);
    expect(mockHttpGet).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockResponse.data);
  });

  // --- Test Gestione Errori (Esempio per una funzione) ---

  it('loginUser dovrebbe rigettare l\'errore se httpClient.post fallisce', async () => {
    const credentials = { email: 'test@user.com', password: 'password123' };
    const mockError = new Error('Network Error');
    mockHttpPost.mockRejectedValueOnce(mockError); // Simula fallimento della chiamata

    // Verifica che la funzione rigetti l'errore
    await expect(ApiService.loginUser(credentials)).rejects.toThrow('Network Error');

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost).toHaveBeenCalledWith(apiEndpoints.buyerLogin, credentials);
  });

});
