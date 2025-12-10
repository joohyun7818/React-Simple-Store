import { Product, CartItem, Order, User } from '../types';

let dbInstance: any = null;
// Schema changed, increment version to force new DB creation
const DB_FILE_KEY = 'ai_store_sqlite_v2.db';

// SQL.js initialization
export const initDB = async () => {
  if (dbInstance) return;

  try {
    const SQL = await window.initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });

    // Load existing DB from localStorage if available
    const savedDb = localStorage.getItem(DB_FILE_KEY);
    if (savedDb) {
      const binaryString = atob(savedDb);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      dbInstance = new SQL.Database(bytes);
    } else {
      dbInstance = new SQL.Database();
      initTables();
      seedProducts();
    }
    
    // Save initially to ensure structure exists
    saveDb();
  } catch (err) {
    console.error("Failed to initialize SQLite:", err);
    throw err;
  }
};

const saveDb = () => {
  if (!dbInstance) return;
  const data = dbInstance.export();
  let binary = '';
  const len = data.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  localStorage.setItem(DB_FILE_KEY, btoa(binary));
};

const initTables = () => {
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      price INTEGER,
      description TEXT,
      category TEXT,
      imageUrl TEXT
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT,
      date TEXT,
      total INTEGER,
      status TEXT,
      items_json TEXT,
      FOREIGN KEY(user_email) REFERENCES users(email)
    );
    CREATE TABLE IF NOT EXISTS cart (
      user_email TEXT,
      product_id TEXT,
      quantity INTEGER,
      PRIMARY KEY (user_email, product_id),
      FOREIGN KEY(user_email) REFERENCES users(email),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
    CREATE TABLE IF NOT EXISTS session (
      key TEXT PRIMARY KEY,
      user_email TEXT
    );
  `);
};

const seedProducts = () => {
  const stmt = dbInstance.prepare("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?)");
  const initialProducts = [
    ['1', '프리미엄 무선 헤드폰', 259000, '노이즈 캔슬링 기능이 탑재된 고음질 무선 헤드폰입니다.', '전자제품', 'https://picsum.photos/400/400?random=101'],
    ['2', '기계식 키보드', 129000, '타건감이 뛰어난 적축 기계식 키보드입니다.', '컴퓨터', 'https://picsum.photos/400/400?random=102'],
    ['3', '스마트 워치', 350000, '건강 관리와 알림 기능을 제공하는 최신 스마트 워치입니다.', '웨어러블', 'https://picsum.photos/400/400?random=103'],
    ['4', '에르고노믹 의자', 450000, '장시간 업무에도 편안함을 제공하는 인체공학적 의자입니다.', '가구', 'https://picsum.photos/400/400?random=104']
  ];
  
  initialProducts.forEach(p => stmt.run(p));
  stmt.free();
};

export const db = {
  // --- User & Session ---
  createUser: (email: string, name: string, password: string): boolean => {
    try {
      // Check if user exists
      const existing = dbInstance.exec("SELECT email FROM users WHERE email = ?", [email]);
      if (existing.length > 0) {
        return false; // User already exists
      }
      dbInstance.run("INSERT INTO users VALUES (?, ?, ?)", [email, name, password]);
      saveDb();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  login: (email: string, password: string): User | null => {
    // Check credentials
    const result = dbInstance.exec("SELECT email, name FROM users WHERE email = ? AND password = ?", [email, password]);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const [userEmail, userName] = result[0].values[0];
      
      // Set session
      dbInstance.run("INSERT OR REPLACE INTO session (key, user_email) VALUES ('current', ?)", [userEmail]);
      saveDb();
      
      return { email: userEmail as string, name: userName as string };
    }
    return null;
  },

  logout: () => {
    dbInstance.run("DELETE FROM session WHERE key = 'current'");
    saveDb();
  },

  getSession: (): User | null => {
    if (!dbInstance) return null; // Safety check
    const result = dbInstance.exec(`
      SELECT u.email, u.name 
      FROM session s 
      JOIN users u ON s.user_email = u.email 
      WHERE s.key = 'current'
    `);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const [email, name] = result[0].values[0];
      return { email: email as string, name: name as string };
    }
    return null;
  },

  // --- Products ---
  getProducts: (): Product[] => {
    if (!dbInstance) return [];
    const result = dbInstance.exec("SELECT * FROM products");
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    return result[0].values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i];
      });
      return obj as Product;
    });
  },

  // Used internally to upsert products from AI search when they are added to cart
  upsertProduct: (product: Product) => {
    dbInstance.run(
      "INSERT OR REPLACE INTO products (id, name, price, description, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?)",
      [product.id, product.name, product.price, product.description, product.category, product.imageUrl]
    );
  },

  // --- Cart ---
  getCart: (userEmail: string): CartItem[] => {
    if (!dbInstance) return [];
    const query = `
      SELECT p.*, c.quantity 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_email = ?
    `;
    const result = dbInstance.exec(query, [userEmail]);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    return result[0].values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i];
      });
      return obj as CartItem;
    });
  },

  saveCart: (userEmail: string, cart: CartItem[]) => {
    // Transaction-like approach
    dbInstance.run("BEGIN TRANSACTION");
    try {
      // 1. Clear existing cart for user
      dbInstance.run("DELETE FROM cart WHERE user_email = ?", [userEmail]);
      
      // 2. Insert new items
      const stmtProduct = dbInstance.prepare("INSERT OR REPLACE INTO products VALUES (?, ?, ?, ?, ?, ?)");
      const stmtCart = dbInstance.prepare("INSERT INTO cart VALUES (?, ?, ?)");
      
      for (const item of cart) {
        // Ensure product exists (Upsert)
        stmtProduct.run([item.id, item.name, item.price, item.description, item.category, item.imageUrl]);
        // Insert into cart
        stmtCart.run([userEmail, item.id, item.quantity]);
      }
      
      stmtProduct.free();
      stmtCart.free();
      dbInstance.run("COMMIT");
      saveDb();
    } catch (e) {
      console.error("Cart save failed", e);
      dbInstance.run("ROLLBACK");
    }
  },

  // --- Orders ---
  getOrders: (userEmail: string): Order[] => {
    if (!dbInstance) return [];
    const result = dbInstance.exec("SELECT * FROM orders WHERE user_email = ? ORDER BY date DESC", [userEmail]);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    return result[0].values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col: string, i: number) => {
        if (col === 'items_json') {
             obj['items'] = JSON.parse(row[i] as string);
        } else {
             obj[col] = row[i];
        }
      });
      // Filter out raw json column from object if needed, but TypeScript interface handles it via mapping
      return {
          id: obj.id,
          date: obj.date,
          total: obj.total,
          status: obj.status,
          items: obj.items
      } as Order;
    });
  },

  addOrder: (userEmail: string, order: Order) => {
    const itemsJson = JSON.stringify(order.items);
    dbInstance.run(
      "INSERT INTO orders (id, user_email, date, total, status, items_json) VALUES (?, ?, ?, ?, ?, ?)",
      [order.id, userEmail, order.date, order.total, order.status, itemsJson]
    );
    saveDb();
  }
};