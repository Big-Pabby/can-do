import { ref } from "vue";

interface ToastOptions {
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  dismissible?: boolean;
  description?: string;
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration: number;
  dismissible: boolean;
  createdAt: number;
}

// Global toast state
const toasts = ref<Toast[]>([]);
const toastIdCounter = ref(0);

// Default options
const defaultOptions: Required<ToastOptions> = {
  type: "info",
  duration: 5000,
  dismissible: true,
  description: "",
};

// Toast methods
const addToast = (title: string, options: ToastOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const id = `toast-${++toastIdCounter.value}`;

  const toast: Toast = {
    id,
    title,
    description: mergedOptions.description,
    type: mergedOptions.type,
    duration: mergedOptions.duration,
    dismissible: mergedOptions.dismissible,
    createdAt: Date.now(),
  };

  toasts.value.push(toast);

  // Auto dismiss
  if (mergedOptions.duration !== Infinity) {
    setTimeout(() => {
      dismissToast(id);
    }, mergedOptions.duration);
  }

  return id;
};

const dismissToast = (id: string) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const dismissAll = () => {
  toasts.value = [];
};

// Convenience methods
const success = (title: string, options?: ToastOptions) =>
  addToast(title, { ...options, type: "success" });

const error = (title: string, options?: ToastOptions) =>
  addToast(title, { ...options, type: "error" });

const warning = (title: string, options?: ToastOptions) =>
  addToast(title, { ...options, type: "warning" });

const info = (title: string, options?: ToastOptions) =>
  addToast(title, { ...options, type: "info" });

export function useToast() {
  return {
    toasts,
    success,
    error,
    warning,
    info,
    dismiss: dismissToast,
    dismissAll,
    addToast,
  };
}
