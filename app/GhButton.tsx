"use client";

import { Button, ConfigProvider, theme } from "antd";
import type { ButtonProps } from "antd";

/**
 * Golden Ant Design Button — color comes from ConfigProvider token
 * (colorGolden), not Tailwind className.
 */
export default function GhButton({ type = "primary", ...props }: ButtonProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: token.colorGolden,
        },
      }}
    >
      <Button type={type} {...props} />
    </ConfigProvider>
  );
}
