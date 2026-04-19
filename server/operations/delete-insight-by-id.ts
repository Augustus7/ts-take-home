import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): void => {
  console.log(`Deleting insight for id=${input.id}`);

  input.db.exec(insightsTable.deleteInsightSql, [input.id]);

  console.log("Insight deleted successfully");
};
