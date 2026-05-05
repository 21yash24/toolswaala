import { Link } from "react-router-dom";
import { BRAND } from "../../shared/constants";
import { BLOG_POSTS } from "./blogData";

export default function BlogHome() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }} className="fade-in">
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${BRAND.primary}15`, border: `1px solid ${BRAND.primary}30`, fontSize: 13, fontWeight: 600, color: BRAND.primary, marginBottom: 16 }}>
          Bharat's Knowledge Hub
        </div>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 56px)", color: BRAND.text, marginBottom: 24, lineHeight: 1.1, fontWeight: 900 }}>
          Master Your <span style={{ color: BRAND.primary }}>Digital Workflow</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Expert guides on taxation, student life, PDF management, and business productivity.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 32 }}>
        {BLOG_POSTS.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <div className="glass-card" style={{ height: "100%", padding: 32, display: "flex", flexDirection: "column", border: `1px solid ${BRAND.border}` }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary, padding: "4px 10px", borderRadius: 6, background: `${BRAND.primary}15` }}>{post.category}</span>
                <span style={{ fontSize: 12, color: BRAND.textSecondary }}>{post.date}</span>
              </div>
              <h2 style={{ fontSize: 22, color: BRAND.text, fontWeight: 800, marginBottom: 16, lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ fontSize: 15, color: BRAND.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>{post.excerpt}</p>
              <div style={{ marginTop: "auto", color: BRAND.primary, fontWeight: 700, fontSize: 14 }}>Read Guide →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
