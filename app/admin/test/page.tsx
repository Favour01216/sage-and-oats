"use client";

import { useState } from "react";
import { testCacheSystem, testCollectionManager } from "@/src/lib/test-supabase";

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Capture console.log for display
    const originalLog = console.log;
    console.log = (...args) => {
      addResult(args.join(" "));
      originalLog(...args);
    };

    try {
      await testCacheSystem();
      await testCollectionManager();
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    }

    // Restore console.log
    console.log = originalLog;
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Supabase Integration Test</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Test Supabase Caching & Collections</h2>
          <p className="mb-4 text-gray-600">
            This page tests our new Supabase caching system and collection management features.
          </p>

          <button
            onClick={runTests}
            disabled={testing}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? "Running Tests..." : "Run Tests"}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
            <h3 className="mb-2 font-bold text-white">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>Database migration deployed</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>Supabase cache service created</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>Collection manager created</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>External API updated with caching</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Next Steps</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Integrate authentication (Google/GitHub)</li>
            <li>• Update recipe pages to use collections</li>
            <li>• Add popular recipes dashboard</li>
            <li>• Implement search result caching</li>
            <li>• Add collection sharing features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
