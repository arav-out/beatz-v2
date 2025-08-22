
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/sign-up"
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

export default LoginPage;