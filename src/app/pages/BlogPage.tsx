import { useState } from "react";
import {
  BookOpen, ArrowRight, Clock, User, Calendar, Tag, Shield, ChevronLeft,
  ChevronRight, Sparkles, Code2, Globe, Smartphone, Lock
} from "lucide-react";
import { Navbar, Screen } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface BlogPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

interface BlogPost {
  id: string;
  category: "Vulnerabilities" | "API Security" | "Android/APK" | "DevSecOps" | "Engineering";
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  avatar: string;
  date: string;
  readTime: string;
  imageBg: string;
  icon: typeof Globe;
}

export function BlogPage({ onNav, dark, toggleDark }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Articles");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const posts: BlogPost[] = [
    {
      id: "b1",
      category: "API Security",
      title: "Uncovering BOLA Vulnerabilities in Modern GraphQL APIs",
      excerpt: "Broken Object Level Authorization remains the #1 OWASP API vulnerability. Here is how fuzzer-based state machines detect unauthorized ID parameters.",
      author: "Alex Chen",
      authorRole: "Head of Security",
      avatar: "AC",
      date: "Jul 28, 2025",
      readTime: "6 min read",
      imageBg: "from-violet-600 to-indigo-800",
      icon: Code2,
    },
    {
      id: "b2",
      category: "Vulnerabilities",
      title: "How Attackers Extract Hardcoded AWS Keys from Compiled Android APKs",
      excerpt: "Static bytecode analysis reveals over 14% of popular Play Store apps contain hardcoded cloud credentials in BuildConfig or native C++ libs.",
      author: "Sara Kim",
      authorRole: "Mobile Vulnerability Researcher",
      avatar: "SK",
      date: "Jul 22, 2025",
      readTime: "8 min read",
      imageBg: "from-emerald-600 to-teal-800",
      icon: Smartphone,
    },
    {
      id: "b3",
      category: "DevSecOps",
      title: "Automating Security Scans on Every GitHub Pull Request",
      excerpt: "Why waiting for annual penetration tests is failing engineering teams — and how to block vulnerable code before it lands in main.",
      author: "James Ruiz",
      authorRole: "DevSecOps Architect",
      avatar: "JR",
      date: "Jul 15, 2025",
      readTime: "5 min read",
      imageBg: "from-blue-600 to-cyan-800",
      icon: Shield,
    },
    {
      id: "b4",
      category: "Engineering",
      title: "Building an AI Engine for Instant Vulnerability Remediation Diffs",
      excerpt: "Inside our fine-tuned LLM pipeline that turns abstract security alerts into clean, drop-in code patches for TypeScript and Python.",
      author: "Priya Nair",
      authorRole: "Principal AI Engineer",
      avatar: "PN",
      date: "Jul 09, 2025",
      readTime: "10 min read",
      imageBg: "from-amber-600 to-orange-800",
      icon: Sparkles,
    },
    {
      id: "b5",
      category: "Vulnerabilities",
      title: "The Danger of Wildcard CORS Policies on Payment Endpoints",
      excerpt: "Access-Control-Allow-Origin: * seems harmless until cross-origin requests bypass session checks. Here is how to audit header policies.",
      author: "Alex Chen",
      authorRole: "Head of Security",
      avatar: "AC",
      date: "Jun 30, 2025",
      readTime: "4 min read",
      imageBg: "from-red-600 to-rose-800",
      icon: Globe,
    },
    {
      id: "b6",
      category: "API Security",
      title: "JWT Security Pitfalls: Missing Expiration and Weak Secret Keys",
      excerpt: "Tokens issued without `exp` claims remain active indefinitely. Learn how automated fuzzers test token signature algorithms.",
      author: "Sara Kim",
      authorRole: "Mobile Vulnerability Researcher",
      avatar: "SK",
      date: "Jun 18, 2025",
      readTime: "7 min read",
      imageBg: "from-purple-600 to-pink-800",
      icon: Lock,
    },
  ];

  const categories = ["All Articles", "Vulnerabilities", "API Security", "Android/APK", "DevSecOps", "Engineering"];

  const filteredPosts = activeCategory === "All Articles"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar currentScreen="blog" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      <main className="flex-1 pt-14">
        {/* Blog Header & Hero Featured Banner */}
        <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-mono mb-3">
                <BookOpen size={12} /> Solvane Security Research
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                Security Engineering & Research
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Insights, exploit breakdowns, and DevSecOps best practices from the Solvane security research team.
              </p>
            </div>

            {/* Featured Post Banner */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl grid md:grid-cols-2 gap-6 items-center">
              <div className="p-8 md:p-12 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-primary text-white font-bold tracking-wider uppercase">
                    FEATURED RESEARCH
                  </span>
                  <span className="text-muted-foreground">· Jul 28, 2025</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight hover:text-primary transition-colors cursor-pointer leading-snug">
                  Uncovering BOLA Vulnerabilities in Modern GraphQL APIs
                </h2>

                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Broken Object Level Authorization remains the #1 OWASP API vulnerability. Learn how automated schema-aware fuzzers catch unauthorized object queries before production.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-[12px] flex items-center justify-center border border-primary/30">
                      AC
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">Alex Chen</div>
                      <div className="text-[11px] text-muted-foreground">Head of Security</div>
                    </div>
                  </div>

                  <span className="text-[12px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> 6 min read
                  </span>
                </div>
              </div>

              {/* Graphic Mock Preview */}
              <div className="h-full min-h-[260px] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="flex justify-end">
                  <Code2 size={40} className="text-white/40" />
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="text-[11px] font-mono text-blue-200">PAYLOAD INSPECTOR MATRIX</div>
                  <div className="p-3 bg-black/30 backdrop-blur-md rounded-xl font-mono text-[11px] text-emerald-300 border border-white/15">
                    GET /graphql?query=&#123;user(id:102)&#123;email,ssn&#125;&#125;
                  </div>
                  <div className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
                    ⚠ BOLA Vulnerability Detected: IDOR on User ID #102
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Tabs */}
        <section className="py-6 px-6 border-y border-border bg-secondary/40">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Blog Post Cards Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const PostIcon = post.icon;
              return (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Banner Graphic */}
                    <div className={`h-40 bg-gradient-to-r ${post.imageBg} p-5 flex items-start justify-between text-white relative`}>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/20">
                        {post.category}
                      </span>
                      <PostIcon size={24} className="text-white/60 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                        <span>·</span>
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors cursor-pointer leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 pt-3">
                      <div className="w-7 h-7 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold">{post.author}</div>
                        <div className="text-[10px] text-muted-foreground">{post.authorRole}</div>
                      </div>
                    </div>

                    <button className="text-[12px] font-semibold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer pt-3">
                      Read <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg font-mono text-[13px] font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Newsletter Subscription Banner */}
        <section className="py-16 px-6 bg-secondary border-t border-border">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold">Stay updated on zero-day vulnerabilities</h3>
            <p className="text-[14px] text-muted-foreground max-w-xl mx-auto">
              Get bi-weekly vulnerability research reports and security patch advice delivered straight to your inbox. No spam.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-[13px] outline-none focus:border-primary/60"
              />
              <button className="w-full sm:w-auto bg-primary text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap cursor-pointer">
                Subscribe free
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNav={onNav} />
    </div>
  );
}
