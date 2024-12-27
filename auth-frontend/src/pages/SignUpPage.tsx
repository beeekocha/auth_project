import { Link } from "react-router-dom";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { AuthLayout } from "@/components/layouts/AuthLayout";

const SignUpPage: React.FC = () => {
  return (
    <AuthLayout>
      <SignUpForm />
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
