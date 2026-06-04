import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-6">
      <SignUp />
    </main>
  );
}