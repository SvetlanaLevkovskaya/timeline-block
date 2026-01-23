export interface TimelineEvent {
  year: number;
  description: string;
}

export interface TimelineRange {
  id: string;
  from: number;
  to: number;
  title: string;
  events: TimelineEvent[];
}
