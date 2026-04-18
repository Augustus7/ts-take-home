import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  insight: insightsTable.Insert;
};

export default (input: Input): void => {
  console.log("Creating insight");

  input.db.exec(insightsTable.insertStatement(input.insight));

  console.log("Insight created successfully");
};
