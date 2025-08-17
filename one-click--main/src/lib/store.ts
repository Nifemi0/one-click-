// Zustand store for global state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  DeployedTrap, 
  TrapTemplate, 
  Alert, 
  DeploymentStep, 
  Notification,
  AppState 
} from '@/types';

interface StoreState extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  setTraps: (traps: DeployedTrap[]) => void;
  addTrap: (trap: DeployedTrap) => void;
  updateTrap: (id: string, updates: Partial<DeployedTrap>) => void;
  removeTrap: (id: string) => void;
  setTemplates: (templates: TrapTemplate[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  removeAlert: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: DeploymentStep | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  traps: {
    deployed: [],
    templates: [],
    activeAlerts: [],
  },
  ui: {
    isLoading: false,
    currentStep: null,
    notifications: [],
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      updateUserPreferences: (preferences) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                ...preferences,
              },
            },
          });
        }
      },

      setTraps: (traps) => set((state) => ({
        traps: { ...state.traps, deployed: traps }
      })),

      addTrap: (trap) => set((state) => ({
        traps: { 
          ...state.traps, 
          deployed: [...state.traps.deployed, trap] 
        }
      })),

      updateTrap: (id, updates) => set((state) => ({
        traps: {
          ...state.traps,
          deployed: state.traps.deployed.map((trap) =>
            trap.id === id ? { ...trap, ...updates } : trap
          ),
        },
      })),

      removeTrap: (id) => set((state) => ({
        traps: {
          ...state.traps,
          deployed: state.traps.deployed.filter((trap) => trap.id !== id),
        },
      })),

      setTemplates: (templates) => set((state) => ({
        traps: { ...state.traps, templates }
      })),

      setAlerts: (alerts) => set((state) => ({
        traps: { ...state.traps, activeAlerts: alerts }
      })),

      addAlert: (alert) => set((state) => ({
        traps: {
          ...state.traps,
          activeAlerts: [...state.traps.activeAlerts, alert],
        },
      })),

      updateAlert: (id, updates) => set((state) => ({
        traps: {
          ...state.traps,
          activeAlerts: state.traps.activeAlerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        },
      })),

      removeAlert: (id) => set((state) => ({
        traps: {
          ...state.traps,
          activeAlerts: state.traps.activeAlerts.filter((alert) => alert.id !== id),
        },
      })),

      setLoading: (isLoading) => set((state) => ({
        ui: { ...state.ui, isLoading }
      })),

      setCurrentStep: (currentStep) => set((state) => ({
        ui: { ...state.ui, currentStep }
      })),

      addNotification: (notification) => {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2),
          createdAt: new Date(),
          ...notification,
        };

        set((state) => ({
          ui: {
            ...state.ui,
            notifications: [...state.ui.notifications, newNotification],
          },
        }));

        // Auto-remove notification after duration (default: 5 seconds)
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, duration);
      },

      removeNotification: (id) => set((state) => ({
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter((n) => n.id !== id),
        },
      })),

      clearNotifications: () => set((state) => ({
        ui: { ...state.ui, notifications: [] }
      })),

      reset: () => set(initialState),
    }),
    {
      name: 'drosera-store',
      partialize: (state) => ({
        user: state.user,
        traps: {
          deployed: state.traps.deployed,
          templates: state.traps.templates,
        },
        ui: {
          notifications: state.ui.notifications,
        },
      }),
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useStore((state) => state.user);
export const useUserAddress = () => useStore((state) => state.user?.walletAddress);
export const useIsConnected = () => useStore((state) => state.user?.isConnected ?? false);
export const useChainId = () => useStore((state) => state.user?.chainId);

export const useDeployedTraps = () => useStore((state) => state.traps.deployed);
export const useTrapTemplates = () => useStore((state) => state.traps.templates);
export const useActiveAlerts = () => useStore((state) => state.traps.activeAlerts);

export const useIsLoading = () => useStore((state) => state.ui.isLoading);
export const useCurrentStep = () => useStore((state) => state.ui.currentStep);
export const useNotifications = () => useStore((state) => state.ui.notifications);

// Computed selectors
export const useTrapCount = () => useStore((state) => state.traps.deployed.length);
export const useActiveTrapCount = () => useStore((state) => 
  state.traps.deployed.filter(trap => trap.isActive).length
);
export const useAlertCount = () => useStore((state) => state.traps.activeAlerts.length);
export const useUnacknowledgedAlertCount = () => useStore((state) => 
  state.traps.activeAlerts.filter(alert => !alert.isAcknowledged).length
);

// Action hooks
export const useStoreActions = () => useStore((state) => ({
  setUser: state.setUser,
  updateUserPreferences: state.updateUserPreferences,
  setTraps: state.setTraps,
  addTrap: state.addTrap,
  updateTrap: state.updateTrap,
  removeTrap: state.removeTrap,
  setTemplates: state.setTemplates,
  setAlerts: state.setAlerts,
  addAlert: state.addAlert,
  updateAlert: state.updateAlert,
  removeAlert: state.removeAlert,
  setLoading: state.setLoading,
  setCurrentStep: state.setCurrentStep,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  reset: state.reset,
}));