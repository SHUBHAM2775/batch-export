import { useEffect, useState } from "react";
import { getConfig } from "./api";

export default function App() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    getConfig().then(setConfig).catch((error) => setLoadError(error.message));
  }, []);

  if (loadError) {
    return <p className="p-6 text-red-600">Could not load config : {loadError}</p>;
  }
  
  if (!config){
    return <p className="p-6">Loading...</p>;
  }

   return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">Batch Export Console</h1>
      <pre className="mt-4 text-sm">
        {JSON.stringify(config.settings, null, 2)}
      </pre>
    </main>
  );
}