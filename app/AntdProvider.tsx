"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";

const CSS_VAR_KEY = "app";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          cssVar: { key: CSS_VAR_KEY },
          token: {
            colorPrimary: "#1677ff",
            colorInfo: "#1AAB45",
          },
        }}
      >
        {/* Ant cssVar tokens mount on this class — required for Tailwind bg-* */}
        <div className={`${CSS_VAR_KEY} min-h-full flex flex-1 flex-col`}>
          {children}
        </div>
      </ConfigProvider>
    </StyleProvider>
  );
}
