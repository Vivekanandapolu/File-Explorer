import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiurls } from './shared/apiurls';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {
  constructor(private http: HttpClient) { }

  requestNewToken(oldToken: string): Observable<any> {
    const params = { token: oldToken }; // Add the old token as a query parameter
    // Make an API request to refresh the token
    // Replace 'your-refresh-endpoint' with the actual API endpoint
    return this.http.post(apiurls.refreshToken, null, { params });
  }
  getRemainingTimeUntilExpiration(): number {
    let token = localStorage.getItem('token')
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds

      return decodedToken.exp - currentTimestamp;
    }
    return 0; // Return 0 if token doesn't exist
  }
}
