export interface KwertyValidation {
  metric_match: MetricMatch | null;
  error: null;
}

export interface MetricMatch {
  matches: Match[];
}

interface KwertyExtract {
  country: string;
  indicator: string;
  source: string;
  link?: null;
  currency_code?: null | string;
  unit: string;
  category: string;
  frequency: string;
  note?: null;
  tag?: null;
  country_code: string;
  indicator_definition?: null | string;
  value: string | null;
}

export interface Validity {
  is_valid: boolean;
  invalidity_reason: string;
}

export interface Match {
  position: Position;
  message: string;
  openai_extract: OpenaiExtract;
  kwerty_validation: KwertyExtract;
  validity: Validity;
}

export interface OpenaiExtract {
  metric_year: number;
  metric_name: string;
  metric_month: string;
  metric_value: string;
  metric_source: string;
}

export interface Position {
  offset: number;
  length: number;
}
