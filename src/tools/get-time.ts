import { z } from 'zod';
import { defineTool } from './types.ts';
import { getTimeInfo, DEFAULT_TIMEZONE } from '../time.ts';

export const getTime = defineTool({
  name: 'get_time',
  description:
    'Get the current date and time. Defaults to US Eastern (America/New_York). Pass an IANA timezone to get the time elsewhere.',
  inputSchema: {
    timezone: z
      .string()
      .optional()
      .describe(
        'IANA timezone name (e.g. "America/New_York", "Europe/London", "Asia/Tokyo"). Defaults to America/New_York (US Eastern).',
      ),
  },
  annotations: { readOnlyHint: true },
  async handler({ timezone }) {
    const result = getTimeInfo(new Date(), timezone ?? DEFAULT_TIMEZONE);
    if (!result.ok) {
      return {
        content: [{ type: 'text' as const, text: result.error }],
        isError: true,
      };
    }

    const t = result.value;
    const text = `Current time: ${t.local}
Timezone: ${t.timezone} (${t.utcOffset})
ISO (UTC): ${t.iso}`;

    return { content: [{ type: 'text' as const, text }] };
  },
});
