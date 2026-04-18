import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight>([]);
  const loadInsights = async () => {
    const res = await fetch("/api/insights");
    const data = await res.json();
    setInsights(  data.map((insight) => ({
      ...insight,
      date: new Date(insight.createdAt),
    })));
  };

  useEffect(() => {

    loadInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header loadInsights = {() => loadInsights()} />
      <Insights
          className={styles.insights}
          insights={insights}
          loadInsights = {() => loadInsights()} />
    </main>
  );
};
