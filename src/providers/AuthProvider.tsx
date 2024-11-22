import { SessionProvider } from '@/contexts/SessionContext';
import { getSession } from '@/lib/session';

export async function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <SessionProvider initialSession={session}>{children}</SessionProvider>;
}
