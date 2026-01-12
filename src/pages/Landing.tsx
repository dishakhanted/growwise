import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WealthChart } from "@/components/WealthChart";
import { Check, X, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import homeHeroImage from "@/assets/home-hero.png";
import howItWorksImage from "@/assets/how-it-works.png";
import oneTapExecutionImage from "@/assets/one-tap-execution.png";
import builtForTrustImage from "@/assets/built-for-trust.png";
import whyDidWeCreateItImage from "@/assets/why-did-we-create-it.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [activeGraph, setActiveGraph] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const graphRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "what-is-poonji", label: "What is Poonji" },
    { id: "how-it-works", label: "How it works?" },
    { id: "why-we-created-it", label: "Why did we create it?" },
    { id: "contact-us", label: "Contact Us" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const graphs = [
    {
      id: 2,
      title: "Smart suggestions you can act on",
      subtitle: "Poonji turns your finances into clear actions you can approve.",
      renderVisual: () => (
        <div className="space-y-3 mt-6 w-full max-w-md">
          {[
            {
              title: "Complete emergency fund goal",
              description: "3 steps · Est. +$6.5K safety",
            },
            {
              title: "Rebalance investments for goals",
              description: "Auto-approve in 1 tap",
            },
          ].map((suggestion) => (
            <div
              key={suggestion.title}
              className="bg-card rounded-lg p-3 border border-border shadow-sm"
            >
              <p className="text-sm font-medium mb-1 text-foreground">{suggestion.title}</p>
              <p className="text-xs text-foreground mb-3">{suggestion.description}</p>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="success"
                  className="rounded-full px-4 h-8"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4 h-8"
                >
                  <X className="h-3 w-3 mr-1" />
                  Deny
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  className="p-0 h-auto"
                >
                  Know more
                </Button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 3,
      title: "Progress toward your goals",
      subtitle: "Track how each decision moves you closer to what you care about.",
      renderVisual: () => (
        <div className="flex flex-col gap-4 mt-6">
          {[
            { label: "Emergency Fund", percent: 95, tone: "bg-emerald-500" },
            { label: "Down payment", percent: 40, tone: "bg-blue-500" },
          ].map((goal) => (
            <div
              key={goal.label}
              className="rounded-2xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-foreground">{goal.label}</div>
                <div className="text-sm text-muted-foreground">{goal.percent}%</div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${goal.tone}`}
                  style={{ width: `${goal.percent}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Updated after your latest decision
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 0,
      title: "AI edge",
      subtitle: "for your wealth building.",
      renderVisual: () => (
        <WealthChart currentAmount="$237,672" futureAmount="$1.3M net worth at 65" />
      ),
    },
    {
      id: 1,
      title: "All your money in one place",
      subtitle: "See checking, savings, investments, and debt in one clear view.",
      renderVisual: () => (
        <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
          {[
            { label: "Checking · $4,250", accent: "bg-primary/15 border-primary/30" },
            { label: "Savings · $28,500", accent: "bg-secondary/40 border-secondary/60" },
            { label: "401(k) · $73,200", accent: "bg-muted/60 border-muted-foreground/20" },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border px-4 py-4 shadow-sm ${card.accent}`}
            >
              <div className="text-lg font-semibold text-foreground">{card.label}</div>
              <div className="text-sm text-muted-foreground mt-1">Updated just now</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const scrollToGraph = (index: number) => {
    setActiveGraph(index);
    const graphElement = graphRefs.current[index];
    
    if (graphElement) {
      // Always use horizontal scroll
      graphElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Set each graph width to match container width
    const updateGraphWidths = () => {
      const containerWidth = container.offsetWidth;
      graphRefs.current.forEach((ref) => {
        if (ref) {
          ref.style.width = `${containerWidth}px`;
        }
      });
    };

    updateGraphWidths();
    window.addEventListener("resize", updateGraphWidths);

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      
      // For horizontal scroll, find which graph is most visible
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      graphRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const distance = Math.abs(rect.left - containerRect.left);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });
      
      setActiveGraph(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateGraphWidths);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Logo and Menu */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Poonji</span>
            </div>

            {/* Desktop Menu */}
            {!isMobile && (
              <nav className="flex items-center gap-6 lg:gap-8">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm lg:text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Mobile Hamburger Menu */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Home Section */}
      <section id="home" className="pt-8">
        <div className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto w-full gap-8 lg:gap-12">
        {/* Left Column - Text Content (on desktop) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
            Your AI powered
            <br />
            Personal Financial Advisor
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-6 sm:mb-8 lg:mb-12 leading-relaxed">
            From student loans to investing to life goals, Poonji is an AI powered life coach that provides personalised guidance to help you plan, achieve and execute your financial goals with confidence and ease.
          </p>

          {/* Buttons - Stack on mobile, side by side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <Button
              onClick={() => navigate("/demo-login")}
              variant="outline"
              className="w-full h-14 text-lg rounded-2xl border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Try Demo
            </Button>
            <Button
              variant="default"
              onClick={() => navigate("/waitlist")}
              className="w-full h-14 text-lg rounded-2xl"
            >
              Join Waitlist
            </Button>
          </div>
        </div>

        {/* Right Column - Image (on desktop) */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col order-2">
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[336px] lg:max-w-[384px] rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                src={homeHeroImage} 
                alt="Poonji AI-powered wealth building app showing financial growth projection on mobile phone" 
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* What is Poonji Section */}
      <section id="what-is-poonji" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16">
            What is Poonji
          </h2>
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Carousel on Left */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              >
                <div className="flex min-w-max">
                  {graphs.map((graph, index) => (
                    <div
                      key={graph.id}
                      ref={(el) => (graphRefs.current[index] = el)}
                      className="flex-shrink-0 snap-center"
                    >
                      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-2 lg:mb-3">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                            {graph.title}
                          </h3>
                          <p className="text-sm sm:text-base lg:text-lg text-foreground/80 mt-1 lg:mt-2">
                            {graph.subtitle}
                          </p>
                        </div>
                        {graph.renderVisual()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center gap-2 mt-6 lg:mt-8">
                {graphs.map((graph, index) => {
                  const isActive = index === activeGraph;
                  return (
                    <button
                      key={graph.id}
                      type="button"
                      aria-label={`Go to graph ${index + 1}`}
                      aria-pressed={isActive}
                      onClick={() => scrollToGraph(index)}
                      className={`h-3 w-3 rounded-full border transition-colors ${
                        isActive
                          ? "bg-primary border-primary"
                          : "border-muted bg-transparent hover:border-primary/50"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Text on Right */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                This is where your financial life comes together!
              </h3>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl text-foreground/80 leading-relaxed">
                <p>
                  Not just another finance app to track things, not just to invest, 
                  but to provide personalised insights and actionable strategies.
                </p>
                <p className="hidden lg:block">
                  Poonji adapts to where you are in life. You can come here with questions. 
                  With uncertainty. With big decisions and goals.                                                               
                  Or just to check if you're on the right path.
                </p>
                <p className="hidden lg:block">
                  It's a system that understands you, 
                  supports you when things feel overwhelming, and helps you build calmer, 
                  more intentional financial habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16">
            How it works?
          </h2>

          {/* First Section: Detailed Features */}
          <div className="mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
              Your Financial Life, Simplified
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Image on Mobile (First) / Right on Desktop */}
              <div className="w-1/2 lg:w-1/2 flex justify-center lg:justify-end mx-auto lg:mx-0 order-1 lg:order-2">
                <div className="w-full max-w-[314px] lg:max-w-[358px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={howItWorksImage} 
                    alt="Poonji features" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>

              {/* Text on Mobile (Second) / Left on Desktop */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">
                {/* Mobile: Bullet Points */}
                <ul className="space-y-3 text-base sm:text-lg lg:hidden">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span className="text-foreground font-semibold">Secure Multi-Asset Integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span className="text-foreground font-semibold">Proactive Analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span className="text-foreground font-semibold">Milestone-Based Guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span className="text-foreground font-semibold">Intelligent Vigilance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span className="text-foreground font-semibold">Ask Poonji Anything</span>
                  </li>
                </ul>
                {/* Desktop: Bullet Points */}
                <ul className="hidden lg:block space-y-3 text-base sm:text-lg lg:text-xl text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Secure Multi-Asset Integration:</strong> Effortlessly connect your bank accounts, loans, and investment portfolios for a unified, real-time view of your net worth.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Proactive Analysis:</strong> Poonji doesn't just show you where your money went; it analyzes your cash flow to find hidden opportunities, like accelerating a loan payoff.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Milestone-Based Guidance:</strong> Replace overwhelming "challenges" with clear, goal-based targets for retirement, home ownership, or debt freedom.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Intelligent Vigilance:</strong> Get proactive alerts the moment a milestone is within reach or when an action is needed to stay on track with your long-term risk profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Ask Poonji Anything:</strong> From "Can I afford this car?" to "Explain this ETF," get instant, personalized advice that is grounded in your real financial data.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Second Section: The One-Tap Promise */}
          <div className="mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
              The "One-Tap" Promise
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Image on Mobile (First) / Left on Desktop */}
              <div className="w-1/2 lg:w-1/2 flex justify-center lg:justify-start order-1 mx-auto lg:mx-0">
                <div className="w-full max-w-[314px] lg:max-w-[358px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={oneTapExecutionImage} 
                    alt="One-tap action" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>

              {/* Text on Mobile (Second) / Right on Desktop */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2">
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-4">
                  From Advice to Action.
                </p>
                <div className="space-y-4 text-base sm:text-lg lg:text-xl text-foreground/80 leading-relaxed">
                  <p>
                    Most apps just give you a list of chores. Poonji gives you a solution. When our AI suggests a smarter move for your money, you can approve and execute it with a single tap. No jumping between banking apps. No second-guessing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Section: Built for Trust, Not Guesses */}
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
              Built for Trust, Not Guesses
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Text on Left */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Mobile: Bullet Points (Title + First Sentence) */}
                <ul className="space-y-3 text-base sm:text-lg lg:hidden">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span><strong className="text-foreground">Reasoning-First AI:</strong> Unlike generic chatbots, Poonji uses a sophisticated architecture to manage multi-step financial workflows.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span><strong className="text-foreground">Safety Guardrails:</strong> It operates within your personal financial rules, goals, and risk limits.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span><strong className="text-foreground">Actionable Explainability:</strong> It never suggests or executes actions outside your profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span><strong className="text-foreground">Safe Execution:</strong> Once you approve, the system securely executes the action, so you never have to jump between multiple bank apps.</span>
                  </li>
                </ul>
                {/* Desktop: Bullet Points (Full Content) */}
                <ul className="hidden lg:block space-y-3 text-base sm:text-lg lg:text-xl text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Reasoning-First AI:</strong> Unlike generic chatbots, Poonji uses a sophisticated architecture to manage multi-step financial workflows.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Safety Guardrails:</strong> It operates within your personal financial rules, goals, and risk limits. Every suggestion passes through rigorous Core AI Nodes including dedicated Guardrails and Decision-Making modules, before it reaches you.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Actionable Explainability:</strong> It never suggests or executes actions outside your profile. We don't just give a number; the system generates clear explanations and actionable cards for your review, so you understand the "why".</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-xl">•</span>
                    <span><strong className="text-foreground">Safe Execution:</strong> Once you approve, the system securely executes the action, so you never have to jump between multiple bank apps. Every recommendation is based on your real financial data and constraints.</span>
                  </li>
                </ul>
              </div>

              {/* Image on Right */}
              <div className="w-1/2 lg:w-1/2 flex justify-center lg:justify-end mx-auto lg:mx-0">
                <div className="w-full max-w-[1570px] lg:max-w-[1790px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={builtForTrustImage} 
                    alt="Built for trust" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why did we create it Section */}
      <section id="why-we-created-it" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16">
            Why did we create it?
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Text on Left */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Bridge the gap of Financial Literacy
              </h3>
              <div className="space-y-4 text-base sm:text-lg lg:text-xl text-foreground/80 leading-relaxed">
                <p>
                  You're expected to make life-changing financial decisions the moment you graduate, yet you're often left to navigate the complexity of adulthood alone. From balancing education loans and new salaries to planning for a first home or a wedding, the weight of these milestones can feel paralyzing. We built Poonji because we believe financial decisions shouldn't feel like walking in the dark.
                </p>
                <p>
                  Our mission is to provide every young adult with an institutional-grade financial guardian, an Agentic AI that doesn't just track your money, but actively protects and guides your journey 24/7. We envision a future where financial confidence is a right, not a privilege. By breaking massive goals into achievable milestones, we empower you to build habit-forming education, ensuring that as you grow, your wealth and your wisdom grow with you.
                </p>
              </div>
            </div>

            {/* Image on Right */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-lg rounded-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={whyDidWeCreateItImage} 
                  alt="Financial literacy and security" 
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 lg:mb-12">
            Contact Us
          </h2>
          <div className="flex flex-col items-center gap-6">
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 text-center max-w-2xl">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-2xl border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
              <Button
                variant="default"
                className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-2xl px-6 sm:px-8"
                onClick={() => navigate("/waitlist")}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 lg:py-8 border-t border-border/50 bg-background w-full">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <p className="text-sm sm:text-base lg:text-lg text-foreground/70 italic text-center">
            <strong className="text-foreground">Your Security is our Foundation</strong> Poonji uses bank-grade encryption and strict privacy protocols. Your data is normalized into secure context packets, ensuring your personal information is never used to "train" public AI models.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
