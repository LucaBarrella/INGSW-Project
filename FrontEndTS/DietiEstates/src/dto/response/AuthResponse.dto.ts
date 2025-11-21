export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  availableRoles: string[];
  message?: string; // Per messaggi di successo o errore non bloccanti
  // Aggiungere qui altri campi se restituiti dal backend e necessari per il frontend
  // Es. id, email, username, firstName, lastName (se non inclusi nel token o recuperati altrove)
}