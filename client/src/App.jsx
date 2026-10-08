import { useEffect, useState } from "react";
import { getConfig } from "./api";
import { useBatchForm } from "./hooks/useBatchForm.js";
import SettingsPanel from "./components/form/SettingsPanel.jsx";
import RowRepeater from "./components/form/RowRepeater.jsx";
import Button from "./components/ui/Button.jsx";
import BatchView from "./components/batch/BatchView.jsx";

function Console({ config, onSubmitted }) {
  const {
    settings,
    rows,
    updateSetting,
    addRow,
    removeRow,
    moveRow,
    updateRow,
    errors,
    isSubmitting,
    submitError,
    submit,
  } = useBatchForm(config, onSubmitted);

  return (
    <main className="p-6">
      <h1 className="">Batch Export Console</h1>
      <SettingsPanel
        schema={config.settings}
        values={settings}
        errors={errors.settings}
        onChange={updateSetting}
      />
      <RowRepeater
        schema={config.rows}
        rows={rows}
        errors={errors.rows}
        error={errors.rowCount}
        onAdd={addRow}
        onRemove={removeRow}
        onMove={moveRow}
        onUpdate={updateRow}
      />
      <Button onClick={submit} disabled={isSubmitting}>
        Submit
      </Button>
      {submitError && <p role="alert">{submitError}</p>}
    </main>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [batchId, setBatchId] = useState(() =>
    new URLSearchParams(window.location.search).get("batch")
  );

  useEffect(() => {
    getConfig().then(setConfig).catch((error) => setLoadError(error.message));
  }, []);

  const handleSubmitted = (newBatchId) => {
    setBatchId(newBatchId);
    window.history.replaceState(null, "", `?batch=${newBatchId}`);
  };

  if (loadError) {
    return <p className="p-6 text-red-600">Could not load config : {loadError}</p>;
  }

  if (!config) {
    return <p className="p-6">Loading...</p>;
  }

  if (batchId) {
    return (
      <main className="p-6">
        <BatchView batchId={batchId} />
      </main>
    );
  }

  return <Console config={config} onSubmitted={handleSubmitted} />;
}