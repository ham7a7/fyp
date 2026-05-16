"use client";

import LoadingState from "@/components/ui/LoadingState";
import { withAuth } from "@/lib/withAuth";
import { botService } from "@/services/bot.service";
import type { Bot } from "@/types/bot";
import { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    botId: string;
  }>;
}

function WidgetScriptLoader({ publicBotId }: { publicBotId: string }) {
  useEffect(() => {
    let active = true;
    const scriptId = "bot-widget-script";

    const cleanupWidget = () => {
      document.querySelectorAll(".chatbot-widget").forEach((el) => el.remove());
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };

    cleanupWidget();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "http://localhost:3000/widget.js";
    script.setAttribute("data-bot-id", publicBotId);

    script.onload = () => {
      if (!active) {
        // If the component unmounted before the script loaded (e.g. React StrictMode),
        // remove the widget that the script just injected to prevent duplicates.
        cleanupWidget();
        return;
      }
      
      // Auto-open logic once the script has successfully loaded
      const bubble = document.getElementById("chatbot-toggle");
      const chatWindow = document.getElementById("chatbot-window");
      
      if (bubble && chatWindow && !chatWindow.classList.contains("open")) {
        bubble.click();
      }
    };

    document.body.appendChild(script);

    return () => {
      active = false;
      cleanupWidget();
    };
  }, [publicBotId]);

  return null;
}

function WidgetTestPage({ params }: PageProps) {
  const { botId } = use(params);
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    botService
      .getBot({ botId })
      .then((response) => {
        if (isMounted) setBot(response.bot);
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || err.message || "Failed to load bot");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [botId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Widget Test</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          This page is for widget testing. The widget has been added to the bottom right corner automatically for you to interact with.
        </p>
      </div>

      {loading && <LoadingState message="Loading bot details..." />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      
        <WidgetScriptLoader publicBotId={bot?.publicBotId??""} />
    
    </div>
  );
}

export default withAuth(WidgetTestPage);