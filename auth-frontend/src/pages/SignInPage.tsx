import { Link } from "react-router-dom";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthLayout } from "@/components/layouts/AuthLayout";

const SignInPage: React.FC = () => {
  return (
    <AuthLayout>
      <SignInForm />
      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignInPage;
