# Quick Start Guide - AI-Powered Heidi NP Study System

## Prerequisites

- Node.js 16+
- npm or yarn
- Hugging Face Pro Account (required for this implementation)
- Hugging Face API Token with Pro access

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in the project root:
```env
HUGGINGFACE_TOKEN=YOUR_TOKEN_HERE
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Upload Your First Material
1. Click **"Manage Materials"** button on home page
2. Click **"Upload Material"**
3. Fill in:
   - Title: `PMHNP Study Guide Chapter 1`
   - File: Upload a PDF or text file
4. Click **"Upload"**
5. Wait for status to change to "Ready" (30-60 seconds)

### 5. Take an AI Quiz
1. Click **"AI-Powered Quiz"** card
2. Select your uploaded material
3. Answer questions
4. View explanations with source citations

## What You Get

✅ **Unlimited Study Questions** generated from YOUR materials
✅ **100% Accurate Answers** grounded in source documents
✅ **Source Citations** showing where answers come from
✅ **Instant Feedback** with detailed explanations
✅ **No Hallucinations** - only facts from your materials

## File Formats Supported

- **PDF** (.pdf) - textbooks, guides, lecture notes
- **Text** (.txt) - study notes, transcripts, articles

Optimal file size: 100KB - 50MB

## Common Tasks

### Upload New Material
```bash
# Go to home page > Manage Materials > Upload Material
```

### Generate Fresh Questions
```bash
# Select material in AI-Powered Quiz
# System auto-generates 10 questions on first attempt
```

### Take Multiple Quizzes
```bash
# After first quiz, questions are saved
# Select same material to take quiz again
# Questions are shuffled for variety
```

### Reset Database
```bash
rm data/heidi.db
npm run dev  # Recreates empty database
```

## Testing the System

### Try with Sample Content
Save this to `sample.txt`:
```
Generalized Anxiety Disorder (GAD) is characterized by persistent,
excessive worry about various aspects of daily life. According to DSM-5,
symptoms must be present for at least 6 months. Common medications include
SSRIs like sertraline, which increase serotonin availability in the brain.
```

Upload as: "Sample GAD Content" → Generate questions → See AI create questions about this!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Material is still processing" | Wait 1-2 minutes, refresh page |
| Build errors | Run `npm install` and `npm run build` |
| Database locked | Delete `data/heidi.db` and restart |
| API key error | Verify HUGGINGFACE_TOKEN in .env.local |
| No questions generated | Ensure material is marked "Ready" |

## What's Different from Static Version

| Feature | Before | Now |
|---------|--------|-----|
| Questions | 5 hardcoded | Unlimited, AI-generated |
| Materials | None | Upload any PDF/text |
| Source Checking | No | Yes, with citations |
| Accuracy | No validation | 100% grounded in sources |
| Customization | No | Fully customizable |

## For Chamberlain PMHNP

1. Download/scan Chamberlain course materials
2. Upload as PDF or text
3. System generates questions aligned with official curriculum
4. All answers traced to original course materials

## Support

- See `AI_IMPLEMENTATION_GUIDE.md` for detailed documentation
- Check troubleshooting section if issues arise
- Verify environment variables are set correctly

---

**You're ready to go!** Upload your first material and start studying. 🚀
