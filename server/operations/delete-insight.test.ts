import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight-by-id.ts";
import lookupInsight from "./lookup-insight.ts";

describe("deleting insights from the database", () => {
  withDB((fixture) => {
    const insights: Insight[] = [
      { id: 1, brand: 0, createdAt: new Date(), text: "1" },
      { id: 2, brand: 0, createdAt: new Date(), text: "2" },
      { id: 3, brand: 1, createdAt: new Date(), text: "3" },
    ];

    let deleted: Insight | undefined;
    let remaining: Insight | undefined;

    beforeAll(() => {
      fixture.insights.insert(
        insights.map((it) => ({
          ...it,
          createdAt: it.createdAt.toISOString(),
        })),
      );

      deleteInsight({ ...fixture, id: 2 });

      deleted = lookupInsight({ ...fixture, id: 2 });
      remaining = lookupInsight({ ...fixture, id: 1 });
    });

    it("removes the requested insight", () => {
      expect(deleted).toBeUndefined();
    });

    it("keeps other insights intact", () => {
      expect(remaining).toEqual(insights[0]);
    });
  });
});
