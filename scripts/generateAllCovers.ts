import fs from 'fs';
import path from 'path';
import { generateCoverSvg, saveCoverImage } from '../src/lib/coverImageGenerator';

async function generateAllCovers() {
  const blogsDir = path.join(process.cwd(), 'src/data/blogs');
  const coversDir = path.join(process.cwd(), 'public/covers');

  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }

  const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} blog JSON files to generate covers for.`);

  for (const file of files) {
    const filePath = path.join(blogsDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const blog = JSON.parse(raw);

    const slug = blog.slug || file.replace('.json', '');
    const title = blog.title;
    const category = blog.category || 'Performance Marketing';
    const tags = blog.tags || [];

    console.log(`Generating 16:9 editorial cover for: [${slug}] - "${title}"`);

    // 1. Generate & Save SVG
    const coverUrl = await saveCoverImage({
      title,
      slug,
      category,
      tags,
      theme: 'dark'
    });

    // 2. Update JSON with the verified cover image URL
    blog.coverImage = coverUrl;
    fs.writeFileSync(filePath, JSON.stringify(blog, null, 2), 'utf8');

    console.log(`✓ Saved ${coverUrl} and updated ${file}`);
  }

  console.log('\nAll 13 blog covers generated successfully!');
}

generateAllCovers().catch(err => {
  console.error('Error generating covers:', err);
  process.exit(1);
});
