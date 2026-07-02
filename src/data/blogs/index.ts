import fs from 'fs';
import path from 'path';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface BlogPost {
  title: string;
  slug: string;
  coverImage: string;
  seoMeta: SEOMeta;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  author: Author;
  readingTime: string;
  publishDate: string;
  featured: boolean;
  views: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const blogsDirectory = path.join(process.cwd(), 'src/data/blogs');

// Ensure the directory exists
function ensureBlogsDirectory() {
  if (!fs.existsSync(blogsDirectory)) {
    fs.mkdirSync(blogsDirectory, { recursive: true });
  }
}

export function getAllBlogs(): BlogPost[] {
  ensureBlogsDirectory();
  try {
    const fileNames = fs.readdirSync(blogsDirectory);
    const blogs: BlogPost[] = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents) as BlogPost;
      });

    // Sort by publication date desc
    return blogs.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error reading blogs directory:', error);
    return [];
  }
}

export function getBlogBySlug(slug: string): BlogPost | null {
  ensureBlogsDirectory();
  try {
    const filePath = path.join(blogsDirectory, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents) as BlogPost;
    }
  } catch (error) {
    console.error(`Error reading blog by slug ${slug}:`, error);
  }
  return null;
}

export function getFeaturedBlog(): BlogPost | null {
  const blogs = getAllBlogs();
  const featured = blogs.find((blog) => blog.featured);
  return featured || blogs[0] || null;
}
