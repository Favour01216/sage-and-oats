"use client";

import { useState } from "react";
import {
  testCacheSystem,
  testCollectionManager,
} from "@/src/lib/test-supabase";

export default function AdminTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, message]);
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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Supabase Integration Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Test Supabase Caching & Collections
          </h2>
          <p className="text-gray-600 mb-4">
            This page tests our new Supabase caching system and collection
            management features.
          </p>

          <button
            onClick={runTests}
            disabled={testing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? "Running Tests..." : "Run Tests"}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
            <h3 className="text-white font-bold mb-2">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Database migration deployed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Supabase cache service created</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Collection manager created</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>External API updated with caching</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
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
