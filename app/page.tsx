"use client";

import { Button, Space, Typography } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-info/20 blur-3xl"
      />


      <section>
        <Title level={1}>Theme Lab</Title>
        <Text
          className="text-5xl font-bold text-foreground"
        >Hello world</Text>
        <Paragraph>
          Ant Design is the source of truth. Colors are mapped in{" "}
          <code>@theme</code> and used as Tailwind classes.
        </Paragraph>

        <Space wrap size="middle">
          <Button
            type={theme === "light" ? "primary" : "default"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            type={theme === "dark" ? "primary" : "default"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            type={theme === "system" ? "primary" : "default"}
            onClick={() => setTheme("system")}
          >
            System
          </Button>

        </Space>

        <div className="mt-8 flex gap-3">
          <div className="h-10 flex-1 rounded-lg bg-info" title="bg-info" />
          <div className="h-10 flex-1 rounded-lg bg-primary" title="bg-primary" />
          <div
            className="h-10 flex-1 rounded-lg bg-layout ring-1 ring-border"
            title="bg-layout"
          />
        </div>
      </section>
    </main>
  );
}
