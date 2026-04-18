import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";
import lookupInsight from "./lookup-insight.ts";
import listInsights from "./list-insights.ts";

describe("creating insights in the database", () => {
  withDB((fixture) => {
    const insight: Insight = {
      id: 1,
      brand: 42,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      text: "new insight",
    };

    let created: Insight | undefined;
    let allInsights: Insight[];

    beforeAll(() => {
      createInsight({
        ...fixture,
        insight: {
          brand: insight.brand,
          createdAt: insight.createdAt.toISOString(),
          text: insight.text,
        },
      });

      created = lookupInsight({ ...fixture, id: 1 });
      allInsights = listInsights(fixture);
    });

    it("saves the insight", () => {
      expect(created).toEqual(insight);
    });

    it("adds the insight to the table", () => {
      expect(allInsights).toHaveLength(1);
      expect(allInsights).toEqual([insight]);
    });
  });
});
