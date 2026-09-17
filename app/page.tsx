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
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-info/20 blur-3xl dark:bg-info/30"
      />

      <section className="relative w-full max-w-lg animate-[fade-in-up_0.5s_ease-out] rounded-2xl border border-border bg-background p-8 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.35)] sm:p-10">
        <Text className="!mb-3 !block !text-xs !font-medium !tracking-[0.18em] !text-info !uppercase">
          Theme lab
        </Text>

        <Title
          level={1}
          className="!mb-3 !text-3xl !leading-tight !text-foreground sm:!text-4xl"
        >
          Hello world
        </Title>

        <Paragraph className="!mb-8 !text-muted">
          Ant Design is the source of truth. Colors are mapped in{" "}
          <code>@theme</code> and used as Tailwind classes.
        </Paragraph>

        <div className="mb-8 flex items-center justify-between rounded-xl bg-fill px-4 py-3">
          <Text className="!text-sm !text-muted">Active mode</Text>
          <Text strong className="!capitalize !text-foreground">
            {mounted ? (resolvedTheme ?? theme ?? "…") : "…"}
          </Text>
        </div>

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
