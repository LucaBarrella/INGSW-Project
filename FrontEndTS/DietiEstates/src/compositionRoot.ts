import { AuthApi } from "./api/AuthApi";
import { AuthRepository } from "./repositories/AuthRepository";
import { AuthService } from "./services/AuthService";
import { TokenService } from "./services/TokenService";
import { setTokenProvider } from "./core/auth/TokenManager";

// 1. Creation of the API layer instance
const authApi = new AuthApi();

// 2. Creation of the TokenService adapter (implements ITokenService and ITokenProvider)
const tokenService = new TokenService();

// Register TokenService as provider for core TokenManager
setTokenProvider(tokenService);

// 3. Creation of the Repository layer instance with API + TokenService injection
const authRepository = new AuthRepository(authApi, tokenService);

// 4. Creation of the Service layer instance with Repository injection
export const authService = new AuthService(authRepository);