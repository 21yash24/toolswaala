import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { BRAND } from "../../shared/constants";
import { BLOG_POSTS } from "./blogData";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ToolsWaala Blog`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.metaDesc);
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div style={{ padding: "100px 24px", textAlign: "center" }}>
        <h1>Post Not Found</h1>
        <Link to="/blog">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }} className="fade-in">
      <Link to="/blog" style={{ color: BRAND.primary, textDecoration: "none", fontSize: 14, fontWeight: 700, display: "block", marginBottom: 40 }}>← All Articles</Link>
      
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary, padding: "4px 10px", borderRadius: 6, background: `${BRAND.primary}15` }}>{post.category}</span>
          <span style={{ fontSize: 12, color: BRAND.textSecondary }}>{post.date}</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", color: BRAND.text, fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>{post.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>T</div>
          <div>
            <div style={{ fontSize: 14, color: BRAND.text, fontWeight: 700 }}>{post.author}</div>
            <div style={{ fontSize: 12, color: BRAND.textSecondary }}>ToolsWaala Content Team</div>
          </div>
        </div>
      </div>

      <div 
        className="blog-content"
        style={{ color: BRAND.text, lineHeight: 1.8, fontSize: 18 }}
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <div style={{ marginTop: 80, padding: 40, borderRadius: 24, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}`, textAlign: "center" }}>
        <h3 style={{ color: BRAND.text, marginBottom: 12 }}>Was this helpful?</h3>
        <p style={{ color: BRAND.textSecondary, marginBottom: 24 }}>ToolsWaala is 100% free. Share this guide with your friends to support us!</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " " + window.location.href)}`)} style={{ padding: "12px 24px", borderRadius: 12, background: "#25D366", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Share on WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
