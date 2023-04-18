export interface Metrics {
    metrics: (MetricsEntity)[];
}
export interface MetricsEntity {
    country: string;
    result: (ResultEntity)[];
}
export interface ResultEntity {
    summary: string;
    openai_extract: OpenaiExtract;
    pandas_extract: PandasExtract;
    is_valid: boolean;
}
export interface OpenaiExtract {
    metric: string;
    month: string;
    source: string;
    value: number;
    year: number;
}
export interface PandasExtract {
    country: string;
    Indicator: string;
    Source: string;
    Link?: null;
    CurrencyCode?: null|string;
    Unit: string;
    Category: string;
    Frequency: string;
    Note?: null;
    Tag?: null;
    CountryCode: string;
    IndicatorDefinition?: null|string;
    value: string;
}
