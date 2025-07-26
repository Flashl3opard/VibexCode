"use client";
import { useState } from "react";
import { account } from "@/lib/appwrite";

// Result type for endpoint (success)
type EndpointResult = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  rawResponse: string;
  parsedResponse: unknown;
  timestamp: string;
};

// Result type for endpoint (error)
type EndpointError = {
  error: string;
  timestamp: string;
};

// Result type for auth success
type AuthResult = {
  success: true;
  userId: string;
  email: string;
  jwtLength: number;
  timestamp: string;
};

// Result type for auth error (re-uses EndpointError)
type ResultsMap = Record<string, EndpointResult | EndpointError | AuthResult>;

const APIDebugger = () => {
  const [results, setResults] = useState<ResultsMap>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: object
  ) => {
    setLoading(endpoint);
    try {
      const jwt = await account.createJWT();

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.jwt}`,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log(`🧪 Testing ${endpoint} with options:`, options);

      const response = await fetch(endpoint, options);

      console.log(`📡 Response status: ${response.status}`);
      console.log(
        `📡 Response headers:`,
        Object.fromEntries(response.headers.entries())
      );

      const responseText = await response.text();
      console.log(
        `📄 Raw response (first 1000 chars):`,
        responseText.substring(0, 1000)
      );

      let parsedResponse: unknown;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e: unknown) {
        // Safely handle unknown type with error narrowing
        let parseErrorMessage = "Unknown error";
        if (e instanceof Error) parseErrorMessage = e.message;
        parsedResponse = {
          error: "Failed to parse JSON",
          rawResponse: responseText,
          parseError: parseErrorMessage,
        };
      }

      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          rawResponse: responseText,
          parsedResponse,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error: unknown) {
      console.error(`❌ Error testing ${endpoint}:`, error);
      // Extract error message safely
      let errorMessage = "Unknown error";
      if (error instanceof Error) errorMessage = error.message;
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const testAuth = async () => {
    setLoading("auth");
    try {
      const jwt = await account.createJWT();
      const user = await account.get();

      setResults((prev) => ({
        ...prev,
        auth: {
          success: true,
          userId: user.$id,
          email: user.email,
          jwtLength: jwt.jwt.length,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error: unknown) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) errorMessage = error.message;
      setResults((prev) => ({
        ...prev,
        auth: {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-w-md max-h-96 overflow-auto shadow-lg z-50">
      <h4 className="font-bold mb-3 text-sm">🔧 API Debugger</h4>

      <div className="space-y-2 mb-4">
        <button
          onClick={() => testAuth()}
          disabled={loading === "auth"}
          className="w-full text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded disabled:opacity-50"
        >
          {loading === "auth" ? "Testing..." : "Test Auth"}
        </button>

        <button
          onClick={() => testEndpoint("/api/user/history")}
          disabled={loading === "/api/user/history"}
          className="w-full text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded disabled:opacity-50"
        >
          {loading === "/api/user/history" ? "Testing..." : "Test History API"}
        </button>

        <button
          onClick={() =>
            testEndpoint("/api/user/mark-solved", "POST", {
              questionId: "test123",
            })
          }
          disabled={loading === "/api/user/mark-solved"}
          className="w-full text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded disabled:opacity-50"
        >
          {loading === "/api/user/mark-solved"
            ? "Testing..."
            : "Test Mark Solved"}
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {Object.entries(results).map(([key, result]) => (
          <details key={key} className="border rounded p-2">
            <summary className="cursor-pointer font-medium">
              {key} {"error" in result && result.error ? "❌" : "✅"}
            </summary>
            <pre className="mt-2 text-xs overflow-auto max-h-32 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        ))}
      </div>

      <button
        onClick={() => setResults({})}
        className="w-full mt-2 text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded"
      >
        Clear Results
      </button>
    </div>
  );
};

export default APIDebugger;
