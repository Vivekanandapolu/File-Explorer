// import { Injectable, OnInit } from '@angular/core';
// import jwt_decode from 'jwt-decode'; // Note the import statement

// @Injectable({
//   providedIn: 'root',
// })
// export class TokenService implements OnInit {
//   private token: string | null = localStorage.getItem('token'); // Initialize with null or actual token
//   ngOnInit(): void {
//     this.validateToken()
//   }
//   setToken(token: string) {
//     this.token = token;
//   }

//   getToken(): string | null {
//     return this.token;
//   }

//   validateToken(): boolean {
//     if (this.token) {
//       try {
//         const decodedToken: any = jwt_decode(this.token);
//         console.log(decodedToken.exp);
//         const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
//         return decodedToken.exp >= currentTimestamp;
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         return false;
//       }
//     }
//     return false;
//   }
// }


import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { TokenRefreshService } from './token-refresh.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // ... (previous methods and properties)

  constructor(private tokenRefreshService: TokenRefreshService) { }

  // Method to check token validity and request a new token if needed

  token: any = localStorage.getItem('token')


  validateTokenAndRefresh(): boolean {
    if (this.token) {
      try {
        const decodedToken: any = jwt_decode(this.token);
        const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds

        // Check if token will expire within 3 minute
        let ramainingTimeOfToken = this.tokenRefreshService.getRemainingTimeUntilExpiration()
        console.log(ramainingTimeOfToken, "remaining Time");
        if (ramainingTimeOfToken <= 180) {
          console.log(ramainingTimeOfToken, "remaining out");
          let obj = {
            token: this.token
          }
          // Request a new token
          this.tokenRefreshService.requestNewToken(obj.token).subscribe(
            (res: any) => {
              // Update the current token with the new token
              localStorage.setItem('token', res.new_token)
            },
            (error) => {
              console.error('Error refreshing token:', error);
            }
          );
        }
        return decodedToken.exp >= currentTimestamp;
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }
}
