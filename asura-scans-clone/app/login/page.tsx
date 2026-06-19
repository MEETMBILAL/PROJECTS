import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <div className="container-shell flex min-h-[70vh] items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
