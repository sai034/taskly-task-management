import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  title: string;
  username: string;
  guest: boolean;
}

const GUEST: AuthUser = {
  id: 'u-dexter',
  name: 'Dexter',
  email: 'dexter@gmail.com',
  title: 'Designer',
  username: 'dexuser',
  guest: true,
};

/**
 * Lightweight auth for the demo. Guest login returns the shared demo user and
 * an opaque session token. `google` is a mock of an OAuth exchange. Real JWT
 * verification would replace the token issuing here.
 */
@Injectable()
export class AuthService {
  loginAsGuest() {
    return { token: this.issueToken(), user: { ...GUEST } };
  }

  loginWithGoogle() {
    return { token: this.issueToken(), user: { ...GUEST, guest: false } };
  }

  private issueToken() {
    return `demo_${randomUUID()}`;
  }
}
