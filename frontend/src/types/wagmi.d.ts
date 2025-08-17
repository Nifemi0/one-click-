declare module "wagmi" {
  export function useAccount(): { address?: string; isConnected: boolean };
  export function useChainId(): number;
}
