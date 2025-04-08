import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-6 text-center">
            Beer Expiry Tracker
          </h1>
          
          <p className="text-lg md:text-xl text-amber-700 max-w-2xl text-center mb-12">
            Keep track of your beer inventory and never drink an expired beer again. 
            Log your beers, set expiration dates, and get notified before they expire.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-16">
            <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Track Your Collection</h2>
              <p className="text-amber-700 mb-4">
                Add your beers to your inventory with brand, type, and expiry dates.
                Upload images to easily identify your beers.
              </p>
              <Link href="/beers" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition">
                View Inventory
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">Expiry Alerts</h2>
              <p className="text-amber-700 mb-4">
                Get notifications about beers that are approaching their expiry date.
                Never waste another craft beer again.
              </p>
              <Link href="/dashboard" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition">
                Check Dashboard
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 border border-amber-200 max-w-4xl w-full">
            <h2 className="text-3xl font-semibold text-amber-800 mb-6 text-center">
              Getting Started
            </h2>
            
            <ol className="list-decimal list-inside space-y-4">
              <li className="text-amber-700">
                <span className="font-medium">Create an account</span> - Sign up with your email and password
              </li>
              <li className="text-amber-700">
                <span className="font-medium">Add your beers</span> - Input details about each beer in your collection
              </li>
              <li className="text-amber-700">
                <span className="font-medium">Track expiry dates</span> - See which beers are expiring soon
              </li>
              <li className="text-amber-700">
                <span className="font-medium">Get notified</span> - Receive reminders before your beers expire
              </li>
            </ol>
            
            <div className="mt-8 text-center">
              <Link href="/auth/register" className="inline-block px-8 py-4 bg-amber-600 text-white rounded-md text-lg hover:bg-amber-700 transition">
                Sign Up Now
              </Link>
              <p className="mt-4 text-amber-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-800 underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
