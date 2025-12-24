# Chamberlain PMHNP Curriculum MCP Server

A Model Context Protocol (MCP) server for scraping, searching, and serving Chamberlain PMHNP curriculum materials. This server integrates with the Heidi-Time application to provide access to standardized, high-quality psychiatric nursing curriculum content.

## Features

- **Curriculum Search**: Search for PMHNP topics across all Chamberlain courses
- **Content Retrieval**: Get detailed curriculum content with learning objectives, key terms, and explanations
- **Curriculum Index**: Browse available courses and topics
- **Web Scraping**: Extensible framework for scraping public Chamberlain curriculum (respecting ToS)
- **MCP Integration**: Full Model Context Protocol support for Claude and other AI tools

## Architecture

```
Heidi-Time App
    ↓
/api/curriculum/search (Next.js)
/api/curriculum/get
    ↓
MCP Server (Optional, currently using direct API)
    ↓
Curriculum Data (Sample included, expandable)
```

## Getting Started

### Installation

```bash
cd mcp-server
npm install
```

### Running the Server

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## Available Tools

### search_curriculum
Search for specific topics in the Chamberlain PMHNP curriculum.

**Parameters:**
- `query` (required): Search term (e.g., "anxiety disorders", "medication management")
- `course` (optional): Filter by course code (e.g., "PMHNP-600")

**Response:**
```json
{
  "results": [
    {
      "title": "Anxiety Disorders",
      "course": "PMHNP-600",
      "topic": "Anxiety Disorders",
      "summary": "...",
      "keyTerms": ["GAD", "panic", "anxiety"]
    }
  ]
}
```

### get_curriculum_index
Retrieve the index of available courses and topics.

**Response:**
```json
{
  "courses": [
    {
      "id": "PMHNP-600",
      "name": "Psychiatric Nursing I",
      "code": "NP-600",
      "description": "..."
    }
  ],
  "topics": [
    {
      "name": "Anxiety Disorders",
      "course": "PMHNP-600",
      "keywords": ["anxiety", "GAD", "panic"]
    }
  ]
}
```

### scrape_topic
Get detailed content for a specific topic.

**Parameters:**
- `topic` (required): Topic name (e.g., "Anxiety Disorders")
- `course` (optional): Course identifier
- `detailed` (optional): Return full content (default: true)

**Response:**
```json
{
  "title": "Anxiety Disorders",
  "course": "PMHNP-600",
  "topic": "Anxiety Disorders",
  "content": "...",
  "learningObjectives": ["..."],
  "keyTerms": ["..."],
  "relatedTopics": ["..."],
  "source": "Chamberlain University PMHNP Curriculum",
  "timestamp": "2024-12-24T..."
}
```

## Curriculum Data

### Current Topics

#### PMHNP-600: Psychiatric Nursing I
- Anxiety Disorders
- Major Depressive Disorder
- Bipolar Disorder
- Schizophrenia
- Personality Disorders
- Substance Use Disorders

#### PMHNP-700: Psychopharmacology and Therapeutics
- Antipsychotic Medications
- Antidepressants
- Anxiolytics
- Mood Stabilizers
- Stimulants and Other Agents

#### PMHNP-800: Advanced Psychiatric Nursing
- Complex Cases
- Treatment-Resistant Disorders
- Specialized Modalities
- Crisis Management

### Expanding Curriculum

To add more topics, update `src/scrapers/chamberlain.ts`:

```typescript
const SAMPLE_CURRICULUM: Record<string, CurriculumContent> = {
  'your-topic': {
    title: 'Your Topic Title',
    course: 'PMHNP-XXX',
    topic: 'Your Topic',
    content: 'Detailed content...',
    learningObjectives: ['Objective 1', 'Objective 2'],
    keyTerms: ['Term1', 'Term2'],
    relatedTopics: ['Related1', 'Related2'],
  },
}
```

## Web Scraping (Future)

The server includes a placeholder for web scraping Chamberlain's public curriculum materials:

```typescript
export async function scrapeChamberlainWebsite(query: string): Promise<string[]>
```

When implementing web scraping:

1. **Respect robots.txt**: Check and follow Chamberlain's robots.txt rules
2. **Rate limiting**: Add delays between requests (1-2 seconds minimum)
3. **User-agent**: Identify your scraper with proper User-Agent headers
4. **Attribution**: Always cite Chamberlain University as the source
5. **Legal compliance**: Only scrape publicly available content
6. **Error handling**: Implement robust error handling and retries

## Integration with Heidi-Time

The main application integrates with curriculum data via:

```typescript
// Search curriculum
GET /api/curriculum/search?q=anxiety&course=PMHNP-600

// Get topic details
GET /api/curriculum/get?topic=Anxiety+Disorders

// Import to materials
POST /api/upload (with curriculum content as file)
```

## Environment Variables

Create `.env.local` if needed for MCP-specific configuration:

```env
# Optional: Chamberlain website URL for scraping
CHAMBERLAIN_CURRICULUM_URL=https://www.chamberlain.edu/...

# Optional: Scraping rate limit (ms between requests)
SCRAPER_RATE_LIMIT=1000
```

## Development Notes

- **Type Safety**: Full TypeScript support with strict type checking
- **Modularity**: Curriculum data and scrapers are separate modules
- **Extensibility**: Easy to add new scrapers or data sources
- **Testing**: Includes sample data for testing without external requests

## Future Enhancements

1. **Automated Web Scraping**
   - Implement actual Chamberlain website scraping
   - Cache results to reduce requests
   - Schedule regular updates

2. **Content Enrichment**
   - Add images and diagrams
   - Include references and citations
   - Add supplementary resources

3. **Search Improvements**
   - Semantic search using embeddings
   - Fuzzy matching for typos
   - Advanced filtering by difficulty level

4. **Performance**
   - Database caching of curriculum data
   - Compression for large responses
   - Pagination for large result sets

## Troubleshooting

### Server won't start
```bash
npm install
npm run build
npm start
```

### Type errors
```bash
npm install --save-dev @types/node @types/cheerio
npx tsc --noEmit
```

### CORS issues when scraping
- Use appropriate headers
- Consider proxy service for CORS issues
- Implement proper error handling

## Contributing

When adding new curriculum topics:

1. Follow the `CurriculumContent` interface structure
2. Include comprehensive learning objectives
3. Provide 5-10 key terms
4. List related topics for cross-referencing
5. Ensure content is accurate and sourced

## License

This MCP server is part of the Heidi-Time project.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review curriculum data structure
3. Verify API responses with curl/Postman
4. Check server logs for detailed error messages

---

**Status**: Currently using sample data. Web scraping implementation pending.
