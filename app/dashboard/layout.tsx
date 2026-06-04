"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <p className="text-slate-400">Loading...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Pilako
          </p>

          <h1 className="mt-4 text-3xl font-black">Sign in required</h1>

          <p className="mt-3 text-slate-400">
            Please sign in or create an account to access your AI Sales Employee.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <SignInButton mode="modal">
              <button className="rounded-full bg-cyan-300 px-6 py-4 font-black text-black">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-full border border-white/15 px-6 py-4 font-bold">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="fixed right-6 top-6 z-50">
        <UserButton />
      </div>
      {children}
    </>
  );
}