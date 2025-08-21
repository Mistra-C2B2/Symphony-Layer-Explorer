export interface P02Parameter {
  code: string;
  label: string;
}

export interface ImprovementReasoning {
  improvement_justification: string;
  difficulty_justification: string;
  satellite_justification: string;
}

export interface SymphonyLayer {
  name: string;
  swedish_name: string;
  symphony_theme: string;
  symphony_category: string;
  symphony_data_type: string;
  date_created: string;
  status: string;
  data_format: string;
  temporal_period: string;
  resource_type: string;
  coordinate_reference_system: string;
  summary: string;
  summary_swedish: string;
  lineage: string;
  limitations_for_use_in_symphony: string;
  recommendations_for_data_improvement: string;
  data_authoring_organisation: string;
  contact_organisation: string;
  data_author_contact: string;
  data_owner: string;
  data_owner_contact: string;
  inspire_topic_category: string;
  inspire_theme: string;
  gemet_keywords: string;
  access_use_restrictions: string;
  use_limitations: string;
  other_restrictions: string;
  map_acknowledgement: string;
  security_classification: string;
  maintenance: string;
  metadata_date: string;
  metadata_organisation: string;
  metadata_contact: string;
  improvement_potential: "small" | "medium" | "large";
  difficulty: "low" | "medium" | "high";
  satellite: boolean;
  improvement_reasoning: ImprovementReasoning;
  p02_parameters: P02Parameter[];
  data_availability_index: number;
}

export interface P02Analysis {
  preferred_label: string;
  definition: string | null;
  parameter_availability_index: number;
  horizontal_resolution_pct: number;
  spatial_coverage_pct: number;
  time_coverage_pct: number;
  up_to_date_pct: number;
  occurance: number;
}

export interface Dataset {
  id_dataset: number;
  language: string;
  source: string;
  name: string;
  aquisition_source: string;
  aquisition_detail: string;
  p02_parameters: string[];
  spatial_representation: string;
  horizontal_resolution: string;
  vertical_resolution: number;
  temporal_resolution: string;
  update_frequency: string;
  start_day: number | null;
  start_month: number | null;
  start_year: number;
  end_day: number | null;
  end_month: number | null;
  end_year: string | number;
  format: string[];
  code_accessibility: string;
  url: string;
  bbox: number[];
  regions: string[];
}

export type P02AnalysisData = Record<string, P02Analysis>;

export interface AppData {
  symphonyLayers: SymphonyLayer[];
  p02Analysis: P02AnalysisData;
  catalogue: Dataset[];
}

export interface SearchFilters {
  searchText: string;
  themes: string[];
  improvementPotential: string[];
  difficulty: string[];
  satelliteOnly: boolean;
}

export type SortOption = 
  | "name"
  | "availability"
  | "theme"
  | "parameters"
  | "improvement"
  | "difficulty";