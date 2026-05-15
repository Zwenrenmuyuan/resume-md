import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface DialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface InternalState {
  options: DialogOptions;
  kind: 'confirm' | 'alert';
  resolve: (ok: boolean) => void;
}

interface DialogApi {
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, 'cancelText' | 'danger'>) => Promise<void>;
}

const DialogContext = createContext<DialogApi | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InternalState | null>(null);
  const stateRef = useRef<InternalState | null>(null);
  stateRef.current = state;

  const close = useCallback((ok: boolean) => {
    const current = stateRef.current;
    if (current) {
      current.resolve(ok);
      setState(null);
    }
  }, []);

  const confirm = useCallback((options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ options, kind: 'confirm', resolve });
    });
  }, []);

  const alert = useCallback((options: Omit<DialogOptions, 'cancelText' | 'danger'>) => {
    return new Promise<void>((resolve) => {
      setState({
        options,
        kind: 'alert',
        resolve: () => resolve(),
      });
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close(false);
      else if (e.key === 'Enter') close(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, close]);

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {state && (
        <div
          className="dialog-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false);
          }}
        >
          <div className="dialog-card">
            {state.options.title && <h3 className="dialog-title">{state.options.title}</h3>}
            <p className="dialog-message">{state.options.message}</p>
            <div className="dialog-actions">
              {state.kind === 'confirm' && (
                <button
                  type="button"
                  className="dialog-btn dialog-btn-secondary"
                  onClick={() => close(false)}
                >
                  {state.options.cancelText ?? '取消'}
                </button>
              )}
              <button
                type="button"
                className={`dialog-btn ${
                  state.options.danger ? 'dialog-btn-danger' : 'dialog-btn-primary'
                }`}
                onClick={() => close(true)}
                autoFocus
              >
                {state.options.confirmText ?? (state.kind === 'alert' ? '知道了' : '确定')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within DialogProvider');
  return ctx;
}
