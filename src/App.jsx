import { useState, useEffect, useCallback, createContext, useContext, lazy, Suspense } from "react";

/* ─────────────────────────────────────────
   STYLE INJECTION
───────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #6B5DB5;
    --primary-light: #D8D0F8;
    --primary-dark: #4E4296;
    --bg: #EDE8F9;
    --surface: #F5F2FF;
    --surface2: #E6E0F5;
    --text: #2D2250;
    --text-muted: #6B5F8A;
    --text-soft: #A899C8;
    --border: rgba(107,93,181,0.18);
    --border-strong: rgba(107,93,181,0.35);
    --success: #3D7A5E;
    --success-bg: #D6F0E5;
    --warn: #8A6120;
    --warn-bg: #FAF0D6;
    --danger: #B03050;
    --danger-bg: #FAD6E0;
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 20px;
    --shadow: 0 2px 12px rgba(107,93,181,0.1);
    --shadow-md: 0 4px 24px rgba(107,93,181,0.18);
    --transition: 0.2s ease;
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
  }

  h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 400; line-height: 1.25; }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: var(--font-body);
    transition: all var(--transition);
  }

  input, textarea {
    font-family: var(--font-body);
    outline: none;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text);
    padding: 10px 14px;
    font-size: 14px;
    transition: border var(--transition);
    width: 100%;
  }

  input:focus, textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(124,110,230,0.1);
  }

  textarea { resize: vertical; min-height: 120px; line-height: 1.7; }

  a { text-decoration: none; color: var(--primary); }

  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* Layout */
  .app-shell { display: flex; flex-direction: column; min-height: 100vh; }
  .main-content { flex: 1; padding: 2rem 1rem; max-width: 800px; margin: 0 auto; width: 100%; }

  /* Nav */
  .nav {
    background: rgba(245,242,255,0.85);
    border-bottom: 1px solid var(--border);
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }
  .nav-inner {
    max-width: 800px; margin: 0 auto;
    display: flex; align-items: center;
    justify-content: space-between; height: 60px;
  }
  .nav-logo { font-family: var(--font-display); font-size: 1.35rem; color: var(--primary); letter-spacing: -0.02em; }
  .nav-logo span { color: var(--text); }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    padding: 6px 14px; border-radius: 999px;
    font-size: 13px; font-weight: 500;
    color: var(--text-muted); background: transparent;
    border: 1px solid transparent;
    transition: all var(--transition);
  }
  .nav-link:hover { background: var(--primary-light); color: var(--primary); }
  .nav-link.active { background: var(--primary-light); color: var(--primary); border-color: var(--border-strong); }
  .nav-btn {
    padding: 7px 16px; border-radius: 999px;
    font-size: 13px; font-weight: 500;
    background: var(--primary); color: white;
  }
  .nav-btn:hover { background: var(--primary-dark); }

  /* Cards */
  .card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    padding: 1.5rem;
    box-shadow: var(--shadow);
  }
  .card + .card { margin-top: 1rem; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500;
    transition: all var(--transition);
    border: 1.5px solid transparent;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,110,230,0.3); }
  .btn-primary:active { transform: translateY(0); }
  .btn-secondary { background: var(--primary-light); color: var(--primary); border-color: var(--border-strong); }
  .btn-secondary:hover { background: var(--primary); color: white; }
  .btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: var(--danger-bg); color: var(--danger); border-color: rgba(220,38,38,0.2); }
  .btn-danger:hover { background: var(--danger); color: white; }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-lg { padding: 13px 28px; font-size: 15px; border-radius: var(--radius); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Tags/badges */
  .tag {
    display: inline-block; padding: 2px 10px;
    border-radius: 999px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.03em; text-transform: uppercase;
  }
  .tag-bias { background: var(--warn-bg); color: var(--warn); border: 1px solid rgba(217,119,6,0.2); }
  .tag-neutral { background: var(--success-bg); color: var(--success); border: 1px solid rgba(5,150,105,0.2); }
  .tag-tone { background: #EFF6FF; color: #1D4ED8; border: 1px solid rgba(29,78,216,0.2); }
  .tag-general { background: var(--primary-light); color: var(--primary); border: 1px solid var(--border-strong); }

  /* Bias result card */
  .result-section {
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-top: 0.75rem;
    border: 1px solid var(--border);
    animation: fadeSlide 0.3s ease;
  }
  .result-bias { background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border-color: rgba(217,119,6,0.25); }
  .result-clean { background: linear-gradient(135deg, #D6F0E5 0%, #C4E8D8 100%); border-color: rgba(61,122,94,0.25); }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Feed */
  .post-card { transition: box-shadow var(--transition); }
  .post-card:hover { box-shadow: var(--shadow-md); }
  .post-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--primary-light); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; flex-shrink: 0;
  }
  .post-actions { display: flex; gap: 8px; margin-top: 1rem; flex-wrap: wrap; }

  /* Dashboard stat grid */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
  .stat-card {
    background: var(--surface); border-radius: var(--radius-sm);
    border: 1px solid var(--border); padding: 1rem;
    text-align: center;
  }
  .stat-num { font-family: var(--font-display); font-size: 2rem; color: var(--primary); }
  .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

  /* Auth page */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 2rem;
    background: linear-gradient(135deg, #E8E2F8 0%, #D4CCF5 100%);
  }
  .auth-card { max-width: 420px; width: 100%; }
  .auth-title { font-size: 2rem; margin-bottom: 0.5rem; }
  .auth-subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 14px; }

  /* Form groups */
  .form-group { margin-bottom: 1rem; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 1.5rem 0; }

  /* Empty state */
  .empty {
    text-align: center; padding: 3rem 1rem;
    color: var(--text-soft);
  }
  .empty-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5; }

  /* Alerts */
  .alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 1rem; }
  .alert-error { background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(220,38,38,0.2); }
  .alert-success { background: var(--success-bg); color: var(--success); border: 1px solid rgba(5,150,105,0.2); }
  .alert-info { background: var(--primary-light); color: var(--primary); border: 1px solid var(--border-strong); }

  /* Loading */
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border);
    border-top-color: var(--primary);
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Section header */
  .section-header { margin-bottom: 1.5rem; }
  .section-title { font-size: 1.6rem; margin-bottom: 0.25rem; }
  .section-sub { color: var(--text-muted); font-size: 14px; }

  /* Pill tabs */
  .tab-group { display: flex; gap: 6px; background: var(--surface2); padding: 4px; border-radius: 999px; margin-bottom: 1.5rem; }
  .tab-pill {
    flex: 1; padding: 7px 16px; border-radius: 999px;
    font-size: 13px; font-weight: 500;
    background: transparent; color: var(--text-muted);
    border: none; transition: all var(--transition);
  }
  .tab-pill.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

  /* Responsive */
  @media (max-width: 600px) {
    .main-content { padding: 1rem; }
    .nav-links { display: none; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─────────────────────────────────────────
   MOCK FIREBASE (in-memory, no real SDK needed)
   Replace with real Firebase config to go live
───────────────────────────────────────── */
let _users = [];
let _posts = [];
let _analysisHistory = [];
let _allyRequests = [];
let _currentUser = null;
let _uid = 1;

const mockAuth = {
  signUp(email, password, displayName) {
    if (_users.find(u => u.email === email)) return Promise.reject(new Error("Email already in use"));
    const user = { uid: `u${_uid++}`, email, displayName: displayName || email.split("@")[0] };
    _users.push({ ...user, password });
    _currentUser = user;
    return Promise.resolve(user);
  },
  signIn(email, password) {
    const user = _users.find(u => u.email === email && u.password === password);
    if (!user) return Promise.reject(new Error("Invalid email or password"));
    _currentUser = { uid: user.uid, email: user.email, displayName: user.displayName };
    return Promise.resolve(_currentUser);
  },
  signOut() {
    _currentUser = null;
    return Promise.resolve();
  },
  getUser() { return _currentUser; }
};

const db = {
  addPost(post) {
    const id = `p${_uid++}`;
    const record = { ...post, id, createdAt: new Date().toISOString(), supportCount: 0, supporters: [] };
    _posts.unshift(record);
    return Promise.resolve(record);
  },
  getPosts() { return Promise.resolve([..._posts]); },
  toggleSupport(postId, userId) {
    const post = _posts.find(p => p.id === postId);
    if (!post) return Promise.reject(new Error("Post not found"));
    if (post.supporters.includes(userId)) {
      post.supporters = post.supporters.filter(u => u !== userId);
    } else {
      post.supporters.push(userId);
    }
    post.supportCount = post.supporters.length;
    return Promise.resolve(post);
  },
  addAnalysis(entry) {
    const id = `a${_uid++}`;
    const record = { ...entry, id, createdAt: new Date().toISOString() };
    _analysisHistory.unshift(record);
    return Promise.resolve(record);
  },
  getAnalysisByUser(uid) {
    return Promise.resolve(_analysisHistory.filter(a => a.userId === uid));
  },
  addAllyRequest(req) {
    const id = `r${_uid++}`;
    const record = { ...req, id, status: "pending", createdAt: new Date().toISOString() };
    _allyRequests.unshift(record);
    return Promise.resolve(record);
  },
  getAllyRequests(userId) {
    return Promise.resolve(_allyRequests.filter(r => r.toUserId === userId || r.fromUserId === userId));
  },
  updateAllyRequest(id, status) {
    const req = _allyRequests.find(r => r.id === id);
    if (req) req.status = status;
    return Promise.resolve(req);
  },
  getPostsByUser(uid) {
    return Promise.resolve(_posts.filter(p => p.authorId === uid));
  }
};

/* ─────────────────────────────────────────
   BIAS DETECTION UTILS (rule-based)
───────────────────────────────────────── */
const BIAS_RULES = [
  {
    type: "gender-stereotype",
    label: "Gender Stereotype",
    patterns: [
      /\b(women|girls?|females?)\s+(are|always|never|can't|cannot|shouldn't|should)\b/i,
      /\b(men|boys?|males?)\s+(are|always|never|can't|cannot|shouldn't|should)\b/i,
      /\b(all\s+)?(women|men|girls|boys)\s+(are|were|will)\b/i,
      /\blike\s+a\s+(woman|man|girl|boy)\b/i,
      /\b(woman's|man's)\s+(place|job|role)\b/i,
      /\btypical\s+(woman|man|female|male)\b/i,
    ],
    suggestions: [
      "Consider describing specific behaviors or situations rather than generalizing by gender.",
      "Use person-first language and avoid attributing traits to an entire gender.",
      "Replace gender-based generalizations with observations about specific individuals.",
    ]
  },
  {
    type: "generalization",
    label: "Overgeneralization",
    patterns: [
      /\b(all|every|none|no one|everyone|everybody|nobody|always|never)\b.*\b(people|person|human|individual|group|they|them)\b/i,
      /\b(they|those people|these people)\s+(always|never|all|just)\b/i,
      /\b(all|every)\s+\w+\s+(are|is|do|does|will|would)\b/i,
      /\b(of course they|obviously they)\b/i,
      /\bthose\s+kind\s+of\s+people\b/i,
    ],
    suggestions: [
      "Try using 'some', 'many', or 'in my experience' to soften absolute claims.",
      "Acknowledge that experiences vary widely across individuals.",
      "Consider using specific examples rather than broad generalizations.",
    ]
  },
  {
    type: "tone",
    label: "Dismissive Tone",
    patterns: [
      /\b(stupid|idiot|dumb|moron|fool|ridiculous|absurd|pathetic)\b/i,
      /\b(obviously|clearly|of course)\s+(wrong|incorrect|mistaken|stupid|silly)\b/i,
      /\bwake\s+up\b/i,
      /\bget\s+over\s+(it|yourself)\b/i,
      /\bjust\s+(deal\s+with\s+it|accept\s+it|move\s+on)\b/i,
      /\bstop\s+(whining|complaining|crying|being\s+so\s+sensitive)\b/i,
      /\b(snowflake|triggered|sensitive)\b/i,
    ],
    suggestions: [
      "Try expressing disagreement without dismissing the other person's feelings or intelligence.",
      "Use 'I disagree because...' instead of labeling someone's view as wrong or stupid.",
      "Acknowledging the other perspective can make your argument more persuasive.",
    ]
  },
  {
    type: "absolutism",
    label: "Absolutist Thinking",
    patterns: [
      /\b(the\s+only|the\s+best|the\s+worst|the\s+most)\s+\w+\s+(way|thing|solution|option|choice)\b/i,
      /\b(nothing|everything|anyone|no\s+one)\s+(will|would|can|could|should)\b/i,
      /\b(impossible|absolutely|completely|totally|entirely)\s+(wrong|right|false|true|impossible)\b/i,
      /\bthere\s+is\s+no\s+(way|question|doubt|excuse)\b/i,
    ],
    suggestions: [
      "Consider whether there might be other valid perspectives or approaches.",
      "Using 'in most cases' or 'I believe' can make your statement more accurate.",
      "Absolute statements are often less convincing than nuanced ones.",
    ]
  },
];

function detectBias(text) {
  if (!text || text.trim().length < 5) return { biases: [], clean: true };

  const findings = [];
  for (const rule of BIAS_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        findings.push({
          type: rule.type,
          label: rule.label,
          matchedText: match[0],
          suggestion: rule.suggestions[Math.floor(Math.random() * rule.suggestions.length)],
        });
        break; // one finding per rule type
      }
    }
  }

  return { biases: findings, clean: findings.length === 0 };
}

function refineText(text) {
  let refined = text;

  // Remove harsh language
  const replacements = [
    [/\bstupid\b/gi, "mistaken"],
    [/\bidiot(ic)?\b/gi, "ill-informed"],
    [/\bdumb\b/gi, "unconsidered"],
    [/\bmoron\b/gi, "misinformed"],
    [/\bridiculous\b/gi, "questionable"],
    [/\bpathetic\b/gi, "concerning"],
    [/\babsurd\b/gi, "difficult to understand"],
    [/\ball (women|men|girls|boys|people)\b/gi, "some $1"],
    [/\bnever\b/gi, "rarely"],
    [/\balways\b/gi, "often"],
    [/\beveryone\b/gi, "many people"],
    [/\bnobody\b/gi, "few people"],
    [/\bget over it\b/gi, "find a way forward"],
    [/\bwake up\b/gi, "consider a broader perspective"],
    [/\bstop (whining|complaining|crying)\b/gi, "try to express your concerns constructively"],
  ];

  for (const [pattern, replacement] of replacements) {
    refined = refined.replace(pattern, replacement);
  }

  // Add softening prefix if needed
  if (refined === text && text.length > 20) {
    const prefixes = [
      "From my perspective, ",
      "I've noticed that ",
      "It seems to me that ",
      "In my experience, ",
    ];
    refined = prefixes[Math.floor(Math.random() * prefixes.length)] + refined.charAt(0).toLowerCase() + refined.slice(1);
  }

  return refined;
}

/* ─────────────────────────────────────────
   AUTH CONTEXT
───────────────────────────────────────── */
const AuthContext = createContext(null);
const AppContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth persistence check
    const saved = mockAuth.getUser();
    setUser(saved);
    setLoading(false);
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    const u = await mockAuth.signUp(email, password, displayName);
    setUser(u);
    return u;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const u = await mockAuth.signIn(email, password);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await mockAuth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function AppProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [allyRequests, setAllyRequests] = useState([]);

  const refreshPosts = useCallback(async () => {
    const data = await db.getPosts();
    setPosts(data);
  }, []);

  const refreshAnalysis = useCallback(async (uid) => {
    if (!uid) return;
    const data = await db.getAnalysisByUser(uid);
    setAnalysisHistory(data);
  }, []);

  const refreshAlly = useCallback(async (uid) => {
    if (!uid) return;
    const data = await db.getAllyRequests(uid);
    setAllyRequests(data);
  }, []);

  return (
    <AppContext.Provider value={{ posts, setPosts, analysisHistory, setAnalysisHistory, allyRequests, setAllyRequests, refreshPosts, refreshAnalysis, refreshAlly }}>
      {children}
    </AppContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);
const useApp = () => useContext(AppContext);

/* ─────────────────────────────────────────
   ROUTER (simple hash-based)
───────────────────────────────────────── */
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.replace("#", "") || "/analyze");

  useEffect(() => {
    const handler = () => setRoute(window.location.hash.replace("#", "") || "/analyze");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

/* ─────────────────────────────────────────
   NAV COMPONENT
───────────────────────────────────────── */
function Nav({ route, navigate }) {
  const { user, signOut } = useAuth();

  const links = [
    { path: "/analyze", label: "Analyze" },
    { path: "/feed", label: "Feed" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-logo" onClick={() => navigate("/analyze")} style={{ cursor: "pointer" }}>
          Mind<span>Mirror</span>
        </span>
        {user && (
          <div className="nav-links">
            {links.map(l => (
              <button
                key={l.path}
                className={`nav-link ${route === l.path ? "active" : ""}`}
                onClick={() => navigate(l.path)}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user ? (
            <>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{user.displayName}</span>
              <button className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button className="nav-btn" onClick={() => navigate("/login")}>Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────── */
function LoginPage({ navigate }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.email, form.password, form.displayName);
      }
      navigate("/analyze");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      // auto-create demo user if needed
      try { await signUp("demo@mindmirror.app", "demo1234", "Demo User"); }
      catch { await signIn("demo@mindmirror.app", "demo1234"); }
      navigate("/analyze");
    } catch (err) {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="auth-title">
          {mode === "signin" ? "Welcome back" : "Join MindMirror"}
        </h1>
        <p className="auth-subtitle">
          {mode === "signin"
            ? "Sign in to continue your reflection journey."
            : "A calm space to reflect before you express."}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {mode === "signup" && (
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input placeholder="How should we address you?" value={form.displayName} onChange={handle("displayName")} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={handle("email")} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: "12px" }} onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <button className="btn btn-ghost btn-lg" style={{ width: "100%", marginBottom: "16px" }} onClick={demoLogin} disabled={loading}>
          Try demo account
        </button>

        <div className="divider" />
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 500, cursor: "pointer", fontSize: "13px" }}
            onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setError(""); }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ANALYZE PAGE
───────────────────────────────────────── */
function AnalyzePage({ navigate }) {
  const { user } = useAuth();
  const { refreshAnalysis } = useApp();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [refined, setRefined] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setRefined("");
    setShowPost(false);
    setPostSuccess(false);

    await new Promise(r => setTimeout(r, 600)); // simulate processing

    const res = detectBias(text);
    setResult(res);

    if (user) {
      await db.addAnalysis({
        userId: user.uid,
        originalText: text,
        biases: res.biases,
        clean: res.clean,
      });
      refreshAnalysis(user.uid);
    }

    setAnalyzing(false);
  };

  const improve = () => {
    const r = refineText(text);
    setRefined(r);
  };

  const postToFeed = async () => {
    if (!user) { navigate("/login"); return; }
    setPosting(true);
    const tags = result?.biases?.map(b => b.type) || [];
    await db.addPost({
      authorId: anonymous ? null : user.uid,
      authorName: anonymous ? "Anonymous" : user.displayName,
      content: refined || text,
      originalContent: text,
      tags,
      anonymous,
    });
    setPosting(false);
    setPostSuccess(true);
    setShowPost(false);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Reflect before you express</h2>
        <p className="section-sub">Share your thoughts below. We'll help you explore them with clarity and care.</p>
      </div>

      <div className="card">
        <textarea
          placeholder="What's on your mind? Write freely — this space is private until you choose to share..."
          value={text}
          onChange={e => { setText(e.target.value); setResult(null); setRefined(""); setPostSuccess(false); }}
          style={{ minHeight: 140 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-soft)" }}>{wordCount} words · {charCount} chars</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-secondary" onClick={improve} disabled={!text.trim()}>Improve my text</button>
            <button className="btn btn-primary" onClick={analyze} disabled={!text.trim() || analyzing}>
              {analyzing ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Analyzing…</> : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {/* Refined text */}
      {refined && (
        <div className="card" style={{ marginTop: "1rem", borderColor: "rgba(61,122,94,0.3)", background: "linear-gradient(135deg, #D6F0E5, #C8EAD8)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Refined version</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setText(refined); setRefined(""); setResult(null); }}>Use this</button>
          </div>
          <p style={{ color: "var(--text)", lineHeight: 1.7 }}>{refined}</p>
        </div>
      )}

      {/* Analysis result */}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.clean ? (
            <div className="result-section result-clean">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✓</span>
                <span style={{ fontWeight: 600, color: "var(--success)" }}>Looks good!</span>
              </div>
              <p style={{ color: "#047857", fontSize: "14px" }}>
                No obvious bias patterns detected. Your text reads as thoughtful and considerate.
              </p>
              {user && (
                <button className="btn btn-secondary btn-sm" style={{ marginTop: "12px" }} onClick={() => setShowPost(p => !p)}>
                  Share to community
                </button>
              )}
            </div>
          ) : (
            <>
              {result.biases.map((bias, i) => (
                <div key={i} className="result-section result-bias" style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span className="tag tag-bias">{bias.label}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      matched: <em>"{bias.matchedText}"</em>
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#78350F", marginBottom: "8px", fontStyle: "italic" }}>
                    {bias.suggestion}
                  </p>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "0.5rem" }}>
                <button className="btn btn-secondary btn-sm" onClick={improve}>Improve my text</button>
                {user && <button className="btn btn-ghost btn-sm" onClick={() => setShowPost(p => !p)}>Share anyway</button>}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post to feed panel */}
      {showPost && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Share to Community Feed</h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {refined ? "Your refined version will be posted." : "Your original text will be posted."} The community will see it along with any detected categories.
          </p>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", marginBottom: "1rem" }}>
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} style={{ width: "auto" }} />
            Post anonymously
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary btn-sm" onClick={postToFeed} disabled={posting}>
              {posting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : "Post"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowPost(false)}>Cancel</button>
          </div>
        </div>
      )}

      {postSuccess && (
        <div className="alert alert-success" style={{ marginTop: "1rem" }}>
          Your post has been shared to the community feed!{" "}
          <button style={{ background: "none", border: "none", color: "var(--success)", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/feed")}>
            View feed →
          </button>
        </div>
      )}

      {/* Tips */}
      {!result && !analyzing && (
        <div className="card" style={{ marginTop: "2rem", background: "var(--primary-light)", borderColor: "var(--border-strong)" }}>
          <h3 style={{ fontSize: "0.95rem", color: "var(--primary)", marginBottom: "0.75rem" }}>Reflection tips</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              "Write as if you're speaking to someone you respect.",
              "Ask yourself: would I say this in a calm conversation?",
              "Replace absolutes (always, never) with softer qualifiers.",
              "Consider the other person's perspective before posting.",
            ].map((tip, i) => (
              <li key={i} style={{ fontSize: "13px", color: "var(--primary-dark)", display: "flex", gap: "8px" }}>
                <span style={{ opacity: 0.6 }}>→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FEED PAGE
───────────────────────────────────────── */
function FeedPage({ navigate }) {
  const { user } = useAuth();
  const { posts, refreshPosts, setPosts } = useApp();
  const [loading, setLoading] = useState(true);
  const [allyModal, setAllyModal] = useState(null); // { post }
  const [allyMsg, setAllyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      await refreshPosts();
      setLoading(false);
    })();
  }, []);

  const support = async (postId) => {
    if (!user) { navigate("/login"); return; }
    const updated = await db.toggleSupport(postId, user.uid);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, supportCount: updated.supportCount, supporters: updated.supporters } : p));
  };

  const sendAlly = async () => {
    if (!user || !allyModal) return;
    setSending(true);
    await db.addAllyRequest({
      fromUserId: user.uid,
      fromName: user.displayName,
      toUserId: allyModal.authorId,
      postId: allyModal.id,
      message: allyMsg,
    });
    setSent(s => ({ ...s, [allyModal.id]: true }));
    setSending(false);
    setAllyModal(null);
    setAllyMsg("");
  };

  const TAG_LABELS = {
    "gender-stereotype": "Gender",
    "generalization": "Generalization",
    "tone": "Tone",
    "absolutism": "Absolutism",
  };

  const categories = ["all", "gender-stereotype", "generalization", "tone", "absolutism"];

  const filtered = filter === "all" ? posts : posts.filter(p => p.tags?.includes(filter));

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Community Feed</h2>
        <p className="section-sub">Thoughtful reflections shared by the MindMirror community.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {categories.map(c => (
          <button
            key={c}
            className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(c)}
            style={{ borderRadius: "999px" }}
          >
            {c === "all" ? "All posts" : TAG_LABELS[c] || c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◎</div>
          <p style={{ marginBottom: "1rem" }}>No posts here yet.</p>
          <button className="btn btn-primary" onClick={() => navigate("/analyze")}>Start reflecting</button>
        </div>
      ) : (
        filtered.map(post => {
          const isSupported = post.supporters?.includes(user?.uid);
          const canAlly = post.authorId && post.authorId !== user?.uid;
          return (
            <div className="card post-card" key={post.id}>
              <div className="post-meta">
                <div className="avatar">
                  {post.authorName?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>{post.authorName || "Anonymous"}</span>
                  <span style={{ color: "var(--text-soft)", fontSize: "12px", marginLeft: "8px" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p style={{ color: "var(--text)", lineHeight: 1.7, marginBottom: "0.75rem" }}>{post.content}</p>

              {post.tags?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {post.tags.map(t => (
                    <span key={t} className="tag tag-bias" style={{ cursor: "pointer" }} onClick={() => setFilter(t)}>
                      {TAG_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button
                  className={`btn btn-sm ${isSupported ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => support(post.id)}
                >
                  ❤ {post.supportCount || 0} {isSupported ? "Supported" : "Support"}
                </button>
                {canAlly && !sent[post.id] && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setAllyModal(post)}>
                    🤝 Offer help
                  </button>
                )}
                {sent[post.id] && (
                  <span style={{ fontSize: "12px", color: "var(--success)", alignSelf: "center" }}>Help offer sent!</span>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Ally modal */}
      {allyModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(31,41,55,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem", zIndex: 1000,
          }}
          onClick={e => e.target === e.currentTarget && setAllyModal(null)}
        >
          <div className="card" style={{ maxWidth: 420, width: "100%" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Offer support</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Let the author know you'd like to help. They'll choose whether to connect.
            </p>
            <div className="form-group">
              <label className="form-label">Your message (optional)</label>
              <textarea
                placeholder="I'd like to help because…"
                value={allyMsg}
                onChange={e => setAllyMsg(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-primary btn-sm" onClick={sendAlly} disabled={sending}>
                {sending ? <span className="spinner" style={{ width: 14, height: 14 }} /> : "Send request"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAllyModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────── */
function DashboardPage({ navigate }) {
  const { user } = useAuth();
  const { analysisHistory, allyRequests, refreshAnalysis, refreshAlly } = useApp();
  const [myPosts, setMyPosts] = useState([]);
  const [tab, setTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await Promise.all([
        refreshAnalysis(user.uid),
        refreshAlly(user.uid),
        db.getPostsByUser(user.uid).then(setMyPosts),
      ]);
      setLoading(false);
    })();
  }, [user]);

  const handleAllyResponse = async (id, status) => {
    await db.updateAllyRequest(id, status);
    refreshAlly(user.uid);
  };

  const totalBiasFound = analysisHistory.reduce((acc, a) => acc + (a.biases?.length || 0), 0);
  const cleanRate = analysisHistory.length
    ? Math.round((analysisHistory.filter(a => a.clean).length / analysisHistory.length) * 100)
    : 0;

  const receivedRequests = allyRequests.filter(r => r.toUserId === user?.uid);
  const sentRequests = allyRequests.filter(r => r.fromUserId === user?.uid);

  if (!user) return <div className="main-content"><div className="empty"><p>Please sign in to view your dashboard.</p><button className="btn btn-primary" onClick={() => navigate("/login")}>Sign in</button></div></div>;

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Your dashboard</h2>
        <p className="section-sub">Hello, {user.displayName} — here's your reflection journey so far.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num">{analysisHistory.length}</div>
          <div className="stat-label">Analyses done</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{cleanRate}%</div>
          <div className="stat-label">Clean rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{myPosts.length}</div>
          <div className="stat-label">Posts shared</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{receivedRequests.length}</div>
          <div className="stat-label">Ally requests</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-group">
        {[["posts", "My Posts"], ["history", "Analysis History"], ["allies", "Ally Requests"]].map(([k, l]) => (
          <button key={k} className={`tab-pill ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}><span className="spinner" style={{ width: 28, height: 28 }} /></div>
      ) : tab === "posts" ? (
        myPosts.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <p style={{ marginBottom: "1rem" }}>No posts yet.</p>
            <button className="btn btn-primary" onClick={() => navigate("/analyze")}>Start reflecting</button>
          </div>
        ) : (
          myPosts.map(p => (
            <div className="card" key={p.id}>
              <p style={{ lineHeight: 1.7, marginBottom: "0.75rem" }}>{p.content}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "var(--text-soft)" }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                {p.tags?.map(t => <span key={t} className="tag tag-bias">{t}</span>)}
                <span style={{ marginLeft: "auto", fontSize: "13px", color: "var(--text-muted)" }}>❤ {p.supportCount || 0}</span>
              </div>
            </div>
          ))
        )
      ) : tab === "history" ? (
        analysisHistory.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <p>No analyses yet. Go to the Analyze page to get started.</p>
          </div>
        ) : (
          analysisHistory.map(a => (
            <div className="card" key={a.id}>
              <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                "{a.originalText.substring(0, 150)}{a.originalText.length > 150 ? "…" : ""}"
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                {a.clean
                  ? <span className="tag tag-neutral">Clean</span>
                  : a.biases.map((b, i) => <span key={i} className="tag tag-bias">{b.label}</span>)
                }
                <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-soft)" }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )
      ) : (
        <div>
          {receivedRequests.length > 0 && (
            <>
              <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Received requests</h3>
              {receivedRequests.map(r => (
                <div className="card" key={r.id} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{r.fromName}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "13px" }}> wants to help</span>
                      {r.message && <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>"{r.message}"</p>}
                    </div>
                    <div>
                      {r.status === "pending" ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleAllyResponse(r.id, "accepted")}>Accept</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleAllyResponse(r.id, "ignored")}>Ignore</button>
                        </div>
                      ) : (
                        <span className={`tag ${r.status === "accepted" ? "tag-neutral" : "tag-general"}`}>{r.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {sentRequests.length > 0 && (
            <>
              <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.75rem", marginTop: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sent requests</h3>
              {sentRequests.map(r => (
                <div className="card" key={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Help offer sent</span>
                    <span className={`tag ${r.status === "accepted" ? "tag-neutral" : r.status === "ignored" ? "tag-tone" : "tag-general"}`}>{r.status}</span>
                  </div>
                  {r.message && <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>"{r.message}"</p>}
                </div>
              ))}
            </>
          )}
          {receivedRequests.length === 0 && sentRequests.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🤝</div>
              <p>No ally requests yet. Share posts on the feed to connect with others.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
function AppInner() {
  const { user, loading } = useAuth();
  const { route, navigate } = useRoute();

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!loading && !user && route !== "/login") {
      navigate("/login");
    }
  }, [user, loading, route]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <span className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  const renderPage = () => {
    switch (route) {
      case "/login": return <LoginPage navigate={navigate} />;
      case "/feed": return <FeedPage navigate={navigate} />;
      case "/dashboard": return <DashboardPage navigate={navigate} />;
      case "/analyze":
      default: return <AnalyzePage navigate={navigate} />;
    }
  };

  return (
    <div className="app-shell">
      {route !== "/login" && <Nav route={route} navigate={navigate} />}
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <AuthProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </AuthProvider>
    </>
  );
}
