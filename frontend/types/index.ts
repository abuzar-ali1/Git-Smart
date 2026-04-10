export type GitHubData = {
  name: string;
  full_name: string;
  github_url: string;
  github_created_at?: string;
  db_added_at?: string;
  owner_name?: string;
  stars_count?: number;
  forks_count?: number;
  language?: string;
};

export type AnalyzeResponse = {
  repo_details: GitHubData;
  ai_analysis: any;
  refreshed?: boolean;
};