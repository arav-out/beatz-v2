
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/login"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              card: 'shadow-lg',
              headerTitle: 'text-2xl font-bold',
              formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;