import { useState } from "react";

const SiliconFlowKeyChecker = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ key: string; isValid: boolean }[]>(
    []
  );

  const handleAddKey = () => {
    if (inputKey.trim() && !keys.includes(inputKey.trim())) {
      setKeys((prevKeys) => [...prevKeys, inputKey.trim()]);
      setInputKey("");
    }
  };

  const handleCheckKeys = async () => {
    setLoading(true);
    const validationResults = await Promise.all(
      keys.map(async (key) => {
        try {
          const response = await fetch(
            "https://api.siliconflow.cn/v1/user/info",
            {
              headers: {
                Authorization: `Bearer ${key}`,
              },
            }
          );
          const data = await response.json();
          return { key, isValid: response.ok && data?.data.id };
        } catch (error) {
          return { key, isValid: false };
        }
      })
    );
    setResults(validationResults);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        SiliconFlow Key Checker
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter SiliconFlow API Key"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddKey}
          className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Key
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Keys to Check
        </h2>
        <ul className="space-y-2">
          {keys.map((key, index) => (
            <li
              key={index}
              className="bg-gray-100 p-2 rounded-md text-gray-700"
            >
              {key}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCheckKeys}
        disabled={loading || keys.length === 0}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Checking..." : "Check Keys"}
      </button>
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Validation Results
          </h2>
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={index}
                className={`p-2 rounded-md ${
                  result.isValid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.key} - {result.isValid ? "Valid" : "Invalid"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SiliconFlowKeyChecker;
