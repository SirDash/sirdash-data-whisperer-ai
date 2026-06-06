import { supabase } from "@/integrations/supabase/client";
import type { EmailOtpType, User } from "@supabase/supabase-js";

export function profileInitials(user: User): string {
  const meta = user.user_metadata as Record<string, string | undefined> | undefined;
  const fullName = meta?.full_name ?? meta?.name;
  if (fullName?.trim()) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  const email = user.email ?? "";
  return (email.slice(0, 2) || "?").toUpperCase();
}

export function getUserAvatarUrl(user: User): string | undefined {
  const meta = user.user_metadata as Record<string, string | undefined> | undefined;
  return meta?.avatar_url ?? meta?.picture;
}

export async function getSupabaseSessionUser(): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export function subscribeSupabaseAuth(
  onUser: (user: User | null) => void
): { unsubscribe: () => void } {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    onUser(session?.user ?? null);
  });
  return { unsubscribe: () => subscription.unsubscribe() };
}

const SESSION_CHECK_DELAY_MS = 500;

export function getHashParams(): URLSearchParams | null {
  const hash = globalThis.location.hash?.slice(1);
  return hash ? new URLSearchParams(hash) : null;
}

export function clearAuthTokensFromUrl(): void {
  globalThis.history.replaceState(
    null,
    "",
    globalThis.location.pathname + globalThis.location.search
  );
}

export async function verifyPkceFlow(
  token_hash: string,
  type: EmailOtpType
): Promise<{ success: boolean; errorMessage?: string }> {
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) return { success: false, errorMessage: error.message };
  return { success: true };
}

export async function verifyImplicitFlow(): Promise<boolean> {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  };

  if (await checkSession()) return true;
  await new Promise((r) => setTimeout(r, SESSION_CHECK_DELAY_MS));
  return checkSession();
}

export type VerifyEmailResult = {
  success: boolean;
  errorMessage?: string;
};


export async function handleEmailVerification(
  token_hash: string | null,
  type: EmailOtpType | null
): Promise<VerifyEmailResult> {
  const hashParams = getHashParams();
  const hasImplicitFlow = hashParams?.get("access_token");

  if (token_hash && type) {
    const result = await verifyPkceFlow(token_hash, type);
    if (result.success) return { success: true };
    return {
      success: false,
      errorMessage:
        result.errorMessage ??
        "There was a problem verifying your email. The link may have expired or is invalid.",
    };
  }

  if (hasImplicitFlow) {
    const sessionFound = await verifyImplicitFlow();
    if (sessionFound) {
      clearAuthTokensFromUrl();
      return { success: true };
    }
    return {
      success: false,
      errorMessage:
        "There was a problem verifying your email. The link may have expired or is invalid.",
    };
  }

  return { success: false, errorMessage: "Invalid verification link. No token provided." };
}

export function signOutSupabase() {
  return supabase.auth.signOut();
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  const meta = user.app_metadata as Record<string, unknown> | undefined;
  return meta?.role === "admin";
}

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${globalThis.location.origin}/auth/callback`,
    },
  });
}
