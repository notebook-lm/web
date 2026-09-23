import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  FileText,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import "../App.css";

const sources = [
  { name: "Climate change synthesis report", type: "PDF", tint: "coral" },
  { name: "Field notes — coastal restoration", type: "DOC", tint: "blue" },
  { name: "Policy research interviews", type: "AUDIO", tint: "yellow" },
];

const features = [
  {
    icon: BookOpen,
    title: "Grounded in your sources",
    copy: "Every answer is supported by the material you choose, with citations that take you back to the moment.",
  },
  {
    icon: Sparkles,
    title: "Make connections faster",
    copy: "Turn a growing collection of documents into clear briefs, study guides, and fresh ideas.",
  },
  {
    icon: MessageCircle,
    title: "Ask better questions",
    copy: "Explore complex material through a conversation that keeps every detail in reach.",
  },
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMenuOpen(false);
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 84;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });
    closeMenu();
  };

  return (
    <main className="site-shell">
      <header ref={headerRef} className="site-header">
        <button
          className="brand brand-button"
          type="button"
          aria-label="NotebookLM home"
          onClick={() => scrollToSection("top")}
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>NotebookLM</span>
        </button>

        <button
          id="mobile-menu-toggle"
          className="mobile-menu-button"
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="primary-navigation"
          className={menuOpen ? "primary-nav is-open" : "primary-nav"}
          aria-label="Primary"
        >
          <button type="button" onClick={() => scrollToSection("how-it-works")}>
            How it works
          </button>
          <button type="button" onClick={() => scrollToSection("features")}>
            Features
          </button>
          <button type="button" onClick={() => scrollToSection("about")}>
            About
          </button>
          <Link
            className="nav-signin"
            to="/auth?mode=signin"
            onClick={closeMenu}
          >
            Sign in
          </Link>
          <Link
            className="button button-small"
            to="/auth?mode=signup"
            onClick={closeMenu}
          >
            Try NotebookLM <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </nav>
      </header>

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-orb orb-one" aria-hidden="true" />
        <div className="hero-orb orb-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={15} aria-hidden="true" /> Research, reimagined
          </p>
          <h1 id="hero-title">
            Think with your sources,
            <br />
            <em>not around them.</em>
          </h1>
          <p className="hero-description">
            NotebookLM is your personalized research partner. Bring your sources
            together, ask better questions, and turn complex information into
            understanding.
          </p>
          <div className="hero-actions">
            <Link
              id="get-started"
              className="button button-primary"
              to="/auth?mode=signup"
            >
              Start a notebook <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <button
              className="text-action"
              type="button"
              onClick={() => scrollToSection("how-it-works")}
            >
              See how it works <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
          <p className="hero-note">
            <Check aria-hidden="true" size={15} /> Built for your ideas.
            Grounded in your work.
          </p>
        </div>

        <div
          id="workspace"
          className="workspace-card"
          aria-label="NotebookLM workspace preview"
        >
          <div className="workspace-topbar">
            <div className="window-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="workspace-title">
              <BookOpen size={14} aria-hidden="true" /> Coastal futures research
            </div>
            <div className="avatar" aria-label="Your account">
              Y
            </div>
          </div>
          <div className="workspace-body">
            <aside className="source-panel">
              <div className="panel-heading">
                <span>Sources</span>
                <button type="button" aria-label="Add a source">
                  <Plus size={16} />
                </button>
              </div>
              <div className="source-search">
                <Search size={14} aria-hidden="true" />
                <span>Search sources</span>
              </div>
              <ul className="source-list">
                {sources.map((source) => (
                  <li key={source.name}>
                    <span className={`file-icon ${source.tint}`}>
                      <FileText size={15} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{source.name}</strong>
                      <small>{source.type}</small>
                    </span>
                  </li>
                ))}
              </ul>
              <button className="add-source" type="button">
                <Plus size={15} aria-hidden="true" /> Add source
              </button>
            </aside>
            <section className="chat-panel" aria-label="Research conversation">
              <div className="chat-heading">
                <span>Chat</span>
                <button type="button" aria-label="More chat options">
                  •••
                </button>
              </div>
              <div className="conversation">
                <div className="prompt-bubble">
                  What are the strongest nature-based solutions for protecting
                  coastal communities?
                </div>
                <div className="answer-block">
                  <span className="answer-spark">
                    <Sparkles size={15} aria-hidden="true" />
                  </span>
                  <div>
                    <p>
                      Based on your sources, coastal wetlands and mangrove
                      restoration offer the most consistent protection by
                      reducing wave energy and stabilizing shorelines.
                    </p>
                    <div className="citation-row">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-input">
                <span>Ask about your sources...</span>
                <button type="button" aria-label="Send message">
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
            <aside className="studio-panel">
              <div className="panel-heading">
                <span>Studio</span>
              </div>
              <div className="studio-item featured">
                <span className="studio-icon">
                  <MessageCircle size={16} />
                </span>
                <div>
                  <strong>Audio overview</strong>
                  <small>Deep dive conversation</small>
                </div>
                <button type="button" aria-label="Play audio overview">
                  ▶
                </button>
              </div>
              <div className="studio-item">
                <span className="studio-icon">
                  <FileText size={16} />
                </span>
                <div>
                  <strong>Briefing doc</strong>
                  <small>Key takeaways</small>
                </div>
              </div>
              <div className="studio-item">
                <span className="studio-icon">
                  <BookOpen size={16} />
                </span>
                <div>
                  <strong>Study guide</strong>
                  <small>Review your sources</small>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="process-section"
        aria-labelledby="process-title"
      >
        <div className="section-intro">
          <p className="eyebrow">A better way to work with knowledge</p>
          <h2 id="process-title">Your sources become a thinking space.</h2>
        </div>
        <ol className="steps-list">
          <li>
            <span>01</span>
            <div>
              <h3>Bring in what matters</h3>
              <p>
                Upload PDFs, websites, notes, audio, and more. Your notebook
                becomes a focused library around one idea.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Explore without losing context</h3>
              <p>
                Ask questions in natural language and get answers rooted
                directly in the sources you trust.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Move from insight to action</h3>
              <p>
                Create summaries, study guides, and shareable materials when you
                are ready to take the next step.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section
        id="features"
        className="features-section"
        aria-labelledby="features-title"
      >
        <div className="section-intro centered">
          <p className="eyebrow">The clarity to go further</p>
          <h2 id="features-title">
            A research partner that stays with the work.
          </h2>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, copy }) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#get-started">
                Learn more <ArrowRight size={15} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="closing-section"
        aria-labelledby="closing-title"
      >
        <div className="closing-star" aria-hidden="true">
          <Sparkles />
        </div>
        <p className="eyebrow">Ready when you are</p>
        <h2 id="closing-title">
          Make room for your
          <br />
          <em>best thinking.</em>
        </h2>
        <p>Start a notebook and see what your sources can become.</p>
        <Link className="button button-primary" to="/auth?mode=signup">
          Start a notebook <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>

      <footer className="site-footer" aria-label="NotebookLM footer">
        <div className="footer-main">
          <section className="footer-brand-column" aria-label="About NotebookLM">
            <a className="brand footer-brand" href="#top" aria-label="Back to top">
              <span className="brand-mark" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>NotebookLM</span>
            </a>
            <p>
              A calmer place to collect sources, discover connections, and
              turn curiosity into clear thinking.
            </p>
            <Link
              id="footer-start-notebook"
              className="footer-cta"
              to="/auth?mode=signup"
            >
              Start a notebook <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </section>

          <nav className="footer-links" aria-label="Footer navigation">
            <div className="footer-link-group">
              <p>Product</p>
              <a href="#how-it-works">How it works</a>
              <a href="#features">Features</a>
              <a href="#get-started">Get started</a>
            </div>
            <div className="footer-link-group">
              <p>Explore</p>
              <a href="#features">Research guides</a>
              <a href="#how-it-works">Source library</a>
              <a href="mailto:hello@notebooklm.app">Help center</a>
            </div>
            <div className="footer-link-group">
              <p>Company</p>
              <a href="#about">Our story</a>
              <a href="mailto:hello@notebooklm.app">Contact us</a>
              <a href="#top">Updates</a>
            </div>
          </nav>

          <section className="footer-connect" aria-labelledby="footer-connect-title">
            <p id="footer-connect-title">Stay in the loop</p>
            <a className="footer-email" href="mailto:hello@notebooklm.app">
              hello@notebooklm.app
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <div className="footer-socials" aria-label="Social channels">
              <a
                id="footer-linkedin"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="NotebookLM on LinkedIn"
              >
                in
              </a>
              <a
                id="footer-x"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="NotebookLM on X"
              >
                𝕏
              </a>
              <a
                id="footer-instagram"
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="NotebookLM on Instagram"
              >
                ◎
              </a>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NotebookLM. Made for curious minds.</p>
          <div className="footer-legal">
            <span className="footer-status">
              <i aria-hidden="true" /> All systems clear
            </span>
            <a href="#about">Privacy</a>
            <a href="#about">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
