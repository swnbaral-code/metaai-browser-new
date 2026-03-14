
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for crawling
  app.post("/api/crawl", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract metadata
      const title = $("title").text();
      const description = $('meta[name="description"]').attr("content") || "";
      
      // Extract links
      const links: string[] = [];
      $("a").each((_, el) => {
        const href = $(el).attr("href");
        if (href && href.startsWith("http")) {
          links.push(href);
        } else if (href && href.startsWith("/")) {
          try {
            const baseUrl = new URL(url);
            links.push(`${baseUrl.origin}${href}`);
          } catch (e) {}
        }
      });

      // Extract text content (simplified)
      const text = $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);

      res.json({
        url,
        title,
        description,
        links: Array.from(new Set(links)).slice(0, 50), // Unique links, limit to 50
        content: text
      });
    } catch (error: any) {
      console.error("Crawl error:", error.message);
      res.status(500).json({ error: "Failed to crawl website: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
