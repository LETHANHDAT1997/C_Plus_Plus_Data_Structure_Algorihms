import { useState } from "react";

// Token-based C++ syntax highlighter — no dangerouslySetInnerHTML
const KEYWORDS  = new Set(["class","struct","public","private","protected","virtual","override",
  "const","static","auto","void","int","bool","size_t","float","double","char","return",
  "new","delete","if","else","for","while","nullptr","true","false","typename","template",
  "explicit","inline","mutable","using","namespace","operator","this"]);
const STD_NAMES = new Set(["std","make_unique","make_shared","move","forward","unique_ptr",
  "shared_ptr","vector","string","stack","unordered_map","pair","tuple","cout","cin",
  "endl","printf","assert"]);

function tokenizeCpp(code) {
  const tokens = [];
  let i = 0;
  while (i < code.length) {
    // Line comment
    if (code[i] === '/' && code[i+1] === '/') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', value: code.slice(i, j) });
      i = j;
    }
    // String literal
    else if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && !(code[j] === '"' && code[j-1] !== '\\')) j++;
      j++;
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
    }
    // Number
    else if (/[0-9]/.test(code[i]) && (i === 0 || !/\w/.test(code[i-1]))) {
      let j = i;
      while (j < code.length && /[0-9.f]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
    }
    // Word / keyword / std name
    else if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /\w/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (KEYWORDS.has(word))       tokens.push({ type: 'keyword', value: word });
      else if (STD_NAMES.has(word)) tokens.push({ type: 'std',     value: word });
      else                          tokens.push({ type: 'plain',   value: word });
      i = j;
    }
    // Accumulate punctuation / operators / whitespace into plain
    else {
      let j = i;
      while (j < code.length && !/[a-zA-Z_0-9"\/]/.test(code[j])) j++;
      if (j === i) j = i + 1;
      tokens.push({ type: 'plain', value: code.slice(i, j) });
      i = j;
    }
  }
  return tokens;
}

const TOKEN_COLORS = {
  keyword: "#c084fc",
  std:     "#38bdf8",
  comment: "#3d5a6e",
  string:  "#86efac",
  number:  "#fb923c",
  plain:   "#94a3b8"
};

function CppCode({ code }) {
  const tokens = tokenizeCpp(code);
  return (
    <code>
      {tokens.map((tok, idx) => (
        <span key={idx} style={{ color: TOKEN_COLORS[tok.type] }}>{tok.value}</span>
      ))}
    </code>
  );
}

const patterns = {
  Creational: [
    {
      name: "Singleton",
      intent: "Ensure a class has only one instance and provide a global access point to it.",
      uml: (
        <svg viewBox="0 0 320 160" className="w-full h-auto">
          <rect x="80" y="20" width="160" height="120" rx="4" fill="#1a2332" stroke="#38bdf8" strokeWidth="1.5"/>
          <rect x="80" y="20" width="160" height="30" rx="4" fill="#0e4f7a" stroke="#38bdf8" strokeWidth="1.5"/>
          <text x="160" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="bold" fontFamily="monospace">Singleton</text>
          <line x1="80" y1="50" x2="240" y2="50" stroke="#38bdf8" strokeWidth="1"/>
          <text x="92" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace">- instance: Singleton*</text>
          <line x1="80" y1="80" x2="240" y2="80" stroke="#38bdf8" strokeWidth="1"/>
          <text x="92" y="98" fill="#64ffe4" fontSize="10" fontFamily="monospace">+ getInstance(): Singleton*</text>
          <text x="92" y="115" fill="#94a3b8" fontSize="10" fontFamily="monospace">- Singleton() {}</text>
          <text x="92" y="132" fill="#94a3b8" fontSize="10" fontFamily="monospace">- Singleton(const Singleton&amp;)</text>
          <text x="160" y="12" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">«single instance»</text>
        </svg>
      ),
      code: `class Singleton {
private:
    static Singleton* instance_;
    int data_;

    Singleton(int d) : data_(d) {}
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

public:
    static Singleton* getInstance(int d = 0) {
        if (!instance_)
            instance_ = new Singleton(d);
        return instance_;
    }
    int getData() const { return data_; }
};

Singleton* Singleton::instance_ = nullptr;

// Thread-safe version (C++11)
class SafeSingleton {
public:
    static SafeSingleton& getInstance() {
        static SafeSingleton instance; // Guaranteed init once
        return instance;
    }
private:
    SafeSingleton() = default;
};

// Usage
int main() {
    Singleton* s1 = Singleton::getInstance(42);
    Singleton* s2 = Singleton::getInstance();
    // s1 == s2 → same pointer
    assert(s1 == s2);
}`
    },
    {
      name: "Factory Method",
      intent: "Define an interface for creating an object, but let subclasses decide which class to instantiate.",
      uml: (
        <svg viewBox="0 0 420 200" className="w-full h-auto">
          {/* Creator */}
          <rect x="20" y="20" width="150" height="70" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="20" y="20" width="150" height="26" rx="3" fill="#3b1f7a" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="95" y="36" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontStyle="italic">Creator</text>
          <line x1="20" y1="46" x2="170" y2="46" stroke="#a78bfa" strokeWidth="1"/>
          <text x="30" y="62" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProduct()</text>
          <text x="30" y="77" fill="#94a3b8" fontSize="9" fontFamily="monospace">+ anOperation()</text>
          {/* ConcreteCreator */}
          <rect x="20" y="130" width="150" height="55" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="20" y="130" width="150" height="26" rx="3" fill="#1a1130" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="95" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">ConcreteCreator</text>
          <line x1="20" y1="156" x2="170" y2="156" stroke="#a78bfa" strokeWidth="1"/>
          <text x="30" y="172" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProduct()</text>
          <line x1="95" y1="90" x2="95" y2="130" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="95,90 89,102 101,102" fill="#a78bfa"/>
          {/* Product */}
          <rect x="250" y="20" width="140" height="55" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="250" y="20" width="140" height="26" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="1.5"/>
          <text x="320" y="36" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontStyle="italic">Product</text>
          <line x1="250" y1="46" x2="390" y2="46" stroke="#34d399" strokeWidth="1"/>
          <text x="260" y="62" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>
          {/* ConcreteProduct */}
          <rect x="250" y="130" width="140" height="55" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="250" y="130" width="140" height="26" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="320" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">ConcreteProduct</text>
          <line x1="250" y1="156" x2="390" y2="156" stroke="#34d399" strokeWidth="1"/>
          <text x="260" y="172" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>
          <line x1="320" y1="75" x2="320" y2="130" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="320,75 314,87 326,87" fill="#34d399"/>
          {/* creates arrow */}
          <line x1="170" y1="165" x2="250" y2="165" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="250,165 238,160 238,170" fill="#f59e0b"/>
          <text x="200" y="158" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">creates</text>
        </svg>
      ),
      code: `// Product interface
class Button {
public:
    virtual void render() = 0;
    virtual void onClick() = 0;
    virtual ~Button() = default;
};

// Concrete Products
class WindowsButton : public Button {
public:
    void render() override { std::cout << "Rendering Windows button\\n"; }
    void onClick() override { std::cout << "Windows click\\n"; }
};

class MacButton : public Button {
public:
    void render() override { std::cout << "Rendering Mac button\\n"; }
    void onClick() override { std::cout << "Mac click\\n"; }
};

// Creator (abstract)
class Dialog {
public:
    virtual std::unique_ptr<Button> createButton() = 0;
    void render() {
        auto btn = createButton(); // Factory Method
        btn->render();
    }
    virtual ~Dialog() = default;
};

// Concrete Creators
class WindowsDialog : public Dialog {
public:
    std::unique_ptr<Button> createButton() override {
        return std::make_unique<WindowsButton>();
    }
};

class MacDialog : public Dialog {
public:
    std::unique_ptr<Button> createButton() override {
        return std::make_unique<MacButton>();
    }
};

// Usage
int main() {
    std::unique_ptr<Dialog> dialog;
    if (currentOS == "Windows")
        dialog = std::make_unique<WindowsDialog>();
    else
        dialog = std::make_unique<MacDialog>();
    dialog->render(); // Uses factory method
}`
    },
    {
      name: "Abstract Factory",
      intent: "Provide an interface for creating families of related or dependent objects without specifying concrete classes.",
      uml: (
        <svg viewBox="0 0 460 210" className="w-full h-auto">
          <rect x="150" y="10" width="160" height="65" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="150" y="10" width="160" height="24" rx="3" fill="#4a0e2e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="230" y="26" textAnchor="middle" fill="#f9a8d4" fontSize="11" fontFamily="monospace" fontStyle="italic">AbstractFactory</text>
          <line x1="150" y1="34" x2="310" y2="34" stroke="#f472b6" strokeWidth="1"/>
          <text x="160" y="49" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductA()</text>
          <text x="160" y="63" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductB()</text>

          <rect x="20" y="130" width="150" height="55" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="20" y="130" width="150" height="24" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="95" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">ConcreteFactory1</text>
          <line x1="20" y1="154" x2="170" y2="154" stroke="#f472b6" strokeWidth="1"/>
          <text x="30" y="169" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductA()</text>
          <text x="30" y="183" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductB()</text>

          <rect x="290" y="130" width="150" height="55" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="290" y="130" width="150" height="24" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="365" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">ConcreteFactory2</text>
          <line x1="290" y1="154" x2="440" y2="154" stroke="#f472b6" strokeWidth="1"/>
          <text x="300" y="169" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductA()</text>
          <text x="300" y="183" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createProductB()</text>

          <line x1="95" y1="130" x2="200" y2="75" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="200,75 192,87 208,83" fill="#f472b6"/>
          <line x1="365" y1="130" x2="260" y2="75" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="260,75 252,87 268,83" fill="#f472b6"/>
        </svg>
      ),
      code: `// Abstract Products
class Button { public: virtual void paint() = 0; virtual ~Button() = default; };
class Checkbox { public: virtual void paint() = 0; virtual ~Checkbox() = default; };

// Concrete Products - Windows
class WinButton : public Button {
    void paint() override { std::cout << "[WinButton]\\n"; }
};
class WinCheckbox : public Checkbox {
    void paint() override { std::cout << "[WinCheckbox]\\n"; }
};

// Concrete Products - Mac
class MacButton : public Button {
    void paint() override { std::cout << "(MacButton)\\n"; }
};
class MacCheckbox : public Checkbox {
    void paint() override { std::cout << "(MacCheckbox)\\n"; }
};

// Abstract Factory
class GUIFactory {
public:
    virtual std::unique_ptr<Button>   createButton()   = 0;
    virtual std::unique_ptr<Checkbox> createCheckbox() = 0;
    virtual ~GUIFactory() = default;
};

// Concrete Factories
class WinFactory : public GUIFactory {
public:
    std::unique_ptr<Button>   createButton()   override { return std::make_unique<WinButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<WinCheckbox>(); }
};

class MacFactory : public GUIFactory {
public:
    std::unique_ptr<Button>   createButton()   override { return std::make_unique<MacButton>(); }
    std::unique_ptr<Checkbox> createCheckbox() override { return std::make_unique<MacCheckbox>(); }
};

// Client
class Application {
    std::unique_ptr<Button>   btn_;
    std::unique_ptr<Checkbox> chk_;
public:
    Application(std::unique_ptr<GUIFactory> f)
        : btn_(f->createButton()), chk_(f->createCheckbox()) {}
    void paint() { btn_->paint(); chk_->paint(); }
};

int main() {
    auto factory = std::make_unique<WinFactory>();
    Application app(std::move(factory));
    app.paint(); // [WinButton] [WinCheckbox]
}`
    },
    {
      name: "Builder",
      intent: "Separate the construction of a complex object from its representation so the same process can create different representations.",
      uml: (
        <svg viewBox="0 0 440 200" className="w-full h-auto">
          <rect x="280" y="10" width="140" height="80" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="280" y="10" width="140" height="24" rx="3" fill="#431407" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="350" y="26" textAnchor="middle" fill="#fdba74" fontSize="11" fontFamily="monospace" fontStyle="italic">Builder</text>
          <line x1="280" y1="34" x2="420" y2="34" stroke="#fb923c" strokeWidth="1"/>
          <text x="290" y="50" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ buildPartA()</text>
          <text x="290" y="64" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ buildPartB()</text>
          <text x="290" y="78" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ getResult()</text>

          <rect x="280" y="130" width="140" height="60" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="280" y="130" width="140" height="24" rx="3" fill="#1c0802" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="350" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">ConcreteBuilder</text>
          <line x1="280" y1="154" x2="420" y2="154" stroke="#fb923c" strokeWidth="1"/>
          <text x="290" y="170" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ buildPartA()</text>
          <text x="290" y="184" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ getResult(): Product</text>

          <line x1="350" y1="90" x2="350" y2="130" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="350,90 344,102 356,102" fill="#fb923c"/>

          <rect x="10" y="70" width="140" height="60" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="70" width="140" height="24" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="80" y="86" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">Director</text>
          <line x1="10" y1="94" x2="150" y2="94" stroke="#a78bfa" strokeWidth="1"/>
          <text x="20" y="110" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ construct()</text>
          <text x="20" y="124" fill="#94a3b8" fontSize="9" fontFamily="monospace">- builder: Builder*</text>

          <line x1="150" y1="100" x2="280" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="210" y="72" fill="#94a3b8" fontSize="8" fontFamily="monospace">uses</text>

          <rect x="160" y="130" width="100" height="50" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="160" y="130" width="100" height="24" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="210" y="146" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">Product</text>
          <line x1="160" y1="154" x2="260" y2="154" stroke="#34d399" strokeWidth="1"/>
          <text x="170" y="170" fill="#94a3b8" fontSize="9" fontFamily="monospace">- parts[]</text>

          <line x1="280" y1="170" x2="260" y2="162" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="263" y="158" fill="#34d399" fontSize="8" fontFamily="monospace">builds</text>
        </svg>
      ),
      code: `struct Pizza {
    std::string dough, sauce, topping;
    void show() const {
        std::cout << "Dough:" << dough 
                  << " Sauce:" << sauce 
                  << " Topping:" << topping << "\\n";
    }
};

// Builder interface
class PizzaBuilder {
protected:
    Pizza pizza_;
public:
    virtual void buildDough()   = 0;
    virtual void buildSauce()   = 0;
    virtual void buildTopping() = 0;
    Pizza getResult() { return pizza_; }
    virtual ~PizzaBuilder() = default;
};

// Concrete Builders
class MargheritaBuilder : public PizzaBuilder {
public:
    void buildDough()   override { pizza_.dough   = "thin"; }
    void buildSauce()   override { pizza_.sauce   = "tomato"; }
    void buildTopping() override { pizza_.topping = "mozzarella"; }
};

class BBQBuilder : public PizzaBuilder {
public:
    void buildDough()   override { pizza_.dough   = "thick"; }
    void buildSauce()   override { pizza_.sauce   = "BBQ"; }
    void buildTopping() override { pizza_.topping = "chicken+onion"; }
};

// Director
class Cook {
    PizzaBuilder* builder_;
public:
    Cook(PizzaBuilder* b) : builder_(b) {}
    void makePizza() {
        builder_->buildDough();
        builder_->buildSauce();
        builder_->buildTopping();
    }
};

int main() {
    MargheritaBuilder mb;
    Cook cook(&mb);
    cook.makePizza();
    mb.getResult().show();
    // Dough:thin Sauce:tomato Topping:mozzarella
}`
    },
    {
      name: "Prototype",
      intent: "Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.",
      uml: (
        <svg viewBox="0 0 360 180" className="w-full h-auto">
          <rect x="100" y="10" width="160" height="55" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="100" y="10" width="160" height="24" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="180" y="26" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontStyle="italic">Prototype</text>
          <line x1="100" y1="34" x2="260" y2="34" stroke="#22d3ee" strokeWidth="1"/>
          <text x="110" y="50" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ clone(): Prototype*</text>

          <rect x="20" y="120" width="145" height="50" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="20" y="120" width="145" height="24" rx="3" fill="#042030" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="92" y="136" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">ConcretePrototype1</text>
          <line x1="20" y1="144" x2="165" y2="144" stroke="#22d3ee" strokeWidth="1"/>
          <text x="30" y="160" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ clone(): Prototype*</text>

          <rect x="195" y="120" width="145" height="50" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="195" y="120" width="145" height="24" rx="3" fill="#042030" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="267" y="136" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">ConcretePrototype2</text>
          <line x1="195" y1="144" x2="340" y2="144" stroke="#22d3ee" strokeWidth="1"/>
          <text x="205" y="160" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ clone(): Prototype*</text>

          <line x1="92" y1="120" x2="155" y2="65" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="155,65 148,78 162,74" fill="#22d3ee"/>
          <line x1="267" y1="120" x2="205" y2="65" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="205,65 197,78 211,74" fill="#22d3ee"/>

          <text x="180" y="108" textAnchor="middle" fill="#22d3ee" fontSize="20" fontFamily="monospace">↩</text>
          <text x="180" y="118" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">clone()</text>
        </svg>
      ),
      code: `class Shape {
public:
    int x, y;
    std::string color;

    Shape(int x, int y, const std::string& c) : x(x), y(y), color(c) {}
    virtual std::unique_ptr<Shape> clone() const = 0;
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    int radius;
    Circle(int x, int y, const std::string& c, int r)
        : Shape(x, y, c), radius(r) {}

    std::unique_ptr<Shape> clone() const override {
        return std::make_unique<Circle>(*this); // Copy ctor
    }
    void draw() const override {
        std::cout << "Circle(" << x << "," << y 
                  << ") r=" << radius << " " << color << "\\n";
    }
};

class Rectangle : public Shape {
public:
    int w, h;
    Rectangle(int x, int y, const std::string& c, int w, int h)
        : Shape(x, y, c), w(w), h(h) {}

    std::unique_ptr<Shape> clone() const override {
        return std::make_unique<Rectangle>(*this);
    }
    void draw() const override {
        std::cout << "Rect(" << x << "," << y 
                  << ") " << w << "x" << h << " " << color << "\\n";
    }
};

// Prototype Registry
class ShapeCache {
    std::unordered_map<std::string, std::unique_ptr<Shape>> cache_;
public:
    void put(const std::string& key, std::unique_ptr<Shape> s) {
        cache_[key] = std::move(s);
    }
    std::unique_ptr<Shape> get(const std::string& key) {
        return cache_.at(key)->clone(); // Deep copy on demand
    }
};

int main() {
    ShapeCache cache;
    cache.put("bigCircle", std::make_unique<Circle>(0,0,"red",100));
    
    auto c1 = cache.get("bigCircle"); // Cloned, not original
    auto c2 = cache.get("bigCircle"); // Another independent clone
    c1->draw(); c2->draw();
}`
    }
  ],
  Structural: [
    {
      name: "Adapter",
      intent: "Convert the interface of a class into another interface that clients expect. Lets incompatible interfaces work together.",
      uml: (
        <svg viewBox="0 0 440 160" className="w-full h-auto">
          <rect x="10" y="50" width="100" height="60" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="10" y="50" width="100" height="24" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="60" y="66" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Client</text>
          <line x1="10" y1="74" x2="110" y2="74" stroke="#34d399" strokeWidth="1"/>
          <text x="20" y="90" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ request()</text>

          <rect x="155" y="30" width="120" height="55" rx="3" fill="#1a2332" stroke="#38bdf8" strokeWidth="1.5"/>
          <rect x="155" y="30" width="120" height="24" rx="3" fill="#0e4f7a" stroke="#38bdf8" strokeWidth="1.5"/>
          <text x="215" y="46" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontStyle="italic">Target</text>
          <line x1="155" y1="54" x2="275" y2="54" stroke="#38bdf8" strokeWidth="1"/>
          <text x="165" y="70" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ request()</text>

          <rect x="155" y="110" width="120" height="42" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="155" y="110" width="120" height="24" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="215" y="126" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Adapter</text>
          <line x1="155" y1="134" x2="275" y2="134" stroke="#f59e0b" strokeWidth="1"/>
          <text x="165" y="147" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ request()</text>

          <rect x="330" y="110" width="100" height="42" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="330" y="110" width="100" height="24" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="380" y="126" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontFamily="monospace">Adaptee</text>
          <line x1="330" y1="134" x2="430" y2="134" stroke="#f472b6" strokeWidth="1"/>
          <text x="340" y="147" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ specificReq()</text>

          <line x1="110" y1="80" x2="155" y2="57" stroke="#94a3b8" strokeWidth="1.5"/>
          <polygon points="155,57 144,55 148,66" fill="#94a3b8"/>
          <line x1="215" y1="85" x2="215" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="215,85 209,97 221,97" fill="#f59e0b"/>
          <line x1="275" y1="131" x2="330" y2="131" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="300" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">wraps</text>
        </svg>
      ),
      code: `// Existing incompatible class (Adaptee)
class XmlLogger {
public:
    void logXml(const std::string& xml) {
        std::cout << "<log>" << xml << "</log>\\n";
    }
};

// Target interface expected by client
class JsonLogger {
public:
    virtual void logJson(const std::string& json) = 0;
    virtual ~JsonLogger() = default;
};

// Object Adapter (composition)
class LoggerAdapter : public JsonLogger {
    XmlLogger adaptee_;
public:
    void logJson(const std::string& json) override {
        // Convert JSON → XML and delegate
        std::string xml = "data:" + json; // simplified conversion
        adaptee_.logXml(xml);
    }
};

// Class Adapter (multiple inheritance)
class LoggerAdapter2 : public JsonLogger, private XmlLogger {
public:
    void logJson(const std::string& json) override {
        logXml("data:" + json); // Direct access via inheritance
    }
};

// Client only knows JsonLogger
void clientCode(JsonLogger& logger) {
    logger.logJson(R"({"level":"INFO","msg":"hello"})");
}

int main() {
    LoggerAdapter adapter;
    clientCode(adapter);
    // Output: <log>data:{"level":"INFO","msg":"hello"}</log>
}`
    },
    {
      name: "Bridge",
      intent: "Decouple an abstraction from its implementation so the two can vary independently.",
      uml: (
        <svg viewBox="0 0 440 180" className="w-full h-auto">
          <rect x="10" y="40" width="160" height="70" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="40" width="160" height="24" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="90" y="56" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontStyle="italic">Abstraction</text>
          <line x1="10" y1="64" x2="170" y2="64" stroke="#a78bfa" strokeWidth="1"/>
          <text x="20" y="80" fill="#94a3b8" fontSize="9" fontFamily="monospace">- impl: Impl*</text>
          <text x="20" y="96" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>

          <rect x="10" y="140" width="160" height="35" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="140" width="160" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="90" y="155" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">RefinedAbstraction</text>
          <line x1="90" y1="110" x2="90" y2="140" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="90,110 84,122 96,122" fill="#a78bfa"/>

          <rect x="270" y="20" width="160" height="55" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="270" y="20" width="160" height="24" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="350" y="36" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontStyle="italic">Implementation</text>
          <line x1="270" y1="44" x2="430" y2="44" stroke="#34d399" strokeWidth="1"/>
          <text x="280" y="60" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ implOperation()</text>

          <rect x="270" y="115" width="70" height="35" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="270" y="115" width="70" height="22" rx="3" fill="#011a14" stroke="#34d399" strokeWidth="1.5"/>
          <text x="305" y="129" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteA</text>
          <rect x="360" y="115" width="70" height="35" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="360" y="115" width="70" height="22" rx="3" fill="#011a14" stroke="#34d399" strokeWidth="1.5"/>
          <text x="395" y="129" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteB</text>
          <line x1="305" y1="115" x2="330" y2="75" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="330,75 323,88 337,84" fill="#34d399"/>
          <line x1="395" y1="115" x2="370" y2="75" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="370,75 363,88 377,84" fill="#34d399"/>

          <line x1="170" y1="74" x2="270" y2="44" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="215" y="52" fill="#f59e0b" fontSize="8" fontFamily="monospace">bridge</text>
        </svg>
      ),
      code: `// Implementation hierarchy
class Renderer {
public:
    virtual void renderCircle(float x, float y, float r) = 0;
    virtual ~Renderer() = default;
};

class OpenGLRenderer : public Renderer {
public:
    void renderCircle(float x, float y, float r) override {
        std::cout << "OpenGL circle at(" << x << "," << y << ") r=" << r << "\\n";
    }
};

class VulkanRenderer : public Renderer {
public:
    void renderCircle(float x, float y, float r) override {
        std::cout << "Vulkan circle at(" << x << "," << y << ") r=" << r << "\\n";
    }
};

// Abstraction hierarchy
class Shape {
protected:
    std::shared_ptr<Renderer> renderer_; // The bridge
public:
    Shape(std::shared_ptr<Renderer> r) : renderer_(r) {}
    virtual void draw() = 0;
    virtual void resize(float factor) = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    float x_, y_, radius_;
public:
    Circle(float x, float y, float r, std::shared_ptr<Renderer> rend)
        : Shape(rend), x_(x), y_(y), radius_(r) {}

    void draw() override {
        renderer_->renderCircle(x_, y_, radius_);
    }
    void resize(float factor) override { radius_ *= factor; }
};

int main() {
    auto opengl = std::make_shared<OpenGLRenderer>();
    auto vulkan  = std::make_shared<VulkanRenderer>();

    Circle c1(5, 10, 3, opengl);
    Circle c2(2, 4, 7, vulkan);

    c1.draw(); // OpenGL circle...
    c2.draw(); // Vulkan circle...

    // Can swap renderers at runtime!
    c1 = Circle(5, 10, 3, vulkan);
    c1.draw(); // Now Vulkan!
}`
    },
    {
      name: "Composite",
      intent: "Compose objects into tree structures to represent part-whole hierarchies. Lets clients treat individual objects and compositions uniformly.",
      uml: (
        <svg viewBox="0 0 380 190" className="w-full h-auto">
          <rect x="120" y="10" width="140" height="55" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="120" y="10" width="140" height="24" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="190" y="26" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily="monospace" fontStyle="italic">Component</text>
          <line x1="120" y1="34" x2="260" y2="34" stroke="#f59e0b" strokeWidth="1"/>
          <text x="130" y="50" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>

          <rect x="20" y="120" width="120" height="55" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="20" y="120" width="120" height="24" rx="3" fill="#0d0800" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="80" y="136" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">Leaf</text>
          <line x1="20" y1="144" x2="140" y2="144" stroke="#f59e0b" strokeWidth="1"/>
          <text x="30" y="160" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>

          <rect x="230" y="120" width="130" height="65" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="230" y="120" width="130" height="24" rx="3" fill="#0d0800" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="295" y="136" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">Composite</text>
          <line x1="230" y1="144" x2="360" y2="144" stroke="#f59e0b" strokeWidth="1"/>
          <text x="240" y="160" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>
          <text x="240" y="174" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ add(Component*)</text>

          <line x1="80" y1="120" x2="165" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="165,65 157,78 173,74" fill="#f59e0b"/>
          <line x1="295" y1="120" x2="215" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="215,65 207,78 223,74" fill="#f59e0b"/>

          <path d="M 360 155 Q 390 155 390 105 Q 390 52 260 38" stroke="#f59e0b" fill="none" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="368" y="105" fill="#f59e0b" fontSize="8" fontFamily="monospace">children</text>
        </svg>
      ),
      code: `#include <vector>
#include <memory>

// Component interface
class FileSystemItem {
public:
    std::string name;
    FileSystemItem(const std::string& n) : name(n) {}
    virtual int getSize() const = 0;
    virtual void print(int indent = 0) const = 0;
    virtual ~FileSystemItem() = default;
};

// Leaf
class File : public FileSystemItem {
    int size_;
public:
    File(const std::string& name, int size)
        : FileSystemItem(name), size_(size) {}

    int getSize() const override { return size_; }
    void print(int indent = 0) const override {
        std::cout << std::string(indent, ' ') 
                  << "📄 " << name << " (" << size_ << "B)\\n";
    }
};

// Composite
class Directory : public FileSystemItem {
    std::vector<std::unique_ptr<FileSystemItem>> children_;
public:
    Directory(const std::string& name) : FileSystemItem(name) {}

    void add(std::unique_ptr<FileSystemItem> item) {
        children_.push_back(std::move(item));
    }

    int getSize() const override {
        int total = 0;
        for (const auto& child : children_) total += child->getSize();
        return total;
    }

    void print(int indent = 0) const override {
        std::cout << std::string(indent, ' ') 
                  << "📁 " << name << "/\\n";
        for (const auto& child : children_)
            child->print(indent + 2);
    }
};

int main() {
    auto root = std::make_unique<Directory>("root");
    root->add(std::make_unique<File>("readme.txt", 100));
    
    auto src = std::make_unique<Directory>("src");
    src->add(std::make_unique<File>("main.cpp", 5000));
    src->add(std::make_unique<File>("util.cpp", 2000));
    root->add(std::move(src));
    
    root->print();       // Tree traversal
    std::cout << root->getSize() << "B total\\n"; // 7100B
}`
    },
    {
      name: "Decorator",
      intent: "Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.",
      uml: (
        <svg viewBox="0 0 400 200" className="w-full h-auto">
          <rect x="130" y="10" width="140" height="55" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="130" y="10" width="140" height="24" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="200" y="26" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontStyle="italic">Component</text>
          <line x1="130" y1="34" x2="270" y2="34" stroke="#22d3ee" strokeWidth="1"/>
          <text x="140" y="50" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation(): string</text>

          <rect x="20" y="130" width="130" height="42" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="20" y="130" width="130" height="22" rx="3" fill="#042030" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="85" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">ConcreteComp</text>
          <line x1="20" y1="152" x2="150" y2="152" stroke="#22d3ee" strokeWidth="1"/>
          <text x="30" y="165" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>

          <rect x="230" y="105" width="130" height="55" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="230" y="105" width="130" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="295" y="120" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Decorator</text>
          <line x1="230" y1="127" x2="360" y2="127" stroke="#f59e0b" strokeWidth="1"/>
          <text x="240" y="142" fill="#94a3b8" fontSize="9" fontFamily="monospace">- comp: Component*</text>
          <text x="240" y="155" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation()</text>

          <line x1="85" y1="130" x2="170" y2="65" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="170,65 162,78 178,74" fill="#22d3ee"/>
          <line x1="295" y1="105" x2="230" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="230,65 222,78 238,74" fill="#f59e0b"/>

          <path d="M 360 130 Q 390 130 390 37 Q 390 20 270 20" stroke="#f59e0b" fill="none" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="365" y="80" fill="#f59e0b" fontSize="8" fontFamily="monospace">wraps</text>
        </svg>
      ),
      code: `// Component interface
class Coffee {
public:
    virtual std::string getDescription() const = 0;
    virtual double getCost() const = 0;
    virtual ~Coffee() = default;
};

// Concrete Component
class SimpleCoffee : public Coffee {
public:
    std::string getDescription() const override { return "Coffee"; }
    double getCost() const override { return 1.0; }
};

// Base Decorator
class CoffeeDecorator : public Coffee {
protected:
    std::unique_ptr<Coffee> coffee_;
public:
    CoffeeDecorator(std::unique_ptr<Coffee> c) : coffee_(std::move(c)) {}
    std::string getDescription() const override { return coffee_->getDescription(); }
    double getCost() const override { return coffee_->getCost(); }
};

// Concrete Decorators
class Milk : public CoffeeDecorator {
public:
    Milk(std::unique_ptr<Coffee> c) : CoffeeDecorator(std::move(c)) {}
    std::string getDescription() const override {
        return coffee_->getDescription() + ", Milk";
    }
    double getCost() const override { return coffee_->getCost() + 0.25; }
};

class Sugar : public CoffeeDecorator {
public:
    Sugar(std::unique_ptr<Coffee> c) : CoffeeDecorator(std::move(c)) {}
    std::string getDescription() const override {
        return coffee_->getDescription() + ", Sugar";
    }
    double getCost() const override { return coffee_->getCost() + 0.10; }
};

class Vanilla : public CoffeeDecorator {
public:
    Vanilla(std::unique_ptr<Coffee> c) : CoffeeDecorator(std::move(c)) {}
    std::string getDescription() const override {
        return coffee_->getDescription() + ", Vanilla";
    }
    double getCost() const override { return coffee_->getCost() + 0.50; }
};

int main() {
    // Dynamically stack decorators
    auto coffee = std::make_unique<SimpleCoffee>();
    coffee = std::make_unique<Milk>(std::move(coffee));
    coffee = std::make_unique<Sugar>(std::move(coffee));
    coffee = std::make_unique<Vanilla>(std::move(coffee));

    std::cout << coffee->getDescription() << "\\n";
    // Coffee, Milk, Sugar, Vanilla
    std::cout << "$" << coffee->getCost() << "\\n"; // $1.85
}`
    },
    {
      name: "Facade",
      intent: "Provide a simplified interface to a complex subsystem of classes.",
      uml: (
        <svg viewBox="0 0 420 190" className="w-full h-auto">
          <rect x="10" y="70" width="100" height="50" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="10" y="70" width="100" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="60" y="85" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Client</text>
          <line x1="10" y1="92" x2="110" y2="92" stroke="#34d399" strokeWidth="1"/>

          <rect x="155" y="60" width="110" height="70" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="155" y="60" width="110" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="210" y="75" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily="monospace">Facade</text>
          <line x1="155" y1="82" x2="265" y2="82" stroke="#f59e0b" strokeWidth="1"/>
          <text x="165" y="97" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation1()</text>
          <text x="165" y="111" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ operation2()</text>

          <rect x="310" y="10" width="100" height="40" rx="3" fill="#1a2332" stroke="#94a3b8" strokeWidth="1.5"/>
          <rect x="310" y="10" width="100" height="20" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5"/>
          <text x="360" y="24" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">SubsystemA</text>

          <rect x="310" y="70" width="100" height="40" rx="3" fill="#1a2332" stroke="#94a3b8" strokeWidth="1.5"/>
          <rect x="310" y="70" width="100" height="20" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5"/>
          <text x="360" y="84" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">SubsystemB</text>

          <rect x="310" y="130" width="100" height="40" rx="3" fill="#1a2332" stroke="#94a3b8" strokeWidth="1.5"/>
          <rect x="310" y="130" width="100" height="20" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5"/>
          <text x="360" y="144" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">SubsystemC</text>

          <line x1="110" y1="95" x2="155" y2="95" stroke="#94a3b8" strokeWidth="1.5"/>
          <polygon points="155,95 143,90 143,100" fill="#94a3b8"/>
          <line x1="265" y1="78" x2="310" y2="30" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
          <line x1="265" y1="90" x2="310" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
          <line x1="265" y1="108" x2="310" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
        </svg>
      ),
      code: `// Complex subsystem classes
class DVDPlayer {
public:
    void on()          { std::cout << "DVD on\\n"; }
    void play(const std::string& m) { std::cout << "Playing " << m << "\\n"; }
    void off()         { std::cout << "DVD off\\n"; }
};

class Amplifier {
public:
    void on()          { std::cout << "Amp on\\n"; }
    void setVolume(int v) { std::cout << "Volume: " << v << "\\n"; }
    void off()         { std::cout << "Amp off\\n"; }
};

class Projector {
public:
    void on()          { std::cout << "Projector on\\n"; }
    void wideScreen()  { std::cout << "Widescreen mode\\n"; }
    void off()         { std::cout << "Projector off\\n"; }
};

class Lights {
public:
    void dim(int level) { std::cout << "Lights dimmed to " << level << "%\\n"; }
};

// Facade – single simplified interface
class HomeTheaterFacade {
    DVDPlayer  dvd_;
    Amplifier  amp_;
    Projector  proj_;
    Lights     lights_;
public:
    // Simple watchMovie() hides 10 steps
    void watchMovie(const std::string& movie) {
        std::cout << "== Get ready to watch a movie ==\\n";
        lights_.dim(10);
        proj_.on();
        proj_.wideScreen();
        amp_.on();
        amp_.setVolume(20);
        dvd_.on();
        dvd_.play(movie);
    }

    void endMovie() {
        std::cout << "== Shutting down ==\\n";
        dvd_.off();
        amp_.off();
        proj_.off();
        lights_.dim(100);
    }
};

int main() {
    HomeTheaterFacade theater;
    theater.watchMovie("Inception"); // One call instead of many
    theater.endMovie();
}`
    },
    {
      name: "Flyweight",
      intent: "Use sharing to support a large number of fine-grained objects efficiently by separating intrinsic (shared) from extrinsic (unique) state.",
      uml: (
        <svg viewBox="0 0 400 170" className="w-full h-auto">
          <rect x="10" y="60" width="110" height="50" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="10" y="60" width="110" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="65" y="75" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Client</text>

          <rect x="155" y="30" width="130" height="55" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="155" y="30" width="130" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="220" y="45" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">FlyweightFactory</text>
          <line x1="155" y1="52" x2="285" y2="52" stroke="#f59e0b" strokeWidth="1"/>
          <text x="165" y="68" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ getFlyweight(key)</text>

          <rect x="155" y="120" width="130" height="42" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="155" y="120" width="130" height="22" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="220" y="135" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace">Flyweight</text>
          <line x1="155" y1="142" x2="285" y2="142" stroke="#22d3ee" strokeWidth="1"/>
          <text x="165" y="155" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ op(extrinsicState)</text>

          <line x1="120" y1="85" x2="155" y2="57" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="220" y1="85" x2="220" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="228" y="107" fill="#f59e0b" fontSize="8" fontFamily="monospace">returns</text>

          <rect x="310" y="50" width="80" height="30" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="350" y="69" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">cache[]</text>
          <line x1="285" y1="52" x2="310" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>

          <text x="10" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace">Intrinsic: shared state</text>
          <text x="10" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">Extrinsic: passed in</text>
        </svg>
      ),
      code: `#include <unordered_map>

// Flyweight – stores intrinsic (shared) state
class CharacterGlyph {
    char symbol_;
    std::string font_;
    int fontSize_;
public:
    CharacterGlyph(char c, const std::string& font, int size)
        : symbol_(c), font_(font), fontSize_(size) {}

    // Extrinsic state (position) passed in
    void render(int x, int y) const {
        std::cout << "Render '" << symbol_ << "' [" << font_ 
                  << " " << fontSize_ << "pt] at (" << x << "," << y << ")\\n";
    }
};

// Flyweight Factory
class GlyphFactory {
    std::unordered_map<std::string, std::shared_ptr<CharacterGlyph>> cache_;
public:
    std::shared_ptr<CharacterGlyph> getGlyph(char c, const std::string& font, int size) {
        std::string key = std::string(1,c) + font + std::to_string(size);
        if (cache_.find(key) == cache_.end()) {
            cache_[key] = std::make_shared<CharacterGlyph>(c, font, size);
            std::cout << "Created new glyph for '" << c << "'\\n";
        }
        return cache_[key];
    }
    size_t cacheSize() const { return cache_.size(); }
};

int main() {
    GlyphFactory factory;
    std::vector<std::pair<std::shared_ptr<CharacterGlyph>, std::pair<int,int>>> doc;

    // Render 1000 'A's — only 1 glyph object created!
    for (int i = 0; i < 5; ++i) {
        auto glyph = factory.getGlyph('A', "Arial", 12); // shared
        doc.push_back({glyph, {i*10, 0}});
    }

    for (auto& [g, pos] : doc)
        g->render(pos.first, pos.second);

    std::cout << "Unique glyphs: " << factory.cacheSize() << "\\n"; // 1
}`
    },
    {
      name: "Proxy",
      intent: "Provide a surrogate or placeholder for another object to control access to it.",
      uml: (
        <svg viewBox="0 0 420 160" className="w-full h-auto">
          <rect x="10" y="55" width="90" height="50" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="10" y="55" width="90" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="55" y="70" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Client</text>

          <rect x="155" y="20" width="120" height="50" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="155" y="20" width="120" height="22" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="215" y="35" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontStyle="italic">Subject</text>
          <line x1="155" y1="42" x2="275" y2="42" stroke="#a78bfa" strokeWidth="1"/>
          <text x="165" y="58" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ request()</text>

          <rect x="155" y="110" width="120" height="42" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="155" y="110" width="120" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="215" y="125" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Proxy</text>
          <line x1="155" y1="132" x2="275" y2="132" stroke="#f59e0b" strokeWidth="1"/>
          <text x="165" y="145" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ request()</text>

          <rect x="310" y="110" width="100" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="310" y="110" width="100" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="360" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">RealSubject</text>
          <line x1="310" y1="132" x2="410" y2="132" stroke="#a78bfa" strokeWidth="1"/>
          <text x="320" y="145" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ request()</text>

          <line x1="100" y1="80" x2="155" y2="45" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="215" y1="70" x2="215" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="215,70 209,82 221,82" fill="#f59e0b"/>
          <line x1="275" y1="131" x2="310" y2="131" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <polygon points="310,131 298,126 298,136" fill="#f59e0b"/>
          <line x1="360" y1="110" x2="275" y2="50" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="275,50 268,62 280,58" fill="#a78bfa"/>
        </svg>
      ),
      code: `// Subject interface
class Image {
public:
    virtual void display() = 0;
    virtual ~Image() = default;
};

// Real Subject (expensive to create)
class HighResImage : public Image {
    std::string filename_;
    void loadFromDisk() {
        std::cout << "Loading " << filename_ << " from disk (slow!)\\n";
    }
public:
    HighResImage(const std::string& f) : filename_(f) { loadFromDisk(); }
    void display() override {
        std::cout << "Displaying " << filename_ << "\\n";
    }
};

// Virtual Proxy – lazy initialization
class ImageProxy : public Image {
    std::string filename_;
    mutable std::unique_ptr<HighResImage> realImage_;
public:
    ImageProxy(const std::string& f) : filename_(f) {}

    void display() override {
        if (!realImage_) {                    // Load only when needed
            realImage_ = std::make_unique<HighResImage>(filename_);
        }
        realImage_->display();
    }
};

// Protection Proxy – access control
class SecureImageProxy : public Image {
    std::unique_ptr<HighResImage> real_;
    std::string userRole_;
public:
    SecureImageProxy(const std::string& f, const std::string& role)
        : real_(std::make_unique<HighResImage>(f)), userRole_(role) {}

    void display() override {
        if (userRole_ == "admin") real_->display();
        else std::cout << "Access denied!\\n";
    }
};

int main() {
    // Image not loaded until display() is called
    ImageProxy img("4K_photo.jpg");
    std::cout << "Proxy created, no disk I/O yet\\n";
    img.display(); // Loading happens here
    img.display(); // Uses cached real image
}`
    }
  ],
  Behavioral: [
    {
      name: "Chain of Responsibility",
      intent: "Pass requests along a chain of handlers. Each handler decides to process the request or pass it to the next handler.",
      uml: (
        <svg viewBox="0 0 420 140" className="w-full h-auto">
          <rect x="10" y="45" width="110" height="55" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="10" y="45" width="110" height="22" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="65" y="60" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontFamily="monospace" fontStyle="italic">Handler</text>
          <line x1="10" y1="67" x2="120" y2="67" stroke="#f472b6" strokeWidth="1"/>
          <text x="20" y="82" fill="#94a3b8" fontSize="8" fontFamily="monospace">- next: Handler*</text>
          <text x="20" y="95" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ handle(Request)</text>

          {["Handler A", "Handler B", "Handler C"].map((h, i) => (
            <g key={i}>
              <rect x={150 + i*90} y={45} width={80} height={55} rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
              <rect x={150 + i*90} y={45} width={80} height={22} rx="3" fill="#1a0810" stroke="#f472b6" strokeWidth="1.5"/>
              <text x={190 + i*90} y={60} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">{h}</text>
              <line x1={150 + i*90} y1={67} x2={230 + i*90} y2={67} stroke="#f472b6" strokeWidth="1"/>
              <text x={160 + i*90} y={82} fill="#64ffe4" fontSize="8" fontFamily="monospace">+ handle()</text>
            </g>
          ))}

          <line x1="120" y1="72" x2="150" y2="72" stroke="#94a3b8" strokeWidth="1.5"/>
          <polygon points="150,72 138,67 138,77" fill="#94a3b8"/>
          <line x1="230" y1="72" x2="240" y2="72" stroke="#f472b6" strokeWidth="1.5" markerEnd="url(#arrow)"/>
          <polygon points="240,72 228,67 228,77" fill="#f472b6"/>
          <line x1="320" y1="72" x2="330" y2="72" stroke="#f472b6" strokeWidth="1.5"/>
          <polygon points="330,72 318,67 318,77" fill="#f472b6"/>
          <text x="344" y="76" fill="#94a3b8" fontSize="9" fontFamily="monospace">...</text>
          <text x="190" y="120" textAnchor="middle" fill="#f472b6" fontSize="11">→ → →</text>
          <text x="190" y="133" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">request flows through chain</text>
        </svg>
      ),
      code: `struct Request { int level; std::string message; };

// Handler base
class Logger {
protected:
    int level_;
    std::unique_ptr<Logger> next_;
public:
    Logger(int lvl) : level_(lvl) {}

    Logger* setNext(std::unique_ptr<Logger> next) {
        next_ = std::move(next);
        return next_.get();
    }

    virtual void handle(const Request& req) {
        if (next_) next_->handle(req);
    }
};

// Concrete Handlers
class InfoLogger : public Logger {
public:
    InfoLogger() : Logger(1) {}
    void handle(const Request& req) override {
        if (req.level == 1)
            std::cout << "[INFO] " << req.message << "\\n";
        else
            Logger::handle(req); // pass up the chain
    }
};

class WarningLogger : public Logger {
public:
    WarningLogger() : Logger(2) {}
    void handle(const Request& req) override {
        if (req.level == 2)
            std::cout << "[WARN] " << req.message << "\\n";
        else
            Logger::handle(req);
    }
};

class ErrorLogger : public Logger {
public:
    ErrorLogger() : Logger(3) {}
    void handle(const Request& req) override {
        if (req.level == 3)
            std::cout << "[ERROR] " << req.message << "\\n";
        else
            Logger::handle(req);
    }
};

int main() {
    auto info = std::make_unique<InfoLogger>();
    auto warn = std::make_unique<WarningLogger>();
    auto error = std::make_unique<ErrorLogger>();

    // Build chain: info → warn → error
    info->setNext(std::move(warn))->setNext(std::move(error));

    info->handle({1, "Server started"});  // [INFO]
    info->handle({2, "High memory"});     // [WARN]
    info->handle({3, "Disk full"});       // [ERROR]
}`
    },
    {
      name: "Command",
      intent: "Encapsulate a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
      uml: (
        <svg viewBox="0 0 440 160" className="w-full h-auto">
          <rect x="10" y="55" width="80" height="50" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="10" y="55" width="80" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="50" y="70" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">Invoker</text>
          <line x1="10" y1="77" x2="90" y2="77" stroke="#34d399" strokeWidth="1"/>
          <text x="18" y="93" fill="#94a3b8" fontSize="8" fontFamily="monospace">- cmd: Command</text>
          <text x="18" y="105" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ execute()</text>

          <rect x="155" y="20" width="120" height="55" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="155" y="20" width="120" height="22" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="215" y="35" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontStyle="italic">Command</text>
          <line x1="155" y1="42" x2="275" y2="42" stroke="#a78bfa" strokeWidth="1"/>
          <text x="165" y="58" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ execute()</text>
          <text x="165" y="70" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ undo()</text>

          <rect x="155" y="110" width="120" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="155" y="110" width="120" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="215" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteCommand</text>
          <line x1="215" y1="75" x2="215" y2="110" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="215,75 209,87 221,87" fill="#a78bfa"/>

          <rect x="340" y="55" width="90" height="50" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="340" y="55" width="90" height="22" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="385" y="70" textAnchor="middle" fill="#f9a8d4" fontSize="9" fontFamily="monospace">Receiver</text>
          <line x1="340" y1="77" x2="430" y2="77" stroke="#f472b6" strokeWidth="1"/>
          <text x="350" y="93" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ action()</text>

          <line x1="90" y1="80" x2="155" y2="47" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="275" y1="131" x2="340" y2="80" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="300" y="103" fill="#f472b6" fontSize="8" fontFamily="monospace">calls</text>
        </svg>
      ),
      code: `// Receiver
class TextEditor {
    std::string text_;
public:
    void write(const std::string& words) { text_ += words; }
    void erase(size_t count) {
        if (count <= text_.size()) text_.erase(text_.size() - count);
    }
    std::string getText() const { return text_; }
};

// Command interface
class Command {
public:
    virtual void execute() = 0;
    virtual void undo()    = 0;
    virtual ~Command()     = default;
};

// Concrete Commands
class WriteCommand : public Command {
    TextEditor& editor_;
    std::string words_;
public:
    WriteCommand(TextEditor& e, const std::string& w)
        : editor_(e), words_(w) {}
    void execute() override { editor_.write(words_); }
    void undo()    override { editor_.erase(words_.size()); }
};

// Invoker with history (undo/redo support)
class CommandHistory {
    std::stack<std::unique_ptr<Command>> history_;
public:
    void execute(std::unique_ptr<Command> cmd) {
        cmd->execute();
        history_.push(std::move(cmd));
    }
    void undo() {
        if (!history_.empty()) {
            history_.top()->undo();
            history_.pop();
        }
    }
};

int main() {
    TextEditor editor;
    CommandHistory history;

    history.execute(std::make_unique<WriteCommand>(editor, "Hello "));
    history.execute(std::make_unique<WriteCommand>(editor, "World"));
    std::cout << editor.getText() << "\\n"; // Hello World

    history.undo(); // Undo "World"
    std::cout << editor.getText() << "\\n"; // Hello

    history.undo(); // Undo "Hello "
    std::cout << editor.getText() << "\\n"; // (empty)
}`
    },
    {
      name: "Iterator",
      intent: "Provide a way to access elements of a collection sequentially without exposing its underlying representation.",
      uml: (
        <svg viewBox="0 0 400 170" className="w-full h-auto">
          <rect x="10" y="20" width="140" height="65" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="10" y="20" width="140" height="22" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="80" y="35" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontStyle="italic">Iterator</text>
          <line x1="10" y1="42" x2="150" y2="42" stroke="#22d3ee" strokeWidth="1"/>
          <text x="20" y="57" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ hasNext(): bool</text>
          <text x="20" y="71" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ next(): T&amp;</text>

          <rect x="10" y="120" width="140" height="42" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="10" y="120" width="140" height="22" rx="3" fill="#042030" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="80" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteIterator</text>
          <line x1="80" y1="85" x2="80" y2="120" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="80,85 74,97 86,97" fill="#22d3ee"/>

          <rect x="250" y="20" width="140" height="65" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="250" y="20" width="140" height="22" rx="3" fill="#1c0802" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="320" y="35" textAnchor="middle" fill="#fdba74" fontSize="10" fontFamily="monospace" fontStyle="italic">Iterable</text>
          <line x1="250" y1="42" x2="390" y2="42" stroke="#fb923c" strokeWidth="1"/>
          <text x="260" y="57" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ createIterator()</text>

          <rect x="250" y="120" width="140" height="42" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="250" y="120" width="140" height="22" rx="3" fill="#0f0400" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="320" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteCollection</text>
          <line x1="320" y1="85" x2="320" y2="120" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="320,85 314,97 326,97" fill="#fb923c"/>

          <line x1="150" y1="140" x2="250" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="195" y="133" fill="#94a3b8" fontSize="8" fontFamily="monospace">creates</text>
        </svg>
      ),
      code: `// Custom iterator for a binary tree (in-order traversal)
template<typename T>
struct TreeNode {
    T value;
    std::shared_ptr<TreeNode<T>> left, right;
    TreeNode(T v) : value(v) {}
};

template<typename T>
class InOrderIterator {
    std::stack<TreeNode<T>*> stack_;
    
    void pushLeft(TreeNode<T>* node) {
        while (node) { stack_.push(node); node = node->left.get(); }
    }
public:
    InOrderIterator(std::shared_ptr<TreeNode<T>> root) {
        pushLeft(root.get());
    }
    
    bool hasNext() const { return !stack_.empty(); }
    
    T next() {
        auto* node = stack_.top(); stack_.pop();
        T val = node->value;
        pushLeft(node->right.get());
        return val;
    }
};

// STL-compatible iterator (supports range-for)
template<typename T>
class NumberRange {
    T begin_, end_, step_;
public:
    struct Iterator {
        T current, step;
        Iterator(T c, T s) : current(c), step(s) {}
        T operator*() const { return current; }
        Iterator& operator++() { current += step; return *this; }
        bool operator!=(const Iterator& o) const { return current < o.current; }
    };

    NumberRange(T b, T e, T s = 1) : begin_(b), end_(e), step_(s) {}
    Iterator begin() const { return {begin_, step_}; }
    Iterator end()   const { return {end_, step_}; }
};

int main() {
    // Custom tree iterator
    auto root = std::make_shared<TreeNode<int>>(4);
    root->left  = std::make_shared<TreeNode<int>>(2);
    root->right = std::make_shared<TreeNode<int>>(6);
    root->left->left  = std::make_shared<TreeNode<int>>(1);
    root->left->right = std::make_shared<TreeNode<int>>(3);

    InOrderIterator<int> it(root);
    while (it.hasNext()) std::cout << it.next() << " "; // 1 2 3 4 6

    // STL-compatible range-for
    for (int n : NumberRange(0, 10, 2))
        std::cout << n << " "; // 0 2 4 6 8
}`
    },
    {
      name: "Mediator",
      intent: "Define an object that encapsulates how a set of objects interact, promoting loose coupling.",
      uml: (
        <svg viewBox="0 0 400 170" className="w-full h-auto">
          <rect x="150" y="10" width="120" height="55" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="150" y="10" width="120" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="210" y="25" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontStyle="italic">Mediator</text>
          <line x1="150" y1="32" x2="270" y2="32" stroke="#f59e0b" strokeWidth="1"/>
          <text x="160" y="47" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ notify(sender, event)</text>

          {[
            {x:10, y:110, label:"Comp A"},
            {x:140, y:110, label:"Comp B"},
            {x:270, y:110, label:"Comp C"}
          ].map((c,i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width={110} height={45} rx="3" fill="#1a2332" stroke="#94a3b8" strokeWidth="1.5"/>
              <rect x={c.x} y={c.y} width={110} height={22} rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5"/>
              <text x={c.x+55} y={c.y+15} textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">{c.label}</text>
              <line x1={c.x} y1={c.y+22} x2={c.x+110} y2={c.y+22} stroke="#94a3b8" strokeWidth="1"/>
              <text x={c.x+10} y={c.y+37} fill="#94a3b8" fontSize="8" fontFamily="monospace">- med: Mediator*</text>
            </g>
          ))}
          
          <line x1="65" y1="110" x2="175" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <line x1="195" y1="110" x2="210" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <line x1="325" y1="110" x2="245" y2="65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="195" y="100" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">notify ↕</text>
        </svg>
      ),
      code: `class ChatRoom; // forward declaration

class User {
    std::string name_;
    ChatRoom* chatRoom_;
public:
    User(const std::string& name) : name_(name), chatRoom_(nullptr) {}
    void setChatRoom(ChatRoom* room) { chatRoom_ = room; }
    const std::string& getName() const { return name_; }
    
    void send(const std::string& msg);
    void receive(const std::string& from, const std::string& msg) {
        std::cout << "[" << name_ << "] received from " 
                  << from << ": " << msg << "\\n";
    }
};

// Mediator
class ChatRoom {
    std::vector<User*> users_;
public:
    void join(User* user) {
        users_.push_back(user);
        user->setChatRoom(this);
        std::cout << user->getName() << " joined the room\\n";
    }

    void broadcast(const std::string& from, const std::string& msg) {
        for (auto* user : users_)
            if (user->getName() != from)
                user->receive(from, msg);
    }

    void whisper(const std::string& from, const std::string& to,
                 const std::string& msg) {
        for (auto* user : users_)
            if (user->getName() == to)
                user->receive(from + " (whisper)", msg);
    }
};

void User::send(const std::string& msg) {
    std::cout << "[" << name_ << "] says: " << msg << "\\n";
    chatRoom_->broadcast(name_, msg); // Through mediator
}

int main() {
    ChatRoom room;
    User alice("Alice"), bob("Bob"), charlie("Charlie");
    
    room.join(&alice); room.join(&bob); room.join(&charlie);
    
    alice.send("Hello everyone!");
    room.whisper("Bob", "Alice", "Hey, just between us");
}`
    },
    {
      name: "Memento",
      intent: "Capture and externalize an object's internal state so it can be restored later, without violating encapsulation.",
      uml: (
        <svg viewBox="0 0 400 160" className="w-full h-auto">
          <rect x="10" y="40" width="120" height="80" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="10" y="40" width="120" height="22" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="70" y="55" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontFamily="monospace">Originator</text>
          <line x1="10" y1="62" x2="130" y2="62" stroke="#f472b6" strokeWidth="1"/>
          <text x="20" y="76" fill="#94a3b8" fontSize="8" fontFamily="monospace">- state: State</text>
          <text x="20" y="90" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ createMemento()</text>
          <text x="20" y="103" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ restore(Memento)</text>

          <rect x="180" y="40" width="110" height="80" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="180" y="40" width="110" height="22" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="235" y="55" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace">Memento</text>
          <line x1="180" y1="62" x2="290" y2="62" stroke="#22d3ee" strokeWidth="1"/>
          <text x="190" y="76" fill="#94a3b8" fontSize="8" fontFamily="monospace">- state: State</text>
          <text x="190" y="90" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ getState()</text>

          <rect x="310" y="40" width="80" height="80" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="310" y="40" width="80" height="22" rx="3" fill="#1c0802" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="350" y="55" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="monospace">Caretaker</text>
          <line x1="310" y1="62" x2="390" y2="62" stroke="#fb923c" strokeWidth="1"/>
          <text x="320" y="76" fill="#94a3b8" fontSize="8" fontFamily="monospace">- history[]</text>
          <text x="320" y="90" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ save()</text>
          <text x="320" y="103" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ undo()</text>

          <line x1="130" y1="80" x2="180" y2="80" stroke="#f472b6" strokeWidth="1.5"/>
          <polygon points="180,80 168,75 168,85" fill="#f472b6"/>
          <line x1="290" y1="80" x2="310" y2="80" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="170" y="138" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">creates → stores</text>
        </svg>
      ),
      code: `// Memento – stores a snapshot of state
class EditorState {
    std::string content_;
    int cursorPos_;
public:
    EditorState(const std::string& c, int pos)
        : content_(c), cursorPos_(pos) {}
    std::string getContent() const { return content_; }
    int getCursorPos() const { return cursorPos_; }
};

// Originator
class Editor {
    std::string content_;
    int cursorPos_ = 0;
public:
    void write(const std::string& text) {
        content_.insert(cursorPos_, text);
        cursorPos_ += text.size();
    }
    void show() const {
        std::cout << "Content: '" << content_ 
                  << "' Cursor: " << cursorPos_ << "\\n";
    }

    // Create snapshot
    EditorState save() const { return {content_, cursorPos_}; }

    // Restore from snapshot
    void restore(const EditorState& state) {
        content_   = state.getContent();
        cursorPos_ = state.getCursorPos();
    }
};

// Caretaker
class History {
    std::stack<EditorState> states_;
public:
    void push(const EditorState& state) { states_.push(state); }
    EditorState pop() {
        auto state = states_.top();
        states_.pop();
        return state;
    }
    bool empty() const { return states_.empty(); }
};

int main() {
    Editor editor;
    History history;

    editor.write("Hello");
    history.push(editor.save()); // Checkpoint 1

    editor.write(" World");
    history.push(editor.save()); // Checkpoint 2

    editor.write("!!!");
    editor.show(); // Content: 'Hello World!!!'

    editor.restore(history.pop()); // Undo !!!
    editor.show(); // Content: 'Hello World'

    editor.restore(history.pop()); // Undo World
    editor.show(); // Content: 'Hello'
}`
    },
    {
      name: "Observer",
      intent: "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
      uml: (
        <svg viewBox="0 0 420 180" className="w-full h-auto">
          <rect x="10" y="20" width="150" height="85" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="10" y="20" width="150" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="85" y="35" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontStyle="italic">Subject</text>
          <line x1="10" y1="42" x2="160" y2="42" stroke="#f59e0b" strokeWidth="1"/>
          <text x="20" y="57" fill="#94a3b8" fontSize="8" fontFamily="monospace">- observers[]</text>
          <text x="20" y="70" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ subscribe(Observer*)</text>
          <text x="20" y="82" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ unsubscribe(obs)</text>
          <text x="20" y="96" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ notifyAll()</text>

          <rect x="260" y="20" width="140" height="55" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="260" y="20" width="140" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="330" y="35" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontStyle="italic">Observer</text>
          <line x1="260" y1="42" x2="400" y2="42" stroke="#34d399" strokeWidth="1"/>
          <text x="270" y="57" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ update(state)</text>

          {["Subscriber A","Subscriber B"].map((s,i) => (
            <g key={i}>
              <rect x={230 + i*90} y={110} width={90} height={55} rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
              <rect x={230 + i*90} y={110} width={90} height={22} rx="3" fill="#011a14" stroke="#34d399" strokeWidth="1.5"/>
              <text x={275 + i*90} y={125} textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="monospace">{s}</text>
              <text x={240 + i*90} y={148} fill="#64ffe4" fontSize="8" fontFamily="monospace">+ update()</text>
              <line x1={275 + i*90} y1={110} x2={310 + i*10} y2={75} stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
              <polygon points={`${310 + i*10},75 ${302+i*10},87 ${318+i*10},83`} fill="#34d399"/>
            </g>
          ))}

          <line x1="160" y1="55" x2="260" y2="45" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="205" y="42" fill="#f59e0b" fontSize="8" fontFamily="monospace">notifies →</text>
        </svg>
      ),
      code: `// Observer interface
class EventListener {
public:
    virtual void update(const std::string& event, const std::string& data) = 0;
    virtual ~EventListener() = default;
};

// Subject
class EventEmitter {
    std::unordered_map<std::string, 
        std::vector<EventListener*>> listeners_;
public:
    void on(const std::string& event, EventListener* listener) {
        listeners_[event].push_back(listener);
    }
    
    void off(const std::string& event, EventListener* listener) {
        auto& lst = listeners_[event];
        lst.erase(std::remove(lst.begin(), lst.end(), listener), lst.end());
    }
    
    void emit(const std::string& event, const std::string& data = "") {
        if (listeners_.count(event))
            for (auto* l : listeners_[event])
                l->update(event, data);
    }
};

// Concrete Observers
class Logger : public EventListener {
public:
    void update(const std::string& evt, const std::string& data) override {
        std::cout << "[LOG] " << evt << ": " << data << "\\n";
    }
};

class EmailAlert : public EventListener {
    std::string email_;
public:
    EmailAlert(const std::string& e) : email_(e) {}
    void update(const std::string& evt, const std::string& data) override {
        std::cout << "[EMAIL→" << email_ << "] " << evt << " - " << data << "\\n";
    }
};

int main() {
    EventEmitter store;
    Logger logger;
    EmailAlert admin("admin@example.com");

    store.on("purchase", &logger);
    store.on("purchase", &admin);
    store.on("refund",   &logger);

    store.emit("purchase", "Item #42 by user John");
    store.emit("refund",   "Order #7 refunded");

    store.off("purchase", &admin); // Unsubscribe
    store.emit("purchase", "Item #99"); // Only logger notified
}`
    },
    {
      name: "State",
      intent: "Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.",
      uml: (
        <svg viewBox="0 0 380 170" className="w-full h-auto">
          <rect x="110" y="10" width="120" height="55" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="110" y="10" width="120" height="22" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="170" y="25" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontStyle="italic">State</text>
          <line x1="110" y1="32" x2="230" y2="32" stroke="#a78bfa" strokeWidth="1"/>
          <text x="120" y="47" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ handle(Context*)</text>

          <rect x="10" y="115" width="110" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="115" width="110" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="65" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteStateA</text>
          <text x="20" y="150" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ handle()</text>

          <rect x="140" y="115" width="110" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="140" y="115" width="110" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="195" y="130" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteStateB</text>
          <text x="150" y="150" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ handle()</text>

          <line x1="65" y1="115" x2="145" y2="65" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="145,65 137,78 153,74" fill="#a78bfa"/>
          <line x1="195" y1="115" x2="195" y2="65" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="195,65 189,77 201,77" fill="#a78bfa"/>

          <rect x="290" y="45" width="80" height="65" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="290" y="45" width="80" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="330" y="60" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Context</text>
          <line x1="290" y1="67" x2="370" y2="67" stroke="#f59e0b" strokeWidth="1"/>
          <text x="300" y="82" fill="#94a3b8" fontSize="8" fontFamily="monospace">- state: State*</text>
          <text x="300" y="96" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ setState()</text>
          <text x="300" y="108" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ request()</text>

          <line x1="290" y1="78" x2="230" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="255" y="53" fill="#f59e0b" fontSize="8" fontFamily="monospace">has →</text>
        </svg>
      ),
      code: `class TrafficLight; // forward declaration

class LightState {
public:
    virtual void handle(TrafficLight& light) = 0;
    virtual std::string name() const = 0;
    virtual ~LightState() = default;
};

// Context
class TrafficLight {
    std::unique_ptr<LightState> state_;
public:
    TrafficLight(std::unique_ptr<LightState> initial)
        : state_(std::move(initial)) {}

    void setState(std::unique_ptr<LightState> s) {
        std::cout << "Transitioning to: " << s->name() << "\\n";
        state_ = std::move(s);
    }
    void tick() { state_->handle(*this); }
};

// Concrete States
class RedState : public LightState {
public:
    std::string name() const override { return "RED"; }
    void handle(TrafficLight& light) override;
};

class YellowState : public LightState {
public:
    std::string name() const override { return "YELLOW"; }
    void handle(TrafficLight& light) override;
};

class GreenState : public LightState {
public:
    std::string name() const override { return "GREEN"; }
    void handle(TrafficLight& light) override;
};

void RedState::handle(TrafficLight& light) {
    std::cout << "RED → Stopping traffic\\n";
    light.setState(std::make_unique<GreenState>());
}
void GreenState::handle(TrafficLight& light) {
    std::cout << "GREEN → Traffic flowing\\n";
    light.setState(std::make_unique<YellowState>());
}
void YellowState::handle(TrafficLight& light) {
    std::cout << "YELLOW → Slow down\\n";
    light.setState(std::make_unique<RedState>());
}

int main() {
    TrafficLight light(std::make_unique<RedState>());
    for (int i = 0; i < 6; ++i) light.tick();
    // RED → GREEN → YELLOW → RED → GREEN → YELLOW
}`
    },
    {
      name: "Strategy",
      intent: "Define a family of algorithms, encapsulate each one, and make them interchangeable. Lets the algorithm vary independently from clients that use it.",
      uml: (
        <svg viewBox="0 0 420 160" className="w-full h-auto">
          <rect x="10" y="50" width="130" height="60" rx="3" fill="#1a2332" stroke="#f59e0b" strokeWidth="1.5"/>
          <rect x="10" y="50" width="130" height="22" rx="3" fill="#1c1000" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="75" y="65" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace">Context</text>
          <line x1="10" y1="72" x2="140" y2="72" stroke="#f59e0b" strokeWidth="1"/>
          <text x="20" y="86" fill="#94a3b8" fontSize="8" fontFamily="monospace">- strategy: Strategy*</text>
          <text x="20" y="100" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ setStrategy()</text>
          <text x="20" y="112" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ executeStrategy()</text>

          <rect x="215" y="20" width="120" height="45" rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="215" y="20" width="120" height="22" rx="3" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
          <text x="275" y="35" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontStyle="italic">Strategy</text>
          <line x1="215" y1="42" x2="335" y2="42" stroke="#22d3ee" strokeWidth="1"/>
          <text x="225" y="56" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ execute(data)</text>

          {["ConcreteA","ConcreteB","ConcreteC"].map((s,i) => (
            <g key={i}>
              <rect x={190 + i*80} y={100} width={72} height={42} rx="3" fill="#1a2332" stroke="#22d3ee" strokeWidth="1.5"/>
              <rect x={190 + i*80} y={100} width={72} height={20} rx="3" fill="#042030" stroke="#22d3ee" strokeWidth="1.5"/>
              <text x={226 + i*80} y={114} textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">{s}</text>
              <text x={200 + i*80} y={134} fill="#64ffe4" fontSize="7.5" fontFamily="monospace">+ execute()</text>
              <line x1={226 + i*80} y1={100} x2={263 + i*3} y2={65} stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4"/>
              <polygon points={`${263+i*3},65 ${256+i*3},77 ${270+i*3},73`} fill="#22d3ee"/>
            </g>
          ))}

          <line x1="140" y1="80" x2="215" y2="47" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="176" y="58" fill="#f59e0b" fontSize="8" fontFamily="monospace">uses</text>
        </svg>
      ),
      code: `// Strategy interface
class SortStrategy {
public:
    virtual void sort(std::vector<int>& data) = 0;
    virtual std::string name() const = 0;
    virtual ~SortStrategy() = default;
};

// Concrete Strategies
class BubbleSort : public SortStrategy {
public:
    std::string name() const override { return "BubbleSort"; }
    void sort(std::vector<int>& data) override {
        for (size_t i = 0; i < data.size(); ++i)
            for (size_t j = 0; j < data.size()-i-1; ++j)
                if (data[j] > data[j+1]) std::swap(data[j], data[j+1]);
    }
};

class QuickSort : public SortStrategy {
    void qsort(std::vector<int>& d, int l, int r) {
        if (l >= r) return;
        int pivot = d[r], i = l;
        for (int j = l; j < r; ++j)
            if (d[j] <= pivot) std::swap(d[i++], d[j]);
        std::swap(d[i], d[r]);
        qsort(d, l, i-1); qsort(d, i+1, r);
    }
public:
    std::string name() const override { return "QuickSort"; }
    void sort(std::vector<int>& data) override {
        if (!data.empty()) qsort(data, 0, data.size()-1);
    }
};

class StdSort : public SortStrategy {
public:
    std::string name() const override { return "std::sort"; }
    void sort(std::vector<int>& data) override {
        std::sort(data.begin(), data.end());
    }
};

// Context
class Sorter {
    std::unique_ptr<SortStrategy> strategy_;
public:
    Sorter(std::unique_ptr<SortStrategy> s) : strategy_(std::move(s)) {}
    
    void setStrategy(std::unique_ptr<SortStrategy> s) {
        strategy_ = std::move(s);
    }

    void sort(std::vector<int>& data) {
        std::cout << "Using " << strategy_->name() << "\\n";
        strategy_->sort(data);
    }
};

int main() {
    std::vector<int> data = {5,2,8,1,9,3};
    Sorter sorter(std::make_unique<QuickSort>());
    sorter.sort(data); // Using QuickSort

    // Switch strategy at runtime
    sorter.setStrategy(std::make_unique<StdSort>());
    sorter.sort(data); // Using std::sort
}`
    },
    {
      name: "Template Method",
      intent: "Define the skeleton of an algorithm in a base class, deferring some steps to subclasses without changing the algorithm's structure.",
      uml: (
        <svg viewBox="0 0 360 180" className="w-full h-auto">
          <rect x="90" y="10" width="180" height="95" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="90" y="10" width="180" height="22" rx="3" fill="#1c0802" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="180" y="25" textAnchor="middle" fill="#fdba74" fontSize="10" fontFamily="monospace" fontStyle="italic">AbstractClass</text>
          <line x1="90" y1="32" x2="270" y2="32" stroke="#fb923c" strokeWidth="1"/>
          <text x="100" y="47" fill="#64ffe4" fontSize="8.5" fontFamily="monospace">+ templateMethod() ←</text>
          <text x="100" y="60" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">  step1()</text>
          <text x="100" y="72" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">  step2()</text>
          <text x="100" y="84" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">  hook()</text>
          <text x="100" y="96" fill="#64ffe4" fontSize="8" fontFamily="monospace">~ step1(), step2() abstract</text>

          <rect x="20" y="135" width="130" height="40" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="20" y="135" width="130" height="22" rx="3" fill="#0f0400" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="85" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteClass1</text>
          <text x="30" y="168" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ step1(), step2()</text>

          <rect x="210" y="135" width="130" height="40" rx="3" fill="#1a2332" stroke="#fb923c" strokeWidth="1.5"/>
          <rect x="210" y="135" width="130" height="22" rx="3" fill="#0f0400" stroke="#fb923c" strokeWidth="1.5"/>
          <text x="275" y="150" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteClass2</text>
          <text x="220" y="168" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ step1(), step2()</text>

          <line x1="85" y1="135" x2="155" y2="105" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="155,105 147,118 163,114" fill="#fb923c"/>
          <line x1="275" y1="135" x2="205" y2="105" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="205,105 197,118 213,114" fill="#fb923c"/>
        </svg>
      ),
      code: `// Abstract class defines the template
class DataProcessor {
public:
    // Template method – fixed algorithm skeleton
    void process() {
        readData();
        parseData();
        if (shouldValidate()) validateData(); // Hook
        analyzeData();
        writeReport();
    }

protected:
    virtual void readData()    = 0;
    virtual void parseData()   = 0;
    virtual void analyzeData() = 0;
    virtual void writeReport() = 0;
    
    // Hook method – optional override
    virtual bool shouldValidate() { return true; }
    virtual void validateData() {
        std::cout << "Default validation\\n";
    }
};

// Concrete implementation – CSV
class CSVProcessor : public DataProcessor {
protected:
    void readData()    override { std::cout << "Reading CSV file\\n"; }
    void parseData()   override { std::cout << "Parsing comma-separated values\\n"; }
    void analyzeData() override { std::cout << "Running CSV analytics\\n"; }
    void writeReport() override { std::cout << "Writing CSV report\\n"; }
};

// Concrete implementation – JSON (skips validation)
class JSONProcessor : public DataProcessor {
protected:
    void readData()    override { std::cout << "Reading JSON file\\n"; }
    void parseData()   override { std::cout << "Parsing JSON tokens\\n"; }
    void analyzeData() override { std::cout << "Running JSON analytics\\n"; }
    void writeReport() override { std::cout << "Writing JSON report\\n"; }
    
    bool shouldValidate() override { return false; } // Override hook
};

int main() {
    std::cout << "=== CSV ===\\n";
    CSVProcessor csv;
    csv.process(); // Follows fixed skeleton

    std::cout << "\\n=== JSON ===\\n";
    JSONProcessor json;
    json.process(); // Same skeleton, skips validation
}`
    },
    {
      name: "Visitor",
      intent: "Represent an operation to be performed on elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements.",
      uml: (
        <svg viewBox="0 0 420 170" className="w-full h-auto">
          <rect x="230" y="10" width="170" height="55" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="230" y="10" width="170" height="22" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5"/>
          <text x="315" y="25" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontStyle="italic">Visitor</text>
          <line x1="230" y1="32" x2="400" y2="32" stroke="#34d399" strokeWidth="1"/>
          <text x="240" y="46" fill="#64ffe4" fontSize="8.5" fontFamily="monospace">+ visitCircle(Circle*)</text>
          <text x="240" y="58" fill="#64ffe4" fontSize="8.5" fontFamily="monospace">+ visitRect(Rectangle*)</text>

          <rect x="230" y="110" width="170" height="42" rx="3" fill="#1a2332" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="230" y="110" width="170" height="22" rx="3" fill="#011a14" stroke="#34d399" strokeWidth="1.5"/>
          <text x="315" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">ConcreteVisitor</text>
          <line x1="230" y1="132" x2="400" y2="132" stroke="#34d399" strokeWidth="1"/>
          <text x="240" y="146" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ visitCircle() + visitRect()</text>
          <line x1="315" y1="65" x2="315" y2="110" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="315,65 309,77 321,77" fill="#34d399"/>

          <rect x="10" y="10" width="150" height="55" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="10" width="150" height="22" rx="3" fill="#1e1048" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="85" y="25" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontStyle="italic">Element</text>
          <line x1="10" y1="32" x2="160" y2="32" stroke="#a78bfa" strokeWidth="1"/>
          <text x="20" y="46" fill="#64ffe4" fontSize="8.5" fontFamily="monospace">+ accept(Visitor*)</text>

          <rect x="10" y="110" width="65" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="10" y="110" width="65" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="42" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">Circle</text>
          <text x="18" y="146" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ accept()</text>

          <rect x="90" y="110" width="75" height="42" rx="3" fill="#1a2332" stroke="#a78bfa" strokeWidth="1.5"/>
          <rect x="90" y="110" width="75" height="22" rx="3" fill="#100828" stroke="#a78bfa" strokeWidth="1.5"/>
          <text x="127" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">Rectangle</text>
          <text x="100" y="146" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ accept()</text>

          <line x1="42" y1="110" x2="70" y2="65" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="70,65 62,78 78,74" fill="#a78bfa"/>
          <line x1="127" y1="110" x2="100" y2="65" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="100,65 92,78 108,74" fill="#a78bfa"/>

          <line x1="160" y1="37" x2="230" y2="37" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3"/>
          <text x="193" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace">calls</text>
        </svg>
      ),
      code: `class Circle; class Rectangle; // forward declarations

// Visitor interface
class ShapeVisitor {
public:
    virtual void visitCircle(Circle& c)    = 0;
    virtual void visitRectangle(Rectangle& r) = 0;
    virtual ~ShapeVisitor() = default;
};

// Element interface
class Shape {
public:
    virtual void accept(ShapeVisitor& visitor) = 0;
    virtual ~Shape() = default;
};

// Concrete Elements
class Circle : public Shape {
public:
    float radius;
    Circle(float r) : radius(r) {}
    void accept(ShapeVisitor& v) override { v.visitCircle(*this); }
};

class Rectangle : public Shape {
public:
    float width, height;
    Rectangle(float w, float h) : width(w), height(h) {}
    void accept(ShapeVisitor& v) override { v.visitRectangle(*this); }
};

// Concrete Visitor 1 – Area calculator
class AreaVisitor : public ShapeVisitor {
public:
    float totalArea = 0;
    void visitCircle(Circle& c) override {
        totalArea += 3.14159f * c.radius * c.radius;
    }
    void visitRectangle(Rectangle& r) override {
        totalArea += r.width * r.height;
    }
};

// Concrete Visitor 2 – XML exporter
class XMLExportVisitor : public ShapeVisitor {
public:
    void visitCircle(Circle& c) override {
        std::cout << "<circle radius=\\"" << c.radius << "\\"/>\\n";
    }
    void visitRectangle(Rectangle& r) override {
        std::cout << "<rect width=\\"" << r.width 
                  << "\\" height=\\"" << r.height << "\\"/>\\n";
    }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5));
    shapes.push_back(std::make_unique<Rectangle>(4, 6));
    shapes.push_back(std::make_unique<Circle>(3));

    AreaVisitor area;
    XMLExportVisitor xml;

    for (auto& s : shapes) {
        s->accept(area); // Calculate area
        s->accept(xml);  // Export XML
    }
    std::cout << "Total area: " << area.totalArea << "\\n";
    // Add new operations (visitors) without changing Shape classes!
}`
    },
    {
      name: "Interpreter",
      intent: "Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences.",
      uml: (
        <svg viewBox="0 0 400 180" className="w-full h-auto">
          <rect x="120" y="10" width="150" height="55" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="120" y="10" width="150" height="22" rx="3" fill="#2d0d1e" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="195" y="25" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontFamily="monospace" fontStyle="italic">AbstractExpression</text>
          <line x1="120" y1="32" x2="270" y2="32" stroke="#f472b6" strokeWidth="1"/>
          <text x="130" y="47" fill="#64ffe4" fontSize="9" fontFamily="monospace">+ interpret(Context)</text>

          <rect x="20" y="120" width="130" height="50" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="20" y="120" width="130" height="22" rx="3" fill="#1a0810" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="85" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">TerminalExpr</text>
          <line x1="20" y1="142" x2="150" y2="142" stroke="#f472b6" strokeWidth="1"/>
          <text x="30" y="158" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ interpret(Context)</text>

          <rect x="250" y="120" width="140" height="50" rx="3" fill="#1a2332" stroke="#f472b6" strokeWidth="1.5"/>
          <rect x="250" y="120" width="140" height="22" rx="3" fill="#1a0810" stroke="#f472b6" strokeWidth="1.5"/>
          <text x="320" y="135" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace">NonTerminalExpr</text>
          <line x1="250" y1="142" x2="390" y2="142" stroke="#f472b6" strokeWidth="1"/>
          <text x="260" y="158" fill="#64ffe4" fontSize="8" fontFamily="monospace">+ interpret(Context)</text>
          <text x="260" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">- expressions[]</text>

          <line x1="85" y1="120" x2="170" y2="65" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="170,65 162,78 178,74" fill="#f472b6"/>
          <line x1="320" y1="120" x2="220" y2="65" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4"/>
          <polygon points="220,65 212,78 228,74" fill="#f472b6"/>
          <path d="M 390 150 Q 410 150 410 60 Q 410 25 270 25" stroke="#f472b6" fill="none" strokeWidth="1.5" strokeDasharray="3"/>
        </svg>
      ),
      code: `#include <unordered_map>

using Context = std::unordered_map<std::string, int>;

// Abstract Expression
class Expression {
public:
    virtual int interpret(const Context& ctx) const = 0;
    virtual ~Expression() = default;
};

// Terminal Expressions
class NumberExpr : public Expression {
    int value_;
public:
    NumberExpr(int v) : value_(v) {}
    int interpret(const Context&) const override { return value_; }
};

class VariableExpr : public Expression {
    std::string name_;
public:
    VariableExpr(const std::string& n) : name_(n) {}
    int interpret(const Context& ctx) const override {
        auto it = ctx.find(name_);
        return it != ctx.end() ? it->second : 0;
    }
};

// Non-Terminal Expressions
class AddExpr : public Expression {
    std::unique_ptr<Expression> left_, right_;
public:
    AddExpr(std::unique_ptr<Expression> l, std::unique_ptr<Expression> r)
        : left_(std::move(l)), right_(std::move(r)) {}
    int interpret(const Context& ctx) const override {
        return left_->interpret(ctx) + right_->interpret(ctx);
    }
};

class MultiplyExpr : public Expression {
    std::unique_ptr<Expression> left_, right_;
public:
    MultiplyExpr(std::unique_ptr<Expression> l, std::unique_ptr<Expression> r)
        : left_(std::move(l)), right_(std::move(r)) {}
    int interpret(const Context& ctx) const override {
        return left_->interpret(ctx) * right_->interpret(ctx);
    }
};

// Example: interpret (x + 5) * y
int main() {
    Context ctx = {{"x", 3}, {"y", 4}};

    // Build AST: (x + 5) * y
    auto expr = std::make_unique<MultiplyExpr>(
        std::make_unique<AddExpr>(
            std::make_unique<VariableExpr>("x"),
            std::make_unique<NumberExpr>(5)
        ),
        std::make_unique<VariableExpr>("y")
    );

    int result = expr->interpret(ctx);
    std::cout << "(x + 5) * y = " << result << "\\n"; // (3+5)*4 = 32

    // Different context
    ctx = {{"x", 10}, {"y", 2}};
    std::cout << "(x + 5) * y = " << expr->interpret(ctx) << "\\n"; // 30
}`
    }
  ]
};

const categoryColors = {
  Creational: { border: "#38bdf8", bg: "#0e4f7a", text: "#7dd3fc", badge: "#0c3355" },
  Structural: { border: "#34d399", bg: "#064e3b", text: "#6ee7b7", badge: "#022c22" },
  Behavioral: { border: "#f472b6", bg: "#4a0e2e", text: "#f9a8d4", badge: "#2d0d1e" }
};

export default function DesignPatterns() {
  const [activeCategory, setActiveCategory] = useState("Creational");
  const [expandedPattern, setExpandedPattern] = useState(null);
  const [showCode, setShowCode] = useState({});

  const cats = Object.keys(patterns);
  const col = categoryColors[activeCategory];

  const togglePattern = (name) => {
    setExpandedPattern(expandedPattern === name ? null : name);
  };

  const toggleCode = (name, e) => {
    e.stopPropagation();
    setShowCode(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d16",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      color: "#e2e8f0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d1f36 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "24px 32px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{
              background: "#0f3460",
              border: "1px solid #1d6fa4",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 11,
              color: "#64b5f6",
              letterSpacing: 2
            }}>C++ REFERENCE</div>
            <div style={{ color: "#475569", fontSize: 11 }}>GoF • Gang of Four • 23 Patterns</div>
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            background: "linear-gradient(90deg, #38bdf8, #34d399, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: -1
          }}>Design Patterns in C++</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "8px 0 0" }}>
            Interactive reference • UML diagrams • Production-ready code examples
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: "#080f1a",
        borderBottom: "1px solid #0f2035",
        padding: "12px 32px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 32 }}>
          {[
            { label: "Creational", count: 5, color: "#38bdf8" },
            { label: "Structural", count: 7, color: "#34d399" },
            { label: "Behavioral", count: 11, color: "#f472b6" }
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
              <span style={{ color: "#64748b", fontSize: 12 }}>{s.label}</span>
              <span style={{
                background: "#0f2035",
                color: s.color,
                borderRadius: 4,
                padding: "1px 8px",
                fontSize: 11,
                fontWeight: 700
              }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ padding: "24px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, background: "#080f1a", padding: 4, borderRadius: 10, width: "fit-content", border: "1px solid #0f2035" }}>
          {cats.map(cat => {
            const c = categoryColors[cat];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedPattern(null); }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 7,
                  border: active ? `1px solid ${c.border}` : "1px solid transparent",
                  background: active ? c.bg : "transparent",
                  color: active ? c.text : "#475569",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                {cat}
                <span style={{
                  background: active ? c.badge : "#0f2035",
                  color: active ? c.text : "#334155",
                  borderRadius: 4,
                  padding: "1px 6px",
                  fontSize: 10
                }}>{patterns[cat].length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Grid */}
      <div style={{ padding: "24px 32px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 16 }}>
          {patterns[activeCategory].map((pattern, idx) => {
            const expanded = expandedPattern === pattern.name;
            const codeVisible = showCode[pattern.name];
            return (
              <div
                key={pattern.name}
                style={{
                  background: expanded ? "#0a1628" : "#080f1a",
                  border: `1px solid ${expanded ? col.border : "#0f2035"}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  gridColumn: expanded ? "1 / -1" : "auto"
                }}
                onClick={() => togglePattern(pattern.name)}
              >
                {/* Pattern Header */}
                <div style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: expanded ? `1px solid ${col.border}22` : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32,
                      background: `${col.border}18`,
                      border: `1px solid ${col.border}44`,
                      borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: col.border
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>{pattern.name}</div>
                      <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>
                        {activeCategory} Pattern
                      </div>
                    </div>
                  </div>
                  <div style={{
                    color: expanded ? col.border : "#334155",
                    fontSize: 18,
                    transition: "transform 0.2s",
                    transform: expanded ? "rotate(180deg)" : "none"
                  }}>⌄</div>
                </div>

                {/* Intent (always visible) */}
                <div style={{ padding: "12px 20px", fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                  {pattern.intent}
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div style={{ padding: "0 20px 20px" }}>
                    {/* UML Diagram */}
                    <div style={{
                      background: "#050c18",
                      border: `1px solid ${col.border}33`,
                      borderRadius: 8,
                      padding: "16px",
                      marginBottom: 16
                    }}>
                      <div style={{ fontSize: 10, color: col.text, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
                        ◆ UML Class Diagram
                      </div>
                      {pattern.uml}
                    </div>

                    {/* Code toggle */}
                    <button
                      onClick={(e) => toggleCode(pattern.name, e)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        background: codeVisible ? `${col.border}18` : "#0a1628",
                        border: `1px solid ${codeVisible ? col.border : "#1e3a5f"}`,
                        borderRadius: 8,
                        color: codeVisible ? col.text : "#64748b",
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "inherit",
                        marginBottom: codeVisible ? 12 : 0,
                        transition: "all 0.2s",
                        width: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>{ codeVisible ? "▼" : "▶" } C++ Implementation</span>
                      <span style={{ fontSize: 10, color: "#334155" }}>
                        {codeVisible ? "hide" : "show"} code
                      </span>
                    </button>

                    {codeVisible && (
                      <div style={{
                        background: "#030810",
                        border: `1px solid ${col.border}22`,
                        borderRadius: 8,
                        overflow: "auto",
                        maxHeight: 520
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 16px",
                          borderBottom: "1px solid #0f2035",
                          background: "#050c18"
                        }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }}/>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }}/>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }}/>
                          <span style={{ marginLeft: 8, fontSize: 10, color: "#334155" }}>
                            {pattern.name.toLowerCase().replace(/ /g, '_')}.cpp
                          </span>
                        </div>
                        <pre style={{
                          margin: 0,
                          padding: "16px",
                          fontSize: 12,
                          lineHeight: 1.65,
                          overflowX: "auto",
                          fontFamily: "inherit"
                        }}>
                          <CppCode code={pattern.code} />
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #0f2035",
        padding: "20px 32px",
        background: "#040910",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 11, color: "#1e3a5f" }}>
          Creational (5) • Structural (7) • Behavioral (11) • Total: 23 GoF Design Patterns
        </div>
      </div>
    </div>
  );
}