/** Ano do evento exibido por padrão nas listagens. */
export const DEFAULT_EVENT_YEAR = 2026;

export const EVENT_YEAR_OPTIONS = [2026, 2025];

export function parseEventYear(value) {
  const y = parseInt(value, 10);
  return EVENT_YEAR_OPTIONS.includes(y) ? y : DEFAULT_EVENT_YEAR;
}
