import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema, ToolSchema } from '@modelcontextprotocol/sdk/types.js'

import { scrapeCurriculumContent, searchCurriculumTopics, getCurriculumIndex } from './scrapers/chamberlain.js'

const server = new Server({
  name: 'chamberlain-curriculum-mcp',
  version: '1.0.0',
})

// Define available tools
const tools: ToolSchema[] = [
  {
    name: 'search_curriculum',
    description:
      'Search Chamberlain PMHNP curriculum for specific topics. Returns study materials, lecture notes, and learning objectives.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "anxiety disorders", "medication management", "psychopharmacology")',
        },
        course: {
          type: 'string',
          description:
            'Optional course identifier (e.g., "PMHNP-600", "psychiatric-nursing", "therapeutics"). If not specified, searches all courses.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_curriculum_index',
    description:
      'Get the index of available Chamberlain PMHNP courses and modules. Returns course listings and available topics.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'scrape_topic',
    description:
      'Scrape detailed content for a specific Chamberlain PMHNP topic. Returns full course material, learning objectives, and related resources.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'Topic title (e.g., "Generalized Anxiety Disorder", "Major Depressive Disorder", "Antipsychotic Medications")',
        },
        course: {
          type: 'string',
          description: 'Course name or identifier',
        },
        detailed: {
          type: 'boolean',
          description: 'If true, returns full content. If false, returns summary.',
          default: true,
        },
      },
      required: ['topic'],
    },
  },
]

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request

    switch (name) {
      case 'search_curriculum': {
        const { query, course } = args as { query: string; course?: string }
        const results = await searchCurriculumTopics(query, course)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        }
      }

      case 'get_curriculum_index': {
        const index = await getCurriculumIndex()
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(index, null, 2),
            },
          ],
        }
      }

      case 'scrape_topic': {
        const { topic, course, detailed = true } = args as { topic: string; course?: string; detailed?: boolean }
        const content = await scrapeCurriculumContent(topic, course, detailed)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(content, null, 2),
            },
          ],
        }
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Chamberlain Curriculum MCP Server running on stdio')
}

main().catch(console.error)
