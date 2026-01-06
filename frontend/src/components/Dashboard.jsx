import { Bell, MessageSquare, Plus, Search } from "lucide-react";

export default function CommunityDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">C</div>
          <h1 className="text-xl font-semibold">Connunity</h1>
        </div>
        <div className="flex-1 mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
            <input
              placeholder="Search Community"
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare />
          <Bell />
          <Plus />
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6">
        {/* Feed */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          {/* Mood */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold mb-3">What's your mood?</h2>
            <div className="flex flex-wrap gap-2">
              {["Inspiring", "Funny", "Educational", "Wholesome", "Creative", "Chill"].map(
                (mood) => (
                  <span
                    key={mood}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-purple-100 cursor-pointer"
                  >
                    {mood}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Poll */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold mb-3">Community Poll</h2>
            <p className="text-sm text-gray-500 mb-3">What feature should we build next?</p>
            {["Dark Mode", "Mobile App", "AI Assistant", "Advance Search"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 border rounded-lg p-2 mb-2 cursor-pointer"
              >
                <input type="radio" name="poll" />
                {opt}
              </label>
            ))}
            <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg">
              Submit vote
            </button>
          </div>

          {/* Post */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581090700227-1e37b190418e"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">
                The Future of AI in Software Development: What We Can Expect in 2026
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                AI is revolutionizing the way we code. From intelligent code completion to automated testing...
              </p>
              <div className="flex gap-6 text-sm mt-4 text-gray-500">
                <span>👍 3.5K</span>
                <span>💬 540</span>
                <span>🔗 Share</span>
                <span>⭐ Save</span>
              </div>
            </div>
          </div>

          {/* Gaming Post */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1606813902774-23d6f2c28b8d"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">Just finished this indie game and WOW</h3>
              <p className="text-sm text-gray-600 mt-2">
                The storytelling is phenomenal, gameplay is tight, and art style is gorgeous.
              </p>
              <div className="flex gap-6 text-sm mt-4 text-gray-500">
                <span>👍 16.5K</span>
                <span>💬 2.2K</span>
                <span>🔗 Share</span>
                <span>⭐ Save</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-r from-pink-500 to-cyan-400 text-white rounded-xl p-4 shadow">
            <h3 className="font-semibold">Your personal Community</h3>
            <p className="text-sm opacity-90 mt-1">
              Come here to check in with your favorite communities.
            </p>
            <button className="mt-3 w-full bg-white text-gray-800 py-2 rounded-lg">
              Create Post
            </button>
            <button className="mt-2 w-full border border-white py-2 rounded-lg">
              Create Community
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-3">Popular Communities</h3>
            {["technology", "gaming", "nature", "cooking", "programming"].map((c) => (
              <div key={c} className="flex items-center justify-between mb-2">
                <span className="text-sm">c/{c}</span>
                <button className="text-sm px-3 py-1 border rounded-lg">Join</button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">Daily Challenges</h3>
            <p className="text-sm text-gray-500">Community Contributor</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-green-500 h-2 rounded w-1/3"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold">About Community</h3>
            <p className="text-sm text-gray-600 mt-2">
              Welcome to Connunity! Share your thoughts, discover new communities, and engage with posts you love.
            </p>
          </div>
        </aside>
      </main>

      <footer className="bg-gray-800 text-gray-300 text-sm p-4 text-center">
        © 2025 Connunity Inc. All rights reserved
      </footer>
    </div>
  );
}
