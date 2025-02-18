// app/page.tsx
import CreateRoomMenu from '@/components/CreateRoomMenu';

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scrum Planning Poker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your agile estimation process with our real-time planning poker tool.
            Create a room, invite your team, and start estimating stories together.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <CreateRoomMenu />
        </div>

        {/* Features section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-time Collaboration
            </h3>
            <p className="text-gray-600">
              Collaborate with your team in real-time. See votes as they happen and
              facilitate meaningful discussions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Multiple Deck Options
            </h3>
            <p className="text-gray-600">
              Choose from Fibonacci, Modified, or T-shirt sizing decks to match
              your team&apos;s estimation style.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              No setup required. Create a room, share the link, and start
              estimating with your team instantly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}