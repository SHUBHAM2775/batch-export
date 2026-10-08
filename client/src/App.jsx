import { useEffect, useState } from "react";
import { getConfig } from "./api";
import { useBatchForm } from "./hooks/useBatchForm.js";
import { useTheme } from "./hooks/useTheme.js";
import SettingsPanel from "./components/form/SettingsPanel.jsx";
import RowRepeater from "./components/form/RowRepeater.jsx";
import Button from "./components/ui/Button.jsx";
import BatchView from "./components/batch/BatchView.jsx";
import ThemeToggle from "./components/ui/ThemeToggle.jsx";

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
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-8 space-y-6 order-1">
          <div className="bg-surface border border-border rounded-card p-6 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Step 01</span>
              <h2 className="text-xl">Export settings</h2>
              <p className="text-sm text-text-muted">Configure global parameters for this batch export.</p>
            </div>
            <SettingsPanel
              schema={config.settings}
              values={settings}
              errors={errors.settings}
              onChange={updateSetting}
            />
          </div>

          <div className="bg-surface border border-border rounded-card p-6 space-y-4">
            {errors.rowCount && <p role="alert" className="text-error text-sm font-medium">{errors.rowCount}</p>}
            {submitError && <p role="alert" className="text-error text-sm font-medium">{submitError}</p>}
            <Button onClick={submit} disabled={isSubmitting} className="w-full py-3 text-lg">
              {isSubmitting ? "Starting export..." : "Start batch export"}
            </Button>
            <p className="text-xs text-text-muted text-center">
              You can retry individual items if an export fails.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 order-2">
          <div className="bg-surface border border-border rounded-card p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Step 02</span>
                <h2 className="text-xl">{config.rows?.label || "Items to export"}</h2>
                <p className="text-sm text-text-muted">Upload and configure the images to be processed.</p>
              </div>
              <div className="px-2 py-1 rounded-full bg-main border border-border text-[10px] font-bold tabular-nums text-text-muted">
                {rows.length} / {config.rows?.max || "∞"}
              </div>
            </div>
            <RowRepeater
              schema={config.rows}
              rows={rows}
              errors={errors.rows}
              error={null}
              onAdd={addRow}
              onRemove={removeRow}
              onMove={moveRow}
              onUpdate={updateRow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [batchId, setBatchId] = useState(() =>
    new URLSearchParams(window.location.search).get("batch")
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    getConfig().then(setConfig).catch((error) => setLoadError(error.message));
  }, []);

  const handleSubmitted = (newBatchId) => {
    setBatchId(newBatchId);
    window.history.replaceState(null, "", `?batch=${newBatchId}`);
  };

  const goHome = () => {
    setBatchId(null);
    window.history.replaceState(null, "", "/");
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <p className="text-error font-medium">Could not load config: {loadError}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <p className="text-text-muted animate-pulse">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <header className="max-w-6xl mx-auto py-8 px-6 flex items-center justify-between">
        <div className="space-y-1">
          <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
            Export workspace
          </span>
          <h1 className="text-3xl">Batch Export Console</h1>
          <p className="text-sm text-text-muted">Manage and monitor your campaign image exports</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {batchId ? (
        <main className="max-w-6xl mx-auto py-0 px-6">
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-main transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to home
          </button>
          <BatchView batchId={batchId} />
        </main>
      ) : (
        <Console config={config} onSubmitted={handleSubmitted} />
      )}
    </div>
  );
}
