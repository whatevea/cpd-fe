import useUserStore from "../storage/userInfo";

export function LoadingWrapper({ children }) {
  const { isHydrated } = useUserStore();

  return <div style={{ opacity: isHydrated ? 1 : 0 }}>{children}</div>;
}
